'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  // Check if we're on the landing page (root path with language)
  const isLandingPage = pathname === '/' || /^\/[a-z]{2}$/.test(pathname);
  
  return <Navbar isScrollable={isLandingPage} />;
} 