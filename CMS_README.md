# RSF Fitness - Content Management System (CMS) Documentation

## 🎉 Overview

The RSF Fitness CMS is a powerful, fully-integrated content management system that allows administrators to customize every aspect of the website without touching code.

## 🌟 Features

### 1. **Content Manager**
- Create, edit, and delete pages
- Publish/unpublish pages
- SEO settings per page
- Page versioning and history

### 2. **Page Builder**
- Drag-and-drop block system
- Multiple block types:
  - **Hero** - Full-screen hero sections with images
  - **Features** - Feature grids with icons
  - **Testimonials** - Customer testimonials
  - **CTA** - Call-to-action sections
  - **Gallery** - Image galleries
  - **Text** - Rich text content
  - **Pricing** - Pricing plan displays
  - **Workouts** - Featured workouts
- Reorder blocks with up/down arrows
- Duplicate blocks
- Hide/show blocks
- Version control with rollback

### 3. **Theme Customizer**
- **Branding**
  - Site name and tagline
  - Logo uploads (full color, white, icon)
  - Color palette (primary, secondary, accent)
  - Typography (heading and body fonts)
- **SEO**
  - Meta title, description, keywords
- **Contact Information**
  - Email, phone, address
- **Social Media**
  - Facebook, Instagram, Twitter/X URLs

### 4. **Media Library**
- Upload images, videos, and documents
- Search and filter media
- Edit alt text and captions
- Tag media for organization
- Copy URLs with one click
- Delete unwanted files

## 🚀 Getting Started

### Step 1: Run Database Migrations

The CMS requires database tables. Make sure to run migrations:

```bash
# If using Supabase CLI
supabase db push

# Or apply the migration file manually
# File: supabase/migrations/20250512000000_cms_system.sql
```

### Step 2: Access Admin Panel

1. Log in to the admin panel at `/admin/login`
2. Navigate to **Website CMS** section in the sidebar

### Step 3: Create Your First Page

1. Go to **Content Manager**
2. Click **New Page**
3. Fill in page details:
   - Title: "About Us"
   - URL Slug: "about-us"
   - Meta title and description for SEO
4. Click **Create Page**

### Step 4: Build Page Content

1. Click **Edit** on your new page
2. Add content blocks:
   - Click **Add Content Block**
   - Choose a block type
   - Fill in the content
   - Save
3. Reorder blocks using up/down arrows
4. Toggle visibility with the eye icon
5. Click **Publish** when ready

### Step 5: Customize Your Theme

1. Go to **Theme Customizer**
2. Update branding:
   - Change site name and colors
   - Upload your logo
   - Customize fonts
3. Click **Save Changes**
4. Changes apply site-wide immediately

## 📋 Block Types Guide

### Hero Block
Perfect for landing page headers with large text and CTA buttons.

**Fields:**
- Heading (supports HTML)
- Subheading
- CTA button text and link
- Background image URL
- Overlay opacity

**Example Use:**
Homepage hero, service page headers

### Features Block
Display features or benefits in a grid layout with icons.

**Fields:**
- Section heading and subheading
- Features array:
  - Icon name (Lucide React icons)
  - Title
  - Description

**Example Use:**
"Why Choose Us" section, service features

### CTA Block
Eye-catching call-to-action sections with colored backgrounds.

**Fields:**
- Heading and subheading
- Button text and link
- Background color

**Example Use:**
"Get Started" sections, conversion-focused areas

### Text Block
Simple rich text content with optional heading.

**Fields:**
- Heading (optional)
- Content (supports HTML)
- Alignment (left, center, right)

**Example Use:**
About us content, policy pages, long-form content

### Testimonials Block
Displays customer testimonials from your database.

**Fields:**
- Heading and subheading
- (Testimonials pulled from database)

**Example Use:**
Social proof sections

### Gallery Block
Display image galleries from your media library.

**Fields:**
- Heading (optional)
- (Images can be managed in Media Library)

**Example Use:**
Gym photos, before/after galleries

### Pricing Block
Display pricing plans from your data files.

**Fields:**
- Heading and subheading
- (Plans managed in code data files)

**Example Use:**
Membership pricing pages

### Workouts Block
Featured workout displays from your database.

**Fields:**
- Heading and subheading
- (Workouts pulled from database)

**Example Use:**
Homepage featured workouts

## 🎨 Customization

### Adding Custom Block Types

1. Create a new block type in the migration
2. Add TypeScript types in `src/types/cms.ts`
3. Create a renderer component in `src/components/cms/blocks/`
4. Add to BlockRenderer component
5. Add to BlockEditor component

### Styling Blocks

All blocks respect your theme colors set in Theme Customizer. You can also:

1. Override styles in `src/index.css`
2. Add custom Tailwind classes
3. Use inline styles in block content

## 🔧 Technical Details

### Database Schema

The CMS uses 8 main tables:

1. **site_settings** - Global site configuration
2. **pages** - Page metadata
3. **content_blocks** - Page content sections
4. **media_library** - Uploaded files
5. **navigation_menus** - Menu configurations
6. **navigation_items** - Menu links
7. **content_templates** - Reusable block templates
8. **page_versions** - Version history

### API Hooks

The CMS provides custom React hooks:

```typescript
// Pages
const { pages, createPage, updatePage, deletePage } = usePages();

// Content Blocks
const { blocks, createBlock, updateBlock, deleteBlock } = useContentBlocks(pageId);

// Site Settings
const { settings, updateSetting } = useSiteSettings();

// Media
const { media, uploadMedia, deleteMedia } = useMediaLibrary();

// Versions
const { versions, createVersion, restoreVersion } = usePageVersions(pageId);
```

### CMS Context

The `CMSContext` provides global access to site settings:

```typescript
import { useCMS } from './contexts/CMSContext';

function MyComponent() {
  const { settings, loading } = useCMS();
  
  return <div>{settings.siteName}</div>;
}
```

## 🔒 Security

- **Row Level Security (RLS)** enforced on all tables
- Only admin/superadmin can modify content
- Public can view published content only
- File uploads validated and stored in Supabase Storage

## 📱 Features Coming Soon

- [ ] Drag-and-drop block reordering
- [ ] Visual page builder (WYSIWYG)
- [ ] Content scheduling
- [ ] A/B testing
- [ ] Multi-language support
- [ ] Content approval workflow
- [ ] Custom fields per block type
- [ ] Analytics integration
- [ ] SEO score checker

## 🐛 Troubleshooting

### Content not appearing on frontend

1. Check if page is published (green badge in Content Manager)
2. Check if blocks are visible (eye icon should be open)
3. Clear browser cache
4. Check browser console for errors

### Images not uploading

1. Check Supabase Storage bucket exists (named "public")
2. Verify storage permissions in Supabase dashboard
3. Check file size limits
4. Ensure file type is supported

### Theme changes not applying

1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Check CSS variables in browser DevTools
3. Verify settings saved successfully

## 📞 Support

For issues or questions, contact the development team or file an issue in the repository.

## 🎓 Best Practices

1. **Save versions before major changes** - Use version control feature
2. **Optimize images** - Compress images before upload
3. **Use descriptive names** - Name blocks clearly for easy management
4. **Test before publishing** - Use preview mode to check changes
5. **SEO optimization** - Always fill in meta titles and descriptions
6. **Mobile-first** - Test all content on mobile devices
7. **Accessibility** - Add alt text to all images

---

Built with ❤️ for RSF Fitness

