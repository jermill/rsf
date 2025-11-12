import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Page, ContentBlock } from '../types/cms';
import BlockRenderer from '../components/cms/BlockRenderer';

const DynamicPage: React.FC<{ slug?: string }> = ({ slug: propSlug }) => {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const slug = propSlug || paramSlug || 'home';
  
  const [page, setPage] = useState<Page | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      setLoading(true);
      setError(null);

      // Fetch page data
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (pageError || !pageData) {
        setError('Page not found');
        setLoading(false);
        return;
      }

      setPage(pageData);

      // Fetch content blocks
      const { data: blocksData, error: blocksError } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('page_id', pageData.id)
        .eq('is_visible', true)
        .order('position');

      if (blocksError) {
        setError('Failed to load page content');
      } else {
        setBlocks(blocksData || []);
      }

      setLoading(false);
    };

    fetchPageContent();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Page Not Found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The page you're looking for doesn't exist or hasn't been published yet.
          </p>
        </div>
      </div>
    );
  }

  // Update document title
  useEffect(() => {
    if (page) {
      document.title = page.meta_title || page.title || 'RSF Fitness';
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (page.meta_description) {
        if (metaDescription) {
          metaDescription.setAttribute('content', page.meta_description);
        } else {
          const meta = document.createElement('meta');
          meta.name = 'description';
          meta.content = page.meta_description;
          document.head.appendChild(meta);
        }
      }
    }
  }, [page]);

  return <BlockRenderer blocks={blocks} />;
};

export default DynamicPage;

