import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Code, Zap, User, Shield, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardBody, CardHeader } from '../components/ui/Card';

interface QuickLoginCardProps {
  title: string;
  description: string;
  email: string;
  password: string;
  role: string;
  icon: React.ReactNode;
  color: string;
  onLogin: (email: string, password: string) => void;
  loading: boolean;
}

const QuickLoginCard: React.FC<QuickLoginCardProps> = ({
  title,
  description,
  email,
  password,
  role,
  icon,
  color,
  onLogin,
  loading,
}) => (
  <Card className="hover:shadow-xl transition-all duration-300">
    <CardBody className="p-6">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {description}
      </p>
      
      <div className="space-y-2 mb-4 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Email:</span>
          <code className="text-gray-900 dark:text-white font-mono">{email}</code>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Password:</span>
          <code className="text-gray-900 dark:text-white font-mono">{password}</code>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Role:</span>
          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{role}</span>
        </div>
      </div>

      <Button
        variant="primary"
        fullWidth
        onClick={() => onLogin(email, password)}
        disabled={loading}
        leftIcon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
      >
        {loading ? 'Signing in...' : 'Quick Login'}
      </Button>
    </CardBody>
  </Card>
);

export const DevLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [supabaseConfigured, setSupabaseConfigured] = useState(true);

  // Check if Supabase is configured
  React.useEffect(() => {
    const checkSupabase = () => {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        setSupabaseConfigured(false);
        setError('⚠️ Supabase not configured! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
      }
    };
    
    checkSupabase();
  }, []);

  const testAccounts = [
    {
      title: 'Client Account',
      description: 'Regular gym member with Pro membership',
      email: 'rsf.client.test@gmail.com',
      password: 'TestClient123!',
      role: 'Client',
      icon: <User className="w-6 h-6 text-blue-500" />,
      color: 'bg-blue-500/10',
      redirect: '/dashboard',
    },
    {
      title: 'Admin Account',
      description: 'Administrator with full access',
      email: 'rsf.admin.test@gmail.com',
      password: 'TestAdmin123!',
      role: 'Admin',
      icon: <Shield className="w-6 h-6 text-purple-500" />,
      color: 'bg-purple-500/10',
      redirect: '/admin/dashboard',
    },
    {
      title: 'New User',
      description: 'Fresh account for onboarding testing',
      email: 'rsf.newuser.test@gmail.com',
      password: 'TestNew123!',
      role: 'New',
      icon: <Zap className="w-6 h-6 text-green-500" />,
      color: 'bg-green-500/10',
      redirect: '/onboarding',
    },
  ];

  const handleQuickLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('🔐 Attempting login for:', email);
      
      // Try to sign in first
      const signInResult = await signIn(email, password);
      console.log('Sign in result:', signInResult);
      
      if (signInResult?.error) {
        const signInError = signInResult.error;
        console.log('Sign in error:', signInError);
        
        // If sign in fails, try to create the account
        if (signInError.message.includes('Invalid login credentials') || 
            signInError.message.includes('Invalid')) {
          console.log('📝 Account does not exist, creating it...');
          
          try {
            const signUpResult = await signUp(email, password);
            console.log('Sign up result:', signUpResult);
            
            if (signUpResult?.error) {
              console.error('Sign up error:', signUpResult.error);
              setError(`Failed to create account: ${signUpResult.error.message}`);
              setLoading(false);
              return;
            }
            
            setSuccess('✅ Test account created! Signing in...');
            
            // Wait for account to be fully created
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Try signing in again
            const retryResult = await signIn(email, password);
            console.log('Retry sign in result:', retryResult);
            
            if (retryResult?.error) {
              console.error('Retry sign in error:', retryResult.error);
              setError(`Created account but sign in failed. Try using the regular sign in page.`);
              setLoading(false);
              return;
            }
          } catch (signUpErr) {
            console.error('Sign up catch error:', signUpErr);
            setError(`Error creating account: ${signUpErr instanceof Error ? signUpErr.message : 'Unknown error'}`);
            setLoading(false);
            return;
          }
        } else {
          console.error('Other sign in error:', signInError);
          setError(`Sign in failed: ${signInError.message}`);
          setLoading(false);
          return;
        }
      }

      console.log('✅ Login successful!');
      setSuccess('✅ Signed in successfully! Redirecting...');
      
      // Redirect based on email
      setTimeout(() => {
        if (email.includes('admin')) {
          console.log('Redirecting to admin dashboard...');
          navigate('/admin/dashboard');
        } else if (email.includes('newuser')) {
          console.log('Redirecting to onboarding...');
          navigate('/onboarding');
        } else {
          console.log('Redirecting to dashboard...');
          navigate('/dashboard');
        }
      }, 1500);
    } catch (err) {
      console.error('❌ Dev login catch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(`Error: ${errorMessage}. Check browser console for details.`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            leftIcon={<ArrowLeft className="w-5 h-5" />}
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white"
          >
            Back to Home
          </Button>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <Code className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-medium text-yellow-500">DEVELOPMENT MODE</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl mb-4">
            <Code className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-3">
            Developer Login
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            Quick access to test accounts
          </p>
          <p className="text-sm text-gray-500">
            No need to remember credentials - just click and go!
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-900/20 border border-green-500/50 rounded-lg p-4 text-center flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-green-400">{success}</p>
          </div>
        )}

        {/* Quick Login Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {testAccounts.map((account) => (
            <QuickLoginCard
              key={account.email}
              {...account}
              onLogin={supabaseConfigured ? handleQuickLogin : () => {}}
              loading={loading || !supabaseConfigured}
            />
          ))}
        </div>

        {/* Info Card */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <h2 className="text-xl font-display font-bold text-white">
              💡 Developer Notes
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <h3 className="font-semibold text-white mb-2">How it works:</h3>
              <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                <li>Click "Quick Login" on any card</li>
                <li>If account doesn't exist, it will be created automatically</li>
                <li>You'll be signed in and redirected to the appropriate page</li>
                <li>No need to manually create accounts in Supabase!</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">Test Account Details:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                  <p className="text-blue-400 font-semibold mb-1">Client Account</p>
                  <p className="text-gray-400">• Pro membership tier</p>
                  <p className="text-gray-400">• Access to coach messaging</p>
                  <p className="text-gray-400">• Full dashboard features</p>
                </div>
                <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                  <p className="text-purple-400 font-semibold mb-1">Admin Account</p>
                  <p className="text-gray-400">• Full admin access</p>
                  <p className="text-gray-400">• User management</p>
                  <p className="text-gray-400">• System settings</p>
                </div>
                <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                  <p className="text-green-400 font-semibold mb-1">New User</p>
                  <p className="text-gray-400">• Fresh account</p>
                  <p className="text-gray-400">• Goes to onboarding</p>
                  <p className="text-gray-400">• No existing data</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">Troubleshooting:</h3>
              <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                <li>Check browser console (F12) for detailed error logs</li>
                <li>Ensure Supabase is configured correctly (.env file)</li>
                <li>Verify your Supabase project URL and anon key</li>
                <li>Check if email confirmations are disabled in Supabase Auth settings</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500 text-center">
                ⚠️ This page should only be accessible in development mode. 
                Remove or protect it in production!
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Manual Login Links */}
        <div className="mt-8 flex justify-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/sign-in')}
            className="text-gray-400 hover:text-white"
          >
            Client Login Page →
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/login')}
            className="text-gray-400 hover:text-white"
          >
            Admin Login Page →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DevLoginPage;

