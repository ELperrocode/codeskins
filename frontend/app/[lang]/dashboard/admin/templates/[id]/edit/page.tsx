"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getTemplate, updateTemplate, getCategories, getTags, getLicenses } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TemplateImageUploader } from "@/components/forms/TemplateImageUploader";

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface Tag {
  _id: string;
  name: string;
  description?: string;
  color?: string;
}

interface License {
  _id: string;
  name: string;
  description: string;
  price: number;
}

export default function AdminTemplateEditPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const templateId = params.id as string;
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    tags: [] as string[],
    fileUrl: '',
    previewUrl: '',
    licenseId: '',
    status: 'draft' as 'draft' | 'active' | 'inactive',
    previewImages: [] as string[],
    features: [] as string[],
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [newFeature, setNewFeature] = useState('');

  // Fetch categories, tags, and licenses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, tagsResponse, licensesResponse] = await Promise.all([
          getCategories({ active: true }),
          getTags({ active: true }),
          getLicenses({ active: true })
        ]);
        
        if (categoriesResponse.success && categoriesResponse.data?.categories) {
          setCategories(categoriesResponse.data.categories);
        }
        
        if (tagsResponse.success && tagsResponse.data?.tags) {
          setTags(tagsResponse.data.tags);
        }
        
        if (licensesResponse.success && licensesResponse.data?.licenses) {
          setLicenses(licensesResponse.data.licenses);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await getTemplate(templateId);
        if (response.success && response.data?.template) {
          const template = response.data.template;
          setForm({
            title: template.title,
            description: template.description,
            price: template.price.toString(),
            category: template.category,
            tags: template.tags || [],
            fileUrl: template.fileUrl || '',
            previewUrl: template.previewUrl || '',
            licenseId: template.licenseId?._id || '',
            status: template.status,
            previewImages: template.previewImages || [],
            features: template.features || [],
          });
        }
      } catch (err: any) {
        setError(err.message || 'Error loading template');
      } finally {
        setInitialLoading(false);
      }
    };

    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  if (!user || user.role !== 'admin') return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTagChange = (tagId: string, checked: boolean) => {
    if (checked) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tagId] }));
    } else {
      setForm(prev => ({ ...prev, tags: prev.tags.filter(id => id !== tagId) }));
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !form.features.includes(newFeature.trim())) {
      setForm(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    setForm(prev => ({ ...prev, features: prev.features.filter(f => f !== featureToRemove) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        previewImages: form.previewImages,
        status: form.status,
        features: form.features,
      };
      const response = await updateTemplate(templateId, payload);
      if (response.success) {
        router.push(`/${lang}/dashboard/admin/templates`);
      } else {
        setError(response.message || 'Error updating template');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating template');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading template...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Template</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input name="title" value={form.title} onChange={handleChange} required />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                required 
                className="w-full border rounded p-2 min-h-[100px] resize-vertical" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price (USD)</label>
                <Input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select 
                  name="category" 
                  value={form.category} 
                  onChange={handleChange} 
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">License</label>
                <select 
                  name="licenseId" 
                  value={form.licenseId} 
                  onChange={handleChange} 
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="">Select a license</option>
                  {licenses.map(license => (
                    <option key={license._id} value={license._id}>
                      {license.name} - ${license.price}
                    </option>
                  ))}
                </select>
              </div>

            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                {tags.map(tag => (
                  <label key={tag._id} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.tags.includes(tag._id)}
                      onChange={(e) => handleTagChange(tag._id, e.target.checked)}
                      className="rounded"
                    />
                    <span>{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Features</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  />
                  <Button type="button" onClick={handleAddFeature} variant="outline">
                    Add
                  </Button>
                </div>
                {form.features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(feature)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">File URL</label>
                <Input name="fileUrl" value={form.fileUrl} onChange={handleChange} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preview URL (optional)</label>
                <Input name="previewUrl" value={form.previewUrl} onChange={handleChange} placeholder="https://..." />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded p-2">
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Preview Images</label>
              <p className="text-sm text-gray-600 mb-2">
                Drag & drop images or click to select. You can reorder images using the arrows and remove them with the trash icon.
              </p>
              <TemplateImageUploader 
                value={form.previewImages} 
                onChange={imgs => setForm(f => ({ ...f, previewImages: imgs }))} 
              />
            </div>
            
            {error && <div className="text-red-500 text-sm">{error}</div>}
            
            <div className="flex space-x-4">
              <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white" disabled={loading}>
                {loading ? 'Saving...' : 'Update Template'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push(`/${lang}/dashboard/admin/templates`)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 