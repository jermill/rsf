import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Camera } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

export const ProfileSection: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    city: '',
    state: '',
    date_of_birth: '',
    gender: '',
    bio: '',
    avatar_url: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    fitness_goals: [] as string[],
    fitness_level: '',
    height: 0,
    weight: 0,
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
      if (data) setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user?.id);

      if (error) throw error;
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile();
  };

  const heightFeet = Math.floor((profile.height || 0) / 12);
  const heightInches = (profile.height || 0) % 12;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Profile & Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your personal information and preferences
          </p>
        </div>
        {!isEditing ? (
          <Button
            variant="primary"
            leftIcon={<Edit2 className="w-5 h-5" />}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="primary"
              leftIcon={<Save className="w-5 h-5" />}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="ghost"
              leftIcon={<X className="w-5 h-5" />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Profile Photo */}
      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4 text-dark" />
                </button>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-1">
                {profile.first_name} {profile.last_name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{user?.email}</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  {profile.fitness_level || 'Not Set'}
                </span>
                {profile.fitness_goals && profile.fitness_goals.length > 0 && (
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full">
                    {profile.fitness_goals[0]}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
            Personal Information
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.first_name}
                  onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{profile.first_name || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.last_name}
                  onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{profile.last_name || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{profile.phone || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date of Birth
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={profile.date_of_birth}
                  onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent [color-scheme:dark]"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">
                  {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'Not set'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender
              </label>
              {isEditing ? (
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              ) : (
                <p className="text-gray-900 dark:text-white capitalize">
                  {profile.gender || 'Not set'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    className="w-24 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              ) : (
                <p className="text-gray-900 dark:text-white">
                  {profile.city && profile.state ? `${profile.city}, ${profile.state}` : 'Not set'}
                </p>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Physical Stats */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
            Physical Stats
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Height
              </label>
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Feet"
                    value={heightFeet || ''}
                    onChange={(e) => {
                      const feet = parseInt(e.target.value) || 0;
                      setProfile({ ...profile, height: feet * 12 + heightInches });
                    }}
                    className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Inches"
                    value={heightInches || ''}
                    onChange={(e) => {
                      const inches = parseInt(e.target.value) || 0;
                      setProfile({ ...profile, height: heightFeet * 12 + inches });
                    }}
                    className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              ) : (
                <p className="text-gray-900 dark:text-white">
                  {profile.height ? `${heightFeet}' ${heightInches}"` : 'Not set'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Weight (lbs)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={profile.weight || ''}
                  onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">
                  {profile.weight ? `${profile.weight} lbs` : 'Not set'}
                </p>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
            Emergency Contact
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.emergency_contact_name}
                  onChange={(e) => setProfile({ ...profile, emergency_contact_name: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">
                  {profile.emergency_contact_name || 'Not set'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.emergency_contact_phone}
                  onChange={(e) => setProfile({ ...profile, emergency_contact_phone: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">
                  {profile.emergency_contact_phone || 'Not set'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Relationship
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.emergency_contact_relationship}
                  onChange={(e) => setProfile({ ...profile, emergency_contact_relationship: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">
                  {profile.emergency_contact_relationship || 'Not set'}
                </p>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

