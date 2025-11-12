# Netlify Deployment Guide for RSF Fitness

## 🚀 Quick Fix for Build Failure

The build likely failed because of missing environment variables. Follow these steps:

## Step 1: Add Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your **rsf** site
3. Go to **Site settings** → **Environment variables**
4. Add these two variables:

```
VITE_SUPABASE_URL = your_supabase_project_url
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
```

**Where to find these values:**
- Log in to https://app.supabase.com
- Select your project
- Go to Settings → API
- Copy the URL and anon/public key

## Step 2: Update Build Settings (Already Configured)

These are already set in `netlify.toml`, but verify in Netlify dashboard:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18 or higher (automatic)

## Step 3: Trigger New Deploy

After adding environment variables:

1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** → **Deploy site**
3. Wait for the build to complete (usually 2-3 minutes)

## Common Issues & Solutions

### Issue 1: "Missing Supabase environment variables"
**Solution:** Add the environment variables in Netlify (Step 1 above)

### Issue 2: TypeScript compilation errors
**Solution:** Already fixed - build now uses `vite build` instead of `tsc && vite build`

### Issue 3: Build succeeds but site shows blank page
**Solution:** Check browser console for errors, usually Supabase connection issues

### Issue 4: 404 errors on page refresh
**Solution:** Already configured - `netlify.toml` has SPA redirects set up

## Step 4: Verify Deployment

Once deployed:

1. **Check the URL:** Your site should be at `https://your-site-name.netlify.app`
2. **Test these pages:**
   - Homepage: `/`
   - Admin login: `/admin/login`
   - Services: `/services`
   - Pricing: `/pricing`

## Step 5: Set Up Database (If Not Done)

Before the CMS will work, you need to run migrations:

1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/20250512000000_cms_system.sql`
3. Paste and run in SQL Editor
4. Create storage bucket named `public` in Storage section

## Optional: Custom Domain

To use your own domain:

1. In Netlify: **Domain settings** → **Add custom domain**
2. Follow DNS configuration instructions
3. Netlify automatically provides SSL certificate

## Build Script Reference

```json
"scripts": {
  "dev": "vite",                    // Local development
  "build": "vite build",            // Production build (Netlify uses this)
  "build:check": "tsc && vite build", // Build with type checking
  "preview": "vite preview"         // Preview production build locally
}
```

## Environment Variables Reference

### Required for All Environments:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

### Optional (Future):
- `VITE_STRIPE_PUBLIC_KEY` - For payment processing
- `VITE_GOOGLE_ANALYTICS_ID` - For analytics
- `VITE_SENTRY_DSN` - For error tracking

## Troubleshooting Checklist

- [ ] Environment variables added in Netlify
- [ ] Build command is `npm run build`
- [ ] Publish directory is `dist`
- [ ] Supabase project is created and accessible
- [ ] Database migrations have been run
- [ ] Storage bucket `public` exists in Supabase
- [ ] Site deploys successfully
- [ ] Can access homepage at deployed URL
- [ ] Can log in to admin panel

## Next Steps After Successful Deploy

1. **Create admin user** in Supabase
2. **Run database migrations**
3. **Upload media** to Media Library
4. **Configure theme** in Theme Customizer
5. **Create pages** in Content Manager
6. **Test all features** on live site

## Support

If you're still having issues:
1. Check the deploy logs in Netlify
2. Check browser console for errors
3. Verify Supabase connection in Network tab
4. Review `CMS_SETUP_GUIDE.md` for detailed setup

---

**Your site will be live at:** `https://your-site-name.netlify.app`

Good luck! 🚀

