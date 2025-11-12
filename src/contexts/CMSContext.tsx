import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CMSSettings } from '../types/cms';

interface CMSContextType {
  settings: CMSSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: CMSSettings = {
  siteName: 'RSF Fitness',
  siteTagline: 'Transform Your Body, Transform Your Life',
  siteLogo: '/RSF_FullLogo_FullColor.png',
  siteLogoWhite: '/RSF_FullLogo_WhiteandGreen.png',
  siteIcon: '/RSF_IconOnly_FullColor.png',
  primaryColor: '#10b981',
  secondaryColor: '#3b82f6',
  accentColor: '#f59e0b',
  fontHeading: 'Inter',
  fontBody: 'Inter',
  metaTitle: 'RSF Fitness - Transform Your Life',
  metaDescription: 'Join RSF Fitness for personalized training, nutrition plans, and a supportive community.',
  metaKeywords: 'fitness, training, nutrition, wellness, gym',
  facebookUrl: '',
  instagramUrl: '',
  twitterUrl: '',
  contactEmail: 'info@rsfitness.com',
  contactPhone: '',
  address: '',
};

const CMSContext = createContext<CMSContextType>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {},
});

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CMSSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('site_settings').select('key, value');
    
    if (!error && data) {
      const settingsMap = data.reduce((acc, setting) => {
        // Parse JSON value
        try {
          acc[setting.key] = typeof setting.value === 'string' 
            ? JSON.parse(setting.value) 
            : setting.value;
        } catch {
          acc[setting.key] = setting.value;
        }
        return acc;
      }, {} as Record<string, any>);

      setSettings({
        siteName: settingsMap.site_name || defaultSettings.siteName,
        siteTagline: settingsMap.site_tagline || defaultSettings.siteTagline,
        siteLogo: settingsMap.site_logo || defaultSettings.siteLogo,
        siteLogoWhite: settingsMap.site_logo_white || defaultSettings.siteLogoWhite,
        siteIcon: settingsMap.site_icon || defaultSettings.siteIcon,
        primaryColor: settingsMap.primary_color || defaultSettings.primaryColor,
        secondaryColor: settingsMap.secondary_color || defaultSettings.secondaryColor,
        accentColor: settingsMap.accent_color || defaultSettings.accentColor,
        fontHeading: settingsMap.font_heading || defaultSettings.fontHeading,
        fontBody: settingsMap.font_body || defaultSettings.fontBody,
        metaTitle: settingsMap.meta_title || defaultSettings.metaTitle,
        metaDescription: settingsMap.meta_description || defaultSettings.metaDescription,
        metaKeywords: settingsMap.meta_keywords || defaultSettings.metaKeywords,
        facebookUrl: settingsMap.facebook_url || defaultSettings.facebookUrl,
        instagramUrl: settingsMap.instagram_url || defaultSettings.instagramUrl,
        twitterUrl: settingsMap.twitter_url || defaultSettings.twitterUrl,
        contactEmail: settingsMap.contact_email || defaultSettings.contactEmail,
        contactPhone: settingsMap.contact_phone || defaultSettings.contactPhone,
        address: settingsMap.address || defaultSettings.address,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshSettings();

    // Subscribe to changes
    const subscription = supabase
      .channel('site_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings',
        },
        () => {
          refreshSettings();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Apply theme colors to CSS variables
  useEffect(() => {
    if (!loading) {
      document.documentElement.style.setProperty('--color-primary', settings.primaryColor);
      document.documentElement.style.setProperty('--color-secondary', settings.secondaryColor);
      document.documentElement.style.setProperty('--color-accent', settings.accentColor);
    }
  }, [settings, loading]);

  return (
    <CMSContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};

