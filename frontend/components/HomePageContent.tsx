'use client';

import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
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
              {[
                {
                  name: "Sarah Chen",
                  role: "Frontend Developer",
                  company: "TechCorp",
                  content: "CodeSkins templates saved me weeks of development time. The quality is outstanding!",
                  rating: 5
                },
                {
                  name: "Marcus Rodriguez",
                  role: "Designer",
                  company: "Creative Studio",
                  content: "Finally, templates that actually look professional and are easy to customize.",
                  rating: 5
                },
                {
                  name: "Emily Watson",
                  role: "Startup Founder",
                  company: "InnovateLab",
                  content: "Launched our MVP in 2 days using CodeSkins. Our investors were impressed!",
                  rating: 5
                },
                {
                  name: "David Kim",
                  role: "Full Stack Developer",
                  company: "Digital Agency",
                  content: "The code quality is exceptional. Clean, well-documented, and production-ready.",
                  rating: 5
                },
                {
                  name: "Lisa Thompson",
                  role: "Product Manager",
                  company: "SaaS Startup",
                  content: "CodeSkins helped us ship faster than ever. Highly recommended!",
                  rating: 5
                },
                {
                  name: "Alex Johnson",
                  role: "UI/UX Designer",
                  company: "Design Studio",
                  content: "Beautiful designs that are actually functional. Perfect for rapid prototyping.",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <div key={`${testimonial.name}-${index}`} className="flex-shrink-0 w-80 mx-4">
                  <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-white/90 mb-4 italic">"{testimonial.content}"</p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-bold text-lg">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">{testimonial.name}</p>
                          <p className="text-white/60 text-sm">{testimonial.role} at {testimonial.company}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {[
                {
                  name: "Sarah Chen",
                  role: "Frontend Developer",
                  company: "TechCorp",
                  content: "CodeSkins templates saved me weeks of development time. The quality is outstanding!",
                  rating: 5
                },
                {
                  name: "Marcus Rodriguez",
                  role: "Designer",
                  company: "Creative Studio",
                  content: "Finally, templates that actually look professional and are easy to customize.",
                  rating: 5
                },
                {
                  name: "Emily Watson",
                  role: "Startup Founder",
                  company: "InnovateLab",
                  content: "Launched our MVP in 2 days using CodeSkins. Our investors were impressed!",
                  rating: 5
                },
                {
                  name: "David Kim",
                  role: "Full Stack Developer",
                  company: "Digital Agency",
                  content: "The code quality is exceptional. Clean, well-documented, and production-ready.",
                  rating: 5
                },
                {
                  name: "Lisa Thompson",
                  role: "Product Manager",
                  company: "SaaS Startup",
                  content: "CodeSkins helped us ship faster than ever. Highly recommended!",
                  rating: 5
                },
                {
                  name: "Alex Johnson",
                  role: "UI/UX Designer",
                  company: "Design Studio",
                  content: "Beautiful designs that are actually functional. Perfect for rapid prototyping.",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <div key={`${testimonial.name}-duplicate-${index}`} className="flex-shrink-0 w-80 mx-4">
                  <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-white/90 mb-4 italic">"{testimonial.content}"</p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-bold text-lg">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">{testimonial.name}</p>
                          <p className="text-white/60 text-sm">{testimonial.role} at {testimonial.company}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
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
          
          <div className="space-y-4">
            {[
              {
                question: t('landing.faq.questions.0.question'),
                answer: t('landing.faq.questions.0.answer')
              },
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

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('landing.cta.title')}
            </h2>
            <p className="text-xl text-white/80 mb-8">
              {t('landing.cta.subtitle')}
            </p>
            <Button
              size="lg"
              className="bg-gradient-primary hover:bg-gradient-primary-hover text-white font-semibold px-8 py-4 text-lg"
              onClick={() => router.push(`/${lang}/templates`)}
            >
              <IconRocket className="w-5 h-5 mr-2" />
              {t('landing.cta.button')}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer Section - Integrated with landing page background */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href={`/${lang}`} className="flex items-center space-x-2 mb-4 group">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="font-bold text-xl group-hover:text-primary-400 transition-colors duration-300 text-white drop-shadow-lg">CodeSkins</span>
              </Link>
              <p className="mb-6 max-w-md leading-relaxed text-white/70">
                {t('footer.description')}
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {[
                  { name: 'GitHub', href: 'https://github.com', icon: IconBrandGithub },
                  { name: 'Twitter', href: 'https://twitter.com', icon: IconBrandTwitter },
                  { name: 'LinkedIn', href: 'https://linkedin.com', icon: IconBrandLinkedin },
                  { name: 'Email', href: 'mailto:contact@codeskins.com', icon: IconMail },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-primary-400 hover:scale-110 transition-all duration-300 p-2 rounded-lg hover:bg-white/10"
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold mb-4 text-lg text-white drop-shadow-sm">{t('footer.product')}</h3>
              <ul className="space-y-2">
                {[
                  { name: t('footer.templates'), href: `/${lang}/templates` },
                  { name: t('footer.categories'), href: `/${lang}/templates?category=all` },
                  { name: t('footer.newArrivals'), href: `/${lang}/templates?sort=newest` },
                  { name: t('footer.popular'), href: `/${lang}/templates?sort=popular` },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold mb-4 text-lg text-white drop-shadow-sm">{t('footer.company')}</h3>
              <ul className="space-y-2">
                {[
                  { name: t('footer.login'), href: `/${lang}/login` },
                  { name: t('footer.register'), href: `/${lang}/register` },
                  { name: t('footer.cart'), href: `/${lang}/cart` },
                  { name: t('footer.checkout'), href: `/${lang}/checkout` },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="flex items-center space-x-2 text-white/70">
                <span>&copy; {new Date().getFullYear()} CodeSkins. {t('footer.copyright')}</span>
                <span className="hidden sm:inline text-white/40">•</span>
                <span className="hidden sm:inline">{t('footer.madeWith')}</span>
                <IconHeart className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="hidden sm:inline">{t('footer.forDevelopers')}</span>
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap justify-center md:justify-end space-x-6">
                {[
                  { name: t('footer.terms'), href: '#' },
                  { name: t('footer.privacy'), href: '#' },
                ].map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors duration-300 text-sm hover:underline"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
} 