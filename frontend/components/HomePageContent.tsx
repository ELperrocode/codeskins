'use client';

import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getAllReviews } from '../lib/api';
import Link from 'next/link';
import { HeroParallax } from './ui/hero-parallax';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { IconRocket, IconCode, IconPalette, IconUsers, IconStar, IconDownload, IconBrandGithub, IconBrandTwitter, IconBrandLinkedin, IconMail, IconHeart } from '@tabler/icons-react';
import { useTranslation } from '../lib/hooks/useTranslation';
import LicensesSection from './LicensesSection';

// FAQ Accordion Component
const FAQAccordion = ({ question, answer, index }: { question: string; answer: string; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
        <CardContent className="p-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <h3 className="text-xl font-semibold text-white">{question}</h3>
            <svg
              className={`w-6 h-6 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <motion.div
            initial={false}
            animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <p className="text-white/80">{answer}</p>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface License {
  _id: string;
  name: string;
  description: string;
  price: number;
  maxSales?: number;
  isActive: boolean;
}

interface Template {
  _id: string;
  title: string;
  description: string;
  previewImages?: string[];
  price: number;
  category: string;
  tags: string[];
  rating: number;
  sales: number;
}

export default function HomePageContent() {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const { t } = useTranslation();
  
  const [categories, setCategories] = useState<Array<{ _id: string; name: string; description?: string; imageUrl?: string; templateCount: number; isActive: boolean }>>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);

  // Testimonials state (reviews from backend)
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoadingTestimonials(true);
      try {
        const response = await getAllReviews();
        setTestimonials(response?.data?.reviews || []);
      } catch (error) {
        setTestimonials([]);
      } finally {
        setLoadingTestimonials(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Convert templates to products format for HeroParallax
  const products = templates.map(template => ({
    title: template.title,
    link: `/${lang}/templates/${template._id}`,
    thumbnail: template.previewImages && template.previewImages.length > 0 
      ? template.previewImages[0] 
      : "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop&crop=center"
  }));

  const features = [
    {
      icon: <IconRocket className="w-8 h-8" />,
      title: t('landing.features.rapidDevelopment.title'),
      description: t('landing.features.rapidDevelopment.description')
    },
    {
      icon: <IconStar className="w-8 h-8" />,
      title: t('landing.features.premiumQuality.title'),
      description: t('landing.features.premiumQuality.description')
    },
    {
      icon: <IconPalette className="w-8 h-8" />,
      title: t('landing.features.easyCustomization.title'),
      description: t('landing.features.easyCustomization.description')
    },
    {
      icon: <IconCode className="w-8 h-8" />,
      title: t('landing.features.developerFriendly.title'),
      description: t('landing.features.developerFriendly.description')
    }
  ];

  const stats = [
    { number: "500+", label: t('landing.stats.templates') },
    { number: "10K+", label: t('landing.stats.downloads') },
    { number: "5K+", label: t('landing.stats.developers') },
    { number: "50+", label: t('landing.stats.countries') }
  ];



  // Fetch categories with images from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?active=true');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.categories) {
            setCategories(data.data.categories);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch templates for Hero Parallax from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates?limit=15&sort=newest'); // Fetch latest templates
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.templates) {
            setTemplates(data.data.templates);
          }
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setTemplatesLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleCategoryClick = (category: { _id: string; name: string; description?: string; imageUrl?: string; templateCount: number; isActive?: boolean }) => {
    router.push(`/${lang}/templates?category=${category.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      
      {/* Hero Parallax Section */}
      <div className="relative z-10">
        <HeroParallax products={products} />
      </div>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
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
              {t('landing.features.title')}
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                    <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-white/80 text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('landing.testimonials.title')}
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {t('landing.testimonials.subtitle')}
            </p>
          </motion.div>
          
          {/* Infinity Scroll Testimonials */}
          <div className="relative">
            <div className="flex animate-scroll">
              {loadingTestimonials ? (
                <div className="text-white text-lg mx-auto">Cargando testimonios...</div>
              ) : testimonials.length === 0 ? (
                <div className="text-white text-lg mx-auto">No hay testimonios aún.</div>
              ) : (
                testimonials.map((testimonial, index) => (
                  <div key={testimonial._id || index} className="flex-shrink-0 w-80 mx-4">
                    <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                      <CardContent className="p-6">
                        <div className="flex mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-white/90 mb-4 italic">"{testimonial.comment}"</p>
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mr-4">
                            <span className="text-white font-bold text-lg">
                              {testimonial.userId?.username?.slice(0, 2).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-semibold">{testimonial.userId?.username || 'Anonymous'}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Licenses Section */}
      <LicensesSection />

      {/* FAQ Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('landing.faq.title')}
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {t('landing.faq.subtitle')}
            </p>
          </motion.div>
          <div className="space-y-6">
            {[
              {
                question: t('landing.faq.questions.1.question'),
                answer: t('landing.faq.questions.1.answer')
              },
              {
                question: t('landing.faq.questions.2.question'),
                answer: t('landing.faq.questions.2.answer')
              },
              {
                question: t('landing.faq.questions.3.question'),
                answer: t('landing.faq.questions.3.answer')
              },
              {
                question: t('landing.faq.questions.4.question'),
                answer: t('landing.faq.questions.4.answer')
              },
              {
                question: t('landing.faq.questions.5.question'),
                answer: t('landing.faq.questions.5.answer')
              }
            ].map((faq, index) => (
              <FAQAccordion key={index} question={faq.question} answer={faq.answer} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}