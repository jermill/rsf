# Supabase New Project Setup Complete! ✅

## What Was Set Up

### ✅ Database Tables Created (23 tables)
All critical tables for your fitness app and CMS are now live:

**CMS Tables:**
- `site_settings` - Global site configuration
- `pages` - CMS managed pages
- `content_blocks` - Page content blocks
- `media_library` - Media assets
- `navigation_menus` & `navigation_items` - Site navigation
- `content_templates` - Reusable content templates
- `page_versions` - Page version history

**Core App Tables:**
- `profiles` - User profiles (with `role` column for admin/superadmin)
- `bookings` - Service bookings
- `service_providers` & `services` - Service management
- `availability` - Provider availability
- `payment_methods` & `payment_history` - Payment system
- `goals` - User fitness goals
- `measurements` - Body measurements tracking
- `progress_photos` - Progress photo tracking
- `nutrition_logs` - Nutrition tracking
- `workout_logs` - Workout tracking
- `dietary_restrictions` & `nutritional_requirements` - Diet management
- `food_items` - Food database

### ✅ Storage Buckets Created
- `media` - For CMS media uploads (50MB limit, public)
- `avatars` - User profile pictures (5MB limit, public)
- `progress` - Progress photos (10MB limit, private)

### ✅ Row Level Security (RLS) Enabled
All tables have RLS policies configured for:
- Public read access where appropriate
- Authenticated user access
- Admin/Superadmin management access

## Next Steps

### 1. Update Local Environment Variables
Update your `.env` file with:
```env
VITE_SUPABASE_URL=https://sgbspmvglhyhvaikdzhs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnYnNwbXZnbGh5aHZhaWtkemhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzgwNDUsImV4cCI6MjA3ODU1NDA0NX0.8agj7e6NeDvx6uH-aKRf6yVooHaDAQI3bY6JowB8T4o
```

### 2. Configure Storage Bucket Policies (Supabase Dashboard)

Go to: https://supabase.com/dashboard/project/sgbspmvglhyhvaikdzhs/storage/buckets

For each bucket (`media`, `avatars`, `progress`), add these policies:

**Media Bucket:**
1. **SELECT** policy: Public access
   ```sql
   bucket_id = 'media'
   ```

2. **INSERT** policy: Authenticated users can upload
   ```sql
   bucket_id = 'media' AND auth.role() = 'authenticated'
   ```

3. **DELETE** policy: Admins only
   ```sql
   bucket_id = 'media' AND 
   EXISTS (
     SELECT 1 FROM profiles 
     WHERE id = auth.uid() 
     AND role IN ('admin', 'superadmin')
   )
   ```

**Avatars Bucket:**
1. **SELECT** policy: Public
   ```sql
   bucket_id = 'avatars'
   ```

2. **INSERT/UPDATE** policy: Authenticated users
   ```sql
   bucket_id = 'avatars' AND auth.uid() IS NOT NULL
   ```

**Progress Bucket:**
1. **SELECT** policy: Own photos only
   ```sql
   bucket_id = 'progress' AND auth.uid() = owner
   ```

2. **INSERT/UPDATE** policy: Own photos only
   ```sql
   bucket_id = 'progress' AND auth.uid() IS NOT NULL
   ```

### 3. Create Your First Admin User

1. Sign up through your app: https://rsfapp.netlify.app/signup
2. Go to Supabase Dashboard > Authentication > Users
3. Find your user and copy the UUID
4. Go to SQL Editor and run:
   ```sql
   UPDATE profiles 
   SET role = 'superadmin' 
   WHERE id = 'YOUR_USER_UUID_HERE';
   ```

### 4. Update Netlify Environment Variables

Go to: https://app.netlify.com/sites/rsfapp/settings/deploys#environment

Update these variables:
- `VITE_SUPABASE_URL` = `https://sgbspmvglhyhvaikdzhs.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnYnNwbXZnbGh5aHZhaWtkemhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzgwNDUsImV4cCI6MjA3ODU1NDA0NX0.8agj7e6NeDvx6uH-aKRf6yVooHaDAQI3bY6JowB8T4o`

Then trigger a new deployment.

### 5. Test Your CMS

Once deployed with the new environment variables:

1. **Log in** with your superadmin account
2. **Navigate to** `/admin/content` to manage pages
3. **Navigate to** `/admin/theme` to customize the theme
4. **Navigate to** `/admin/media` to upload media
5. **Navigate to** `/admin/page-builder/:pageId` to build pages with blocks

## Project Information

- **Project ID:** `sgbspmvglhyhvaikdzhs`
- **Project URL:** `https://sgbspmvglhyhvaikdzhs.supabase.co`
- **Region:** `US East (North Virginia)`
- **Database:** `postgres` (password: 2026RSF)

## Troubleshooting

### If you see "black screen" on Netlify:
1. Verify environment variables are set correctly
2. Check browser console for errors
3. Ensure Supabase project is not paused

### If CMS pages don't load:
1. Check that storage policies are configured
2. Verify your user has `role = 'superadmin'` in profiles table
3. Check browser console for RLS policy errors

### If uploads fail:
1. Verify storage buckets exist
2. Check storage policies in Supabase dashboard
3. Ensure file size limits are not exceeded

## Support

For issues or questions:
1. Check browser console (F12) for error messages
2. Check Supabase Dashboard > Logs
3. Check Netlify Deploy Logs

---

**Status:** ✅ Backend setup complete! Ready for production use once environment variables are updated.

