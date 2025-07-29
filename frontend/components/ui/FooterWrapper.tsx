'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterWrapper() {
  const pathname = usePathname();
  
  // Check if we're on auth pages (login/register) - don't show footer
  const isAuthPage = /^\/[a-z]{2}\/(login|register)$/.test(pathname);
  
  // Don't show footer on dashboard pages
  const isDashboardPage = /^\/[a-z]{2}\/dashboard/.test(pathname);
  
  // Don't render footer on auth pages, landing page, or dashboard pages
  if (isAuthPage || pathname === '/' || /^\/[a-z]{2}$/.test(pathname) || isDashboardPage) {
    return null;
  }
  
  // Use solid footer for other pages
  return <Footer isTransparent={false} />;
} 