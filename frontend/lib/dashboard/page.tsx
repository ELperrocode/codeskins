'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-secondary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary">
            Welcome back, {user.email}!
          </h1>
          <p className="text-secondary/70 mt-2">
            Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </p>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.role === 'customer' ? (
            // Customer Dashboard
            <>
              <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4">
                  My Purchases
                </h3>
                <p className="text-secondary/70 mb-4">
                  View and download your purchased templates.
                </p>
                <Link
                  href="/purchases"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  View Purchases
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4">
                  Browse Templates
                </h3>
                <p className="text-secondary/70 mb-4">
                  Discover new templates to purchase.
                </p>
                <Link
                  href="/templates"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Browse Templates
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4">
                  Account Settings
                </h3>
                <p className="text-secondary/70 mb-4">
                  Manage your account and preferences.
                </p>
                <Link
                  href="/settings"
                  className="inline-flex items-center px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10"
                >
                  Settings
                </Link>
              </div>
            </>
          ) : user.role === 'seller' ? (
            // Seller Dashboard
            <>
              <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4">
                  My Templates
                </h3>
                <p className="text-secondary/70 mb-4">
                  Manage your uploaded templates.
                </p>
                <Link
                  href="/templates/manage"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Manage Templates
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4">
                  Sales Analytics
                </h3>
                <p className="text-secondary/70 mb-4">
                  View your sales and earnings.
                </p>
                <Link
                  href="/analytics"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  View Analytics
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4">
                  Upload Template
                </h3>
                <p className="text-secondary/70 mb-4">
                  Upload a new template to sell.
                </p>
                <Link
                  href="/templates/upload"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Upload Template
                </Link>
              </div>
            </>
          ) : (
            // Admin Dashboard
            <>
              <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4">
                  User Management
                </h3>
                <p className="text-secondary/70 mb-4">
                  Manage users and their roles.
                </p>
                <Link
                  href="/admin/users"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Manage Users
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4">
                  Template Moderation
                </h3>
                <p className="text-secondary/70 mb-4">
                  Review and approve templates.
                </p>
                <Link
                  href="/admin/templates"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Moderate Templates
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4">
                  Platform Analytics
                </h3>
                <p className="text-secondary/70 mb-4">
                  View platform-wide statistics.
                </p>
                <Link
                  href="/admin/analytics"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  View Analytics
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-secondary text-secondary rounded-md hover:bg-secondary/10"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 