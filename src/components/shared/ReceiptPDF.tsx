'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Shield, Printer, ArrowLeft } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { APP_NAME, DISCLAIMER_SHORT } from '@/lib/constants';
import type { Application } from '@/types';

interface ReceiptPDFProps {
  application: Application;
  onClose?: () => void;
}

export default function ReceiptPDF({ application, onClose }: ReceiptPDFProps) {
  const totalAmount = application.governmentFee + application.serviceCharge;
  const gstAmount = Math.round(application.serviceCharge * 0.18); // 18% GST on service charge
  const grandTotal = totalAmount + gstAmount;

  const handlePrint = () => {
    window.print();
  };

  const trackingUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/track?number=${application.applicationNumber}`
    : `https://esevakendra.in/track?number=${application.applicationNumber}`;

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-6 sm:p-10 max-w-3xl mx-auto rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 relative">
      
      {/* Action Buttons (Hidden on print) */}
      <div className="no-print flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        {onClose ? (
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Application
          </button>
        ) : (
          <div />
        )}
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="space-y-8" id="printable-receipt">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center shadow-lg text-white">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{APP_NAME}</h2>
              <p className="text-xs text-muted-foreground">Private Assistance & Submission Portal</p>
              <p className="text-[10px] text-amber-600 font-semibold mt-0.5">{DISCLAIMER_SHORT}</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Receipt / Invoice</p>
            <p className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400 mt-0.5">
              {application.applicationNumber}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Date: {formatDate(application.submittedAt)}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid sm:grid-cols-2 gap-6 text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-xs">
              Applicant Details
            </h3>
            <div className="space-y-2">
              <p className="text-slate-600 dark:text-slate-400">
                <span className="font-medium text-slate-800 dark:text-slate-200">Name:</span> {application.userName}
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                <span className="font-medium text-slate-800 dark:text-slate-200">Email:</span> {application.userEmail || 'N/A'}
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                <span className="font-medium text-slate-800 dark:text-slate-200">Phone:</span> {application.userPhone}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider text-xs">
                Track Status
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                Scan the QR code to track your application online in real-time.
              </p>
              <span className="status-badge bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                Payment: {application.paymentStatus.toUpperCase()}
              </span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200 shrink-0">
              <QRCodeSVG value={trackingUrl} size={80} />
            </div>
          </div>
        </div>

        {/* Service Table */}
        <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-2xl">
          <table className="w-full text-sm border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Description</th>
                <th className="p-4 text-right font-semibold text-slate-700 dark:text-slate-300">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="p-4">
                  <p className="font-bold text-slate-900 dark:text-white">{application.serviceName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Government application fee</p>
                </td>
                <td className="p-4 text-right font-medium">
                  {application.governmentFee > 0 ? formatCurrency(application.governmentFee) : 'Free'}
                </td>
              </tr>
              <tr>
                <td className="p-4">
                  <p className="font-bold text-slate-900 dark:text-white">Assistance & Submission Charge</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Document review, verification, and portal processing</p>
                </td>
                <td className="p-4 text-right font-medium">
                  {formatCurrency(application.serviceCharge)}
                </td>
              </tr>
              <tr>
                <td className="p-4 text-muted-foreground">GST (18% on service charge)</td>
                <td className="p-4 text-right text-muted-foreground">{formatCurrency(gstAmount)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary Details */}
        <div className="flex justify-end pt-4">
          <div className="w-full sm:w-64 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCurrency(totalAmount + gstAmount)}</span>
            </div>
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
            <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white">
              <span>Total Paid</span>
              <span className="text-gradient">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 text-center space-y-2">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
            This receipt is electronically generated for assistance services rendered.
            For any queries, contact support@esevakendra.in.
          </p>
          <p className="text-[10px] text-amber-500 font-medium">
            Disclaimer: E Seva Kendra is a private entity. The fee includes government charges plus service facilitation fees.
          </p>
        </div>
      </div>
    </div>
  );
}
