'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import { cn } from '../../lib/utils';
import { useParams, usePathname } from 'next/navigation';
import { 
  IconTemplate, 
  IconShoppingCart, 
  IconUsers, 
  IconTrendingUp, 
  IconFilter, 
  IconPalette,
  IconFileText,
  IconUser,
  IconHeart,
  IconDashboard,
  IconPackage,
  IconChartBar,
  IconHome
} from '@tabler/icons-react';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const { user } = useAuth();
  const params = useParams();
  const pathname = usePathname();
  const lang = params.lang as string;

  // Determinar panel según rol
  const getNavItems = () => {
    if (user?.role === 'admin') {
      return [
        { 
          href: `/${lang}/dashboard/admin`, 
          label: 'Overview', 
          icon: IconDashboard,
          exact: true
        },
        { 
          href: `/${lang}/dashboard/admin/templates`, 
          label: 'Templates', 
          icon: IconTemplate
        },
        { 
          href: `/${lang}/dashboard/admin/categories`, 
          label: 'Categories', 
          icon: IconFilter
        },
        { 
          href: `/${lang}/dashboard/admin/tags`, 
          label: 'Tags', 
          icon: IconPalette
        },
        { 
          href: `/${lang}/dashboard/admin/orders`, 
          label: 'Orders', 
          icon: IconShoppingCart
        },
        { 
          href: `/${lang}/dashboard/admin/users`, 
          label: 'Users', 
          icon: IconUsers
        },
        { 
          href: `/${lang}/dashboard/admin/analytics`, 
          label: 'Analytics', 
          icon: IconChartBar
        },
        { 
          href: `/${lang}/dashboard/admin/licenses`, 
          label: 'Licenses', 
          icon: IconFileText
        }
      ];
    } else if (user?.role === 'customer') {
      return [
        { 
          href: `/${lang}/dashboard/customer`, 
          label: 'Overview', 
          icon: IconDashboard,
          exact: true
        },
        { 
          href: `/${lang}/dashboard/customer/purchases`, 
          label: 'My Purchases', 
          icon: IconPackage
        },
        { 
          href: `/${lang}/dashboard/customer/favorites`, 
          label: 'Favorites', 
          icon: IconHeart
        }
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  const isActiveLink = (href: string, exact: boolean = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-20 flex items-center justify-center border-b border-gray-200 bg-gradient-to-r from-yellow-400 to-yellow-500">
            <Link href={`/${lang}`} className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-yellow-600 font-bold text-xl">C</span>
              </div>
              <div className="text-white">
                <h1 className="font-bold text-xl">CodeSkins</h1>
                <p className="text-xs text-yellow-100">Dashboard</p>
              </div>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <IconUser className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role} • Active
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                {user?.role === 'admin' ? 'Admin Panel' : 'My Account'}
              </h3>
            </div>
            
            {navItems.map((item) => {
              const isActive = isActiveLink(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    // Close sidebar on mobile when clicking a link
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                    isActive 
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-all duration-200",
                    isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                  )} />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="absolute right-2 w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <Link
              href={`/${lang}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group"
            >
              <IconHome className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
              <span>Back to Site</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
} 