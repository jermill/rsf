import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';

export const ClientSignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validatePassword = () => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'sign-up') {
        const passwordError = validatePassword();
        if (passwordError) {
          setError(passwordError);
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const { error: signUpError } = await signUp(email, password);
        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }
        
        // Redirect to onboarding after successful sign up
        navigate('/onboarding');
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          if (signInError.message === 'Invalid login credentials') {
            setError('Invalid email or password. Please try again.');
          } else {
            setError(signInError.message);
          }
          setLoading(false);
          return;
        }
        
        // Redirect to dashboard after successful sign in
        navigate('/dashboard');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred. Please try again.');
      }
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

        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="https://github.com/QRUMN/RSFIMG/blob/main/RSF_IconOnly_FullColor%20(1).png?raw=true"
            alt="RSF Logo"
            className="w-20 h-20 mx-auto mb-4"
          />
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {mode === 'sign-in' ? 'Welcome Back!' : 'Join Ready Set Fit'}
          </h1>
          <p className="text-gray-400">
            {mode === 'sign-in' 
              ? 'Sign in to continue your fitness journey' 
              : 'Start your transformation today'}
          </p>
        </div>

        {/* Auth Card */}
        <Card>
          <CardBody className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Sign Up Only) */}
              {mode === 'sign-up' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
                leftIcon={loading ? <Loader2 className="w-5 h-5 animate-spin" /> : undefined}
              >
                {loading 
                  ? 'Processing...' 
                  : mode === 'sign-in' 
                    ? 'Sign In' 
                    : 'Create Account'}
              </Button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in');
                  setError(null);
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-gray-400 hover:text-primary transition-colors"
              >
                {mode === 'sign-in' 
                  ? "Don't have an account? Sign Up" 
                  : 'Already have an account? Sign In'}
              </button>
            </div>

            {/* Admin Link */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => navigate('/admin/login')}
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
              >
                Admin Login →
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ClientSignInPage;

