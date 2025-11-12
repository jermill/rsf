-- =====================================================
-- CMS SYSTEM MIGRATION
-- Enables full content management capabilities
-- =====================================================

-- =====================================================
-- 1. SITE SETTINGS TABLE
-- Stores global site configuration
-- =====================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  category text NOT NULL, -- 'branding', 'seo', 'social', 'general'
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES profiles(id)
);

-- Insert default settings
INSERT INTO site_settings (key, value, category) VALUES
  ('site_name', '"RSF Fitness"', 'branding'),
  ('site_tagline', '"Transform Your Body, Transform Your Life"', 'branding'),
  ('site_logo', '"/RSF_FullLogo_FullColor.png"', 'branding'),
  ('site_logo_white', '"/RSF_FullLogo_WhiteandGreen.png"', 'branding'),
  ('site_icon', '"/RSF_IconOnly_FullColor.png"', 'branding'),
  ('primary_color', '"#10b981"', 'branding'),
  ('secondary_color', '"#3b82f6"', 'branding'),
  ('accent_color', '"#f59e0b"', 'branding'),
  ('font_heading', '"Inter"', 'branding'),
  ('font_body', '"Inter"', 'branding'),
  ('meta_title', '"RSF Fitness - Transform Your Life"', 'seo'),
  ('meta_description', '"Join RSF Fitness for personalized training, nutrition plans, and a supportive community."', 'seo'),
  ('meta_keywords', '"fitness, training, nutrition, wellness, gym"', 'seo'),
  ('facebook_url', '""', 'social'),
  ('instagram_url', '""', 'social'),
  ('twitter_url', '""', 'social'),
  ('contact_email', '"info@rsfitness.com"', 'general'),
  ('contact_phone', '""', 'general'),
  ('address', '""', 'general')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- 2. PAGES TABLE
-- Manages website pages
-- =====================================================
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  meta_title text,
  meta_description text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id),
  updated_by uuid REFERENCES profiles(id)
);

-- Insert default pages
INSERT INTO pages (slug, title, meta_title, meta_description, is_published, published_at) VALUES
  ('home', 'Home', 'RSF Fitness - Transform Your Life', 'Join RSF Fitness for personalized training, nutrition plans, and a supportive community.', true, now()),
  ('services', 'Services', 'Our Services - RSF Fitness', 'Explore our comprehensive fitness services including personal training, group classes, and nutrition coaching.', true, now()),
  ('pricing', 'Pricing', 'Membership Plans - RSF Fitness', 'Choose the perfect membership plan for your fitness journey.', true, now()),
  ('community', 'Community', 'Community - RSF Fitness', 'Join our vibrant fitness community and connect with like-minded individuals.', true, now())
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 3. CONTENT BLOCKS TABLE
-- Stores reusable content sections
-- =====================================================
CREATE TABLE IF NOT EXISTS content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES pages(id) ON DELETE CASCADE,
  block_type text NOT NULL, -- 'hero', 'features', 'testimonials', 'cta', 'gallery', 'text', 'custom'
  block_name text NOT NULL,
  content jsonb NOT NULL,
  position integer NOT NULL DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_content_blocks_page_position ON content_blocks(page_id, position);

-- =====================================================
-- 4. MEDIA LIBRARY TABLE
-- Manages uploaded images and files
-- =====================================================
CREATE TABLE IF NOT EXISTS media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_path text NOT NULL UNIQUE,
  file_url text NOT NULL,
  file_type text NOT NULL, -- 'image', 'video', 'document'
  mime_type text NOT NULL,
  file_size integer NOT NULL, -- in bytes
  alt_text text,
  caption text,
  width integer,
  height integer,
  uploaded_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  tags text[] DEFAULT '{}'
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_media_library_type ON media_library(file_type);
CREATE INDEX IF NOT EXISTS idx_media_library_tags ON media_library USING gin(tags);

-- =====================================================
-- 5. NAVIGATION MENUS TABLE
-- Manages site navigation
-- =====================================================
CREATE TABLE IF NOT EXISTS navigation_menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  location text NOT NULL, -- 'header', 'footer', 'mobile'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default menus
INSERT INTO navigation_menus (name, location) VALUES
  ('Primary Navigation', 'header'),
  ('Footer Navigation', 'footer'),
  ('Mobile Navigation', 'mobile')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 6. NAVIGATION ITEMS TABLE
-- Individual menu items
-- =====================================================
CREATE TABLE IF NOT EXISTS navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id uuid REFERENCES navigation_menus(id) ON DELETE CASCADE,
  label text NOT NULL,
  url text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  parent_id uuid REFERENCES navigation_items(id) ON DELETE CASCADE,
  is_visible boolean DEFAULT true,
  open_in_new_tab boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_navigation_items_menu_position ON navigation_items(menu_id, position);

-- =====================================================
-- 7. CONTENT TEMPLATES TABLE
-- Pre-built section templates
-- =====================================================
CREATE TABLE IF NOT EXISTS content_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  block_type text NOT NULL,
  template_data jsonb NOT NULL,
  thumbnail_url text,
  is_system boolean DEFAULT false, -- system templates can't be deleted
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

-- =====================================================
-- 8. PAGE VERSIONS TABLE (for history/rollback)
-- =====================================================
CREATE TABLE IF NOT EXISTS page_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES pages(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  content_snapshot jsonb NOT NULL, -- stores all blocks at this version
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id),
  notes text
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_page_versions_page ON page_versions(page_id, version_number DESC);

-- =====================================================
-- 9. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_blocks_updated_at ON content_blocks;
CREATE TRIGGER update_content_blocks_updated_at
  BEFORE UPDATE ON content_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_navigation_menus_updated_at ON navigation_menus;
