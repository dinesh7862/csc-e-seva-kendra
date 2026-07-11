'use client';

import { useEffect } from 'react';

/** Client component to register the PWA service worker */
export default function PWARegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('E Seva Kendra SW registered: ', reg.scope);
          })
          .catch((err) => {
            console.error('E Seva Kendra SW registration failed: ', err);
          });
      });
    }
  }, []);

  return null;
}
