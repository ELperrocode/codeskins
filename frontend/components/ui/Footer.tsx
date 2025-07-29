'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { IconBrandGithub, IconBrandTwitter, IconBrandLinkedin, IconMail, IconHeart } from '@tabler/icons-react';

export default function Footer() {
  const params = useParams();
  const lang = params.lang as string;

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Templates', href: `/${lang}/templates` },
      { name: 'Categories', href: `/${lang}/templates?category=all` },
      { name: 'New Arrivals', href: `/${lang}/templates?sort=newest` },
      { name: 'Popular', href: `/${lang}/templates?sort=popular` },
    ],
    company: [
      { name: 'Login', href: `/${lang}/login` },
      { name: 'Register', href: `/${lang}/register` },
    ],
    support: [
      { name: 'Cart', href: `/${lang}/cart` },
      { name: 'Checkout', href: `/${lang}/checkout` },
    ],
    legal: [
      { name: 'Terms of Service', href: '#' },
      { name: 'Privacy Policy', href: '#' },
    ],
  };

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com', icon: IconBrandGithub },
    { name: 'Twitter', href: 'https://twitter.com', icon: IconBrandTwitter },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: IconBrandLinkedin },
    { name: 'Email', href: 'mailto:contact@codeskins.com', icon: IconMail },
  ];

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href={`/${lang}`} className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-white font-bold text-xl">CodeSkins</span>
            </Link>
            <p className="text-white/60 mb-6 max-w-md">
              Premium website templates and components for modern web development. 
              Built with the latest technologies and designed for developers who care about quality.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors duration-200"
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
            <div className="flex items-center space-x-2 text-white/60">
              <span>&copy; {currentYear} CodeSkins. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Made with</span>
              <IconHeart className="w-4 h-4 text-red-500" />
              <span className="hidden sm:inline">for developers</span>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
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