// CMS Type Definitions

export interface SiteSetting {
  id: string;
  key: string;
  value: any;
  category: 'branding' | 'seo' | 'social' | 'general';
  updated_at: string;
  updated_by?: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface ContentBlock {
  id: string;
  page_id: string;
  block_type: BlockType;
  block_name: string;
  content: BlockContent;
  position: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export type BlockType = 
  | 'hero' 
  | 'features' 
  | 'testimonials' 
  | 'cta' 
  | 'gallery' 
  | 'text' 
  | 'pricing'
  | 'workouts'
  | 'custom';

export interface BlockContent {
  [key: string]: any;
}

// Specific block content types
export interface HeroBlockContent {
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
  overlayOpacity?: number;
}

export interface FeaturesBlockContent {
  heading: string;
  subheading?: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface TestimonialsBlockContent {
  heading: string;
  subheading?: string;
  testimonials?: Array<{
    id: string;
    name: string;
    quote: string;
    imageUrl?: string;
    rating?: number;
  }>;
}

export interface CTABlockContent {
  heading: string;
  subheading?: string;
  ctaText: string;
  ctaLink: string;
  backgroundColor?: string;
}

export interface GalleryBlockContent {
  heading?: string;
  images: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
}

export interface TextBlockContent {
  heading?: string;
  content: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface MediaItem {
  id: string;
  file_name: string;
  file_path: string;
  file_url: string;
  file_type: 'image' | 'video' | 'document';
  mime_type: string;
  file_size: number;
  alt_text?: string;
  caption?: string;
  width?: number;
  height?: number;
  uploaded_by?: string;
  created_at: string;
  tags?: string[];
}

export interface NavigationMenu {
  id: string;
  name: string;
  location: 'header' | 'footer' | 'mobile';
  created_at: string;
  updated_at: string;
  items?: NavigationItem[];
}

export interface NavigationItem {
  id: string;
  menu_id: string;
  label: string;
  url: string;
  position: number;
  parent_id?: string;
  is_visible: boolean;
  open_in_new_tab: boolean;
  created_at: string;
}

export interface ContentTemplate {
  id: string;
  name: string;
  description?: string;
  block_type: BlockType;
  template_data: BlockContent;
  thumbnail_url?: string;
  is_system: boolean;
  created_at: string;
  created_by?: string;
}

export interface PageVersion {
  id: string;
  page_id: string;
  version_number: number;
  content_snapshot: any;
  created_at: string;
  created_by?: string;
  notes?: string;
}

// CMS Context Types
export interface CMSSettings {
  siteName: string;
  siteTagline: string;
  siteLogo: string;
  siteLogoWhite: string;
  siteIcon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

