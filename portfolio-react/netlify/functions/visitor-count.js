const { createClient } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Initialize Netlify Blob storage
    const blob = createClient({
      token: process.env.NETLIFY_BLOB_TOKEN || context.clientContext?.custom?.netlify_blobs_token,
      siteID: process.env.SITE_ID || context.site?.id,
    });

    const STORE_KEY = 'visitor-count';
    const VISITORS_KEY = 'unique-visitors';

    // Get current count and visitor list
    let countData = await blob.get(STORE_KEY);
    let visitorData = await blob.get(VISITORS_KEY);
    
    let count = countData ? parseInt(countData) : 0;
    let visitors = visitorData ? JSON.parse(visitorData) : {};

    if (event.httpMethod === 'POST') {
      // Increment count for new visitor
      const body = JSON.parse(event.body || '{}');
      const visitorId = body.visitorId;
      const fingerprint = body.fingerprint;
      
      if (!visitorId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'visitorId is required' }),
        };
      }

      // Check if this visitor has been counted (using both ID and fingerprint for reliability)
      const visitorKey = fingerprint || visitorId;
      const lastVisit = visitors[visitorKey];
      const now = Date.now();
      const ONE_DAY = 24 * 60 * 60 * 1000;

      // Only count if: new visitor OR last visit was more than 24 hours ago
      if (!lastVisit || (now - lastVisit) > ONE_DAY) {
        count += 1;
        visitors[visitorKey] = now;

        // Store updated count and visitors
        await blob.set(STORE_KEY, count.toString());
        await blob.set(VISITORS_KEY, JSON.stringify(visitors));

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            count,
            isNewVisitor: !lastVisit,
            message: 'Count incremented',
          }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          count,
          isNewVisitor: false,
          message: 'Visitor already counted today',
        }),
      };
    }

    // GET request - just return current count
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ count }),
    };
  } catch (error) {
    console.error('Error in visitor-count function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
    };
  }
};
