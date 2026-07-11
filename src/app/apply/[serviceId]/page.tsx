'use client';

import { use, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Upload, X, FileText, CheckCircle,
  AlertCircle, Trash2, Eye, Image, File, Loader2, Printer,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { formatCurrency, formatFileSize, generateId } from '@/lib/utils';
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES, DISCLAIMER_TEXT } from '@/lib/constants';
import type { UploadedFile, FormField as FormFieldType, Application } from '@/types';
import ReceiptPDF from '@/components/shared/ReceiptPDF';


// ── Form Field Component ──
function DynamicFormField({
  field,
  value,
  onChange,
  error,
}: {
  field: FormFieldType;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}) {
  const baseInput =
    'w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm';

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {field.type === 'text' || field.type === 'email' || field.type === 'tel' ? (
        <input
          type={field.type}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={baseInput}
          required={field.required}
        />
      ) : field.type === 'number' ? (
        <input
          type="number"
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={baseInput}
          required={field.required}
        />
      ) : field.type === 'date' ? (
        <input
          type="date"
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          className={baseInput}
          required={field.required}
        />
      ) : field.type === 'textarea' ? (
        <textarea
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className={`${baseInput} resize-none`}
          required={field.required}
        />
      ) : field.type === 'dropdown' ? (
        <select
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          className={baseInput}
          required={field.required}
        >
          <option value="">Select {field.label}</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : field.type === 'radio' ? (
        <div className="flex flex-wrap gap-3 pt-1">
          {field.options?.map((opt) => (
            <label
              key={opt}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${
                value === opt
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300'
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
              }`}
            >
              <input
                type="radio"
                name={field.id}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  value === opt
                    ? 'border-blue-500'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                {value === opt && (
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                )}
              </div>
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      ) : field.type === 'checkbox' ? (
        <div className="flex flex-wrap gap-3 pt-1">
          {field.options?.map((opt) => {
            const checked = Array.isArray(value) && (value as string[]).includes(opt);
            return (
              <label
                key={opt}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${
                  checked
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const current = Array.isArray(value)
                      ? (value as string[])
                      : [];
                    onChange(
                      checked
                        ? current.filter((v) => v !== opt)
                        : [...current, opt]
                    );
                  }}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    checked
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {checked && (
                    <CheckCircle className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-sm">{opt}</span>
              </label>
            );
          })}
        </div>
      ) : null}

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

// ── Document Upload Component ──
function DocumentUploadZone({
  documents,
  uploadedFiles,
  onUpload,
  onRemove,
}: {
  documents: { id: string; name: string; description?: string; required: boolean; acceptedFormats: string[]; maxSizeMB: number }[];
  uploadedFiles: Record<string, UploadedFile>;
  onUpload: (docId: string, file: File) => void;
  onRemove: (docId: string) => void;
}) {
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleDrop = useCallback(
    (docId: string, e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(null);
      const file = e.dataTransfer.files[0];
      if (file) onUpload(docId, file);
    },
    [onUpload]
  );

  return (
    <div className="space-y-4">
      {documents.map((doc) => {
        const uploaded = uploadedFiles[doc.id];
        const isDraggedOver = dragOver === doc.id;

        return (
          <div key={doc.id} className="glass-card p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-sm">
                  {doc.name}
                  {doc.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </p>
                {doc.description && (
                  <p className="text-xs text-muted-foreground">{doc.description}</p>
                )}
              </div>
              {uploaded && (
                <span className="status-badge bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  <CheckCircle className="w-3 h-3" />
                  Uploaded
                </span>
              )}
            </div>

            {uploaded ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                {uploaded.fileType.startsWith('image/') ? (
                  <Image className="w-8 h-8 text-green-600" />
                ) : (
                  <File className="w-8 h-8 text-green-600" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{uploaded.fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(uploaded.fileSize)}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(doc.id)}
                  className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(doc.id);
                }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => handleDrop(doc.id, e)}
                className={`dropzone ${isDraggedOver ? 'dragover' : ''}`}
              >
                <input
                  type="file"
                  accept={doc.acceptedFormats.map((f) => `.${f}`).join(',')}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onUpload(doc.id, file);
                    e.target.value = '';
                  }}
                  className="sr-only"
                  id={`upload-${doc.id}`}
                />
                <label htmlFor={`upload-${doc.id}`} className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">
                    Drag & drop or{' '}
                    <span className="text-blue-600 dark:text-blue-400">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {doc.acceptedFormats.map((f) => f.toUpperCase()).join(', ')} · Max{' '}
                    {doc.maxSizeMB}MB
                  </p>
                </label>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main Apply Page ──
export default function ApplyPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = use(params);
  const router = useRouter();
  const { services, submitApplication, currentUser, setCurrentUser } = useAppStore();
  const service = services.find((s) => s.id === serviceId);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<Application | null>(null);
  const [viewReceipt, setViewReceipt] = useState(false);

  // Quick login for demo (if no user)
  const [quickLogin, setQuickLogin] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground opacity-30 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Service Not Found</h2>
          <Link href="/services" className="btn-primary">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const totalSteps = currentUser ? 3 : 4;
  const stepLabels = currentUser
    ? ['Application Form', 'Upload Documents', 'Review & Submit']
    : ['Your Details', 'Application Form', 'Upload Documents', 'Review & Submit'];

  const handleFieldChange = (fieldId: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  };

  const handleFileUpload = (docId: string, file: File) => {
    // Validate
    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, [docId]: 'File size exceeds 10MB limit' }));
      return;
    }
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, [docId]: 'Invalid file type. Use PDF, JPG, or PNG.' }));
      return;
    }

    const uploaded: UploadedFile = {
      id: generateId(),
      documentId: docId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      status: 'pending',
    };

    setUploadedFiles((prev) => ({ ...prev, [docId]: uploaded }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[docId];
      return next;
    });
  };

  const handleFileRemove = (docId: string) => {
    setUploadedFiles((prev) => {
      const next = { ...prev };
      if (next[docId]?.url) URL.revokeObjectURL(next[docId].url);
      delete next[docId];
      return next;
    });
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (!currentUser && step === 1) {
      if (!quickLogin.name) newErrors['login_name'] = 'Name is required';
      if (!quickLogin.email) newErrors['login_email'] = 'Email is required';
      if (!quickLogin.phone) newErrors['login_phone'] = 'Phone is required';
    }

    const formStep = currentUser ? 1 : 2;
    if (step === formStep) {
      service.formFields.forEach((field) => {
        if (field.required) {
          const val = formData[field.id];
          if (!val || (Array.isArray(val) && val.length === 0)) {
            newErrors[field.id] = `${field.label} is required`;
          }
        }
      });
    }

    const docStep = currentUser ? 2 : 3;
    if (step === docStep) {
      service.requiredDocuments.forEach((doc) => {
        if (doc.required && !uploadedFiles[doc.id]) {
          newErrors[doc.id] = `${doc.name} is required`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (!currentUser && step === 1) {
        setCurrentUser({
          id: generateId(),
          name: quickLogin.name,
          email: quickLogin.email,
          phone: quickLogin.phone,
        });
      }
      setStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const user = currentUser || {
      id: generateId(),
      name: quickLogin.name,
      email: quickLogin.email,
      phone: quickLogin.phone,
    };

    const app = submitApplication({
      serviceId: service.id,
      serviceName: service.name,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      formData,
      documents: Object.values(uploadedFiles),
      governmentFee: service.governmentFee,
      serviceCharge: service.serviceCharge,
      totalAmount: service.governmentFee + service.serviceCharge,
      paymentStatus: 'pending',
    });

    setSubmittedApp(app);
    setSubmitting(false);
  };

  // Success state
  if (submittedApp) {
    if (viewReceipt) {
      return (
        <div className="min-h-screen py-10 px-4">
          <ReceiptPDF application={submittedApp} onClose={() => setViewReceipt(false)} />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Your application has been submitted successfully.
          </p>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 mb-6">
            <p className="text-sm text-muted-foreground">Application Number</p>
            <p className="text-2xl font-bold text-gradient font-mono">
              {submittedApp.applicationNumber}
            </p>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Save this number to track your application status.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setViewReceipt(true)}
              className="btn-primary w-full flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              View & Print Receipt
            </button>
            <Link
              href={`/track?number=${submittedApp.applicationNumber}`}
              className="btn-outline w-full flex items-center justify-center gap-2"
            >
              Track Application
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-slate-500 hover:text-blue-600 transition-colors mt-2"
            >
              Go to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentFormStep = currentUser ? step : step;
  const isFormStep = currentUser ? step === 1 : step === 2;
  const isDocStep = currentUser ? step === 2 : step === 3;
  const isReviewStep = step === totalSteps;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative bg-gradient-hero text-white py-10 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/services/${service.id}`}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {service.name}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Apply for {service.name}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            {stepLabels.map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    i + 1 <= step
                      ? 'bg-gradient-primary text-white shadow-lg shadow-blue-500/25'
                      : 'bg-slate-200 dark:bg-slate-700 text-muted-foreground'
                  }`}
                >
                  {i + 1 < step ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-xs hidden sm:block ${
                    i + 1 <= step ? 'font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  {label}
                </span>
                {i < stepLabels.length - 1 && (
                  <div
                    className={`w-12 lg:w-24 h-0.5 mx-2 transition-colors ${
                      i + 1 < step
                        ? 'bg-blue-500'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Quick Login (if no user) */}
            {!currentUser && step === 1 && (
              <div className="glass-card p-6 space-y-5">
                <h2 className="text-xl font-bold">Your Details</h2>
                <p className="text-sm text-muted-foreground">
                  Please provide your contact information to proceed.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      value={quickLogin.name}
                      onChange={(e) => setQuickLogin({ ...quickLogin, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                    {errors.login_name && <p className="text-xs text-red-500 mt-1">{errors.login_name}</p>}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Email *</label>
                      <input
                        type="email"
                        value={quickLogin.email}
                        onChange={(e) => setQuickLogin({ ...quickLogin, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                      {errors.login_email && <p className="text-xs text-red-500 mt-1">{errors.login_email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Mobile Number *</label>
                      <input
                        type="tel"
                        value={quickLogin.phone}
                        onChange={(e) => setQuickLogin({ ...quickLogin, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                      {errors.login_phone && <p className="text-xs text-red-500 mt-1">{errors.login_phone}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Step */}
            {isFormStep && (
              <div className="glass-card p-6 space-y-5">
                <h2 className="text-xl font-bold">Application Form</h2>
                <p className="text-sm text-muted-foreground">
                  Fill in all required fields for {service.name}.
                </p>
                <div className="grid sm:grid-cols-2 gap-5">
                  {service.formFields.map((field) => (
                    <div
                      key={field.id}
                      className={
                        field.type === 'textarea' || field.type === 'checkbox'
                          ? 'sm:col-span-2'
                          : ''
                      }
                    >
                      <DynamicFormField
                        field={field}
                        value={formData[field.id]}
                        onChange={(val) => handleFieldChange(field.id, val)}
                        error={errors[field.id]}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Document Upload Step */}
            {isDocStep && (
              <div className="space-y-5">
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold mb-1">Upload Documents</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Upload the required documents for {service.name}. Accepted
                    formats: PDF, JPG, PNG. Max size: 10MB per file.
                  </p>
                  <DocumentUploadZone
                    documents={service.requiredDocuments}
                    uploadedFiles={uploadedFiles}
                    onUpload={handleFileUpload}
                    onRemove={handleFileRemove}
                  />
                </div>
                {Object.keys(errors).length > 0 && (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 font-medium">
                      Please upload all required documents before proceeding.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Review & Submit Step */}
            {isReviewStep && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold mb-4">Review Your Application</h2>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
                        Service
                      </h3>
                      <p className="font-bold text-lg">{service.name}</p>
                    </div>

                    <div className="h-px bg-slate-200 dark:bg-slate-700" />

                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
                        Application Details
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {service.formFields.map((field) => {
                          const val = formData[field.id];
                          if (!val) return null;
                          return (
                            <div key={field.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                              <p className="text-xs text-muted-foreground">{field.label}</p>
                              <p className="text-sm font-medium">
                                {Array.isArray(val) ? (val as string[]).join(', ') : String(val)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="h-px bg-slate-200 dark:bg-slate-700" />

                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
                        Documents ({Object.keys(uploadedFiles).length} uploaded)
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {Object.values(uploadedFiles).map((file) => (
                          <div key={file.id} className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm truncate">{file.fileName}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-slate-200 dark:bg-slate-700" />

                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
                        Fee Summary
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Government Fee</span>
                          <span>{service.governmentFee > 0 ? formatCurrency(service.governmentFee) : 'Free'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Service Charge</span>
                          <span>{formatCurrency(service.serviceCharge)}</span>
                        </div>
                        <div className="h-px bg-slate-200 dark:bg-slate-700" />
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span className="text-gradient text-lg">
                            {formatCurrency(service.governmentFee + service.serviceCharge)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="disclaimer-banner flex items-start gap-3 p-4">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed">{DISCLAIMER_TEXT}</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            disabled={step === 1}
            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {step < totalSteps ? (
            <button
              onClick={handleNext}
              className="btn-primary flex items-center gap-2"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary flex items-center gap-2 disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <CheckCircle className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
