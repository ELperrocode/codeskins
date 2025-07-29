'use client';

import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { HeroParallax } from '../../components/ui/hero-parallax';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { IconRocket, IconCode, IconPalette, IconUsers, IconStar, IconDownload } from '@tabler/icons-react';

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
  maxDownloads: number;
  isActive: boolean;
}

export default function HomePage() {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  
  const [licenses, setLicenses] = useState<License[]>([]);
  const [licensesLoading, setLicensesLoading] = useState(true);
  
  // Sample products for Hero Parallax with real images from Unsplash
  const products = [
    {
      title: "Photography Studio",
      link: `/${lang}/templates/687aeffc41ae1f1165071489`,
      thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop&crop=center"
    },
    {
      title: "Blog & Magazine",
      link: `/${lang}/templates/687aeffc41ae1f1165071486`,
      thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&crop=center"
    },
    {
      title: "Startup Landing Page",
      link: `/${lang}/templates/687aeffc41ae1f1165071483`,
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=center"
    },
    {
      title: "Creative Agency",
      link: `/${lang}/templates/687aeffc41ae1f1165071480`,
      thumbnail: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop&crop=center"
    },
    {
      title: "Restaurant & Food",
      link: `/${lang}/templates/687aeffc41ae1f116507147d`,
      thumbnail: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&crop=center"
    },
    {
      title: "Corporate Business",
      link: `/${lang}/templates/687aeffc41ae1f116507147a`,
      thumbnail: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop&crop=center"
    },
    {
      title: "Portfolio Showcase",
      link: `/${lang}/templates/687aeffc41ae1f1165071477`,
      thumbnail: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop&crop=center"
    },
    {
      title: "E-commerce Store",
      link: `/${lang}/templates/687aeffc41ae1f1165071474`,
      thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&crop=center"
    },
    {
      title: "Personal Blog",
      link: `/${lang}/templates/687aeffc41ae1f1165071471`,
      thumbnail: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=400&fit=crop&crop=center"
    },
    {
      title: "Tech Startup",
      link: `/${lang}/templates/687aeffc41ae1f116507146e`,
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop&crop=center"
    },
    {
      title: "Design Agency",
      link: `/${lang}/templates/687aeffc41ae1f116507146b`,
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center"
    },
    {
      title: "Fitness & Health",
      link: `/${lang}/templates/687aeffc41ae1f1165071468`,
      thumbnail: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop&crop=center"
    },
    {
      title: "Education Platform",
      link: `/${lang}/templates/687aeffc41ae1f1165071465`,
      thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=center"
    },
    {
      title: "Real Estate",
      link: `/${lang}/templates/687aeffc41ae1f1165071462`,
      thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop&crop=center"
    },
    {
      title: "Travel & Tourism",
      link: `/${lang}/templates/687aeffc41ae1f116507145f`,
      thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&crop=center"
    }
  ];
  
  const features = [
    {
      icon: <IconCode className="w-8 h-8" />,
      title: "Premium Templates",
      description: "High-quality, responsive website templates for every industry"
    },
    {
      icon: <IconPalette className="w-8 h-8" />,
      title: "Customizable Design",
      description: "Easy to customize with modern design tools and frameworks"
    },
    {
      icon: <IconRocket className="w-8 h-8" />,
      title: "Fast Development",
      description: "Get your website up and running in minutes, not hours"
    },
    {
      icon: <IconUsers className="w-8 h-8" />,
      title: "Community Support",
      description: "Join our community of developers and designers"
    }
  ];

  const stats = [
    { number: "500+", label: "Templates" },
    { number: "10K+", label: "Downloads" },
    { number: "5K+", label: "Happy Customers" },
    { number: "4.9", label: "Rating" }
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      
      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-20">
        <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6">
              Build Amazing <br />
              <span className="bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">
                Websites
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/80 mb-10">
              Premium website templates for developers, designers, and businesses. 
              Start building your next project with our professional templates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-primary hover:bg-gradient-primary-hover text-white font-semibold px-8 py-4 text-lg"
                onClick={() => router.push(`/${lang}/templates`)}
              >
                Browse Templates
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg"
                onClick={() => router.push(`/${lang}/templates`)}
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

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
              Why Choose CodeSkins?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              We provide everything you need to create stunning websites quickly and efficiently.
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
              What Our Customers Say
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Join thousands of satisfied developers and designers who trust CodeSkins.
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
              Available Licenses
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Choose the license type that best fits your project needs and usage requirements.
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
                // Generate features based on license data
                const features = [
                  license.maxDownloads === -1 ? "Unlimited downloads" : 
                  license.maxDownloads === 1 ? "1 download" : 
                  `${license.maxDownloads} downloads`,
                  
                  license.name.includes('Extended') || license.name.includes('Developer') || license.name.includes('Premium') ? "Commercial use" : "Personal use",
                  
                  license.name.includes('Developer') ? "Client projects" : 
                  license.name.includes('Extended') || license.name.includes('Premium') ? "Multiple projects" : "Single project",
                  
                  license.name.includes('Developer') ? "Agency work" : 
                  license.name.includes('Extended') || license.name.includes('Premium') ? "Resale rights" : "Personal portfolio",
                  
                  license.name.includes('Developer') ? "White-label rights" : 
                  license.name.includes('Extended') || license.name.includes('Premium') ? "Priority support" : "Basic support",
                  
                  license.name.includes('Developer') ? "Dedicated support" : 
                  license.name.includes('Extended') || license.name.includes('Premium') ? "Lifetime updates" : "1 year updates"
                ].filter(Boolean);

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
                            Most Popular
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
                            {license.maxDownloads === -1 ? 'Unlimited' : `${license.maxDownloads} Downloads`}
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
                          Browse Templates
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              // Fallback if no licenses
              <div className="col-span-3 text-center text-white/60">
                <p>No licenses available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

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
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Everything you need to know about CodeSkins templates.
            </p>
          </motion.div>
          
          <div className="space-y-4">
            {[
              {
                question: "What's included with each template?",
                answer: "Each template includes the complete source code, documentation, responsive design, and lifetime updates. You also get commercial usage rights and basic support."
              },
              {
                question: "Can I customize the templates?",
                answer: "Absolutely! All templates are fully customizable. You can modify colors, fonts, layouts, and add your own content. The code is clean and well-commented for easy customization."
              },
              {
                question: "Do you offer refunds?",
                answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with your purchase, simply contact us and we'll process your refund."
              },
              {
                question: "What technologies do you use?",
                answer: "Our templates use modern technologies like React, Next.js, Tailwind CSS, and TypeScript. They're built with best practices and are production-ready."
              },
              {
                question: "Is there a limit on downloads?",
                answer: "With the Pro plan, you get unlimited downloads. The Starter plan includes one template download, and Enterprise plans include unlimited access for your entire team."
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
              Ready to Start Building?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of developers who trust CodeSkins for their website templates.
            </p>
            <Button
              size="lg"
              className="bg-gradient-primary hover:bg-gradient-primary-hover text-white font-semibold px-8 py-4 text-lg"
              onClick={() => router.push(`/${lang}/templates`)}
            >
              <IconRocket className="w-5 h-5 mr-2" />
              Get Started Today
            </Button>
          </motion.div>
        </div>
      </section>

    </div>
  );
} 