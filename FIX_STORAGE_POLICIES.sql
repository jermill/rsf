-- Fix Storage Policies for Correct Bucket Name
-- Run this in Supabase SQL Editor

-- First, drop the old policies
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public can view community files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;

-- Create new policies with correct bucket name (capital P)
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'Public' 
  AND (storage.foldername(name))[1] = 'community'
);

CREATE POLICY "Public can view community files"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'Public' 
  AND (storage.foldername(name))[1] = 'community'
);

CREATE POLICY "Users can delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'Public' 
  AND (storage.foldername(name))[1] = 'community'
  AND (storage.filename(name)) LIKE auth.uid()::text || '-%'
);

-- Verify policies were created
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename = 'objects';

