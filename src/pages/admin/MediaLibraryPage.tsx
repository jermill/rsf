import React, { useState } from 'react';
import { useMediaLibrary } from '../../hooks/useCMS';
import { Upload, Image as ImageIcon, Trash2, Edit, Copy, Search, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { MediaItem } from '../../types/cms';

const MediaLibraryPage: React.FC = () => {
  const { media, loading, uploadMedia, deleteMedia, updateMedia } = useMediaLibrary();
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      await uploadMedia(file);
    }
    setUploading(false);
    setShowUploadModal(false);
  };

  const handleDelete = async (id: string, filePath: string, fileName: string) => {
    if (confirm(`Delete "${fileName}"?`)) {
      await deleteMedia(id, filePath);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingMedia) return;
    await updateMedia(editingMedia.id, {
      alt_text: editingMedia.alt_text,
      caption: editingMedia.caption,
      tags: editingMedia.tags,
    });
    setEditingMedia(null);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  const filteredMedia = media.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alt_text?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.file_type === filterType;
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Media Library</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Upload and manage your media files
          </p>
        </div>
        <Button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Files
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by filename or alt text..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : filteredMedia.length === 0 ? (
        <Card className="p-12 text-center">
          <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery || filterType !== 'all' ? 'No media found matching your filters' : 'No media uploaded yet'}
          </p>
          {!searchQuery && filterType === 'all' && (
            <Button onClick={() => setShowUploadModal(true)}>
              <Upload className="h-5 w-5 mr-2" />
              Upload Your First File
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <Card key={item.id} className="p-3 group">
              <div className="aspect-square mb-3 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
                {item.file_type === 'image' ? (
                  <img
                    src={item.file_url}
                    alt={item.alt_text || item.file_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => setEditingMedia(item)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4 text-gray-900" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(item.file_url)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                    title="Copy URL"
                  >
                    <Copy className="h-4 w-4 text-gray-900" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.file_path, item.file_name)}
                    className="p-2 bg-white rounded-full hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={item.file_name}>
                  {item.file_name}
                </p>
                <p className="text-xs text-gray-500 mt-1">{formatFileSize(item.file_size)}</p>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 2 && (
                      <span className="px-2 py-0.5 text-xs text-gray-500">
                        +{item.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Upload Files</h2>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Click to select files or drag and drop
              </p>
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button as="span" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Select Files'}
                </Button>
              </label>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Media Modal */}
      {editingMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Edit Media</h2>
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
                {editingMedia.file_type === 'image' ? (
                  <img
                    src={editingMedia.file_url}
                    alt={editingMedia.alt_text || editingMedia.file_name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  File Name
                </label>
                <input
                  type="text"
                  value={editingMedia.file_name}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Alt Text (for accessibility)
                </label>
                <input
                  type="text"
                  value={editingMedia.alt_text || ''}
                  onChange={(e) =>
                    setEditingMedia({ ...editingMedia, alt_text: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Describe the image..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Caption
                </label>
                <textarea
                  value={editingMedia.caption || ''}
                  onChange={(e) =>
                    setEditingMedia({ ...editingMedia, caption: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Add a caption..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingMedia.tags?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingMedia({
                      ...editingMedia,
                      tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                  placeholder="fitness, workout, nutrition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  File URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingMedia.file_url}
                    disabled
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-500 text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(editingMedia.file_url)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <p>Size: {formatFileSize(editingMedia.file_size)}</p>
                <p>Type: {editingMedia.mime_type}</p>
                <p>Uploaded: {new Date(editingMedia.created_at).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setEditingMedia(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MediaLibraryPage;

