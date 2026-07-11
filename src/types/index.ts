// ============================================================
// E Seva Kendra — Type Definitions
// ============================================================

/** Supported form field types for the dynamic form builder */
export type FieldType = 'text' | 'number' | 'date' | 'dropdown' | 'radio' | 'checkbox' | 'file' | 'email' | 'tel' | 'textarea';

/** A single field definition used by the dynamic form builder */
export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For dropdown, radio, checkbox
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

/** A required document for a service */
export interface RequiredDocument {
  id: string;
  name: string;
  description?: string;
  acceptedFormats: string[];  // e.g. ['pdf', 'jpg', 'png']
  maxSizeMB: number;
  required: boolean;
}

/** Service category */
export interface Category {
  id: string;
  name: string;
  icon: string;         // Lucide icon name
  description: string;
  color: string;        // Tailwind color class
  serviceCount?: number;
}

/** A government service definition */
export interface Service {
  id: string;
  name: string;
  icon: string;            // Lucide icon name
  description: string;
  longDescription?: string;
  categoryId: string;
  processingTime: string;  // e.g. "3-5 Working Days"
  governmentFee: number;
  serviceCharge: number;
  eligibility: string[];
  requiredDocuments: RequiredDocument[];
  formFields: FormField[];
  featured?: boolean;
  active?: boolean;
}

/** Application status timeline */
export type ApplicationStatus =
  | 'submitted'
  | 'documents_verified'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'more_documents_needed';

/** Status timeline entry */
export interface StatusEntry {
  status: ApplicationStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

/** An uploaded document file */
export interface UploadedFile {
  id: string;
  documentId: string;   // Links to RequiredDocument.id
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
}

/** A submitted application */
export interface Application {
  id: string;
  applicationNumber: string;   // e.g. ESK202600001
  serviceId: string;
  serviceName: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  formData: Record<string, unknown>;
  documents: UploadedFile[];
  currentStatus: ApplicationStatus;
  statusHistory: StatusEntry[];
  governmentFee: number;
  serviceCharge: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentId?: string;
  submittedAt: string;
  updatedAt: string;
  notes?: string;
}

/** User profile */
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  createdAt: string;
}

/** Admin user */
export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'operator';
  createdAt: string;
}

/** Notification */
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

/** Payment record */
export interface Payment {
  id: string;
  applicationId: string;
  amount: number;
  method: 'razorpay' | 'upi' | 'phonepe' | 'paytm';
  status: 'pending' | 'success' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt: string;
}

/** Dashboard stats for admin */
export interface DashboardStats {
  totalApplications: number;
  todayApplications: number;
  pending: number;
  approved: number;
  rejected: number;
  completed: number;
  totalRevenue: number;
  todayRevenue: number;
}

/** Customer review */
export interface Review {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  comment: string;
  service: string;
  date: string;
  location: string;
}

/** FAQ item */
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}
