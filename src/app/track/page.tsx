'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Send, FileCheck, Clock, CheckCircle, XCircle,
  AlertCircle, CheckCircle2, ChevronRight, FileText,
  Printer, Upload, Trash2, Edit2, Save, X, Eye, File, Image, Check
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { formatDate, formatDateShort, formatCurrency, formatFileSize, generateId } from '@/lib/utils';
import { STATUS_CONFIG, MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '@/lib/constants';
import type { Application, ApplicationStatus, UploadedFile } from '@/types';
import ReceiptPDF from '@/components/shared/ReceiptPDF';

const statusIcons: Record<string, React.ElementType> = {
  Send, FileCheck, Clock, CheckCircle, XCircle, AlertCircle, CheckCircle2,
};

const statusOrder: ApplicationStatus[] = [
  'submitted',
  'documents_verified',
  'under_review',
  'approved',
  'completed',
];

function TrackingTimeline({ application }: { application: Application }) {
  const { services, updateApplication, updateApplicationStatus } = useAppStore();
  const service = services.find((s) => s.id === application.serviceId);

  const [viewReceipt, setViewReceipt] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>(application.formData);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isRejected = application.currentStatus === 'rejected';
  const needsDocs = application.currentStatus === 'more_documents_needed';
  const isEditable = application.currentStatus === 'submitted' || application.currentStatus === 'more_documents_needed';

  const handleSaveData = () => {
    updateApplication(application.id, { formData });
    setIsEditing(false);
  };

  const handleFileUpload = (docId: string, file: File) => {
    setErrorMsg(null);
    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg('File size exceeds 10MB limit');
      return;
    }
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setErrorMsg('Invalid file type. Use PDF, JPG, or PNG.');
      return;
    }

    setUploadingDocId(docId);
    // Simulate upload delay
    setTimeout(() => {
      const newUpload: UploadedFile = {
        id: generateId(),
        documentId: docId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
        status: 'pending',
      };

      const updatedDocs = application.documents.map(d => d.documentId === docId ? newUpload : d);
      if (!application.documents.some(d => d.documentId === docId)) {
        updatedDocs.push(newUpload);
      }

      updateApplication(application.id, { documents: updatedDocs });
      
      // If they uploaded all required docs and were flagged for docs, transition status back
      if (application.currentStatus === 'more_documents_needed') {
        const requiredDocIds = service?.requiredDocuments.filter(rd => rd.required).map(rd => rd.id) || [];
        const currentDocIds = updatedDocs.map(d => d.documentId);
        const hasAllRequired = requiredDocIds.every(id => currentDocIds.includes(id));
        if (hasAllRequired) {
          updateApplicationStatus(application.id, 'submitted', 'Documents re-uploaded by applicant. Pending verification.');
        }
      }

      setUploadingDocId(null);
    }, 1500);
  };

  if (viewReceipt) {
    return (
      <div className="glass shadow-2xl rounded-3xl p-2 relative">
        <ReceiptPDF application={application} onClose={() => setViewReceipt(false)} />
      </div>
    );
  }

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Timeline Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{application.serviceName}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Application: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{application.applicationNumber}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewReceipt(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Receipt / Invoice
          </button>
          <span className={`status-badge ${STATUS_CONFIG[application.currentStatus]?.bgColor} ${STATUS_CONFIG[application.currentStatus]?.color}`}>
            {STATUS_CONFIG[application.currentStatus]?.label}
          </span>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="space-y-0">
        {statusOrder.map((status, index) => {
          const config = STATUS_CONFIG[status];
          const Icon = statusIcons[config.icon] || CheckCircle;
          const historyEntry = application.statusHistory.find((h) => h.status === status);
          const isActive = historyEntry !== undefined;
          const isCurrent = application.currentStatus === status;
          const isPast = isActive && !isCurrent;

          return (
            <div key={status} className="relative">
              <div className="flex items-start gap-4 py-3">
                <div
                  className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isCurrent
                      ? 'bg-gradient-primary text-white shadow-lg shadow-blue-500/25 scale-105'
                      : isPast
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {isCurrent && (
                    <div className="absolute -inset-1 rounded-full border-2 border-blue-400 animate-pulse" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                    {config.label}
                  </p>
                  {historyEntry ? (
                    <div className="mt-0.5">
                      <p className="text-[10px] text-muted-foreground">
                        {formatDate(historyEntry.timestamp)}
                      </p>
                      {historyEntry.note && (
                        <p className="text-xs text-slate-500 mt-1">
                          {historyEntry.note}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-0.5">Pending</p>
                  )}
                </div>
              </div>

              {index < statusOrder.length - 1 && (
                <div
                  className={`absolute left-[17px] top-[34px] bottom-0 w-[2px] ${
                    isPast
                      ? 'bg-green-300 dark:bg-green-700'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              )}
            </div>
          );
        })}

        {isRejected && (
          <div className="flex items-start gap-4 py-3">
            <div className="relative z-10 w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center shrink-0 scale-105">
              <XCircle className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="font-semibold text-red-600 text-sm">Rejected</p>
              {application.statusHistory
                .filter((h) => h.status === 'rejected')
                .map((entry, i) => (
                  <div key={i} className="mt-0.5">
                    <p className="text-[10px] text-muted-foreground">
                      {formatDate(entry.timestamp)}
                    </p>
                    {entry.note && (
                      <p className="text-xs text-red-500 mt-1">{entry.note}</p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {needsDocs && (
          <div className="flex items-start gap-4 py-3">
            <div className="relative z-10 w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center shrink-0 scale-105">
              <AlertCircle className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="font-semibold text-orange-600 text-sm">
                Additional Documents Needed
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Please review the document checklist below and upload required files.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Editable Application Details */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Application Information</h4>
          {isEditable && (
            <button
              onClick={() => {
                if (isEditing) handleSaveData();
                else setIsEditing(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {isEditing ? (
                <>
                  <Save className="w-3.5 h-3.5 text-green-600" />
                  Save Details
                </>
              ) : (
                <>
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Details
                </>
              )}
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {service?.formFields.map((field) => {
            const currentVal = formData[field.id];
            if (!currentVal && !isEditing) return null;

            return (
              <div
                key={field.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isEditing
                    ? 'border-blue-500/30 bg-blue-50/10'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                }`}
              >
                <p className="text-xs text-muted-foreground mb-1.5">{field.label}</p>
                {isEditing ? (
                  field.type === 'dropdown' ? (
                    <select
                      value={String(currentVal || '')}
                      onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                      className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 focus:outline-none"
                    >
                      {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      value={String(currentVal || '')}
                      onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                      className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 focus:outline-none"
                    />
                  )
                ) : (
                  <p className="text-sm font-semibold">{String(currentVal || 'N/A')}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Document Management Section */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-4">Required Documents Checklist</h4>
        
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 text-xs flex items-center gap-2 border border-red-200 dark:border-red-900">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          {service?.requiredDocuments.map((doc) => {
            const file = application.documents.find((d) => d.documentId === doc.id);
            const isUploading = uploadingDocId === doc.id;

            return (
              <div
                key={doc.id}
                className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                      {doc.required ? 'Required Document' : 'Optional Document'}
                    </span>
                    {file ? (
                      <span className="status-badge bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Uploaded
                      </span>
                    ) : (
                      <span className="status-badge bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400">
                        Missing
                      </span>
                    )}
                  </div>
                  <h5 className="font-bold text-sm">{doc.name}</h5>
                  {file && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      File: {file.fileName} ({formatFileSize(file.fileSize)})
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {file?.url ? (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View File
                    </a>
                  ) : (
                    <div />
                  )}

                  {isEditable && (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept={doc.acceptedFormats.map((f) => `.${f}`).join(',')}
                        disabled={isUploading}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileUpload(doc.id, f);
                        }}
                        className="sr-only"
                      />
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg transition-colors">
                        {isUploading ? 'Uploading...' : file ? 'Replace File' : 'Upload File'}
                        <Upload className="w-3.5 h-3.5" />
                      </span>
                    </label>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function TrackPage() {
  const [searchType, setSearchType] = useState<'number' | 'phone'>('number');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Application[]>([]);
  const [searched, setSearched] = useState(false);
  const { getApplicationByNumber, getApplicationsByPhone } = useAppStore();

  // Check URL params for pre-filled search
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const num = params.get('number');
    if (num && !searched && !query) {
      setQuery(num);
    }
  }

  const handleSearch = () => {
    setSearched(true);
    if (searchType === 'number') {
      const app = getApplicationByNumber(query.toUpperCase());
      setResults(app ? [app] : []);
    } else {
      const apps = getApplicationsByPhone(query);
      setResults(apps);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative bg-gradient-hero text-white py-16 overflow-hidden">
        <div className="floating-shapes">
          <div className="shape" />
          <div className="shape" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              Track Your Application
            </h1>
            <p className="text-white/80 max-w-xl mx-auto">
              Enter your application number or mobile number to check the
              current status of your application.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-8 -mt-16 relative z-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setSearchType('number')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                searchType === 'number'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Application Number
            </button>
            <button
              onClick={() => setSearchType('phone')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                searchType === 'phone'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:bg-slate-200'
              }`}
            >
              <Search className="w-4 h-4 inline mr-2" />
              Mobile Number
            </button>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={
                  searchType === 'number'
                    ? 'Enter Application Number (e.g., ESK202600001)'
                    : 'Enter 10-digit Mobile Number'
                }
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-base"
              />
            </div>
            <button
              onClick={handleSearch}
              className="btn-primary px-8 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline">Track</span>
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {results.length > 0 ? (
                <div className="space-y-6">
                  {results.map((app) => (
                    <TrackingTimeline key={app.id} application={app} />
                  ))}
                </div>
              ) : (
                <div className="glass-card p-12 text-center">
                  <Search className="w-16 h-16 mx-auto text-muted-foreground opacity-30 mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Application Found</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    We couldn&apos;t find any application matching your search.
                    Please check the {searchType === 'number' ? 'application number' : 'mobile number'} and try again.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* How to Track */}
        {!searched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid sm:grid-cols-3 gap-6 mt-8"
          >
            {[
              { step: '1', title: 'Enter Details', desc: 'Type your application number or registered mobile number' },
              { step: '2', title: 'Click Track', desc: 'Hit the track button to search for your application' },
              { step: '3', title: 'View Status', desc: 'See the complete timeline and current status of your application' },
            ].map((item) => (
              <div key={item.step} className="glass-card p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                  {item.step}
                </div>
                <h4 className="font-bold mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
