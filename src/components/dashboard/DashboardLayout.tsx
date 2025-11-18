import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  TrendingUp, 
  Target, 
  CreditCard, 
  User, 
  Menu,
  X,
  Dumbbell
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'sessions', label: 'My Sessions', icon: Dumbbell },
  { id: 'progress', label: 'My Progress', icon: TrendingUp },
  { id: 'plan', label: 'My Plan', icon: Target },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'profile', label: 'Profile', icon: User },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentSection,
  onSectionChange,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme } = useTheme();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-24 md:pt-28 pb-20">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-20 md:top-24 left-0 right-0 z-30 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-display font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 top-[128px] md:top-[144px]"
          onClick={toggleSidebar}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-[128px] md:top-[144px] left-0 h-[calc(100vh-128px)] md:h-[calc(100vh-144px)]
            w-64 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-gray-800
            transition-transform duration-300 ease-in-out z-40
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <nav className="p-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 text-left
                    ${
                      isActive
                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 mt-[52px] lg:mt-0">
          <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

