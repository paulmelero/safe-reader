import { defineEventHandler, getQuery, createError, setHeader } from 'h3';
import { parseHTML } from 'linkedom';
import { Readability } from '@mozilla/readability';
import createDOMPurify from 'dompurify';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const targetUrl = query.url as string;

  if (!targetUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing URL parameter',
    });
  }

  try {
    // 1. Fetch Request
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; [S]R/1.0)',
      },
    });

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: 'Failed to fetch source: ' + response.statusText,
      });
    }

    const rawHtml = await response.text();

    // Guard: bail out early on oversized pages to avoid CPU limit
    const MAX_HTML_SIZE = 300_000; // ~300 KB
    if (rawHtml.length > MAX_HTML_SIZE) {
      throw createError({
        statusCode: 413,
        statusMessage: 'Page too large for reader mode',
      });
    }

    // 2. Parse HTML
    const { window, document } = parseHTML(rawHtml);

    // Fix relative URLs before Readability
    const baseUrl = new URL(targetUrl);

    // Helper to resolve URL
    const resolveUrl = (rel: string) => {
      try {
        return new URL(rel, baseUrl).href;
      } catch {
        return rel;
      }
    };

    // Pre-process: Resolve content links (img src, a href) to absolute
    document.querySelectorAll('img').forEach((img: any) => {
      if (img.src) img.src = resolveUrl(img.src);
    });
    document.querySelectorAll('a').forEach((a: any) => {
      if (a.href) a.href = resolveUrl(a.href);
    });

    // 3. Extract Article
    const reader = new Readability(document, {
      keepClasses: false,
    });
    const article = reader.parse();

    if (!article) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Could not extract article content',
      });
    }

    // 4. Sanitize & Rewrite Assets using DOMPurify
    const DOMPurify = createDOMPurify(window as any);

    DOMPurify.addHook('afterSanitizeAttributes', (node) => {
      // Rewrite Images to Proxy
      if (node.tagName === 'IMG' && node.hasAttribute('src')) {
        const src = node.getAttribute('src');
        if (src && src.startsWith('http')) {
          node.setAttribute(
            'src',
            `/api/proxy-asset?url=${encodeURIComponent(src)}`,
          );
          node.removeAttribute('srcset');
        }
      }

      // Target _blank for links
      if (node.tagName === 'A' && node.hasAttribute('href')) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    });

    const cleanHtml = DOMPurify.sanitize(article.content || '', {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'object', 'embed', 'canvas'],
      FORBID_ATTR: ['onmouseover', 'onclick', 'onerror', 'onload'],
    });

    // 5. Return JSON response
    setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=86400');

    return {
      title: article.title,
      byline: article.byline,
      content: cleanHtml,
      originalUrl: targetUrl,
      excerpt: article.excerpt,
      siteName: article.siteName,
    };
  } catch (error: any) {
    console.error('Reader Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage:
        'Failed to process article: ' + (error.message || 'Unknown error'),
    });
  }
});
