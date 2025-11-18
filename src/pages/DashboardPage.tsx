import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { OverviewSection } from '../components/dashboard/sections/OverviewSection';
import { SessionsSection } from '../components/dashboard/sections/SessionsSection';
import { ProgressSection } from '../components/dashboard/sections/ProgressSection';
import { PlanSection } from '../components/dashboard/sections/PlanSection';
import { ScheduleSection } from '../components/dashboard/sections/ScheduleSection';
import { BillingSection } from '../components/dashboard/sections/BillingSection';
import { ProfileSection as ProfileSettingsSection } from '../components/dashboard/sections/ProfileSection';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
    }
  }, [user]);

  const checkOnboardingStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed_at')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking onboarding status:', error);
        setLoading(false);
        return;
      }

      // If no profile or onboarding not completed, redirect to onboarding
      if (!data || !data.onboarding_completed_at) {
        navigate('/onboarding', { replace: true });
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'overview':
        return <OverviewSection />;
      case 'sessions':
        return <SessionsSection />;
      case 'progress':
        return <ProgressSection />;
      case 'plan':
        return <PlanSection />;
      case 'schedule':
        return <ScheduleSection />;
      case 'billing':
        return <BillingSection />;
      case 'profile':
        return <ProfileSettingsSection />;
      default:
        return <OverviewSection />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DashboardLayout currentSection={currentSection} onSectionChange={setCurrentSection}>
      {renderSection()}
    </DashboardLayout>
  );
};

export default DashboardPage;