import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First sign in - safely handle the response
      const signInResult = await signIn(email, password);
      const signInError = signInResult?.error;

      if (signInError) {
        if (signInError.message === 'Invalid login credentials') {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(signInError.message);
        }
        setLoading(false);
        return;
      }

      // Get the signed-in user's ID from Auth
      const user = signInResult?.data?.user;
      if (!user) {
        setError('Failed to retrieve user information.');
        setLoading(false);
        return;
      }

      // Then check if user is admin by fetching their profile and checking role
      const allowedRoles = ['superadmin', 'admin', 'site_manager'];
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile query error:', profileError); // DEBUG LOG
        setError('An error occurred while verifying admin access.');
        setLoading(false);
        return;
      }

      if (!profile || !allowedRoles.includes(profile.role)) {
        setError('You do not have permission to access the admin dashboard.');
        setLoading(false);
        return;
      }

      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft className="w-5 h-5" />}
          onClick={() => navigate('/')}
          className="mb-6 text-gray-400 hover:text-white"
        >
          Back to Home
        </Button>

        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl mb-4">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Admin Access
          </h1>
          <p className="text-gray-400">
            Authorized personnel only
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="admin@readysetfit.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
              leftIcon={loading ? <Loader className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
            >
              {loading ? 'Verifying Access...' : 'Admin Sign In'}
            </Button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-300 text-center">
              🔒 This area is restricted to authorized administrators only. 
              All login attempts are monitored and logged.
            </p>
          </div>

          {/* Client Login Link */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate('/sign-in')}
              className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
            >
              ← Client Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;