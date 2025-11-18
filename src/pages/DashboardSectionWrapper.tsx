import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface DashboardSectionWrapperProps {
  children: React.ReactNode;
}

export const DashboardSectionWrapper: React.FC<DashboardSectionWrapperProps> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-24 md:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            leftIcon={<ArrowLeft className="w-5 h-5" />}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};

