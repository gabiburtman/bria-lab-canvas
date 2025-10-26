import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the image data from the request
    const { imageUrl, shareMessage } = await req.json();
    
    if (!imageUrl) {
      throw new Error('No image URL provided');
    }

    console.log('Fetching image from:', imageUrl);

    // Fetch the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    
    const imageBlob = await imageResponse.blob();
    console.log('Image fetched, size:', imageBlob.size);

    // Generate a unique filename
    const filename = `${crypto.randomUUID()}.jpg`;
    const storagePath = `shares/${filename}`;

    console.log('Uploading to storage:', storagePath);

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('shared-images')
      .upload(storagePath, imageBlob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    console.log('Upload successful:', uploadData);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('shared-images')
      .getPublicUrl(storagePath);

    console.log('Public URL:', publicUrl);

    // Create share record
    const { data: shareData, error: shareError } = await supabase
      .from('shared_images')
      .insert({
        storage_path: storagePath,
        share_message: shareMessage || 'Generated in the Bria GAIA Lab',
        image_url: publicUrl,
      })
      .select()
      .single();

    if (shareError) {
      console.error('Share record error:', shareError);
      throw shareError;
    }

    console.log('Share record created:', shareData);

    // Get the origin from the request headers
    const origin = req.headers.get('origin') || 'http://localhost:8080';
    const shareUrl = `${origin}/share/${shareData.id}`;
    
    console.log('Share URL:', shareUrl);
    
    return new Response(
      JSON.stringify({ 
        shareUrl,
        shareId: shareData.id,
        imageUrl: publicUrl
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in create-share:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});