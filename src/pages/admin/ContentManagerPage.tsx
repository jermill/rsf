import React, { useState } from 'react';
import { usePages } from '../../hooks/useCMS';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Edit, Eye, EyeOff, Trash2, Globe } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const ContentManagerPage: React.FC = () => {
  const { pages, loading, createPage, updatePage, deletePage } = usePages();
  const navigate = useNavigate();
  const [showNewPageModal, setShowNewPageModal] = useState(false);

  const handleCreatePage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { error } = await createPage({
      slug: formData.get('slug') as string,
      title: formData.get('title') as string,
      meta_title: formData.get('meta_title') as string,
      meta_description: formData.get('meta_description') as string,
      is_published: false,
    });
    if (!error) {
      setShowNewPageModal(false);
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    await updatePage(id, {
      is_published: !currentStatus,
      published_at: !currentStatus ? new Date().toISOString() : undefined,
    });
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deletePage(id);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Manager</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your website pages and content
          </p>
        </div>
        <Button onClick={() => setShowNewPageModal(true)} className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          New Page
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {pages.map((page) => (
            <Card key={page.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {page.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          page.is_published
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {page.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      /{page.slug}
                    </p>
                    {page.meta_description && (
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                        {page.meta_description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      <span>Updated {new Date(page.updated_at).toLocaleDateString()}</span>
                      {page.published_at && (
                        <span>Published {new Date(page.published_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/admin/page-builder/${page.id}`)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => togglePublish(page.id, page.is_published)}
                    className="flex items-center gap-2"
                  >
                    {page.is_published ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Publish
                      </>
                    )}
                  </Button>
                  {page.is_published && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open(`/${page.slug}`, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      View
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDelete(page.id, page.title)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* New Page Modal */}
      {showNewPageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6 m-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Create New Page
            </h2>
            <form onSubmit={handleCreatePage}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Page Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                    placeholder="About Us"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    required
                    pattern="[a-z0-9-]+"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                    placeholder="about-us"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Lowercase letters, numbers, and hyphens only
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Meta Title (SEO)
                  </label>
                  <input
                    type="text"
                    name="meta_title"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                    placeholder="About Us - RSF Fitness"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Meta Description (SEO)
                  </label>
                  <textarea
                    name="meta_description"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Learn more about RSF Fitness..."
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowNewPageModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Page</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ContentManagerPage;

