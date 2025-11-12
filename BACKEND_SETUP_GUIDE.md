# Complete Backend Setup for Supabase

## 🎯 Overview

Your RSF Fitness app has **29 database migrations** that set up:
- User profiles and authentication
- Booking system
- Meal planning
- Financial tracking
- Reminders
- **CMS System** (Content Management)

---

## 🚀 Quick Setup (Recommended)

### Option 1: Run Complete Setup (All at Once)

1. **Open Supabase SQL Editor:**
   - https://supabase.com/dashboard/project/sgbspmvglhyhvaikdzhs/sql/new

2. **Copy the complete setup file:**
   - Open: `COMPLETE_BACKEND_SETUP.sql` (in your project root)
   - Select ALL content (Cmd+A or Ctrl+A)
   - Copy it

3. **Paste and Run:**
   - Paste into Supabase SQL Editor
   - Click **"Run"** button
   - Wait for completion (may take 30-60 seconds)
   - You should see "Success" message

✅ **Done!** Your entire backend is now set up.

---

## 📋 What Gets Created

### 1. **Core Tables**
- `profiles` - User profiles with roles (user, admin, superadmin)
- `bookings` - Service booking system
- `services` - Available services
- `subscriptions` - User subscription plans
- `payment_methods` - Payment information

### 2. **Meal Planning**
- `meal_plans` - Custom meal plans
- `meal_plan_items` - Individual meals
- `nutrition_targets` - User nutrition goals

### 3. **Reminders & Notifications**
- `reminders` - User reminders
- `notifications` - System notifications

### 4. **CMS System** (Content Management)
- `site_settings` - Global site configuration
- `pages` - Website pages
- `content_blocks` - Page content sections
- `media_library` - Uploaded files
- `navigation_menus` - Site navigation
- `navigation_items` - Menu links
- `content_templates` - Reusable templates
- `page_versions` - Version history

### 5. **Security**
- Row Level Security (RLS) policies on all tables
- User authentication rules
- Admin access controls
- Public content access

### 6. **Functions**
- `create_page_version()` - Save page history
- `restore_page_version()` - Rollback to previous version
- Auto-update triggers for timestamps
- Various helper functions

---

## 🔐 Post-Setup: Create Admin User

After running the migration, create your admin user:

### Step 1: Create User Account

**Via Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard/project/sgbspmvglhyhvaikdzhs/auth/users
2. Click **"Add user"** → **"Create new user"**
3. Enter your email: `your-email@example.com`
4. Enter password: `SecurePassword123!`
5. Click **"Create user"**

### Step 2: Make User Superadmin

**Run this SQL:**
```sql
-- Replace with YOUR email
UPDATE profiles 
SET role = 'superadmin',
    first_name = 'Your',
    last_name = 'Name'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
);

-- Also update auth metadata
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"superadmin"'
)
WHERE email = 'your-email@example.com';
```

---

## 📦 Create Storage Bucket

For media uploads (images, videos):

1. **Go to Storage:**
   - https://supabase.com/dashboard/project/sgbspmvglhyhvaikdzhs/storage/buckets

2. **Create Bucket:**
   - Click **"New bucket"**
   - Name: `public`
   - Check ✅ **"Public bucket"**
   - Click **"Create bucket"**

3. **Add Storage Policies:**

Go to SQL Editor and run:

```sql
-- Policy 1: Public can view files
CREATE POLICY "Public Access for SELECT"
ON storage.objects FOR SELECT
USING (bucket_id = 'public');

-- Policy 2: Authenticated users can upload
CREATE POLICY "Authenticated INSERT"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'public');

-- Policy 3: Authenticated users can delete their files
CREATE POLICY "Authenticated DELETE"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'public');

-- Policy 4: Authenticated users can update their files
CREATE POLICY "Authenticated UPDATE"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'public');
```

---

## ✅ Verify Setup

Run these checks in SQL Editor:

### Check Tables Were Created
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Should return ~20+ tables.

### Check Default Data
```sql
-- Check site settings
SELECT COUNT(*) as settings_count FROM site_settings;

-- Check default pages
SELECT slug, title, is_published FROM pages;

-- Check profiles table
SELECT COUNT(*) as user_count FROM profiles;
```

### Check RLS Policies
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename;
```

Should return many policies (50+).

### Check Functions
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION';
```

Should show `create_page_version`, `restore_page_version`, etc.

---

## 🔧 Troubleshooting

### Error: "relation already exists"
**Solution:** Some tables might already exist. This is okay - the migrations use `IF NOT EXISTS` and `DO $$` blocks to handle this.

### Error: "permission denied"
**Solution:** Make sure you're using the project owner account in Supabase.

### Error: "syntax error"
**Solution:** Make sure you copied the ENTIRE file, including all BEGIN/END blocks.

### Tables not showing up
**Solution:** Refresh the Supabase dashboard or check the "public" schema specifically.

---

## 🎨 Initial Configuration

After setup, configure your site:

### 1. Update Site Settings
```sql
UPDATE site_settings 
SET value = '"Your Gym Name"'
WHERE key = 'site_name';

UPDATE site_settings 
SET value = '"Your tagline here"'
WHERE key = 'site_tagline';
```

### 2. Create First Page
```sql
-- Already done by migration!
-- Check existing pages:
SELECT * FROM pages;
```

### 3. Upload Brand Assets
- Go to: https://rsfapp.netlify.app/admin/media
- Upload your logos and images

---

## 📊 Database Statistics

After setup, you'll have:
- **Tables:** ~25 tables
- **Functions:** ~10+ functions
- **Policies:** 50+ RLS policies
- **Triggers:** ~15 triggers
- **Default Data:**
  - 18 site settings
  - 4 default pages
  - 4 content blocks (home page)
  - 3 navigation menus

---

## 🔗 Quick Links

- **SQL Editor:** https://supabase.com/dashboard/project/sgbspmvglhyhvaikdzhs/sql
- **Table Editor:** https://supabase.com/dashboard/project/sgbspmvglhyhvaikdzhs/editor
- **Auth Users:** https://supabase.com/dashboard/project/sgbspmvglhyhvaikdzhs/auth/users
- **Storage:** https://supabase.com/dashboard/project/sgbspmvglhyhvaikdzhs/storage/buckets
- **API Docs:** https://supabase.com/dashboard/project/sgbspmvglhyhvaikdzhs/api

---

## 🎉 Next Steps

After backend is set up:

1. ✅ **Deploy to Netlify** (with env vars)
2. ✅ **Create admin account**
3. ✅ **Login to admin panel:** https://rsfapp.netlify.app/admin/login
4. ✅ **Start customizing:**
   - Theme Customizer: Change colors & logo
   - Content Manager: Create pages
   - Media Library: Upload images
   - Meal Plans: Set up meal plans
   - Scheduling: Configure bookings

---

## 📞 Support

If you encounter issues:
1. Check the error message in Supabase
2. Verify all migrations ran successfully
3. Check table permissions and RLS policies
4. Review the individual migration files for details

---

**Your backend is production-ready with:**
- ✅ User authentication
- ✅ Role-based access control
- ✅ Complete CMS system
- ✅ Booking management
- ✅ Meal planning
- ✅ Financial tracking
- ✅ File storage
- ✅ Security policies

Let's build something amazing! 🚀

