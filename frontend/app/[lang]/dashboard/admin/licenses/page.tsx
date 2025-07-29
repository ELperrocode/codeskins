'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../../lib/auth-context';
import { useDictionary } from '../../../../../lib/hooks/useDictionary';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Input } from '../../../../../components/ui/input';
import { Badge } from '../../../../../components/ui/badge';
import { getLicenses, createLicense, updateLicense, deleteLicense } from '../../../../../lib/api';
import { IconPlus, IconEdit, IconTrash, IconDownload, IconInfinity } from '@tabler/icons-react';

interface License {
  _id: string;
  name: string;
  description: string;
  price: number;
  maxSales?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LicenseForm {
  name: string;
  description: string;
  price: number;
  maxSales?: number;
}

export default function AdminLicensesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useDictionary();
  const params = useParams();
  const lang = params.lang as string;
  
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLicense, setEditingLicense] = useState<License | null>(null);
  const [form, setForm] = useState<LicenseForm>({
    name: '',
    description: '',
    price: 0,
    maxSales: -1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push(`/${lang}/login`);
    }
  }, [user, authLoading, router, lang]);

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const response = await getLicenses();
        if (response.success && response.data?.licenses) {
          setLicenses(response.data.licenses);
        }
      } catch (error) {
        console.error('Error fetching licenses:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchLicenses();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingLicense) {
        const response = await updateLicense(editingLicense._id, form);
        if (response.success) {
          setLicenses(licenses.map(l => 
            l._id === editingLicense._id 
              ? { ...l, ...form }
              : l
          ));
          handleCloseModal();
        }
      } else {
        const response = await createLicense(form);
        if (response.success && response.data?.license) {
          setLicenses([...licenses, response.data.license]);
          handleCloseModal();
        }
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (licenseId: string) => {
    if (!confirm('Are you sure you want to delete this license?')) return;

    try {
      const response = await deleteLicense(licenseId);
      if (response.success) {
        setLicenses(licenses.filter(l => l._id !== licenseId));
      }
    } catch (error: any) {
      console.error('Error deleting license:', error);
    }
  };

  const handleEdit = (license: License) => {
    setEditingLicense(license);
    setForm({
      name: license.name,
      description: license.description,
      price: license.price,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLicense(null);
    setForm({
      name: '',
      description: '',
      price: 0,
    });
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'maxDownloads' ? Number(value) : value,
    }));
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">License Management</h1>
              <p className="text-muted-foreground mt-2">
                Create and manage license types for templates
              </p>
            </div>
            <Button 
              onClick={() => setShowModal(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <IconPlus className="w-4 h-4 mr-2" />
              Add New License
            </Button>
          </div>
        </div>

        {/* License Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {licenses.map((license) => (
            <Card key={license._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-foreground">{license.name}</CardTitle>
                    <CardDescription className="mt-1 text-muted-foreground">
                      {license.description}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(license)}
                      className="border-border text-foreground hover:bg-accent"
                    >
                      <IconEdit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(license._id)}
                      className="border-border text-destructive hover:bg-destructive/10"
                    >
                      <IconTrash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                                                  <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">Price:</span>
                                  <div className="flex items-center gap-1">
                                    <IconDownload className="w-4 h-4 text-primary" />
                                    <span className="font-medium text-foreground">${license.price}</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">Sales Limit:</span>
                                  <div className="flex items-center gap-1">
                                    <IconDownload className="w-4 h-4 text-primary" />
                                    <span className="font-medium text-foreground">
                                      {license.maxSales === -1 ? 'Unlimited' : `${license.maxSales} sales`}
                                    </span>
                                  </div>
                                </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge 
                      variant={license.isActive ? 'default' : 'secondary'}
                      className={license.isActive ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}
                    >
                      {license.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(license.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {licenses.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <IconDownload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No licenses found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first license type to get started
              </p>
              <Button 
                onClick={() => setShowModal(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <IconPlus className="w-4 h-4 mr-2" />
                Add Your First License
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader>
              <CardTitle className="text-foreground">
                {editingLicense ? 'Edit License' : 'Add New License'}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {editingLicense ? 'Update license information' : 'Create a new license type'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g., Standard License"
                    required
                    className="border-border bg-background text-foreground"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe what this license includes..."
                    rows={3}
                    required
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                                                <div>
                                  <label className="block text-sm font-medium text-foreground mb-2">Price</label>
                                  <Input
                                    name="price"
                                    type="number"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="29.99"
                                    min="0"
                                    step="0.01"
                                    required
                                    className="border-border bg-background text-foreground"
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Price for this license type
                                  </p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-foreground mb-2">Sales Limit</label>
                                  <Input
                                    name="maxSales"
                                    type="number"
                                    value={form.maxSales}
                                    onChange={handleChange}
                                    placeholder="-1"
                                    min="-1"
                                    required
                                    className="border-border bg-background text-foreground"
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Maximum sales allowed (-1 for unlimited)
                                  </p>
                                </div>

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    className="flex-1 border-border text-foreground hover:bg-accent"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {submitting ? 'Saving...' : (editingLicense ? 'Update License' : 'Create License')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 