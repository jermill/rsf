import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, X, Image as ImageIcon, Loader2, Check } from 'lucide-react';

interface MealImageUploadProps {
  mealPlanId?: string;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  onImageUploaded?: (imageUrl: string) => void;
  existingImages?: string[];
  maxImages?: number;
}

const MealImageUpload: React.FC<MealImageUploadProps> = ({
  mealPlanId = 'temp',
  mealType = 'breakfast',
  onImageUploaded,
  existingImages = [],
  maxImages = 5,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>(existingImages);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (uploadedImages.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error('Only image files are allowed');
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Image size must be less than 5MB');
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${mealPlanId}_${mealType}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `meal-images/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);

        return data.publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      setUploadedImages((prev) => [...prev, ...uploadedUrls]);
      
      // Notify parent component
      uploadedUrls.forEach((url) => {
        if (onImageUploaded) onImageUploaded(url);
      });

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (imageUrl: string, index: number) => {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const filePath = `meal-images/${urlParts[urlParts.length - 1]}`;

      // Delete from Supabase Storage
      const { error: deleteError } = await supabase.storage
        .from('media')
        .remove([filePath]);

      if (deleteError) throw deleteError;

      // Remove from state
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    } catch (err: any) {
      console.error('Delete error:', err);
      setError('Failed to delete image');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
          dragActive
            ? 'border-primary bg-primary/10'
            : 'border-primary/30 hover:border-primary/50 bg-dark/50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileUpload(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading || uploadedImages.length >= maxImages}
        />

        <div className="flex flex-col items-center justify-center text-center">
          {uploading ? (
            <>
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-light/70">Uploading images...</p>
            </>
          ) : uploadedImages.length >= maxImages ? (
            <>
              <Check className="w-12 h-12 text-green-400 mb-4" />
              <p className="text-light/70">Maximum images uploaded</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-primary mb-4" />
              <p className="text-lg font-semibold text-light mb-2">
                Drop images here or click to upload
              </p>
              <p className="text-sm text-light/60">
                {mealType.charAt(0).toUpperCase() + mealType.slice(1)} • Max {maxImages} images • Max 5MB each
              </p>
              <p className="text-xs text-light/50 mt-2">
                {uploadedImages.length}/{maxImages} images uploaded
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-900/20 border border-red-700/50 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-light/70 mb-3">
            Uploaded Images ({uploadedImages.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploadedImages.map((imageUrl, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden bg-dark border border-primary/20 hover:border-primary/40 transition"
              >
                <img
                  src={imageUrl}
                  alt={`${mealType} ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center">
                  <button
                    onClick={() => handleRemoveImage(imageUrl, index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-red-600 hover:bg-red-700 text-white"
                    title="Remove image"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Image Icon Badge */}
                <div className="absolute top-2 right-2 p-1.5 rounded bg-primary/80 backdrop-blur-sm">
                  <ImageIcon className="w-4 h-4 text-dark" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {uploadedImages.length === 0 && !uploading && (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-xs text-light/60">
            💡 <strong>Tip:</strong> Upload appetizing photos of your meal to make it more appealing to clients.
            Supported formats: JPG, PNG, GIF, WEBP
          </p>
        </div>
      )}
    </div>
  );
};

export default MealImageUpload;

