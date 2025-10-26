import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract share ID from URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const shareId = pathParts[pathParts.length - 1];

    if (!shareId) {
      throw new Error('No share ID provided');
    }

    // Fetch share data
    const { data: shareData, error } = await supabase
      .from('shared_images')
      .select('*')
      .eq('id', shareId)
      .maybeSingle();

    if (error || !shareData) {
      throw new Error('Share not found');
    }

    const shareMessage = shareData.share_message || 'Generated in the Bria GAIA Lab';
    const imageUrl = shareData.image_url;
    const origin = req.headers.get('origin') || 'https://87c75306-9882-45ad-9687-7ffbd4cbfdad.lovableproject.com';
    const shareUrl = `${origin}/share/${shareId}`;

    // Generate HTML with meta tags
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${shareMessage}</title>
  <meta name="description" content="${shareMessage}">
  
  <!-- Open Graph meta tags -->
  <meta property="og:title" content="${shareMessage}">
  <meta property="og:description" content="${shareMessage}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:secure_url" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${shareUrl}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Bria GAIA Lab">
  
  <!-- Twitter Card meta tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${shareMessage}">
  <meta name="twitter:description" content="${shareMessage}">
  <meta name="twitter:image" content="${imageUrl}">
  <meta name="twitter:image:alt" content="${shareMessage}">
  
  <meta http-equiv="refresh" content="0;url=${origin}/share/${shareId}">
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #f5f5f5;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${shareMessage}</h1>
    <img src="${imageUrl}" alt="Shared image">
    <p>Redirecting to full page...</p>
  </div>
</body>
</html>`;

    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
      },
    });

  } catch (error) {
    console.error('Error in share-page:', error);
    return new Response(
      `<!DOCTYPE html>
<html>
<head><title>Share Not Found</title></head>
<body><h1>Share not found</h1></body>
</html>`,
      {
        status: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
        },
      }
    );
  }
});
