import React, { useState } from 'react';
import { ContentBlock, BlockType } from '../../types/cms';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { X, Plus, Trash2 } from 'lucide-react';

interface BlockEditorProps {
  block: ContentBlock;
  onSave: (updates: Partial<ContentBlock>) => void;
  onClose: () => void;
}

const BlockEditor: React.FC<BlockEditorProps> = ({ block, onSave, onClose }) => {
  const [blockName, setBlockName] = useState(block.block_name);
  const [isVisible, setIsVisible] = useState(block.is_visible);
  const [content, setContent] = useState(block.content);

  const handleSave = () => {
    onSave({
      block_name: blockName,
      is_visible: isVisible,
      content,
    });
  };

  const updateContent = (key: string, value: any) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const renderEditor = () => {
    switch (block.block_type) {
      case 'hero':
        return renderHeroEditor();
      case 'features':
        return renderFeaturesEditor();
      case 'testimonials':
        return renderTestimonialsEditor();
      case 'cta':
        return renderCTAEditor();
      case 'gallery':
        return renderGalleryEditor();
      case 'text':
        return renderTextEditor();
      case 'pricing':
        return renderPricingEditor();
      case 'workouts':
        return renderWorkoutsEditor();
      default:
        return renderJSONEditor();
    }
  };

  const renderHeroEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Heading
        </label>
        <input
          type="text"
          value={content.heading || ''}
          onChange={(e) => updateContent('heading', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Subheading
        </label>
        <textarea
          value={content.subheading || ''}
          onChange={(e) => updateContent('subheading', e.target.value)}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            CTA Button Text
          </label>
          <input
            type="text"
            value={content.ctaText || ''}
            onChange={(e) => updateContent('ctaText', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            CTA Link
          </label>
          <input
            type="text"
            value={content.ctaLink || ''}
            onChange={(e) => updateContent('ctaLink', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Background Image URL
        </label>
        <input
          type="text"
          value={content.backgroundImage || ''}
          onChange={(e) => updateContent('backgroundImage', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
          placeholder="/path/to/image.jpg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Overlay Opacity (0-1)
        </label>
        <input
          type="number"
          min="0"
          max="1"
          step="0.1"
          value={content.overlayOpacity || 0.4}
          onChange={(e) => updateContent('overlayOpacity', parseFloat(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
    </div>
  );

  const renderFeaturesEditor = () => {
    const features = content.features || [];
    
    const addFeature = () => {
      updateContent('features', [
        ...features,
        { icon: 'Star', title: 'New Feature', description: 'Feature description' },
      ]);
    };

    const updateFeature = (index: number, key: string, value: string) => {
      const newFeatures = [...features];
      newFeatures[index] = { ...newFeatures[index], [key]: value };
      updateContent('features', newFeatures);
    };

    const removeFeature = (index: number) => {
      updateContent('features', features.filter((_: any, i: number) => i !== index));
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Section Heading
          </label>
          <input
            type="text"
            value={content.heading || ''}
            onChange={(e) => updateContent('heading', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subheading
          </label>
          <input
            type="text"
            value={content.subheading || ''}
            onChange={(e) => updateContent('subheading', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Features
            </label>
            <Button size="sm" onClick={addFeature}>
              <Plus className="h-4 w-4 mr-1" />
              Add Feature
            </Button>
          </div>
          <div className="space-y-3">
            {features.map((feature: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={feature.icon || ''}
                      onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                      placeholder="Icon name (e.g., Star)"
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                    />
                    <input
                      type="text"
                      value={feature.title || ''}
                      onChange={(e) => updateFeature(index, 'title', e.target.value)}
                      placeholder="Feature title"
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                    />
                    <textarea
                      value={feature.description || ''}
                      onChange={(e) => updateFeature(index, 'description', e.target.value)}
                      placeholder="Feature description"
                      rows={2}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTestimonialsEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Section Heading
        </label>
        <input
          type="text"
          value={content.heading || ''}
          onChange={(e) => updateContent('heading', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Subheading
        </label>
        <input
          type="text"
          value={content.subheading || ''}
          onChange={(e) => updateContent('subheading', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 Testimonials are pulled from your database. This block controls the display settings only.
        </p>
      </div>
    </div>
  );

  const renderCTAEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Heading
        </label>
        <input
          type="text"
          value={content.heading || ''}
          onChange={(e) => updateContent('heading', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Subheading
        </label>
        <input
          type="text"
          value={content.subheading || ''}
          onChange={(e) => updateContent('subheading', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Button Text
          </label>
          <input
            type="text"
            value={content.ctaText || ''}
            onChange={(e) => updateContent('ctaText', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Button Link
          </label>
          <input
            type="text"
            value={content.ctaLink || ''}
            onChange={(e) => updateContent('ctaLink', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Background Color
        </label>
        <input
          type="color"
          value={content.backgroundColor || '#10b981'}
          onChange={(e) => updateContent('backgroundColor', e.target.value)}
          className="w-full h-12 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
        />
      </div>
    </div>
  );

  const renderGalleryEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Gallery Heading
        </label>
        <input
          type="text"
          value={content.heading || ''}
          onChange={(e) => updateContent('heading', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 Use the Media Library to upload and manage gallery images.
        </p>
      </div>
    </div>
  );

  const renderTextEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Heading (Optional)
        </label>
        <input
          type="text"
          value={content.heading || ''}
          onChange={(e) => updateContent('heading', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Content
        </label>
        <textarea
          value={content.content || ''}
          onChange={(e) => updateContent('content', e.target.value)}
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white font-mono text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Alignment
        </label>
        <select
          value={content.alignment || 'left'}
          onChange={(e) => updateContent('alignment', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  );

  const renderPricingEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Section Heading
        </label>
        <input
          type="text"
          value={content.heading || ''}
          onChange={(e) => updateContent('heading', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Subheading
        </label>
        <input
          type="text"
          value={content.subheading || ''}
          onChange={(e) => updateContent('subheading', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 Pricing plans are managed in your data files. This block controls the display.
        </p>
      </div>
    </div>
  );

  const renderWorkoutsEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Section Heading
        </label>
        <input
          type="text"
          value={content.heading || ''}
          onChange={(e) => updateContent('heading', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Subheading
        </label>
        <input
          type="text"
          value={content.subheading || ''}
          onChange={(e) => updateContent('subheading', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 Workout content is managed in your data files. This block controls the display.
        </p>
      </div>
    </div>
  );

  const renderJSONEditor = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Content (JSON)
      </label>
      <textarea
        value={JSON.stringify(content, null, 2)}
        onChange={(e) => {
          try {
            setContent(JSON.parse(e.target.value));
          } catch {
            // Invalid JSON, don't update
          }
        }}
        rows={15}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white font-mono text-sm"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit {block.block_type.charAt(0).toUpperCase() + block.block_type.slice(1)} Block
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {/* Basic Settings */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Block Name
                </label>
                <input
                  type="text"
                  value={blockName}
                  onChange={(e) => setBlockName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is-visible"
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="is-visible" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Visible on page
                </label>
              </div>
            </div>

            {/* Block-specific Editor */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              {renderEditor()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </Card>
    </div>
  );
};

export default BlockEditor;

