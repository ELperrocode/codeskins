'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../../lib/auth-context';
import { useDictionary } from '../../../../../lib/hooks/useDictionary';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Input } from '../../../../../components/ui/input';
import { getTemplates, deleteTemplate } from '../../../../../lib/api';
import { IconPlus, IconEdit, IconTrash, IconEye, IconSearch, IconFilter } from '@tabler/icons-react';

interface AdminTemplate {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  status: 'active' | 'inactive' | 'draft';
  downloads: number;
  sales: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  licenseId?: {
    _id: string;
    name: string;
    price: number;
  };
  ownerId: {
    _id: string;
    username: string;
  };
}

export default function AdminTemplatesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useDictionary();
  const params = useParams();
  const lang = params.lang as string;
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push(`/${lang}/login`);
    }
  }, [user, authLoading, router, lang]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await getTemplates();
        if (response.success && response.data?.templates) {
          // Map API response to AdminTemplate format
          const mappedTemplates: AdminTemplate[] = response.data.templates.map((template: any) => ({
            _id: template._id,
            title: template.title,
            description: template.description,
            price: template.price,
            category: template.category,
            tags: template.tags,
            status: template.status,
            downloads: template.downloads,
            sales: template.sales,
            rating: template.rating,
            reviewCount: template.reviewCount,
            createdAt: template.createdAt || new Date().toISOString(),
            licenseId: template.licenseId,
            ownerId: {
              _id: template.seller?._id || template.ownerId?._id || '',
              username: template.seller?.username || template.ownerId?.username || 'Unknown'
            }
          }));
          setTemplates(mappedTemplates);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchTemplates();
    }
  }, [user]);

  const handleDeleteTemplate = async (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        const response = await deleteTemplate(templateId);
        if (response.success) {
          setTemplates(templates.filter(t => t._id !== templateId));
        }
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || template.status === selectedStatus;
    const matchesTag = selectedTag === 'all' || template.tags.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesTag;
  });

  const categories = Array.from(new Set(templates.map(t => t.category)));
  const allTags = Array.from(new Set(templates.flatMap(t => t.tags || [])));

  if (loading) {
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-secondary">Manage Templates</h1>
              <p className="text-secondary/70 mt-2">
                Upload, edit, and manage all templates on the platform
              </p>
            </div>
            <Button 
              onClick={() => router.push(`/${lang}/dashboard/admin/templates/new`)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <IconPlus className="w-4 h-4 mr-2" />
              Add New Template
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconFilter className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tag</label>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {template.description.length > 100 
                        ? `${template.description.substring(0, 100)}...` 
                        : template.description
                      }
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/${lang}/dashboard/admin/templates/${template._id}/edit`)}
                    >
                      <IconEdit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/${lang}/templates/${template._id}`)}
                    >
                      <IconEye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteTemplate(template._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <IconTrash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold">${template.price}</span>
                  </div>
                  {template.licenseId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">License:</span>
                      <span className="font-medium">{template.licenseId.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{template.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      template.status === 'active' ? 'bg-green-100 text-green-800' :
                      template.status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {template.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Downloads:</span>
                    <span className="font-medium">{template.downloads}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sales:</span>
                    <span className="font-medium">{template.sales}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-medium">{(template.rating || 0).toFixed(1)} ⭐</span>
                  </div>
                  {template.tags && template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="text-xs text-gray-600 mr-1">Tags:</span>
                      {template.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{template.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500">
                      Created: {new Date(template.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Owner: {template.ownerId?.username || 'Unknown'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 text-lg">No templates found</p>
              <Button 
                onClick={() => router.push(`/${lang}/dashboard/admin/templates/new`)}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
              >
                <IconPlus className="w-4 h-4 mr-2" />
                Add Your First Template
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 