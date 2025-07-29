'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../../lib/auth-context';
import { useDictionary } from '../../../../../lib/hooks/useDictionary';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Input } from '../../../../../components/ui/input';
import { getTags, createTag, updateTag, deleteTag } from '../../../../../lib/api';
import { IconPlus, IconEdit, IconTrash, IconSearch, IconFilter, IconRefresh, IconPalette } from '@tabler/icons-react';

interface Tag {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  templateCount: number;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminTagsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useDictionary();
  const params = useParams();
  const lang = params.lang as string;
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', color: '#3B82F6' });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push(`/${lang}/login`);
    }
  }, [user, authLoading, router, lang]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getTags({ active: showActiveOnly });
        if (response.success && response.data?.tags) {
          setTags(response.data.tags);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchTags();
    }
  }, [user, showActiveOnly]);

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createTag(formData);
      if (response.success) {
        setShowCreateModal(false);
        setFormData({ name: '', description: '', color: '#3B82F6' });
        // Refresh tags
        const refreshResponse = await getTags({ active: showActiveOnly });
        if (refreshResponse.success && refreshResponse.data?.tags) {
          setTags(refreshResponse.data.tags);
        }
      }
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;
    
    try {
      const response = await updateTag(editingTag._id, formData);
      if (response.success) {
        setEditingTag(null);
        setFormData({ name: '', description: '', color: '#3B82F6' });
        // Refresh tags
        const refreshResponse = await getTags({ active: showActiveOnly });
        if (refreshResponse.success && refreshResponse.data?.tags) {
          setTags(refreshResponse.data.tags);
        }
      }
    } catch (error) {
      console.error('Error updating tag:', error);
    }
  };

  const handleDelete = async (tagId: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;
    
    try {
      const response = await deleteTag(tagId);
      if (response.success) {
        // Refresh tags
        const refreshResponse = await getTags({ active: showActiveOnly });
        if (refreshResponse.success && refreshResponse.data?.tags) {
          setTags(refreshResponse.data.tags);
        }
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({ 
      name: tag.name, 
      description: tag.description || '', 
      color: tag.color 
    });
  };

  const handleToggleActive = async (tag: Tag) => {
    try {
      const response = await updateTag(tag._id, { isActive: !tag.isActive });
      if (response.success) {
        // Refresh tags
        const refreshResponse = await getTags({ active: showActiveOnly });
        if (refreshResponse.success && refreshResponse.data?.tags) {
          setTags(refreshResponse.data.tags);
        }
      }
    } catch (error) {
      console.error('Error toggling tag status:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t.ui.loading}</div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Tags</h1>
          <p className="text-gray-600 mt-2">
            Create and manage template tags
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
              <IconRefresh className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {tags.length}
              </div>
              <p className="text-xs text-muted-foreground">
                All tags
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tags</CardTitle>
              <IconFilter className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {tags.filter(t => t.isActive).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
              <IconEdit className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {tags.reduce((sum, t) => sum + t.templateCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all tags
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowActiveOnly(!showActiveOnly)}
              className={showActiveOnly ? 'bg-green-50 border-green-200' : ''}
            >
              <IconFilter className="w-4 h-4 mr-2" />
              {showActiveOnly ? 'Active Only' : 'All Tags'}
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              <IconPlus className="w-4 h-4 mr-2" />
              New Tag
            </Button>
          </div>
        </div>

        {/* Tags List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTags.map((tag) => (
            <Card key={tag._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: tag.color }}
                      />
                      <CardTitle className="text-lg">{tag.name}</CardTitle>
                    </div>
                    <CardDescription>
                      {tag.description || 'No description'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tag.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tag.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Slug:</span>
                    <span className="font-mono text-xs">{tag.slug}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Templates:</span>
                    <span className="font-semibold">{tag.templateCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Color:</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="font-mono text-xs">{tag.color}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span>{new Date(tag.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(tag)}
                    >
                      <IconEdit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(tag)}
                    >
                      {tag.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(tag._id)}
                      disabled={tag.templateCount > 0}
                      className="text-red-600 hover:text-red-700"
                    >
                      <IconTrash className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTags.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 text-lg">No tags found</p>
              <p className="text-gray-400 text-sm mt-2">
                {searchTerm || !showActiveOnly 
                  ? 'Try adjusting your filters' 
                  : 'Create your first tag to get started'
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md shadow-xl">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-xl text-foreground">Create New Tag</CardTitle>
                <CardDescription className="text-muted-foreground">Add a new template tag</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter tag name"
                      required
                      className="w-full border-border bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                    <Input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter tag description (optional)"
                      className="w-full border-border bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-12 h-10 rounded border border-border cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        placeholder="#3B82F6"
                        className="flex-1 font-mono border-border bg-background text-foreground"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Create Tag
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Modal */}
        {editingTag && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md shadow-xl">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-xl text-foreground">Edit Tag</CardTitle>
                <CardDescription className="text-muted-foreground">Update tag information</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter tag name"
                      required
                      className="w-full border-border bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                    <Input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter tag description (optional)"
                      className="w-full border-border bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        placeholder="#3B82F6"
                        className="flex-1 font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                      Update Tag
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setEditingTag(null)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 