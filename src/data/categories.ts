// ============================================================
// E Seva Kendra — Service Categories
// ============================================================

import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'identity',
    name: 'Identity Documents',
    icon: 'Fingerprint',
    description: 'Aadhaar, PAN Card, Voter ID, and other identity proofs',
    color: 'from-blue-500 to-blue-700',
    serviceCount: 4,
  },
  {
    id: 'travel',
    name: 'Travel & Transport',
    icon: 'Plane',
    description: 'Passport, Driving Licence, and vehicle-related services',
    color: 'from-purple-500 to-purple-700',
    serviceCount: 2,
  },
  {
    id: 'certificates',
    name: 'Certificates',
    icon: 'Award',
    description: 'Birth, Death, Marriage, Income, Caste, and Residence certificates',
    color: 'from-emerald-500 to-emerald-700',
    serviceCount: 6,
  },
  {
    id: 'welfare',
    name: 'Welfare & Benefits',
    icon: 'Heart',
    description: 'Ration Card, Ayushman Card, Labour Card, Pension, and scholarships',
    color: 'from-rose-500 to-rose-700',
    serviceCount: 5,
  },
  {
    id: 'property',
    name: 'Property & Land',
    icon: 'Home',
    description: 'Land records, property registration, and mutation services',
    color: 'from-amber-500 to-amber-700',
    serviceCount: 1,
  },
  {
    id: 'utilities',
    name: 'Utilities & Connections',
    icon: 'Zap',
    description: 'Electricity, water, and gas connection services',
    color: 'from-cyan-500 to-cyan-700',
    serviceCount: 2,
  },
];
