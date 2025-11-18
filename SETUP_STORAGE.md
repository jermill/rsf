# 🗄️ Supabase Storage Setup for Community Photos

## Problem
Photo uploads are failing because the Supabase Storage bucket doesn't exist or isn't configured properly.

---

## 🛠️ Solution: Create Storage Bucket

### Step 1: Go to Supabase Dashboard
1. Visit: https://supabase.com/dashboard
2. Select your **RSF project**
3. Click **"Storage"** in the left sidebar

### Step 2: Create "public" Bucket
1. Click **"New bucket"** button (top right)
2. Fill in the form:
   - **Name:** `public`
   - **Public bucket:** ✅ **Check this box** (important!)
   - **File size limit:** 50 MB (recommended)
   - **Allowed MIME types:** Leave empty (or add: `image/jpeg, image/png, image/gif, image/webp`)
3. Click **"Create bucket"**

### Step 3: Set Bucket Policies
After creating the bucket, you need to set up access policies:

1. Click on the **"public"** bucket you just created
2. Go to the **"Policies"** tab
3. Click **"New policy"**

#### Policy 1: Allow Authenticated Users to Upload
```sql
-- Policy Name: Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'public' 
  AND (storage.foldername(name))[1] = 'community'
);
```

#### Policy 2: Allow Public to View
```sql
-- Policy Name: Public can view community images
CREATE POLICY "Public can view community images"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'public' 
  AND (storage.foldername(name))[1] = 'community'
);
```

#### Policy 3: Allow Users to Delete Own Files
```sql
-- Policy Name: Users can delete own files
CREATE POLICY "Users can delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'public' 
  AND (storage.foldername(name))[1] = 'community'
  AND (storage.filename(name)) LIKE auth.uid()::text || '-%'
);
```

---

## 🎯 Alternative: Use the UI Policy Builder

If you prefer using the UI:

1. Go to **Storage → Policies**
2. Click **"New policy"**
3. Select **"Custom"**
4. Configure:
   - **Policy name:** `Allow authenticated uploads`
   - **Target roles:** `authenticated`
   - **Action:** `INSERT`
   - **Policy definition:**
     ```sql
     bucket_id = 'public' AND (storage.foldername(name))[1] = 'community'
     ```

Repeat for SELECT (public) and DELETE (authenticated) policies.

---

## ✅ Verify Setup

After setting up:

1. **Refresh your browser** (Cmd+Shift+R)
2. Go to **Community** page
3. Click **"Photo"** button (camera icon)
4. Select an image
5. Check browser console (F12) for:
   - `📤 Uploading file:`
   - `✅ Upload successful:`
   - `🔗 Public URL:`

---

## 🐛 Troubleshooting

### Error: "Bucket not found"
- ✅ Make sure bucket name is exactly `public` (lowercase)
- ✅ Bucket must be marked as "Public bucket"

### Error: "Policy check violation"
- ✅ Make sure policies are created (see Step 3)
- ✅ User must be authenticated (signed in)
- ✅ Check that `authenticated` role has INSERT permission

### Error: "File size too large"
- ✅ Check bucket file size limit (should be at least 10 MB)
- ✅ Try compressing the image

### Images upload but don't display
- ✅ Make sure SELECT policy exists for `public` role
- ✅ Check that bucket is marked as "Public bucket"
- ✅ Verify the public URL format in console logs

---

## 📊 Bucket Structure

After setup, your uploads will be organized like:
```
public/
  └── community/
      ├── {user_id}-{timestamp}.jpg
      ├── {user_id}-{timestamp}.png
      └── ...
```

---

## 🔐 Security Notes

✅ **Safe:**
- Only authenticated users can upload
- Files are organized by community folder
- Users can only delete their own files

⚠️ **Note:**
- All uploaded images are publicly viewable (by design for social feed)
- File names include user ID for tracking ownership

---

Need more help? Check the console logs after attempting an upload!

