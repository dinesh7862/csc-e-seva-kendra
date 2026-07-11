// ============================================================
// E Seva Kendra — Application Constants
// ============================================================

/** Application metadata */
export const APP_NAME = 'MyESeva';
export const APP_TAGLINE = 'Your Gateway to Government Services';
export const APP_DESCRIPTION =
  'A private service portal that helps citizens prepare and submit applications for various government services. Fast, secure, and reliable assistance.';
export const APP_URL = 'https://myeseva.in';

/** Disclaimer text shown across the application */
export const DISCLAIMER_TEXT =
  'This is NOT an official government website. MyESeva is a private service portal that assists citizens in preparing and submitting applications for various government-related services. Government fees are separate from our service charges.';

export const DISCLAIMER_SHORT =
  'Private service portal — not affiliated with any government body.';

/** Application number prefix */
export const APP_NUMBER_PREFIX = 'MES';

/** Max file upload size in bytes (10MB) */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Accepted file types */
export const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
export const ACCEPTED_FILE_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

/** Application statuses with display labels and colors */
export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string; icon: string }
> = {
  submitted: {
    label: 'Submitted',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    icon: 'Send',
  },
  documents_verified: {
    label: 'Documents Verified',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    icon: 'FileCheck',
  },
  under_review: {
    label: 'Under Review',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    icon: 'Clock',
  },
  approved: {
    label: 'Approved',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    icon: 'CheckCircle',
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    icon: 'XCircle',
  },
  completed: {
    label: 'Completed',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    icon: 'CheckCircle2',
  },
  more_documents_needed: {
    label: 'More Documents Needed',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    icon: 'AlertCircle',
  },
};

/** Navigation links */
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/track', label: 'Track Application' },
  { href: '/dashboard', label: 'Dashboard' },
];

/** Statistics displayed on landing page */
export const LANDING_STATS = [
  { label: 'Services Offered', value: 50, suffix: '+', icon: 'Layers' },
  { label: 'Applications Processed', value: 25000, suffix: '+', icon: 'FileText' },
  { label: 'Happy Citizens', value: 18000, suffix: '+', icon: 'Users' },
  { label: 'Districts Covered', value: 38, suffix: '', icon: 'MapPin' },
];

/** Footer links */
export const FOOTER_LINKS = {
  services: [
    { label: 'Aadhaar Card', href: '/services/aadhaar' },
    { label: 'PAN Card', href: '/services/pan-card' },
    { label: 'Passport', href: '/services/passport' },
    { label: 'Voter ID', href: '/services/voter-id' },
    { label: 'Driving Licence', href: '/services/driving-licence' },
  ],
  certificates: [
    { label: 'Birth Certificate', href: '/services/birth-certificate' },
    { label: 'Death Certificate', href: '/services/death-certificate' },
    { label: 'Marriage Certificate', href: '/services/marriage-certificate' },
    { label: 'Income Certificate', href: '/services/income-certificate' },
    { label: 'Caste Certificate', href: '/services/caste-certificate' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/#contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Refund Policy', href: '/refund' },
  ],
  support: [
    { label: 'FAQ', href: '/#faq' },
    { label: 'Track Application', href: '/track' },
    { label: 'Help Center', href: '/help' },
    { label: 'Report Issue', href: '/report' },
  ],
};

/** Social links */
export const SOCIAL_LINKS = [
  { platform: 'Facebook', url: '#', icon: 'Facebook' },
  { platform: 'Twitter', url: '#', icon: 'Twitter' },
  { platform: 'Instagram', url: '#', icon: 'Instagram' },
  { platform: 'YouTube', url: '#', icon: 'Youtube' },
];

/** Contact info */
export const CONTACT_INFO = {
  email: 'csccentersolution@gmail.com',
  personalEmail: 'bhardwajadarsh093@gmail.com',
  phone: '086990 07628',
  address: '308b/12, Church Rd, Dashmesh Nagar, Nayagaon, Punjab 160103',
  hours: 'Open · Closes 9:00 PM (Daily)',
};
