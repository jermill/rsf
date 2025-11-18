import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code } from 'lucide-react';

export const DevLoginButton: React.FC = () => {
  const navigate = useNavigate();
  
  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <button
      onClick={() => navigate('/dev-login')}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 font-medium"
      title="Quick access to test accounts"
    >
      <Code className="w-5 h-5" />
      <span className="hidden sm:inline">Dev Login</span>
    </button>
  );
};

