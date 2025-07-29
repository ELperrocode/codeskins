'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';
import { useDictionary } from '../../../lib/hooks/useDictionary';
import { cn } from '../../../lib/utils';
import { useParams, usePathname } from 'next/navigation';
import { 
  IconTemplate, 
  IconShoppingCart, 
  IconUsers, 
  IconTrendingUp, 
  IconFilter, 
  IconPalette,
  IconFileText,
  IconSettings,
  IconUser,
  IconHeart,
  IconDownload
} from '@tabler/icons-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { t } = useDictionary();
  const params = useParams();
  const pathname = usePathname();
  const lang = params.lang as string;

  // Determinar panel según rol
  const getNavItems = () => {
    if (user?.role === 'admin') {
      return [
        { 
          href: `/${lang}/dashboard/admin`, 
          label: t.dashboard.admin.title, 
          icon: IconSettings,
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
          icon: IconTrendingUp
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
          label: t.dashboard.customer.title, 
          icon: IconUser,
          exact: true
        },
        { 
          href: `/${lang}/dashboard/customer/purchases`, 
          label: 'My Purchases', 
          icon: IconShoppingCart
        },
        { 
          href: `/${lang}/dashboard/customer/downloads`, 
          label: 'Downloads', 
          icon: IconDownload
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
    <div className="min-h-screen flex bg-gradient-to-br from-primary/10 to-secondary/5">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col bg-white border-r shadow-sm">
        <div className="h-20 flex items-center justify-center font-bold text-2xl text-yellow-500 border-b">
          CodeSkins
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = isActiveLink(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2 rounded-lg text-lg font-medium transition',
                  isActive 
                    ? 'bg-yellow-100 text-yellow-700 border-r-2 border-yellow-500' 
                    : 'hover:bg-yellow-50 text-gray-700 hover:text-yellow-600'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1 min-h-screen p-4 md:p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
} 