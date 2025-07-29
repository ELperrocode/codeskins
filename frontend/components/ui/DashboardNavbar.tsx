'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from './button';
import { 
  IconMenu2, 
  IconX, 
  IconBell
} from '@tabler/icons-react';
import { useAuth } from '../../lib/auth-context';

interface DashboardNavbarProps {
  onSidebarToggle: () => void;
  isSidebarOpen: boolean;
}

export default function DashboardNavbar({ onSidebarToggle, isSidebarOpen }: DashboardNavbarProps) {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      {/* Left side - Sidebar toggle and breadcrumb */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSidebarToggle}
          className="lg:hidden p-2"
        >
          {isSidebarOpen ? (
            <IconX className="w-5 h-5" />
          ) : (
            <IconMenu2 className="w-5 h-5" />
          )}
        </Button>
        
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold text-gray-900">
            {user?.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
          </h1>
        </div>
      </div>

                        {/* Right side - Actions */}
                  <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <Button variant="ghost" size="sm" className="relative p-2">
                      <IconBell className="w-5 h-5 text-gray-600" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                    </Button>
                  </div>
    </header>
  );
} 