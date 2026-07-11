'use client';

import { AlertTriangle } from 'lucide-react';
import { DISCLAIMER_TEXT, DISCLAIMER_SHORT } from '@/lib/constants';

interface DisclaimerProps {
  variant?: 'full' | 'short' | 'banner';
}

export default function Disclaimer({ variant = 'short' }: DisclaimerProps) {
  if (variant === 'banner') {
    return (
      <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{DISCLAIMER_SHORT}</span>
        </div>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className="disclaimer-banner flex items-start gap-3 p-4">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm leading-relaxed">{DISCLAIMER_TEXT}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
      <span>{DISCLAIMER_SHORT}</span>
    </div>
  );
}
