'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Service } from '@/types';
import {
  Fingerprint, CreditCard, BookOpen, Car, Baby, FileX, Heart,
  IndianRupee, MapPin, Users, ShoppingBasket, HeartPulse, HardHat,
  GraduationCap, Landmark, Map, Zap, Droplets, UserCheck, Vote,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Fingerprint, CreditCard, BookOpen, Car, Baby, FileX, Heart,
  IndianRupee, MapPin, Users, ShoppingBasket, HeartPulse, HardHat,
  GraduationCap, Landmark, Map, Zap, Droplets, UserCheck, Vote,
};

export default function ServiceCard({
  service,
  index = 0,
}: {
  service: Service;
  index?: number;
}) {
  const Icon = iconMap[service.icon] || Fingerprint;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/services/${service.id}`} className="block group h-full">
        <div className="glass-card p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Icon className="w-6 h-6 text-white" />
            </div>
            {service.featured && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                Popular
              </span>
            )}
          </div>

          {/* Content */}
          <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {service.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
            {service.description}
          </p>

          {/* Processing Time */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Clock className="w-3.5 h-3.5" />
            {service.processingTime}
          </div>

          {/* Fees */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Govt. Fee
              </p>
              <p className="text-sm font-bold">
                {service.governmentFee > 0
                  ? formatCurrency(service.governmentFee)
                  : 'Free'}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Service
              </p>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(service.serviceCharge)}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700/50">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
              Apply Now
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center group-hover:bg-blue-600 transition-all">
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
