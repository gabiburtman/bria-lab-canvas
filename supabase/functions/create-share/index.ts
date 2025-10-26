import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { imageUrl, shareMessage } = await req.json()
    
    console.log('Creating share for image:', imageUrl)

    // Fetch the image
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image')
    }

    const imageBlob = await imageResponse.blob()
    const fileName = `share-${Date.now()}.jpg`
    const filePath = `${fileName}`

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('shared-images')
      .upload(filePath, imageBlob, {
        contentType: 'image/jpeg',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    console.log('Image uploaded successfully:', uploadData.path)

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('shared-images')
      .getPublicUrl(uploadData.path)

    console.log('Public URL:', publicUrl)

    // Create database record
    const { data: shareData, error: dbError } = await supabase
      .from('shared_images')
      .insert({
        storage_path: uploadData.path,
        share_message: shareMessage,
        image_url: publicUrl
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw dbError
    }

    console.log('Share record created:', shareData.id)

    // Return the share URL
    const shareUrl = `${req.headers.get('origin')}/share/${shareData.id}`
    
    return new Response(
      JSON.stringify({ shareUrl, shareId: shareData.id }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error creating share:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})