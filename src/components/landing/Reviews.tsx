'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import type { Review } from '@/types';

const reviews: Review[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    rating: 5,
    comment: 'Got my PAN card within 7 days! The process was smooth and the team was very helpful. Highly recommended for anyone who needs quick government services.',
    service: 'PAN Card',
    date: '2026-06-15',
    location: 'Delhi',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    rating: 5,
    comment: 'Excellent service! Applied for my passport through E Seva Kendra and it was approved without any hassle. Their document verification saved me from multiple visits.',
    service: 'Passport',
    date: '2026-06-10',
    location: 'Mumbai',
  },
  {
    id: '3',
    name: 'Amit Patel',
    rating: 4,
    comment: 'Very professional service. My income certificate was ready in just 5 days. The tracking system is fantastic — I could see every step of the process.',
    service: 'Income Certificate',
    date: '2026-05-28',
    location: 'Ahmedabad',
  },
  {
    id: '4',
    name: 'Sunita Devi',
    rating: 5,
    comment: 'I was struggling with my Aadhaar update for months. E Seva Kendra handled everything in one visit. The staff is very patient and knowledgeable.',
    service: 'Aadhaar Card',
    date: '2026-06-01',
    location: 'Jaipur',
  },
  {
    id: '5',
    name: 'Mohammed Irfan',
    rating: 5,
    comment: 'Applied for driving licence renewal and got it within 10 days. The online tracking was a great feature. Will definitely use again for other services.',
    service: 'Driving Licence',
    date: '2026-05-20',
    location: 'Hyderabad',
  },
  {
    id: '6',
    name: 'Lakshmi Nair',
    rating: 4,
    comment: 'Got my marriage certificate done through them. The team guided us through all the requirements and made the process very simple. Thank you!',
    service: 'Marriage Certificate',
    date: '2026-05-15',
    location: 'Kochi',
  },
];

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  const next = () => setCurrentIndex((prev) => (prev + 1) % totalPages);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);

  const visibleReviews = reviews.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-semibold mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            What Our <span className="text-gradient">Citizens Say</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real feedback from real people who used our services
          </p>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {visibleReviews.map((review) => (
                <div key={review.id} className="glass-card p-6 flex flex-col">
                  <Quote className="w-8 h-8 text-blue-200 dark:text-blue-800 mb-3" />
                  <p className="text-sm leading-relaxed mb-5 flex-1">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{review.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {review.service} · {review.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Previous reviews"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === currentIndex
                        ? 'bg-blue-600 w-8'
                        : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Next reviews"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
