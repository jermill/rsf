import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { handleError } from '../utils/errorHandler';
import { trackEvent } from '../lib/analytics';

export interface OnboardingProgress {
  id: string;
  user_id: string;
  current_step: number;
  total_steps: number;
  is_complete: boolean;
  completed_at: string | null;
  steps_completed: Record<string, boolean>;
  onboarding_data: Record<string, any>;
  time_spent_minutes: number;
  sessions_count: number;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
}

export interface ChecklistItem {
  id: string;
  item_key: string;
  item_title: string;
  item_description: string | null;
  item_order: number;
  is_required: boolean;
  is_completed: boolean;
  completed_at: string | null;
  action_type: string | null;
  action_url: string | null;
}

export interface Recommendation {
  id: string;
  recommendation_type: string;
  title: string;
  description: string | null;
  priority: number;
  recommendation_data: Record<string, any>;
  is_accepted: boolean;
  is_dismissed: boolean;
}

export const useOnboarding = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOnboardingData();
    }
  }, [user]);

  const fetchOnboardingData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch progress
      const { data: progressData, error: progressError } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (progressError && progressError.code !== 'PGRST116') {
        throw progressError;
      }

      if (progressData) {
        setProgress(progressData);
      }

      // Fetch checklist
      const { data: checklistData, error: checklistError } = await supabase
        .from('onboarding_checklist')
        .select('*')
        .eq('user_id', user.id)
        .order('item_order');

      if (checklistError) throw checklistError;
      setChecklist(checklistData || []);

      // Fetch recommendations
      const { data: recommendationsData, error: recommendationsError } = await supabase
        .from('onboarding_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_dismissed', false)
        .order('priority', { ascending: false });

      if (recommendationsError) throw recommendationsError;
      setRecommendations(recommendationsData || []);

    } catch (error) {
      handleError(error, {
        customMessage: 'Failed to load onboarding data',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStep = async (stepKey: string, stepData?: Record<string, any>) => {
    if (!user) return false;

    try {
      const { error } = await supabase.rpc('update_onboarding_step', {
        p_user_id: user.id,
        p_step_key: stepKey,
        p_step_data: stepData || null,
      });

      if (error) throw error;

      // Track in analytics
      trackEvent('onboarding_step_completed', {
        step: stepKey,
        user_id: user.id,
      });

      // Refresh data
      await fetchOnboardingData();
      return true;
    } catch (error) {
      handleError(error, {
        customMessage: 'Failed to update onboarding progress',
      });
      return false;
    }
  };

  const completeChecklistItem = async (itemKey: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('onboarding_checklist')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('item_key', itemKey);

      if (error) throw error;

      // Track in analytics
      trackEvent('checklist_item_completed', {
        item: itemKey,
        user_id: user.id,
      });

      // Refresh data
      await fetchOnboardingData();
      return true;
    } catch (error) {
      handleError(error, {
        customMessage: 'Failed to complete checklist item',
      });
      return false;
    }
  };

  const acceptRecommendation = async (recommendationId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('onboarding_recommendations')
        .update({
          is_accepted: true,
          accepted_at: new Date().toISOString(),
        })
        .eq('id', recommendationId);

      if (error) throw error;

      // Track in analytics
      trackEvent('recommendation_accepted', {
        recommendation_id: recommendationId,
        user_id: user.id,
      });

      // Refresh data
      await fetchOnboardingData();
      return true;
    } catch (error) {
      handleError(error, {
        customMessage: 'Failed to accept recommendation',
      });
      return false;
    }
  };

  const dismissRecommendation = async (recommendationId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('onboarding_recommendations')
        .update({
          is_dismissed: true,
          dismissed_at: new Date().toISOString(),
        })
        .eq('id', recommendationId);

      if (error) throw error;

      // Refresh data
      await fetchOnboardingData();
      return true;
    } catch (error) {
      handleError(error, {
        customMessage: 'Failed to dismiss recommendation',
      });
      return false;
    }
  };

  const generateRecommendations = async () => {
    if (!user) return false;

    try {
      const { error } = await supabase.rpc('generate_onboarding_recommendations', {
        p_user_id: user.id,
      });

      if (error) throw error;

      // Refresh data
      await fetchOnboardingData();
      return true;
    } catch (error) {
      handleError(error, {
        customMessage: 'Failed to generate recommendations',
      });
      return false;
    }
  };

  const completeOnboarding = async () => {
    if (!user) return false;

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Track in analytics
      trackEvent('onboarding_completed', {
        user_id: user.id,
        time_to_complete: progress?.time_spent_minutes || 0,
      });

      // Refresh data
      await fetchOnboardingData();
      return true;
    } catch (error) {
      handleError(error, {
        customMessage: 'Failed to complete onboarding',
      });
      return false;
    }
  };

  const getCompletionPercentage = () => {
    if (!progress) return 0;
    
    const stepsCompleted = Object.values(progress.steps_completed).filter(Boolean).length;
    const totalSteps = Object.keys(progress.steps_completed).length;
    
    return Math.round((stepsCompleted / totalSteps) * 100);
  };

  const getRequiredItemsRemaining = () => {
    return checklist.filter(item => item.is_required && !item.is_completed).length;
  };

  return {
    progress,
    checklist,
    recommendations,
    loading,
    updateStep,
    completeChecklistItem,
    acceptRecommendation,
    dismissRecommendation,
    generateRecommendations,
    completeOnboarding,
    getCompletionPercentage,
    getRequiredItemsRemaining,
    refresh: fetchOnboardingData,
  };
};

