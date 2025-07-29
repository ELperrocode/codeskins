'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../../lib/auth-context';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Badge } from '../../../../../components/ui/badge';
import { Input } from '../../../../../components/ui/input';
import { getAllTemplatesForAdmin, deleteTemplate } from '../../../../../lib/api';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconEye, 
  IconSearch, 
  IconFilter,
  IconTemplate,
  IconDownload,
  IconStar,
  IconCurrencyDollar,
  IconTrendingUp,
  IconTrendingDown,
  IconArrowRight,
  IconPackage,
  IconUsers,
  IconCalendar,
  IconTag,
  IconCategory,
  IconEyeOff,
  IconCheck,
  IconX
} from '@tabler/icons-react';

interface AdminTemplate {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  previewImages?: string[];
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
        const response = await getAllTemplatesForAdmin();
        if (response.success && response.data?.templates) {
          // Map API response to AdminTemplate format
          const mappedTemplates: AdminTemplate[] = response.data.templates.map((template: any) => ({
            _id: template._id,
            title: template.title,
            description: template.description,
            price: template.price,
            category: template.category,
            tags: template.tags,
            previewImages: template.previewImages,
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

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate statistics
  const stats = {
    total: templates.length,
    active: templates.filter(t => t.status === 'active').length,
    inactive: templates.filter(t => t.status === 'inactive').length,
    draft: templates.filter(t => t.status === 'draft').length,
    totalRevenue: templates.reduce((sum, t) => sum + (t.sales * t.price), 0),
    totalDownloads: templates.reduce((sum, t) => sum + t.downloads, 0),
    avgRating: templates.length > 0 ? templates.reduce((sum, t) => sum + (t.rating || 0), 0) / templates.length : 0
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header with Stats - Loading State */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Template Management</h1>
              <p className="text-blue-100 mt-2">Manage and monitor all platform templates</p>
            </div>
            <Button 
              onClick={() => router.push(`/${lang}/dashboard/admin/templates/new`)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <IconPlus className="w-4 h-4 mr-2" />
              Add New Template
            </Button>
          </div>
          
          {/* Stats Cards - Loading State */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-white/20 rounded mb-2 animate-pulse"></div>
                    <div className="h-8 bg-white/30 rounded animate-pulse"></div>
                  </div>
                  <div className="w-8 h-8 bg-white/20 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading Content */}
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading all templates...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a moment for large collections</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Template Management</h1>
            <p className="text-blue-100 mt-2">Manage and monitor all platform templates</p>
          </div>
          <Button 
            onClick={() => router.push(`/${lang}/dashboard/admin/templates/new`)}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <IconPlus className="w-4 h-4 mr-2" />
            Add New Template
          </Button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Templates</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <IconTemplate className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <IconCheck className="w-8 h-8 text-green-300" />
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <IconCurrencyDollar className="w-8 h-8 text-green-300" />
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Avg Rating</p>
                <p className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</p>
              </div>
              <IconStar className="w-8 h-8 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconFilter className="w-5 h-5 mr-2" />
            Filters & Search
          </CardTitle>
          <CardDescription>Find and filter templates by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search Templates</label>
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by title or description..."
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
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories ({categories.length})</option>
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
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active ({stats.active})</option>
                <option value="inactive">Inactive ({stats.inactive})</option>
                <option value="draft">Draft ({stats.draft})</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Tags ({allTags.length})</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

              {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-blue-600">{filteredTemplates.length}</span> of <span className="font-semibold text-gray-900">{templates.length}</span> templates
            </div>
            {filteredTemplates.length !== templates.length && (
              <Badge variant="secondary" className="text-xs">
                Filtered Results
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <IconDownload className="w-3 h-3 mr-1" />
              {stats.totalDownloads} total downloads
            </Badge>
            <Badge variant="outline" className="text-xs">
              <IconStar className="w-3 h-3 mr-1" />
              {stats.avgRating.toFixed(1)} avg rating
            </Badge>
          </div>
        </div>

      {/* Enhanced Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <IconTemplate className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Templates Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedTag !== 'all'
                ? 'Try adjusting your filters to see more templates.'
                : 'Get started by adding your first template to the platform!'
              }
            </p>
            <Button 
              onClick={() => router.push(`/${lang}/dashboard/admin/templates/new`)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <IconPlus className="w-4 h-4 mr-2" />
              Add Your First Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template._id} className="hover:shadow-lg transition-all duration-300 group">
              {/* Preview Image */}
              <div className="relative">
                {template.previewImages && template.previewImages.length > 0 ? (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={template.previewImages[0]}
                      alt={template.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-lg flex items-center justify-center">
                    <IconTemplate className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className={`${
                    template.status === 'active' ? 'bg-green-100 text-green-800' :
                    template.status === 'inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {template.status}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => router.push(`/${lang}/dashboard/admin/templates/${template._id}/edit`)}
                    className="w-8 h-8 p-0"
                  >
                    <IconEdit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => router.push(`/${lang}/templates/${template._id}`)}
                    className="w-8 h-8 p-0"
                  >
                    <IconEye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteTemplate(template._id)}
                    className="w-8 h-8 p-0"
                  >
                    <IconTrash className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-gray-900 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {template.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 line-clamp-2 mt-1">
                      {template.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price and License */}
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(template.price)}
                  </div>
                  {template.licenseId && (
                    <Badge variant="outline" className="text-xs">
                      {template.licenseId.name}
                    </Badge>
                  )}
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <IconDownload className="w-4 h-4" />
                    <span>{template.downloads}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconPackage className="w-4 h-4" />
                    <span>{template.sales}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconStar className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{(template.rating || 0).toFixed(1)}</span>
                  </div>
                </div>

                {/* Category and Tags */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IconCategory className="w-4 h-4 text-gray-400" />
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                  {template.tags && template.tags.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      <IconTag className="w-4 h-4 text-gray-400" />
                      {template.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{template.tags.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Info */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <IconCalendar className="w-3 h-3" />
                      <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IconUsers className="w-3 h-3" />
                      <span>{template.ownerId?.username || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 