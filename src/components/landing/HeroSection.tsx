'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  ArrowRight,
  FileCheck,
  Shield,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { searchServices } from '@/data/services';
import type { Service } from '@/types';

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Service[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length > 1) {
      setResults(searchServices(value).slice(0, 5));
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="floating-shapes">
        <div className="shape" />
        <div className="shape" />
        <div className="shape" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Trusted by 18,000+ Citizens
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Your Gateway to{' '}
              <span className="relative">
                <span className="relative z-10">Government</span>
                <motion.span
                  className="absolute bottom-2 left-0 right-0 h-3 bg-green-400/30 rounded"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.6 }}
                />
              </span>{' '}
              Services
            </h1>

            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-lg">
              Fast, secure, and hassle-free assistance for all government
              services. From Aadhaar to Passport — we handle the paperwork so
              you don&apos;t have to.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-lg mb-8">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => query.length > 1 && setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                  placeholder="Search for any service... (e.g. PAN Card, Passport)"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                />
              </div>

              {/* Search Results Dropdown */}
              {showResults && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                >
                  {results.map((service) => (
                    <Link
                      key={service.id}
                      href={`/services/${service.id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors text-slate-800 dark:text-slate-200"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{service.name}</p>
                        <p className="text-xs text-slate-500">
                          {service.processingTime} · ₹{service.serviceCharge}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 ml-auto text-slate-400" />
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                Explore Services
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/track"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-2xl hover:bg-white/20 hover:-translate-y-1 transition-all duration-300"
              >
                Track Application
              </Link>
            </div>
          </motion.div>

          {/* Right - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            {[
              {
                icon: Shield,
                title: 'Secure Process',
                desc: '256-bit encrypted document handling',
                color: 'from-blue-500 to-blue-600',
                delay: 0.4,
              },
              {
                icon: Clock,
                title: 'Fast Processing',
                desc: 'Most services completed in 3-7 days',
                color: 'from-purple-500 to-purple-600',
                delay: 0.5,
              },
              {
                icon: FileCheck,
                title: 'Expert Verification',
                desc: 'Every document verified before submission',
                color: 'from-green-500 to-green-600',
                delay: 0.6,
              },
              {
                icon: CheckCircle,
                title: '99% Success Rate',
                desc: 'Industry-leading approval rate',
                color: 'from-amber-500 to-amber-600',
                delay: 0.7,
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: card.delay, duration: 0.5 }}
                className="group p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 hover:-translate-y-2 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">{card.title}</h3>
                <p className="text-white/60 text-sm">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-[hsl(var(--background))]"
          />
        </svg>
      </div>
    </section>
  );
}
