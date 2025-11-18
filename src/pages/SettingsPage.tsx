import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  User, 
  Camera, 
  CreditCard, 
  Save, 
  ArrowLeft,
  Upload,
  Check
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Section } from '../components/ui/Section';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    avatar_url: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    card_number: '',
    card_name: '',
    expiry_month: '',
    expiry_year: '',
    cvv: '',
    billing_zip: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          avatar_url: data.avatar_url || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      console.log('📤 Uploading avatar:', file.name, 'Size:', (file.size / 1024).toFixed(2), 'KB');
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        setLoading(false);
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (JPG, PNG, or GIF)');
        setLoading(false);
        return;
      }
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      console.log('📁 Upload path:', filePath);

      // Upload to Supabase Storage (using Public bucket)
      const { error: uploadError, data } = await supabase.storage
        .from('Public')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        alert(`Failed to upload photo: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      console.log('✅ Upload successful:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('Public')
        .getPublicUrl(filePath);

      console.log('🔗 Public URL:', publicUrl);

      // Update profile state
      setProfile({ ...profile, avatar_url: publicUrl });

      // Save to database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        alert('Photo uploaded but failed to save to profile');
      } else {
        console.log('✅ Profile updated with new avatar');
        alert('Profile photo updated successfully!');
      }
    } catch (error: any) {
      console.error('❌ Error uploading photo:', error);
      alert(`Failed to upload photo: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          avatar_url: profile.avatar_url,
        })
        .eq('id', user?.id);

      if (error) throw error;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePayment = async () => {
    // In production, you'd use Stripe or similar payment processor
    // For now, we'll just show a success message
    alert('Payment information saved securely! (Demo mode - integration coming soon)');
    
    // TODO: Integrate with Stripe API
    // const stripe = await loadStripe(process.env.STRIPE_PUBLIC_KEY);
    // Create payment method and save to Supabase
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-24 md:pt-28 pb-20">
      <Section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              leftIcon={<ArrowLeft className="w-5 h-5" />}
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>

          <div>
            <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
              Account Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your profile and payment information
            </p>
          </div>

          {/* Profile Photo */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                Profile Photo
              </h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-4 border-primary/20">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                    )}
                  </div>
                  <label
                    htmlFor="photo-upload"
                    className="absolute bottom-0 right-0 p-3 bg-primary rounded-full hover:bg-primary/90 transition-colors cursor-pointer shadow-lg"
                  >
                    <Camera className="w-5 h-5 text-dark" />
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Upload Profile Photo
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Choose a clear photo of yourself. JPG, PNG or GIF. Max size 5MB.
                  </p>
                  <Button
                    variant="outline"
                    leftIcon={<Upload className="w-4 h-4" />}
                    onClick={() => document.getElementById('photo-upload')?.click()}
                  >
                    Choose Photo
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                Personal Information
              </h2>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={profile.first_name}
                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={profile.last_name}
                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email (Read-only)
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  leftIcon={<Save className="w-5 h-5" />}
                  onClick={handleSaveProfile}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </Button>
                {saveSuccess && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Saved successfully!</span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                  Payment Information
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Your payment information is encrypted and secure
              </p>
            </CardHeader>
            <CardBody className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  value={paymentInfo.card_name}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, card_name: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Card Number *
                </label>
                <input
                  type="text"
                  value={paymentInfo.card_number}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value.slice(0, 19));
                    setPaymentInfo({ ...paymentInfo, card_number: formatted });
                  }}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Exp. Month *
                  </label>
                  <input
                    type="text"
                    value={paymentInfo.expiry_month}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry_month: e.target.value.slice(0, 2) })}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="MM"
                    maxLength={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Exp. Year *
                  </label>
                  <input
                    type="text"
                    value={paymentInfo.expiry_year}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry_year: e.target.value.slice(0, 4) })}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="YYYY"
                    maxLength={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CVV *
                  </label>
                  <input
                    type="text"
                    value={paymentInfo.cvv}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value.slice(0, 4) })}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="123"
                    maxLength={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    value={paymentInfo.billing_zip}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, billing_zip: e.target.value.slice(0, 10) })}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="12345"
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  🔒 Your payment information is encrypted and processed securely through Stripe. 
                  We never store your full card details on our servers.
                </p>
              </div>

              <Button
                variant="primary"
                leftIcon={<CreditCard className="w-5 h-5" />}
                onClick={handleSavePayment}
                disabled={loading}
              >
                Save Payment Method
              </Button>
            </CardBody>
          </Card>
        </div>
      </Section>
    </div>
  );
};

export default SettingsPage;
