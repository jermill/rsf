import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon,
  X,
  Loader2,
  Smile,
  MapPin,
  Users,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { showNotification } from '../../utils/notifications';

interface CreatePostProps {
  onPostCreated: (post: any) => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userProfile, setUserProfile] = useState<any>(null);

  React.useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url')
      .eq('id', user.id)
      .single();

    setUserProfile(data);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        console.log('📤 Uploading file:', file.name, 'Size:', (file.size / 1024).toFixed(2), 'KB');
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
        const filePath = `community/${fileName}`;

        console.log('📁 Upload path:', filePath);

        const { error: uploadError, data } = await supabase.storage
          .from('Public')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('❌ Upload error:', uploadError);
          throw uploadError;
        }

        console.log('✅ Upload successful:', data);

        const { data: { publicUrl } } = supabase.storage
          .from('Public')
          .getPublicUrl(filePath);

        console.log('🔗 Public URL:', publicUrl);
        uploadedUrls.push(publicUrl);
      }

      setImages(prev => [...prev, ...uploadedUrls]);
      showNotification(`${uploadedUrls.length} image(s) uploaded successfully!`, 'success');
    } catch (error: any) {
      console.error('❌ Upload error details:', error);
      
      let errorMessage = 'Failed to upload images';
      if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      if (error.statusCode === '404') {
        errorMessage = 'Storage bucket not found. Please set up the "public" bucket in Supabase Storage.';
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) {
      showNotification('Please add some content or images', 'error');
      return;
    }

    setPosting(true);

    try {
      console.log('Creating post with data:', {
        content: content.trim(),
        images,
        user_id: user?.id
      });

      const post = await onPostCreated({
        content: content.trim(),
        images,
      });

      console.log('Post creation result:', post);

      if (post) {
        setContent('');
        setImages([]);
        showNotification('Post created successfully!', 'success');
      } else {
        showNotification('Failed to create post. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      showNotification('Failed to create post. Please try again.', 'error');
    } finally {
      setPosting(false);
    }
  };

  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <div className="p-6 bg-white dark:bg-gray-900">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
            {userProfile?.avatar_url ? (
              <img
                src={userProfile.avatar_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              `${userProfile?.first_name?.[0] || 'U'}${userProfile?.last_name?.[0] || ''}`
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {userProfile?.first_name || 'User'} {userProfile?.last_name || ''}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Share your fitness journey
            </p>
          </div>
        </div>

        {/* Text Input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full min-h-[100px] p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />

        {/* Image Preview */}
        <AnimatePresence>
          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2"
            >
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-square rounded-lg overflow-hidden group"
                >
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ImageIcon className="w-5 h-5 text-green-500" />
              )}
              <span className="text-sm font-medium hidden sm:inline">
                Photo
              </span>
            </button>

            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-600 transition-colors opacity-50 cursor-not-allowed"
            >
              <Smile className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">
                Feeling
              </span>
            </button>
          </div>

          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={(!content.trim() && images.length === 0) || posting}
            leftIcon={posting ? <Loader2 className="w-5 h-5 animate-spin" /> : undefined}
          >
            {posting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

