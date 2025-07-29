'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from './button';
import { IconMenu2, IconX, IconShoppingCart, IconUser } from '@tabler/icons-react';
import { useAuth } from '../../lib/auth-context';
import { useCart } from '../../lib/cart-context';
import { useTranslation } from '../../lib/hooks/useTranslation';

interface NavbarProps {
  isScrollable?: boolean;
}

export default function Navbar({ isScrollable = false }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { t } = useTranslation();

  // Handle scroll effect only if isScrollable is true
  useEffect(() => {
    if (!isScrollable) return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrollable]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeMenu();
    router.push(`/${lang}`);
  };

  const navigation = [
    { name: t('navigation.templates'), href: `/${lang}/templates` },
    { name: t('navigation.about'), href: `/${lang}/about` },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
      isScrollable && isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg' 
        : isScrollable 
        ? 'bg-transparent' 
        : 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className={`font-bold text-xl transition-colors ${
              isScrollable && isScrolled 
                ? 'text-gray-900' 
                : isScrollable 
                ? 'text-white drop-shadow-lg' 
                : 'text-gray-900'
            }`}>CodeSkins</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors duration-200 font-medium ${
                  isScrollable && isScrolled 
                    ? 'text-gray-700 hover:text-gray-900' 
                    : isScrollable 
                    ? 'text-white/90 hover:text-white drop-shadow-sm' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            <Link href={`/${lang}/cart`} className="relative">
              <IconShoppingCart className={`w-6 h-6 transition-colors ${
                isScrollable && isScrolled 
                  ? 'text-gray-700 hover:text-gray-900' 
                  : isScrollable 
                  ? 'text-white/90 hover:text-white drop-shadow-sm' 
                  : 'text-gray-700 hover:text-gray-900'
              }`} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href={user.role === 'admin' ? `/${lang}/dashboard/admin` : `/${lang}/dashboard/customer`}>
                  <Button variant="ghost" className={`${
                    isScrollable && isScrolled 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : isScrollable 
                      ? 'text-white hover:bg-white/10' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}>
                    <IconUser className="w-5 h-5 mr-2" />
                    {user.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className={`${
                    isScrollable && isScrolled 
                      ? 'border-gray-300 text-gray-700 hover:bg-gray-50' 
                      : isScrollable 
                      ? 'border-white/20 text-white hover:bg-white/10' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href={`/${lang}/login`}>
                  <Button variant="ghost" className={`${
                    isScrollable && isScrolled 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : isScrollable 
                      ? 'text-white hover:bg-white/10' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}>
                    Sign In
                  </Button>
                </Link>
                <Link href={`/${lang}/register`}>
                  <Button className="bg-primary-500 hover:bg-primary-600 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`transition-colors ${
                isScrollable && isScrolled 
                  ? 'text-gray-700 hover:text-gray-900' 
                  : isScrollable 
                  ? 'text-white hover:text-white/80 drop-shadow-sm' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <IconX className="w-6 h-6" />
              ) : (
                <IconMenu2 className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={closeMenu}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Cart */}
              <Link
                href={`/${lang}/cart`}
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                onClick={closeMenu}
              >
                <div className="flex items-center justify-between">
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* Mobile User Actions */}
              {user ? (
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <Link
                    href={user.role === 'admin' ? `/${lang}/dashboard/admin` : `/${lang}/dashboard/customer`}
                    className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={closeMenu}
                  >
                    {user.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <Link
                    href={`/${lang}/login`}
                    className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={closeMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    href={`/${lang}/register`}
                    className="block px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors"
                    onClick={closeMenu}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 