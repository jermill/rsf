# RSF Fitness CMS - Quick Setup Guide

## 🚀 Installation & Setup

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Project cloned and dependencies installed

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project settings.

### Step 3: Run Database Migrations

#### Option A: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

#### Option B: Manual Migration

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy contents of `supabase/migrations/20250512000000_cms_system.sql`
4. Paste and run in SQL Editor

### Step 4: Set Up Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `public`
3. Set policies:
   - **Public access for SELECT**: Allow anyone to view files
   - **Authenticated INSERT**: Allow logged-in users to upload
   - **Authenticated DELETE**: Allow users to delete their files

```sql
-- Storage policies (run in SQL Editor)
CREATE POLICY "Public Access for SELECT"
ON storage.objects FOR SELECT
USING (bucket_id = 'public');

CREATE POLICY "Authenticated INSERT"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'public' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated DELETE"
ON storage.objects FOR DELETE
USING (bucket_id = 'public' AND auth.role() = 'authenticated');
```

### Step 5: Create Admin User

You need a user with admin/superadmin role to access the CMS.

#### Option A: Using Supabase Dashboard

1. Go to Authentication → Users
2. Create a new user
3. Go to Table Editor → profiles
4. Find the user and set `role` to `superadmin`

#### Option B: Using SQL

```sql
-- First, create user via Supabase Auth UI, then:
UPDATE profiles 
SET role = 'superadmin' 
WHERE email = 'your-admin-email@example.com';
```

### Step 6: Start Development Server

```bash
npm run dev
```

Your app should now be running at `http://localhost:5173`

### Step 7: Access CMS

1. Navigate to `http://localhost:5173/admin/login`
2. Log in with your admin credentials
3. You should see the admin dashboard

### Step 8: Configure Theme

1. In admin sidebar, click **Theme Customizer** under "Website CMS"
2. Update:
   - Site name
   - Logo URLs (use existing assets or upload new ones)
   - Colors
   - Contact information
3. Click **Save Changes**

### Step 9: Create Your First Page

1. Click **Content Manager** in sidebar
2. Click **New Page**
3. Fill in:
   - **Title**: "Home"
   - **URL Slug**: "home"
   - **Meta Title**: "Your Site Title"
   - **Meta Description**: "Your site description"
4. Click **Create Page**

### Step 10: Build Page Content

1. Click **Edit** on your new page
2. Click **Add Content Block**
3. Choose **Hero** block
4. Fill in:
   - Heading: "Welcome to RSF Fitness"
   - Subheading: "Transform your life today"
   - CTA Text: "Get Started"
   - CTA Link: "/pricing"
   - Background Image: Use one of the existing photos
5. Click **Save Changes**
6. Add more blocks as needed
7. Click **Publish** in Content Manager

### Step 11: View Your Page

Navigate to `http://localhost:5173/` to see your dynamically generated homepage!

## 🎨 Customization Tips

### Using Existing Assets

You have professional photos in your project root:
- Move them to a `/public/images/` folder
- Reference them in blocks like: `/images/C71A8224.jpg`

### Brand Colors

Your current theme uses:
- Primary: `#10b981` (Green)
- Secondary: `#3b82f6` (Blue)
- Accent: `#f59e0b` (Orange)

Update these in Theme Customizer to match your brand.

### Logo Files

You have these logos in your project:
- `RSF_FullLogo_FullColor.png`
- `RSF_FullLogo_WhiteandGreen.png`
- `RSF_IconOnly_FullColor.png`

Reference them in Theme Customizer after moving to `/public/`

## 📱 Making Homepage Dynamic

To make your existing homepage use CMS content:

### Option 1: Replace HomePage Component

```typescript
// In src/App.tsx
import DynamicPage from './pages/DynamicPage';

// Replace
<Route index element={<HomePage />} />

// With
<Route index element={<DynamicPage slug="home" />} />
```

### Option 2: Wrap Existing Content

Keep your existing homepage but add CMS sections above or below:

```typescript
// In src/pages/HomePage.tsx
import DynamicPage from './DynamicPage';

function HomePage() {
  return (
    <>
      <DynamicPage slug="home" />
      {/* Your existing content */}
    </>
  );
}
```

## 🔄 Migration from Hardcoded Content

If you want to migrate your existing hardcoded content to CMS:

1. **Create pages for each route**:
   - Home → slug: "home"
   - Services → slug: "services"
   - Pricing → slug: "pricing"
   - Community → slug: "community"

2. **Recreate sections as blocks**:
   - Hero sections → Hero blocks
   - Feature grids → Features blocks
   - Testimonials → Testimonials blocks

3. **Update routes in App.tsx**:
   ```typescript
   <Route path="/services" element={<DynamicPage slug="services" />} />
   <Route path="/pricing" element={<DynamicPage slug="pricing" />} />
   ```

## 🚨 Troubleshooting

### "Missing Supabase environment variables"

- Check your `.env` file exists
- Restart dev server after creating `.env`
- Verify variable names match exactly

### "Permission denied" errors

- Check RLS policies are applied
- Verify user has admin/superadmin role
- Check Supabase logs for details

### Images not loading

- Ensure storage bucket is named exactly `public`
- Check storage policies
- Verify file paths are correct

### CMS pages showing 404

- Verify migrations ran successfully
- Check tables exist in Supabase Table Editor
- Ensure routes added to App.tsx

## 📚 Next Steps

1. **Populate Media Library**: Upload your professional photos
2. **Create More Pages**: Add Services, About, Contact pages
3. **Customize Theme**: Match your brand identity
4. **Add Content**: Build out your page content with blocks
5. **SEO Optimization**: Fill in meta tags for all pages
6. **Test Mobile**: Ensure everything looks great on mobile
7. **Go Live**: Deploy to Netlify when ready

## 🎓 Learning Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)

## 💡 Pro Tips

1. **Use Versions**: Create a version before major changes
2. **Preview First**: Always preview before publishing
3. **Optimize Images**: Compress images for better performance
4. **Mobile First**: Design for mobile, then desktop
5. **SEO Matters**: Never skip meta descriptions
6. **Backup**: Export your Supabase data regularly

---

Need help? Refer to the comprehensive `CMS_README.md` for detailed documentation.

Happy building! 🚀

