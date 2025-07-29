'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../../lib/auth-context';
import { useDictionary } from '../../../../../lib/hooks/useDictionary';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Badge } from '../../../../../components/ui/badge';
import { getDownloadHistory, getDownloadStatus, downloadTemplate } from '../../../../../lib/api';
import { IconDownload, IconInfinity, IconAlertCircle, IconCheck, IconX } from '@tabler/icons-react';

interface DownloadRecord {
  _id: string;
  templateId: {
    _id: string;
    title: string;
    description: string;
    previewImages?: string[];
    fileUrl: string;
  };
  licenseId: {
    _id: string;
    name: string;
    maxDownloads: number;
  };
  downloadCount: number;
  maxDownloads: number;
  lastDownloadAt: string;
  createdAt: string;
}

export default function CustomerDownloadsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useDictionary();
  const params = useParams();
  const lang = params.lang as string;
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'customer') {
      router.push(`/${lang}/login`);
    }
  }, [user, router, lang]);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const response = await getDownloadHistory();
        if (response.success && response.data) {
          setDownloads(response.data.downloads);
        }
      } catch (error) {
        console.error('Error fetching downloads:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'customer') {
      fetchDownloads();
    }
  }, [user]);

  const handleDownload = async (templateId: string, licenseId: string, templateTitle: string) => {
    setDownloading(templateId);
    
    try {
      const response = await downloadTemplate({
        templateId,
        licenseId,
      });

      if (response.success && response.data) {
        // Trigger actual file download
        if (response.data.downloadUrl) {
          const link = document.createElement('a');
          link.href = response.data.downloadUrl;
          link.download = `${templateTitle}.zip`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        // Refresh downloads list
        const downloadsResponse = await getDownloadHistory();
        if (downloadsResponse.success && downloadsResponse.data) {
          setDownloads(downloadsResponse.data.downloads);
        }
      }
    } catch (error: any) {
      console.error('Download failed:', error);
      alert(error.message || 'Download failed');
    } finally {
      setDownloading(null);
    }
  };

  const getRemainingDownloads = (downloadCount: number, maxDownloads: number) => {
    if (maxDownloads === -1) return -1;
    return Math.max(0, maxDownloads - downloadCount);
  };

  const canDownload = (downloadCount: number, maxDownloads: number) => {
    return maxDownloads === -1 || downloadCount < maxDownloads;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t.ui.loading}</div>
      </div>
    );
  }

  if (!user || user.role !== 'customer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary">
            My Downloads
          </h1>
          <p className="text-secondary/70 mt-2">
            Access and download your purchased templates
          </p>
        </div>

        {downloads.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <IconDownload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Downloads Available</h3>
              <p className="text-muted-foreground mb-6">
                You haven't purchased any templates yet. Start exploring our collection!
              </p>
              <Button
                onClick={() => router.push(`/${lang}/templates`)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Browse Templates
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloads.map((download) => (
              <Card key={download._id} className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-foreground text-lg">
                        {download.templateId.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {download.licenseId.name}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={canDownload(download.downloadCount, download.maxDownloads) ? "default" : "destructive"}
                      className="ml-2"
                    >
                      {canDownload(download.downloadCount, download.maxDownloads) ? 'Available' : 'Limit Reached'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Download Stats */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Downloads:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{download.downloadCount}</span>
                        <span>/</span>
                        {download.maxDownloads === -1 ? (
                          <div className="flex items-center gap-1">
                            <IconInfinity className="w-3 h-3" />
                            <span>∞</span>
                          </div>
                        ) : (
                          <span className="font-medium">{download.maxDownloads}</span>
                        )}
                      </div>
                    </div>

                    {download.maxDownloads !== -1 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Remaining:</span>
                        <span className={`font-medium ${
                          getRemainingDownloads(download.downloadCount, download.maxDownloads) === 0 
                            ? 'text-destructive' 
                            : 'text-success'
                        }`}>
                          {getRemainingDownloads(download.downloadCount, download.maxDownloads)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Download:</span>
                      <span className="text-xs text-muted-foreground">
                        {download.lastDownloadAt 
                          ? new Date(download.lastDownloadAt).toLocaleDateString()
                          : 'Never'
                        }
                      </span>
                    </div>
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={() => handleDownload(
                      download.templateId._id, 
                      download.licenseId._id, 
                      download.templateId.title
                    )}
                    disabled={!canDownload(download.downloadCount, download.maxDownloads) || downloading === download.templateId._id}
                    className="w-full"
                  >
                    <IconDownload className="w-4 h-4 mr-2" />
                    {downloading === download.templateId._id 
                      ? 'Downloading...' 
                      : canDownload(download.downloadCount, download.maxDownloads)
                        ? 'Download Template'
                        : 'Download Limit Reached'
                    }
                  </Button>

                  {/* Warning if limit reached */}
                  {!canDownload(download.downloadCount, download.maxDownloads) && download.maxDownloads !== -1 && (
                    <div className="text-xs text-destructive bg-destructive/10 p-2 rounded-md flex items-center gap-2">
                      <IconAlertCircle className="w-4 h-4" />
                      You've reached the download limit for this license
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 