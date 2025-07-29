'use client';

import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useTranslation } from '../lib/hooks/useTranslation';

interface License {
  _id: string;
  name: string;
  description: string;
  price: number;
  maxSales?: number;
  isActive: boolean;
}

export default function LicensesSection() {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const { t } = useTranslation();
  
  const [licenses, setLicenses] = useState<License[]>([]);
  const [licensesLoading, setLicensesLoading] = useState(true);

  // Fetch licenses from API
  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const response = await fetch('/api/licenses');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.licenses) {
            setLicenses(data.data.licenses);
          }
        }
      } catch (error) {
        console.error('Error fetching licenses:', error);
      } finally {
        setLicensesLoading(false);
      }
    };

    fetchLicenses();
  }, []);

  const getLicenseFeatures = (license: License) => {
    const features = [
      t('landing.licenses.features.unlimitedDownloads'),
      
      license.name.includes('Extended') || license.name.includes('Developer') || license.name.includes('Premium') 
        ? t('landing.licenses.features.commercialUse') 
        : t('landing.licenses.features.personalUse'),
      
      license.name.includes('Developer') 
        ? t('landing.licenses.features.clientProjects') 
        : license.name.includes('Extended') || license.name.includes('Premium') 
          ? t('landing.licenses.features.multipleProjects') 
          : t('landing.licenses.features.singleProject'),
      
      license.name.includes('Developer') 
        ? t('landing.licenses.features.agencyWork') 
        : license.name.includes('Extended') || license.name.includes('Premium') 
          ? t('landing.licenses.features.resaleRights') 
          : t('landing.licenses.features.personalPortfolio'),
      
      license.name.includes('Developer') 
        ? t('landing.licenses.features.whiteLabelRights') 
        : license.name.includes('Extended') || license.name.includes('Premium') 
          ? t('landing.licenses.features.prioritySupport') 
          : t('landing.licenses.features.basicSupport'),
      
      license.name.includes('Developer') 
        ? t('landing.licenses.features.dedicatedSupport') 
        : license.name.includes('Extended') || license.name.includes('Premium') 
          ? t('landing.licenses.features.lifetimeUpdates') 
          : t('landing.licenses.features.oneYearUpdates'),
      
      license.maxSales && license.maxSales !== -1 
        ? `${t('landing.licenses.features.limitedSales')} ${license.maxSales} sales` 
        : t('landing.licenses.features.unlimitedSales')
    ].filter(Boolean);

    return features;
  };

  return (
    <section className="relative z-10 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('landing.licenses.title')}
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {t('landing.licenses.subtitle')}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {licensesLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="backdrop-blur-md bg-white/10 border-white/20 h-full">
                  <CardHeader className="text-center">
                    <div className="h-6 bg-white/20 rounded animate-pulse mb-4"></div>
                    <div className="h-4 bg-white/10 rounded animate-pulse mb-2"></div>
                    <div className="h-8 bg-white/20 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-4 bg-white/10 rounded animate-pulse"></div>
                      ))}
                    </div>
                    <div className="h-10 bg-white/20 rounded animate-pulse mt-6"></div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : licenses.length > 0 ? (
            licenses.map((license, index) => {
              const features = getLicenseFeatures(license);
              const isPopular = license.name.includes('Extended');

              return (
                <motion.div
                  key={license._id || license.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className={`backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 h-full relative ${
                    isPopular ? 'bg-gradient-primary border-primary-400' : 'bg-white/10'
                  }`}>
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                          {t('landing.licenses.mostPopular')}
                        </span>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className={`text-2xl ${isPopular ? 'text-white' : 'text-white'}`}>
                        {license.name}
                      </CardTitle>
                      <p className={`text-sm ${isPopular ? 'text-white/80' : 'text-white/60'} mt-2`}>
                        {license.description}
                      </p>
                      <div className="mt-4">
                        <span className={`text-2xl font-semibold ${isPopular ? 'text-white' : 'text-white'}`}>
                          {t('landing.licenses.unlimitedDownloads')}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {features.map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <svg className={`w-5 h-5 mr-3 ${isPopular ? 'text-white' : 'text-primary-400'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className={isPopular ? 'text-white' : 'text-white/80'}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className={`w-full mt-6 ${isPopular ? 'bg-white text-primary-600 hover:bg-gray-100' : 'bg-primary-500 hover:bg-primary-600'}`}
                        onClick={() => router.push(`/${lang}/templates`)}
                      >
                        {t('landing.licenses.browseTemplates')}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            // Fallback if no licenses
            <div className="col-span-3 text-center text-white/60">
              <p>{t('landing.licenses.noLicensesAvailable')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 