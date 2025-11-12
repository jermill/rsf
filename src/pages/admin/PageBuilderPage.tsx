import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePages, useContentBlocks, usePageVersions } from '../../hooks/useCMS';
import {
  ArrowLeft,
  Plus,
  Eye,
  Save,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  History,
  Copy,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { BlockType, ContentBlock } from '../../types/cms';
import BlockEditor from '../../components/admin/BlockEditor';

const PageBuilderPage: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { pages } = usePages();
  const { blocks, loading, createBlock, updateBlock, deleteBlock, reorderBlocks } = useContentBlocks(pageId);
  const { versions, createVersion, restoreVersion } = usePageVersions(pageId);
  
  const [page, setPage] = useState(pages.find((p) => p.id === pageId));
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [showVersionsModal, setShowVersionsModal] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    setPage(pages.find((p) => p.id === pageId));
  }, [pages, pageId]);

  const handleAddBlock = async (blockType: BlockType) => {
    if (!pageId) return;
    
    const defaultContent = getDefaultBlockContent(blockType);
    const { data } = await createBlock({
      page_id: pageId,
      block_type: blockType,
      block_name: `New ${blockType} Block`,
      content: defaultContent,
      position: blocks.length,
      is_visible: true,
    });
    
    if (data) {
      setEditingBlock(data);
    }
    setShowAddBlockModal(false);
  };

  const handleSaveBlock = async (blockId: string, updates: Partial<ContentBlock>) => {
    await updateBlock(blockId, updates);
    setEditingBlock(null);
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (confirm('Are you sure you want to delete this block?')) {
      await deleteBlock(blockId);
    }
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    reorderBlocks(newBlocks);
  };

  const handleDuplicateBlock = async (block: ContentBlock) => {
    await createBlock({
      page_id: block.page_id,
      block_type: block.block_type,
      block_name: `${block.block_name} (Copy)`,
      content: block.content,
      position: block.position + 1,
      is_visible: block.is_visible,
    });
  };

  const handleCreateVersion = async () => {
    const notes = prompt('Add version notes (optional):');
    await createVersion(notes || undefined);
    alert('Version saved successfully!');
  };

  const handleRestoreVersion = async (versionId: string) => {
    if (confirm('Are you sure you want to restore this version? Current content will be replaced.')) {
      await restoreVersion(versionId);
      setShowVersionsModal(false);
      alert('Version restored successfully!');
      window.location.reload();
    }
  };

  if (!page) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Page not found</p>
          <Button onClick={() => navigate('/admin/content')} className="mt-4">
            Back to Content Manager
          </Button>
        </div>
      </div>
    );
  }

  const blockTypes: BlockType[] = ['hero', 'features', 'testimonials', 'cta', 'gallery', 'text', 'pricing', 'workouts'];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/admin/content')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{page.title}</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">/{page.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowVersionsModal(true)}
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            Versions ({versions.length})
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCreateVersion}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Version
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {previewMode ? 'Exit Preview' : 'Preview'}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {blocks.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No content blocks yet</p>
              <Button onClick={() => setShowAddBlockModal(true)}>
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Block
              </Button>
            </Card>
          ) : (
            blocks.map((block, index) => (
              <Card key={block.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col gap-2">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {block.block_name}
                          </h3>
                          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                            {block.block_type}
                          </span>
                          {!block.is_visible && (
                            <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Position: {index + 1}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleMoveBlock(index, 'up')}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleMoveBlock(index, 'down')}
                          disabled={index === blocks.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDuplicateBlock(block)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setEditingBlock(block)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => updateBlock(block.id, { is_visible: !block.is_visible })}
                        >
                          {block.is_visible ? <Eye className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDeleteBlock(block.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {/* Block Content Preview */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
                        {JSON.stringify(block.content, null, 2).substring(0, 200)}...
                      </pre>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}

          {/* Add Block Button */}
          <Button
            onClick={() => setShowAddBlockModal(true)}
            className="w-full py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            <Plus className="h-6 w-6 mr-2" />
            Add Content Block
          </Button>
        </div>
      )}

      {/* Add Block Modal */}
      {showAddBlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Add Content Block
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {blockTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleAddBlock(type)}
                  className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-center"
                >
                  <div className="text-4xl mb-2">{getBlockIcon(type)}</div>
                  <div className="font-medium capitalize text-gray-900 dark:text-white">{type}</div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="secondary" onClick={() => setShowAddBlockModal(false)}>
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Block Editor Modal */}
      {editingBlock && (
        <BlockEditor
          block={editingBlock}
          onSave={(updates) => handleSaveBlock(editingBlock.id, updates)}
          onClose={() => setEditingBlock(null)}
        />
      )}

      {/* Versions Modal */}
      {showVersionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Page Versions
            </h2>
            <div className="space-y-3">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Version {version.version_number}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(version.created_at).toLocaleString()}
                    </div>
                    {version.notes && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {version.notes}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRestoreVersion(version.id)}
                  >
                    Restore
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="secondary" onClick={() => setShowVersionsModal(false)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// Helper functions
function getDefaultBlockContent(blockType: BlockType): any {
  const defaults: Record<BlockType, any> = {
    hero: {
      heading: 'Your Heading Here',
      subheading: 'Your subheading text',
      ctaText: 'Get Started',
      ctaLink: '/pricing',
      backgroundImage: '',
      overlayOpacity: 0.4,
    },
    features: {
      heading: 'Features',
      subheading: 'What we offer',
      features: [],
    },
    testimonials: {
      heading: 'Testimonials',
      subheading: 'What our clients say',
    },
    cta: {
      heading: 'Ready to get started?',
      subheading: 'Join us today',
      ctaText: 'Sign Up',
      ctaLink: '/pricing',
      backgroundColor: '#10b981',
    },
    gallery: {
      heading: 'Gallery',
      images: [],
    },
    text: {
      heading: '',
      content: 'Your content here...',
      alignment: 'left',
    },
    pricing: {
      heading: 'Pricing Plans',
      subheading: 'Choose your plan',
    },
    workouts: {
      heading: 'Workouts',
      subheading: 'Featured workouts',
    },
    custom: {},
  };
  return defaults[blockType] || {};
}

function getBlockIcon(blockType: BlockType): string {
  const icons: Record<BlockType, string> = {
    hero: '🎯',
    features: '⭐',
    testimonials: '💬',
    cta: '📢',
    gallery: '🖼️',
    text: '📝',
    pricing: '💰',
    workouts: '💪',
    custom: '🔧',
  };
  return icons[blockType] || '📄';
}

export default PageBuilderPage;

