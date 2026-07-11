'use client';

import { motion } from 'framer-motion';
import {
  Zap, Shield, HeadphonesIcon, Clock, FileCheck, BadgeCheck,
  CreditCard, RefreshCw,
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Fast Processing',
    description: 'Most services processed within 3-7 working days. Expedited options available.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Shield,
    title: '100% Secure',
    description: 'Your documents are encrypted with bank-grade security. We never share your data.',
    color: 'from-blue-500 to-blue-700',
  },
  {
    icon: HeadphonesIcon,
    title: 'Expert Support',
    description: 'Dedicated support team available 6 days a week to help with any queries.',
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: Clock,
    title: 'Real-time Tracking',
    description: 'Track your application status in real-time with our transparent tracking system.',
    color: 'from-purple-500 to-purple-700',
  },
  {
    icon: FileCheck,
    title: 'Document Verification',
    description: 'Every document is verified by experts before submission to avoid rejections.',
    color: 'from-rose-500 to-pink-600',
  },
  {
    icon: BadgeCheck,
    title: '99% Approval Rate',
    description: 'Our expert preparation ensures highest approval rates for all applications.',
    color: 'from-cyan-500 to-teal-600',
  },
  {
    icon: CreditCard,
    title: 'Easy Payments',
    description: 'Multiple payment options including UPI, cards, and net banking.',
    color: 'from-indigo-500 to-violet-600',
  },
  {
    icon: RefreshCw,
    title: 'Free Resubmission',
    description: 'If your application is rejected due to our error, we resubmit for free.',
    color: 'from-emerald-500 to-green-700',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-gradient-mesh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-semibold mb-4">
            Our Advantages
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Choose <span className="text-gradient">E Seva Kendra</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We combine technology with expertise to deliver the best service experience
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="glass-card p-6 text-center group"
            >
              <div
                className={`w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
