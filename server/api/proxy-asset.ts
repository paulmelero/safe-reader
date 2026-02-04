import { defineEventHandler, getQuery, createError, type H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);
  const targetUrl = query.url as string;

  if (!targetUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing URL parameter',
    });
  }

  try {
    const url = new URL(targetUrl);
    // Basic protocol check
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid protocol',
      });
    }

    // Proxy the request using global fetch
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 SafeReader/1.0',
      },
    });

    if (!response.body) {
      throw createError({
        statusCode: 502,
        statusMessage: 'Failed to fetch asset',
      });
    }

    const contentType = response.headers.get('content-type') || '';

    // Strict Accept List
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/avif',
      'text/css',
    ];

    // Check if content type is allowed
    const isAllowed = allowedTypes.some((type) =>
      contentType.toLowerCase().startsWith(type),
    );

    if (!isAllowed) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Content-Type not allowed (Only images and CSS proxied)',
      });
    }

    // Prepare headers for the response
    const headers = new Headers(response.headers);
    headers.set(
      'Cache-Control',
      'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
    );
    headers.set('Content-Type', contentType);

    // Remove problematic headers
    headers.delete('content-encoding');
    headers.delete('content-length');

    // Return a native Response object
    return new Response(response.body, {
      status: response.status,
      headers: headers,
    });
  } catch (error: any) {
    console.error('Proxy error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching asset: ' + (error.message || 'Unknown'),
    });
  }
});