CREATE TRIGGER update_navigation_menus_updated_at
  BEFORE UPDATE ON navigation_menus
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_versions ENABLE ROW LEVEL SECURITY;

-- Public read access to published content
CREATE POLICY "Public can view published pages"
  ON pages FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can view visible content blocks"
  ON content_blocks FOR SELECT
  USING (is_visible = true AND EXISTS (
    SELECT 1 FROM pages WHERE pages.id = content_blocks.page_id AND pages.is_published = true
  ));

CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view navigation menus"
  ON navigation_menus FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view visible navigation items"
  ON navigation_items FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Public can view media"
  ON media_library FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view system templates"
  ON content_templates FOR SELECT
  USING (is_system = true);

-- Admin full access
CREATE POLICY "Admins can manage site settings"
  ON site_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can manage pages"
  ON pages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can manage content blocks"
  ON content_blocks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can manage media"
  ON media_library FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can manage navigation"
  ON navigation_menus FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can manage navigation items"
  ON navigation_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can manage templates"
  ON content_templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can view page versions"
  ON page_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- =====================================================
-- 11. HELPER FUNCTIONS
-- =====================================================

-- Function to create a page version snapshot
CREATE OR REPLACE FUNCTION create_page_version(
  p_page_id uuid,
  p_notes text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_version_id uuid;
  v_version_number integer;
  v_content_snapshot jsonb;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO v_version_number
  FROM page_versions
  WHERE page_id = p_page_id;
  
  -- Create snapshot of all content blocks
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', id,
      'block_type', block_type,
      'block_name', block_name,
      'content', content,
      'position', position,
      'is_visible', is_visible
    ) ORDER BY position
  )
  INTO v_content_snapshot
  FROM content_blocks
  WHERE page_id = p_page_id;
  
  -- Insert version
  INSERT INTO page_versions (page_id, version_number, content_snapshot, created_by, notes)
  VALUES (p_page_id, v_version_number, v_content_snapshot, auth.uid(), p_notes)
  RETURNING id INTO v_version_id;
  
  RETURN v_version_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to restore a page version
CREATE OR REPLACE FUNCTION restore_page_version(
  p_version_id uuid
)
RETURNS boolean AS $$
DECLARE
  v_page_id uuid;
  v_content_snapshot jsonb;
  v_block jsonb;
BEGIN
  -- Get version data
  SELECT page_id, content_snapshot
  INTO v_page_id, v_content_snapshot
  FROM page_versions
  WHERE id = p_version_id;
  
  IF v_page_id IS NULL THEN
    RAISE EXCEPTION 'Version not found';
  END IF;
  
  -- Delete current blocks
  DELETE FROM content_blocks WHERE page_id = v_page_id;
  
  -- Restore blocks from snapshot
  FOR v_block IN SELECT * FROM jsonb_array_elements(v_content_snapshot)
  LOOP
    INSERT INTO content_blocks (
      page_id,
      block_type,
      block_name,
      content,
      position,
      is_visible
    )
    VALUES (
      v_page_id,
      v_block->>'block_type',
      v_block->>'block_name',
      v_block->'content',
      (v_block->>'position')::integer,
      (v_block->>'is_visible')::boolean
    );
  END LOOP;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 12. INITIAL CONTENT BLOCKS FOR HOME PAGE
-- =====================================================

-- Get home page ID
DO $$
DECLARE
  v_home_page_id uuid;
BEGIN
  SELECT id INTO v_home_page_id FROM pages WHERE slug = 'home' LIMIT 1;
  
  IF v_home_page_id IS NOT NULL THEN
    -- Hero Section
    INSERT INTO content_blocks (page_id, block_type, block_name, content, position) VALUES
    (v_home_page_id, 'hero', 'Main Hero Section', '{
      "heading": "Transform Your Body,<br/>Transform Your Life",
      "subheading": "Join RSF Fitness and discover a personalized approach to wellness",
      "ctaText": "Start Your Journey",
      "ctaLink": "/pricing",
      "backgroundImage": "/C71A8224.jpg",
      "overlayOpacity": 0.4
    }'::jsonb, 1),
    
    -- Features/Benefits Section
    (v_home_page_id, 'features', 'Benefits Section', '{
      "heading": "Why Choose RSF Fitness",
      "subheading": "Everything you need to achieve your fitness goals",
      "features": [
        {
          "icon": "Dumbbell",
          "title": "Expert Training",
          "description": "Work with certified trainers who create personalized workout plans"
        },
        {
          "icon": "Apple",
          "title": "Nutrition Coaching",
          "description": "Custom meal plans designed for your goals and lifestyle"
        },
        {
          "icon": "Users",
          "title": "Community Support",
          "description": "Join a motivating community of fitness enthusiasts"
        },
        {
          "icon": "Calendar",
          "title": "Flexible Scheduling",
          "description": "Book sessions that fit your busy schedule"
        }
      ]
    }'::jsonb, 2),
    
    -- Testimonials Section
    (v_home_page_id, 'testimonials', 'Client Testimonials', '{
      "heading": "Success Stories",
      "subheading": "Hear from our amazing community"
    }'::jsonb, 3),
    
    -- CTA Section
    (v_home_page_id, 'cta', 'Bottom Call to Action', '{
      "heading": "Ready to Start Your Journey?",
      "subheading": "Join hundreds of members transforming their lives",
      "ctaText": "Get Started Today",
      "ctaLink": "/pricing",
      "backgroundColor": "#10b981"
    }'::jsonb, 4);
  END IF;
END $$;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

