'use client';

import { motion } from 'framer-motion';

interface TemplateHeaderProps {
  lang: string;
}

export function TemplateHeader({ lang }: TemplateHeaderProps) {
  return (
    <section className="pt-32 pb-12 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Premium Website Templates
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover high-quality, responsive website templates for every industry. 
            Built with modern technologies and designed for developers who care about quality.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span>✓ Responsive Design</span>
            <span>✓ Modern Technologies</span>
            <span>✓ Well Documented</span>
            <span>✓ Production Ready</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 