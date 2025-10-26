-- Create a storage bucket for shared images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'shared-images',
  'shared-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Create RLS policies for the shared-images bucket
-- Anyone can read shared images (they're public)
CREATE POLICY "Public images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'shared-images');

-- Anyone can upload images (no auth required for this demo)
CREATE POLICY "Anyone can upload shared images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'shared-images');

-- Create a table to store share metadata
CREATE TABLE public.shared_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT NOT NULL,
  share_message TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the table
ALTER TABLE public.shared_images ENABLE ROW LEVEL SECURITY;

-- Anyone can read shared images metadata
CREATE POLICY "Shared images are publicly readable"
ON public.shared_images FOR SELECT
USING (true);

-- Anyone can create shared image records
CREATE POLICY "Anyone can create shared images"
ON public.shared_images FOR INSERT
WITH CHECK (true);