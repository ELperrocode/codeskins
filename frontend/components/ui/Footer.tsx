'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { IconBrandGithub, IconBrandTwitter, IconBrandLinkedin, IconMail, IconHeart } from '@tabler/icons-react';
import { useTranslation } from '../../lib/hooks/useTranslation';

interface FooterProps {
  isTransparent?: boolean;
}

export default function Footer({ isTransparent = false }: FooterProps) {
  const params = useParams();
  const lang = params.lang as string;
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: t('navigation.templates'), href: `/${lang}/templates` },
      { name: t('navigation.about'), href: `/${lang}/about` },
    ],
    legal: [
      { name: t('footer.termsOfService'), href: '#' },
      { name: t('footer.privacyPolicy'), href: '#' },
    ],
  };

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com', icon: IconBrandGithub },
    { name: 'Twitter', href: 'https://twitter.com', icon: IconBrandTwitter },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: IconBrandLinkedin },
    { name: 'Email', href: 'mailto:contact@codeskins.com', icon: IconMail },
  ];

  return (
    <footer className={`transition-all duration-300 ${
      isTransparent 
        ? 'bg-transparent border-transparent' 
        : 'bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href={`/${lang}`} className="flex items-center space-x-2 mb-4 group">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className={`font-bold text-xl group-hover:text-primary-400 transition-colors duration-300 ${
                isTransparent ? 'text-white drop-shadow-lg' : 'text-gray-900'
              }`}>CodeSkins</span>
            </Link>
            <p className={`mb-6 max-w-md leading-relaxed ${
              isTransparent ? 'text-white/70' : 'text-gray-600'
            }`}>
              {t('footer.description')}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hover:text-primary-400 hover:scale-110 transition-all duration-300 p-2 rounded-lg ${
                    isTransparent 
                      ? 'text-white/60 hover:bg-white/10' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className={`font-semibold mb-4 text-lg ${
              isTransparent ? 'text-white drop-shadow-sm' : 'text-gray-900'
            }`}>{t('footer.links')}</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`hover:text-primary-400 transition-colors duration-300 hover:translate-x-1 inline-block ${
                      isTransparent ? 'text-white/70 hover:text-white' : 'text-gray-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`border-t pt-8 ${
          isTransparent ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className={`flex items-center space-x-2 ${
              isTransparent ? 'text-white/70' : 'text-gray-600'
            }`}>
              <span>&copy; {currentYear} CodeSkins. {t('footer.allRightsReserved')}</span>
              <span className={`hidden sm:inline ${
                isTransparent ? 'text-white/40' : 'text-gray-400'
              }`}>•</span>
              <span className="hidden sm:inline">{t('footer.madeWith')}</span>
              <IconHeart className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="hidden sm:inline">{t('footer.forDevelopers')}</span>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`hover:text-primary-400 transition-colors duration-300 text-sm hover:underline ${
                    isTransparent ? 'text-white/60 hover:text-white' : 'text-gray-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 