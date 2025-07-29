'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { IconRocket, IconCode, IconPalette, IconUsers, IconStar, IconDownload, IconBrandGithub, IconBrandTwitter, IconBrandLinkedin, IconMail } from '@tabler/icons-react';
import { useTranslation } from '../../../lib/hooks/useTranslation';
import { getReviews } from '../../../lib/api';


export default function AboutPage() {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      setLoadingTestimonials(true);
      try {
        const response = await getReviews('all', { limit: 8 });
        if (response.success && response.data?.reviews) {
          setTestimonials(response.data.reviews);
        }
      } catch (error) {
        setTestimonials([]);
      } finally {
        setLoadingTestimonials(false);
      }
    }
    fetchTestimonials();
  }, []);

  const features = [
    {
      icon: <IconCode className="w-8 h-8" />,
      title: t('about.features.modernDevelopment.title'),
      description: t('about.features.modernDevelopment.description')
    },
    {
      icon: <IconPalette className="w-8 h-8" />,
      title: t('about.features.beautifulDesign.title'),
      description: t('about.features.beautifulDesign.description')
    },
    {
      icon: <IconRocket className="w-8 h-8" />,
      title: t('about.features.fastResponsive.title'),
      description: t('about.features.fastResponsive.description')
    },
    {
      icon: <IconUsers className="w-8 h-8" />,
      title: t('about.features.communityDriven.title'),
      description: t('about.features.communityDriven.description')
    }
  ];

  const stats = [
    { number: "100+", label: t('about.stats.templates') },
    { number: "50K+", label: t('about.stats.downloads') },
    { number: "4.9", label: t('about.stats.rating') },
    { number: "24/7", label: t('about.stats.support') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-20">
        <div className="max-w-7xl relative mx-auto py-20 md:py-32 px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('about.hero.title')} <br />
              <span className="bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">
                {t('about.hero.subtitle')}
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-white/80 mb-10">
              {t('about.hero.description')}
            </p>
          </motion.div>
        </div>
      </section>

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
              {t('about.features.title')}
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {t('about.features.subtitle')}
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
                    <p className="text-white/80 text-center">{feature.description}</p>
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
              {t('about.testimonials.title')}
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {t('about.testimonials.subtitle')}
            </p>
          </motion.div>
          <div className="relative">
            <div className="flex flex-wrap justify-center gap-6">
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

      {/* Mission Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              {t('about.mission.title')}
            </h2>
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              {t('about.mission.description1')}
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              {t('about.mission.description2')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              {t('about.contact.title')}
            </h2>
            <p className="text-lg text-white/80 mb-8">
              {t('about.contact.description')}
            </p>
            <div className="flex justify-center space-x-6">
              <a href="mailto:contact@codeskins.com" className="text-white/80 hover:text-primary-300 transition-colors">
                <IconMail className="w-6 h-6" />
              </a>
              <a href="https://github.com/codeskins" className="text-white/80 hover:text-primary-300 transition-colors">
                <IconBrandGithub className="w-6 h-6" />
              </a>
              <a href="https://twitter.com/codeskins" className="text-white/80 hover:text-primary-300 transition-colors">
                <IconBrandTwitter className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com/company/codeskins" className="text-white/80 hover:text-primary-300 transition-colors">
                <IconBrandLinkedin className="w-6 h-6" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}