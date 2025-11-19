import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { usePageTracking } from './hooks/usePageTracking';
import AdminLayout from './components/layout/AdminLayout';
import Layout from './components/layout/Layout';
import { AdminRoute } from './components/auth/AdminRoute';

// Eager load critical pages for better initial experience
import HomePage from './pages/HomePage';

// Lazy load user pages
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const SimpleDashboardPage = lazy(() => import('./pages/SimpleDashboardPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const MessageCoachPage = lazy(() => import('./pages/MessageCoachPage'));
const LogWorkoutPage = lazy(() => import('./pages/LogWorkoutPage'));
const ClientSignInPage = lazy(() => import('./pages/ClientSignInPage'));
const DevLoginPage = lazy(() => import('./pages/DevLoginPage'));

// Dashboard section pages (wrapped components)
import { DashboardSectionWrapper } from './pages/DashboardSectionWrapper';
import { SessionsSection } from './components/dashboard/sections/SessionsSection';
import { ProgressSection } from './components/dashboard/sections/ProgressSection';
import { PlanSection } from './components/dashboard/sections/PlanSection';
import { ScheduleSection } from './components/dashboard/sections/ScheduleSection';
import { BillingSection } from './components/dashboard/sections/BillingSection';

// Lazy load all admin pages (heavy, rarely accessed initially)
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminClientsPage = lazy(() => import('./pages/admin/AdminClientsPage'));
const AdminSessionsPage = lazy(() => import('./pages/admin/AdminSessionsPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));
const AdminFinancialPage = lazy(() => import('./pages/admin/AdminFinancialPage'));
const MealPlansPage = lazy(() => import('./pages/admin/MealPlansPage'));
const SchedulingPage = lazy(() => import('./pages/admin/SchedulingPage'));
const ContentManagerPage = lazy(() => import('./pages/admin/ContentManagerPage'));
const PageBuilderPage = lazy(() => import('./pages/admin/PageBuilderPage'));
const ThemeCustomizerPage = lazy(() => import('./pages/admin/ThemeCustomizerPage'));
const MediaLibraryPage = lazy(() => import('./pages/admin/MediaLibraryPage'));
const OnboardingDashboardPage = lazy(() => import('./pages/admin/OnboardingDashboardPage'));

function App() {
  const location = useLocation();
  
  // Track page views automatically
  usePageTracking();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Suspense fallback={<LoadingSpinner fullScreen message="Loading..." />}>
    <Routes>
      {/* Admin Login - no sidebar */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Section - with sidebar */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route element={<AdminRoute allowedRoles={['superadmin', 'admin']} />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="clients" element={<AdminClientsPage />} />
          <Route path="sessions" element={<AdminSessionsPage />} />
          <Route path="reports" element={<AdminFinancialPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="onboarding" element={<OnboardingDashboardPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="financial" element={<AdminFinancialPage />} />
          <Route path="meal-plans" element={<MealPlansPage />} />
          <Route path="scheduling" element={<SchedulingPage />} />
          <Route path="content" element={<ContentManagerPage />} />
          <Route path="page-builder/:pageId" element={<PageBuilderPage />} />
          <Route path="theme" element={<ThemeCustomizerPage />} />
          <Route path="media" element={<MediaLibraryPage />} />
        </Route>
      </Route>

      {/* Auth Routes (Outside Layout - No Header/Footer) */}
      <Route path="/sign-in" element={<ClientSignInPage />} />
      <Route path="/dev-login" element={<DevLoginPage />} />

      {/* User Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<SimpleDashboardPage />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
        <Route path="/dashboard/messages" element={<MessageCoachPage />} />
        <Route path="/dashboard/sessions" element={<DashboardSectionWrapper><SessionsSection /></DashboardSectionWrapper>} />
        <Route path="/dashboard/progress" element={<DashboardSectionWrapper><ProgressSection /></DashboardSectionWrapper>} />
        <Route path="/dashboard/plan" element={<DashboardSectionWrapper><PlanSection /></DashboardSectionWrapper>} />
        <Route path="/dashboard/schedule" element={<DashboardSectionWrapper><ScheduleSection /></DashboardSectionWrapper>} />
        <Route path="/dashboard/billing" element={<DashboardSectionWrapper><BillingSection /></DashboardSectionWrapper>} />
        <Route path="/log-workout" element={<LogWorkoutPage />} />
      </Route>
    </Routes>
    </Suspense>
  );
}

export default App;