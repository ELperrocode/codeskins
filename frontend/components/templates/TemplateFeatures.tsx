'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { 
  IconRocket, 
  IconCode, 
  IconPalette, 
  IconDeviceMobile,
  IconBrowser,
  IconSettings,
  IconShield,
  IconBolt
} from '@tabler/icons-react';

interface TemplateFeaturesProps {
  features: string[];
}

// Map feature keywords to icons
const getFeatureIcon = (feature: string) => {
  const lowerFeature = feature.toLowerCase();
  
  if (lowerFeature.includes('responsive') || lowerFeature.includes('mobile')) {
    return <IconDeviceMobile className="w-5 h-5 text-blue-500" />;
  }
  if (lowerFeature.includes('modern') || lowerFeature.includes('design')) {
    return <IconPalette className="w-5 h-5 text-purple-500" />;
  }
  if (lowerFeature.includes('fast') || lowerFeature.includes('performance')) {
    return <IconBolt className="w-5 h-5 text-yellow-500" />;
  }
  if (lowerFeature.includes('secure') || lowerFeature.includes('security')) {
    return <IconShield className="w-5 h-5 text-green-500" />;
  }
  if (lowerFeature.includes('customizable') || lowerFeature.includes('configurable')) {
    return <IconSettings className="w-5 h-5 text-indigo-500" />;
  }
  if (lowerFeature.includes('browser') || lowerFeature.includes('cross-browser')) {
    return <IconBrowser className="w-5 h-5 text-orange-500" />;
  }
  if (lowerFeature.includes('code') || lowerFeature.includes('clean')) {
    return <IconCode className="w-5 h-5 text-gray-500" />;
  }
  
  return <IconRocket className="w-5 h-5 text-primary-500" />;
};

export function TemplateFeatures({ features }: TemplateFeaturesProps) {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Template Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to build a professional website quickly and efficiently.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white border-gray-200 hover:shadow-lg hover:border-primary-300 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {getFeatureIcon(feature)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {feature}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {getFeatureDescription(feature)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              What's Included
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <span className="text-gray-700">Complete source code</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <span className="text-gray-700">Detailed documentation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <span className="text-gray-700">Lifetime updates</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Helper function to generate feature descriptions
function getFeatureDescription(feature: string): string {
  const lowerFeature = feature.toLowerCase();
  
  if (lowerFeature.includes('responsive')) {
    return 'Fully responsive design that looks great on all devices and screen sizes.';
  }
  if (lowerFeature.includes('modern')) {
    return 'Built with the latest web technologies and design trends.';
  }
  if (lowerFeature.includes('fast')) {
    return 'Optimized for speed and performance with minimal loading times.';
  }
  if (lowerFeature.includes('secure')) {
    return 'Security best practices implemented to protect your data and users.';
  }
  if (lowerFeature.includes('customizable')) {
    return 'Easy to customize and adapt to your specific needs and branding.';
  }
  if (lowerFeature.includes('browser')) {
    return 'Cross-browser compatible and tested on all major browsers.';
  }
  if (lowerFeature.includes('code')) {
    return 'Clean, well-documented code that follows industry best practices.';
  }
  if (lowerFeature.includes('mobile')) {
    return 'Mobile-first design approach for optimal mobile experience.';
  }
  if (lowerFeature.includes('seo')) {
    return 'Search engine optimized with proper meta tags and structure.';
  }
  if (lowerFeature.includes('accessibility')) {
    return 'Built with accessibility in mind, following WCAG guidelines.';
  }
  
  return 'Professional feature designed to enhance your website experience.';
} 