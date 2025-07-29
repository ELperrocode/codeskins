'use client';

import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { IconHome, IconArrowLeft, IconSearch } from '@tabler/icons-react';

export default function NotFound() {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">
                404
              </h1>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Page Not Found
              </h2>
              <p className="text-xl text-white/80 mb-6">
                Oops! The page you're looking for doesn't exist or has been moved.
              </p>
              <p className="text-lg text-white/60">
                Don't worry, you can find what you're looking for below.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-primary hover:bg-gradient-primary-hover text-white font-semibold px-8 py-4 text-lg"
                onClick={() => router.push(`/${lang}`)}
              >
                <IconHome className="w-5 h-5 mr-2" />
                Go Home
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg"
                onClick={() => router.push(`/${lang}/templates`)}
              >
                <IconSearch className="w-5 h-5 mr-2" />
                Browse Templates
              </Button>
            </div>

            {/* Helpful Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Templates</h3>
                <p className="text-white/60 text-sm mb-4">
                  Explore our collection of premium website templates
                </p>
                <Button
                  variant="ghost"
                  className="text-primary-400 hover:text-primary-300"
                  onClick={() => router.push(`/${lang}/templates`)}
                >
                  View Templates
                </Button>
              </div>

              <div className="p-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Account</h3>
                <p className="text-white/60 text-sm mb-4">
                  Access your dashboard and manage your account
                </p>
                <Button
                  variant="ghost"
                  className="text-primary-400 hover:text-primary-300"
                  onClick={() => router.push(`/${lang}/login`)}
                >
                  Sign In
                </Button>
              </div>

              <div className="p-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Support</h3>
                <p className="text-white/60 text-sm mb-4">
                  Need help? Contact our support team
                </p>
                <Button
                  variant="ghost"
                  className="text-primary-400 hover:text-primary-300"
                  onClick={() => router.push(`/${lang}`)}
                >
                  Contact Us
                </Button>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-8">
              <Button
                variant="ghost"
                className="text-white/60 hover:text-white"
                onClick={() => router.back()}
              >
                <IconArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 