import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  Page,
  ContentBlock,
  SiteSetting,
  MediaItem,
  NavigationMenu,
  ContentTemplate,
  PageVersion,
} from '../types/cms';

// Hook for managing pages
export function usePages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPages = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('title');
    if (error) setError(error.message);
    else setPages(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const createPage = async (page: Omit<Page, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pages')
      .insert([page])
      .select()
      .single();
    if (error) setError(error.message);
    else if (data) {
      setPages((prev) => [...prev, data]);
    }
    setLoading(false);
    return { data, error };
  };

  const updatePage = async (id: string, updates: Partial<Page>) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) setError(error.message);
    else if (data) {
      setPages((prev) => prev.map((p) => (p.id === id ? data : p)));
    }
    setLoading(false);
    return { data, error };
  };

  const deletePage = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from('pages').delete().eq('id', id);
    if (error) setError(error.message);
    else {
      setPages((prev) => prev.filter((p) => p.id !== id));
    }
    setLoading(false);
    return { error };
  };

  return { pages, loading, error, fetchPages, createPage, updatePage, deletePage };
}

// Hook for managing content blocks
export function useContentBlocks(pageId?: string) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlocks = useCallback(async () => {
    if (!pageId) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('page_id', pageId)
      .order('position');
    if (error) setError(error.message);
    else setBlocks(data || []);
    setLoading(false);
  }, [pageId]);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const createBlock = async (block: Omit<ContentBlock, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('content_blocks')
      .insert([block])
      .select()
      .single();
    if (error) setError(error.message);
    else if (data) {
      setBlocks((prev) => [...prev, data].sort((a, b) => a.position - b.position));
    }
    setLoading(false);
    return { data, error };
  };

  const updateBlock = async (id: string, updates: Partial<ContentBlock>) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('content_blocks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) setError(error.message);
    else if (data) {
      setBlocks((prev) => prev.map((b) => (b.id === id ? data : b)));
    }
    setLoading(false);
    return { data, error };
  };

  const deleteBlock = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from('content_blocks').delete().eq('id', id);
    if (error) setError(error.message);
    else {
      setBlocks((prev) => prev.filter((b) => b.id !== id));
    }
    setLoading(false);
    return { error };
  };

  const reorderBlocks = async (reorderedBlocks: ContentBlock[]) => {
    setLoading(true);
    const updates = reorderedBlocks.map((block, index) => ({
      id: block.id,
      position: index,
    }));

    const promises = updates.map((update) =>
      supabase
        .from('content_blocks')
        .update({ position: update.position })
        .eq('id', update.id)
    );

    const results = await Promise.all(promises);
    const hasError = results.some((r) => r.error);
    
    if (hasError) {
      setError('Failed to reorder blocks');
    } else {
      setBlocks(reorderedBlocks);
    }
    setLoading(false);
  };

  return { blocks, loading, error, fetchBlocks, createBlock, updateBlock, deleteBlock, reorderBlocks };
}

// Hook for managing site settings
export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('site_settings').select('*');
    if (error) setError(error.message);
    else if (data) {
      const settingsMap = data.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, any>);
      setSettings(settingsMap);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSetting = async (key: string, value: any, category: string) => {
    setLoading(true);
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value, category, updated_by: (await supabase.auth.getUser()).data.user?.id });
    if (error) setError(error.message);
    else {
      setSettings((prev) => ({ ...prev, [key]: value }));
    }
    setLoading(false);
    return { error };
  };

  const updateMultipleSettings = async (updates: Array<{ key: string; value: any; category: string }>) => {
    setLoading(true);
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const { error } = await supabase.from('site_settings').upsert(
      updates.map((u) => ({ ...u, updated_by: userId }))
    );
    if (error) setError(error.message);
    else {
      const newSettings = { ...settings };
      updates.forEach((u) => {
        newSettings[u.key] = u.value;
      });
      setSettings(newSettings);
    }
    setLoading(false);
    return { error };
  };

  return { settings, loading, error, fetchSettings, updateSetting, updateMultipleSettings };
}

// Hook for managing media library
export function useMediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setMedia(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const uploadMedia = async (file: File, altText?: string, tags?: string[]) => {
    setLoading(true);
    setError(null);

    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `media/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('public')
      .upload(filePath, file);

    if (uploadError) {
      setError(uploadError.message);
      setLoading(false);
      return { data: null, error: uploadError };
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from('public').getPublicUrl(filePath);

    // Create media library entry
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const { data, error } = await supabase
      .from('media_library')
      .insert([
        {
          file_name: file.name,
          file_path: filePath,
          file_url: urlData.publicUrl,
          file_type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
          mime_type: file.type,
          file_size: file.size,
          alt_text: altText,
          uploaded_by: userId,
          tags: tags || [],
        },
      ])
      .select()
      .single();

    if (error) setError(error.message);
    else if (data) {
      setMedia((prev) => [data, ...prev]);
    }
    setLoading(false);
    return { data, error };
  };

  const deleteMedia = async (id: string, filePath: string) => {
    setLoading(true);
    // Delete from storage
    await supabase.storage.from('public').remove([filePath]);

    // Delete from database
    const { error } = await supabase.from('media_library').delete().eq('id', id);
    if (error) setError(error.message);
    else {
      setMedia((prev) => prev.filter((m) => m.id !== id));
    }
    setLoading(false);
    return { error };
  };

  const updateMedia = async (id: string, updates: Partial<MediaItem>) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('media_library')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) setError(error.message);
    else if (data) {
      setMedia((prev) => prev.map((m) => (m.id === id ? data : m)));
    }
    setLoading(false);
    return { data, error };
  };

  return { media, loading, error, fetchMedia, uploadMedia, deleteMedia, updateMedia };
}

// Hook for page versions
export function usePageVersions(pageId?: string) {
  const [versions, setVersions] = useState<PageVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVersions = useCallback(async () => {
    if (!pageId) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('page_versions')
      .select('*')
      .eq('page_id', pageId)
      .order('version_number', { ascending: false });
    if (error) setError(error.message);
    else setVersions(data || []);
    setLoading(false);
  }, [pageId]);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  const createVersion = async (notes?: string) => {
    if (!pageId) return { data: null, error: new Error('Page ID required') };
    setLoading(true);
    const { data, error } = await supabase.rpc('create_page_version', {
      p_page_id: pageId,
      p_notes: notes,
    });
    if (error) setError(error.message);
    else {
      fetchVersions();
    }
    setLoading(false);
    return { data, error };
  };

  const restoreVersion = async (versionId: string) => {
    setLoading(true);
    const { data, error } = await supabase.rpc('restore_page_version', {
      p_version_id: versionId,
    });
    if (error) setError(error.message);
    setLoading(false);
    return { data, error };
  };

  return { versions, loading, error, fetchVersions, createVersion, restoreVersion };
}

