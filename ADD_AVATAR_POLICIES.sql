-- Add Storage Policies for Avatar Uploads
-- Run this in Supabase SQL Editor

-- Policy 1: Allow authenticated users to upload avatars
CREATE POLICY "Allow authenticated avatar uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'Public' 
  AND (storage.foldername(name))[1] = 'avatars'
);

-- Policy 2: Allow public to view avatars
CREATE POLICY "Public can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'Public' 
  AND (storage.foldername(name))[1] = 'avatars'
);

-- Policy 3: Allow users to update/delete their own avatars
CREATE POLICY "Users can update own avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'Public' 
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.filename(name)) LIKE auth.uid()::text || '-%'
);

CREATE POLICY "Users can delete own avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'Public' 
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.filename(name)) LIKE auth.uid()::text || '-%'
);

-- Verify all policies
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename = 'objects'
ORDER BY policyname;

