'use client';

import Link from 'next/link';
import { Shield, Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import { APP_NAME, FOOTER_LINKS, CONTACT_INFO } from '@/lib/constants';
import Disclaimer from '@/components/shared/Disclaimer';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20">
      {/* Gradient Top Border */}
      <div className="h-1 bg-gradient-primary" />

      <div className="bg-slate-900 dark:bg-slate-950 text-slate-300">
        {/* Main Footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{APP_NAME}</h3>
                  <p className="text-[10px] text-slate-400 -mt-0.5">
                    Digital Service Portal
                  </p>
                </div>
              </Link>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-sm">
                Your trusted partner for government service assistance. We make
                complex processes simple, fast, and stress-free.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center gap-3 text-sm hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-blue-400" />
                  {CONTACT_INFO.email}
                </a>
                {CONTACT_INFO.personalEmail && (
                  <a
                    href={`mailto:${CONTACT_INFO.personalEmail}`}
                    className="flex items-center gap-3 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4 text-purple-400" />
                    {CONTACT_INFO.personalEmail}
                  </a>
                )}
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="flex items-center gap-3 text-sm hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-green-400" />
                  {CONTACT_INFO.phone}
                </a>
                <p className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{CONTACT_INFO.address}</span>
                </p>
                <p className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-amber-400" />
                  {CONTACT_INFO.hours}
                </p>
              </div>
            </div>

            {/* Popular Services */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Popular Services
              </h4>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.services.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-1 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Certificates */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Certificates
              </h4>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.certificates.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-1 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company & Support */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-1 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <h4 className="text-white font-semibold mb-4 mt-8 text-sm uppercase tracking-wider">
                Support
              </h4>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.support.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-1 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <p className="text-sm text-slate-500">
                  © {currentYear} {APP_NAME}. All rights reserved.
                </p>
                <Disclaimer variant="short" />
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms
                </Link>
                <Link href="/refund" className="hover:text-white transition-colors">
                  Refund
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
