'use client';

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Clock, IndianRupee, FileText,
  CheckCircle, AlertCircle, FileCheck, Users, Shield,
  Fingerprint, CreditCard, BookOpen, Car, Baby, FileX, Heart,
  MapPin, ShoppingBasket, HeartPulse, HardHat, GraduationCap,
  Landmark, Map, Zap, Droplets, UserCheck, Vote,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { formatCurrency } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Fingerprint, CreditCard, BookOpen, Car, Baby, FileX, Heart,
  IndianRupee, MapPin, Users, ShoppingBasket, HeartPulse, HardHat,
  GraduationCap, Landmark, Map, Zap, Droplets, UserCheck, Vote,
};

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { services } = useAppStore();
  const service = services.find((s) => s.id === id);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground opacity-30 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Service Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The service you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/services" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const Icon = iconMap[service.icon] || FileText;
  const totalFee = service.governmentFee + service.serviceCharge;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative bg-gradient-hero text-white py-16 overflow-hidden">
        <div className="floating-shapes">
          <div className="shape" />
          <div className="shape" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-5"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                {service.name}
              </h1>
              <p className="text-white/80 max-w-2xl">
                {service.description}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {service.longDescription && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  About this Service
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {service.longDescription}
                </p>
              </motion.div>
            )}

            {/* Eligibility */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Eligibility Criteria
              </h2>
              <ul className="space-y-3">
                {service.eligibility.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Required Documents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-purple-600" />
                Required Documents
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {service.requiredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        doc.required
                          ? 'bg-red-100 dark:bg-red-900/30'
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    >
                      <FileText
                        className={`w-4 h-4 ${
                          doc.required
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-slate-500'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {doc.name}
                        {doc.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </p>
                      {doc.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {doc.description}
                        </p>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {doc.acceptedFormats.map((f) => f.toUpperCase()).join(', ')} · Max {doc.maxSizeMB}MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Form Fields Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Application Form Fields
              </h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {service.formFields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                  >
                    <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="text-sm">{field.label}</span>
                    {field.required && (
                      <span className="text-red-500 text-xs">*</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card p-6 sticky top-24"
            >
              <h3 className="text-lg font-bold mb-4">Fee Details</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Government Fee</span>
                  <span className="font-semibold">
                    {service.governmentFee > 0
                      ? formatCurrency(service.governmentFee)
                      : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Service Charge</span>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(service.serviceCharge)}
                  </span>
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-700" />
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-bold text-gradient">
                    {formatCurrency(totalFee)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Clock className="w-4 h-4" />
                Processing: {service.processingTime}
              </div>

              <Link
                href={`/apply/${service.id}`}
                className="btn-primary w-full flex items-center justify-center gap-2 !py-4 text-base"
              >
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </Link>

              <p className="text-[10px] text-center text-muted-foreground mt-3">
                By applying, you agree to our terms and service charges.
              </p>
            </motion.div>

            {/* Processing Info */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-4">How it Works</h3>
              <div className="space-y-4">
                {[
                  { step: '1', text: 'Fill the application form' },
                  { step: '2', text: 'Upload required documents' },
                  { step: '3', text: 'Pay the applicable fees' },
                  { step: '4', text: 'We verify & submit to department' },
                  { step: '5', text: 'Track status in real-time' },
                  { step: '6', text: 'Receive your document' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {item.step}
                    </div>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
