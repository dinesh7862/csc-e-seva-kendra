'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { FAQItem } from '@/types';

const faqs: FAQItem[] = [
  {
    id: '1',
    question: 'Is E Seva Kendra an official government website?',
    answer:
      'No, E Seva Kendra is NOT an official government website. We are a private service portal that helps citizens prepare and submit applications for various government services. We charge a nominal service fee for our assistance, which is separate from any government fees.',
  },
  {
    id: '2',
    question: 'How does the application process work?',
    answer:
      'Simply select a service, fill out the required form, upload necessary documents, and pay the applicable fees. Our team verifies your documents, prepares your application, and submits it to the relevant government department. You can track the status of your application in real-time.',
  },
  {
    id: '3',
    question: 'What documents do I need to upload?',
    answer:
      'Required documents vary by service. When you select a service, the portal automatically displays all required documents with specific format requirements. Common documents include Aadhaar Card, passport-size photo, and address proof. All documents should be in PDF, JPG, or PNG format and under 10MB.',
  },
  {
    id: '4',
    question: 'How long does processing take?',
    answer:
      'Processing times vary by service. Most identity documents take 5-15 working days, certificates take 7-30 working days, and welfare services may take 15-60 working days. You can see exact processing times on each service page. These are estimates and actual times depend on the government department.',
  },
  {
    id: '5',
    question: 'What are the fees involved?',
    answer:
      'There are two types of fees: (1) Government Fee — the official fee charged by the government department, and (2) Service Charge — our fee for document preparation, verification, and submission assistance. Both fees are clearly displayed before you submit your application.',
  },
  {
    id: '6',
    question: 'How can I track my application?',
    answer:
      'You can track your application using your unique Application Number (e.g., ESK202600001) or your registered mobile number. Go to the "Track Application" page, enter your details, and view your complete application timeline with real-time status updates.',
  },
  {
    id: '7',
    question: 'What if my application is rejected?',
    answer:
      'If your application is rejected due to our error in document preparation, we will resubmit it free of charge. If the rejection is due to incorrect information provided by you or government policy, we will guide you on next steps. Our 99% approval rate speaks to our quality of service.',
  },
  {
    id: '8',
    question: 'Is my data safe and secure?',
    answer:
      'Yes, your data security is our top priority. We use bank-grade 256-bit encryption for all data transmission and storage. Your documents are stored securely and are never shared with third parties. We comply with all data protection regulations.',
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>('1');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 bg-gradient-mesh">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-sm font-semibold mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Got questions? We&apos;ve got answers. Find everything you need to know here.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => toggle(faq.id)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-semibold pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                    openId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-slate-200 dark:border-slate-700/50 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
