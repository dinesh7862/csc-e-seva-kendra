'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Fingerprint, Plane, Award, Heart, Home, Zap } from 'lucide-react';
import { categories } from '@/data/categories';

const iconMap: Record<string, React.ElementType> = {
  Fingerprint, Plane, Award, Heart, Home, Zap,
};

export default function Categories() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-semibold mb-4">
            Browse by Category
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Service <span className="text-gradient">Categories</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the right service quickly by browsing through our organized categories
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => {
            const Icon = iconMap[cat.icon] || Award;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link href={`/services?category=${cat.id}`} className="block group">
                  <div className="glass-card p-6 flex items-start gap-5">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {cat.name}
                        </h3>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {cat.description}
                      </p>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {cat.serviceCount} Services
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
