import { defineEventHandler, getQuery, createError, setHeader } from 'h3';

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
    const response = await fetch(targetUrl, {
      method: 'HEAD', // Lightweight check
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; SafeReader/1.0; +https://github.com/paulmelero/safe-reader)',
      },
    });

    const xFrameOptions = response.headers.get('x-frame-options');
    const csp = response.headers.get('content-security-policy');

    let iframeLikelyBlocked = false;

    // Check X-Frame-Options
    if (xFrameOptions) {
      const xfo = xFrameOptions.toUpperCase();
      if (xfo === 'DENY' || xfo === 'SAMEORIGIN') {
        iframeLikelyBlocked = true;
      }
    }

    // Check CSP frame-ancestors
    // This is a basic check. Parsing CSP is complex, but we look for the directive.
    if (csp) {
      // If frame-ancestors exists, it likely restricts who can embed.
      if (csp.includes('frame-ancestors')) {
        // If it explicitly allows *, we're good.
        // If it's anything else (including 'self', specific domains, or 'none'),
        // we should assume we might be blocked.
        if (!csp.includes('frame-ancestors *')) {
          iframeLikelyBlocked = true;
        }
      }
    }

    setHeader(event, 'Cache-Control', 'public, max-age=3600');

    return {
      iframeLikelyBlocked,
      status: response.status,
    };
  } catch (error: any) {
    // If we can't even reach it (DNS, timeout), iframe will definitely fail.
    return {
      iframeLikelyBlocked: true,
      error: error.message,
    };
  }
});
