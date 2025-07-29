'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  // Check if we're on the landing page, auth pages (login/register), or about page
  const isLandingPage = pathname === '/' || /^\/[a-z]{2}$/.test(pathname);
  const isAuthPage = /^\/[a-z]{2}\/(login|register)$/.test(pathname);
  const isAboutPage = /^\/[a-z]{2}\/about$/.test(pathname);
  
  // Don't show navbar on dashboard pages
  const isDashboardPage = /^\/[a-z]{2}\/dashboard/.test(pathname);
  
  if (isDashboardPage) {
    return null;
  }
  
  // Use transparent navbar for landing page, auth pages, and about page
  const isScrollable = isLandingPage || isAuthPage || isAboutPage;
  
  return <Navbar isScrollable={isScrollable} />;
} 