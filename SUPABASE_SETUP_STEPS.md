# Supabase Setup for RSF CMS

## Your Project Details
- **Project ID:** sgbspmvglhyhvaikdzhs
- **Project URL:** https://sgbspmvglhyhvaikdzhs.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/sgbspmvglhyhvaikdzhs

---

## Step 1: Run Database Migration ✅

1. Go to SQL Editor: https://supabase.com/dashboard/project/sgbspmvglhyhvaikdzhs/sql/new
2. Copy the ENTIRE contents of: `supabase/migrations/20250512000000_cms_system.sql`
3. Paste into SQL Editor
4. Click "Run" button
5. You should see "Success. No rows returned"

This creates all the CMS tables:
- `site_settings` - Site configuration
- `pages` - Your pages
- `content_blocks` - Page content sections
- `media_library` - Uploaded files
- `navigation_menus` - Site navigation
- `content_templates` - Reusable templates
- `page_versions` - Version history

---

## Step 2: Create Storage Bucket 🗂️

1. Go to Storage: https://supabase.com/dashboard/project/sgbspmvglhyhvaikdzhs/storage/buckets
2. Click "New bucket"
3. Name: `public`
4. Check ✅ "Public bucket"
5. Click "Create bucket"

**Set Storage Policies:**

After creating the bucket, click on `public` bucket → "Policies" tab → "New Policy"

Add these 3 policies:

### Policy 1: Public Read Access
```sql
CREATE POLICY "Public Access for SELECT"
ON storage.objects FOR SELECT
USING (bucket_id = 'public');
```

### Policy 2: Authenticated Upload
```sql
CREATE POLICY "Authenticated INSERT"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'public');
```

### Policy 3: Authenticated Delete
```sql
CREATE POLICY "Authenticated DELETE"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'public');
```

---

## Step 3: Create Admin User 👤

### Option A: Create via Supabase Dashboard

1. Go to Authentication: https://supabase.com/dashboard/project/sgbspmvglhyhvaikdzhs/auth/users
2. Click "Add user" → "Create new user"
3. Enter email: `your-email@example.com`
4. Enter password: `YourSecurePassword123!`
5. Click "Create user"

### Option B: Sign Up via Your App

Once deployed, go to your app and sign up normally, then proceed to make yourself admin.

### Make User Admin

After creating the user, run this in SQL Editor:

```sql
-- Replace with your actual email
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"superadmin"'
)
WHERE email = 'your-email@example.com';

-- Also update profiles table if it exists
INSERT INTO profiles (id, email, role, first_name, last_name)
SELECT 
  id,
  email,
  'superadmin',
  'Admin',
  'User'
FROM auth.users 
WHERE email = 'your-email@example.com'
ON CONFLICT (id) 
DO UPDATE SET role = 'superadmin';
```

---

## Step 4: Verify Setup ✅

### Check Tables Exist
Run in SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'site_settings',
  'pages',
  'content_blocks',
  'media_library',
  'navigation_menus',
  'navigation_items',
  'content_templates',
  'page_versions'
);
```

Should return 8 tables.

### Check Storage Bucket
```sql
SELECT * FROM storage.buckets WHERE name = 'public';
```

Should return 1 row.

### Check Admin User
```sql
SELECT email, raw_user_meta_data->>'role' as role 
FROM auth.users 
WHERE email = 'your-email@example.com';
```

Should show role as 'superadmin'.

---

## Step 5: Test Your Site 🚀

After Netlify redeploys (with env vars):

1. **Visit Homepage:** https://rsfapp.netlify.app/
   - Should load (not black screen anymore!)

2. **Test Admin Login:** https://rsfapp.netlify.app/admin/login
   - Use the email/password you created
   - Should see admin dashboard

3. **Test CMS Features:**
   - Content Manager: https://rsfapp.netlify.app/admin/content
   - Theme Customizer: https://rsfapp.netlify.app/admin/theme
   - Media Library: https://rsfapp.netlify.app/admin/media

---

## Troubleshooting 🔧

### Black Screen Persists
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors (F12)
- Verify env vars are in Netlify
- Verify migration ran successfully

### Can't Login
- Check user exists in Auth → Users
- Verify role is set to 'superadmin'
- Try password reset

### Upload Fails
- Check storage bucket exists and is public
- Verify storage policies are created
- Check file size (max 50MB by default)

---

## Quick Reference Commands

### Create New Admin User (SQL)
```sql
-- Insert into auth.users (Supabase handles this via dashboard)
-- Then update role:
UPDATE profiles SET role = 'superadmin' WHERE email = 'newemail@example.com';
```

### Reset All CMS Data (DANGER!)
```sql
-- Only run if you want to start fresh
TRUNCATE pages, content_blocks, media_library CASCADE;
```

### Check CMS Statistics
```sql
SELECT 
  (SELECT COUNT(*) FROM pages) as total_pages,
  (SELECT COUNT(*) FROM content_blocks) as total_blocks,
  (SELECT COUNT(*) FROM media_library) as total_media,
  (SELECT COUNT(*) FROM page_versions) as total_versions;
```

---

## Next Steps After Setup

1. ✅ Customize theme colors and logo
2. ✅ Upload your professional photos to Media Library
3. ✅ Create your first page in Content Manager
4. ✅ Build homepage with Page Builder
5. ✅ Set up navigation menus
6. ✅ Configure SEO settings

---

**Need help?** Check the main documentation:
- `CMS_SETUP_GUIDE.md` - Complete setup guide
- `CMS_README.md` - Feature documentation
- `CMS_IMPLEMENTATION_SUMMARY.md` - Technical details

Good luck! 🎉

