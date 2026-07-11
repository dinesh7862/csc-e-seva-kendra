'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FileText, Layers, FolderOpen, Users,
  TrendingUp, IndianRupee, Clock, CheckCircle, XCircle,
  Eye, ChevronRight, LogOut, Search, Filter,
  Download, MoreHorizontal, Bell,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { formatCurrency, formatDate, formatDateShort } from '@/lib/utils';
import { STATUS_CONFIG } from '@/lib/constants';
import { categories } from '@/data/categories';
import { Plus, X, Save, FileSpreadsheet } from 'lucide-react';

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: FileText, label: 'Applications', id: 'applications' },
  { icon: Layers, label: 'Services', id: 'services' },
  { icon: FolderOpen, label: 'Categories', id: 'categories' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const {
    isAdmin, applications, services, logout,
    updateApplicationStatus, deleteService, addService,
  } = useAppStore();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Add Service Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    categoryId: 'identity',
    processingTime: '3-5 Working Days',
    governmentFee: 0,
    serviceCharge: 199,
    description: '',
  });
  const [fieldList, setFieldList] = useState('full_name, father_name, dob, gender, mobile, address');
  const [docList, setDocList] = useState('photo, aadhaar, address_proof');

  const exportApplicationsToCSV = () => {
    const headers = ['Application Number', 'Service Name', 'Applicant Name', 'Phone', 'Date', 'Status', 'Service Charge'];
    const rows = filteredApps.map((a) => [
      a.applicationNumber,
      a.serviceName,
      a.userName,
      a.userPhone,
      formatDateShort(a.submittedAt),
      a.currentStatus,
      a.serviceCharge,
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `applications_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name) return;

    const formFields = fieldList.split(',').map((f) => {
      const name = f.trim();
      return {
        id: name.toLowerCase().replace(/\s+/g, '_'),
        label: name.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        type: name.includes('date')
          ? ('date' as const)
          : name.includes('gender')
          ? ('radio' as const)
          : ('text' as const),
        required: true,
        options: name.includes('gender') ? ['Male', 'Female', 'Other'] : undefined,
      };
    });

    const requiredDocuments = docList.split(',').map((d) => {
      const name = d.trim();
      return {
        id: name.toLowerCase().replace(/\s+/g, '_'),
        name: name.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        acceptedFormats: ['pdf', 'jpg', 'png'],
        maxSizeMB: 10,
        required: true,
      };
    });

    addService({
      id: newService.name.toLowerCase().replace(/\s+/g, '-'),
      name: newService.name,
      icon: 'FileText',
      description: newService.description,
      categoryId: newService.categoryId,
      processingTime: newService.processingTime,
      governmentFee: Number(newService.governmentFee),
      serviceCharge: Number(newService.serviceCharge),
      eligibility: ['Indian Citizen', 'Valid supporting documents required'],
      requiredDocuments,
      formFields,
      active: true,
      featured: false,
    });

    setShowAddForm(false);
    setNewService({
      name: '',
      categoryId: 'identity',
      processingTime: '3-5 Working Days',
      governmentFee: 0,
      serviceCharge: 199,
      description: '',
    });
  };

  // Redirect if not admin
  if (!isAdmin) {
    router.push('/admin/login');
    return null;
  }

  // Dashboard stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayApps = applications.filter((a) => a.submittedAt.startsWith(today));
    return {
      total: applications.length,
      today: todayApps.length,
      pending: applications.filter((a) => a.currentStatus === 'submitted' || a.currentStatus === 'under_review' || a.currentStatus === 'documents_verified').length,
      approved: applications.filter((a) => a.currentStatus === 'approved' || a.currentStatus === 'completed').length,
      rejected: applications.filter((a) => a.currentStatus === 'rejected').length,
      revenue: applications.reduce((sum, a) => sum + a.serviceCharge, 0),
    };
  }, [applications]);

  // Filtered applications
  const filteredApps = useMemo(() => {
    let result = [...applications];
    if (statusFilter !== 'all') {
      result = result.filter((a) => a.currentStatus === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.applicationNumber.toLowerCase().includes(q) ||
          a.userName.toLowerCase().includes(q) ||
          a.serviceName.toLowerCase().includes(q) ||
          a.userPhone.includes(q)
      );
    }
    return result;
  }, [applications, statusFilter, searchQuery]);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 dark:bg-slate-950 text-white hidden lg:flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-bold">Admin Panel</h2>
          <p className="text-xs text-slate-400 mt-0.5">E Seva Kendra</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {adminNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/30 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 min-h-screen">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 lg:hidden">
              {adminNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`p-2 rounded-lg ${
                    activeSection === item.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                      : 'text-muted-foreground'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                </button>
              ))}
            </div>
            <h2 className="text-xl font-bold hidden lg:block capitalize">
              {activeSection}
            </h2>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                View Site
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { label: 'Total Applications', value: stats.total, icon: FileText, color: 'from-blue-500 to-blue-700' },
                  { label: "Today's", value: stats.today, icon: Clock, color: 'from-cyan-500 to-cyan-700' },
                  { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-amber-500 to-orange-500' },
                  { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'from-green-500 to-emerald-600' },
                  { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'from-red-500 to-red-700' },
                  { label: 'Revenue', value: formatCurrency(stats.revenue), icon: IndianRupee, color: 'from-purple-500 to-purple-700', isString: true },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-card p-5"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-2xl font-bold">
                      {typeof stat.value === 'number' ? stat.value : stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Applications */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Recent Applications</h3>
                  <button
                    onClick={() => setActiveSection('applications')}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                {applications.length > 0 ? (
                  <div className="space-y-3">
                    {applications.slice(0, 5).map((app) => {
                      const sc = STATUS_CONFIG[app.currentStatus];
                      return (
                        <div
                          key={app.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{app.serviceName}</p>
                              <p className="text-xs text-muted-foreground">
                                {app.applicationNumber} · {app.userName}
                              </p>
                            </div>
                          </div>
                          <span className={`status-badge ${sc?.bgColor} ${sc?.color}`}>
                            {sc?.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No applications yet
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Applications Section */}
          {activeSection === 'applications' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by application number, name, service, or phone..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="all">All Status</option>
                    <option value="submitted">Submitted</option>
                    <option value="documents_verified">Documents Verified</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    onClick={exportApplicationsToCSV}
                    className="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Applications Table */}
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase text-muted-foreground">
                          Application
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase text-muted-foreground">
                          Service
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase text-muted-foreground">
                          Applicant
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase text-muted-foreground">
                          Date
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase text-muted-foreground">
                          Status
                        </th>
                        <th className="text-right px-4 py-3 text-xs font-semibold uppercase text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApps.map((app) => {
                        const sc = STATUS_CONFIG[app.currentStatus];
                        return (
                          <tr
                            key={app.id}
                            className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <p className="font-mono text-sm font-bold text-blue-600">
                                {app.applicationNumber}
                              </p>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-sm font-medium">{app.serviceName}</p>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-sm">{app.userName}</p>
                              <p className="text-xs text-muted-foreground">{app.userPhone}</p>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-sm text-muted-foreground">
                                {formatDateShort(app.submittedAt)}
                              </p>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`status-badge ${sc?.bgColor} ${sc?.color}`}>
                                {sc?.label}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1">
                                {app.currentStatus === 'submitted' && (
                                  <>
                                    <button
                                      onClick={() =>
                                        updateApplicationStatus(app.id, 'documents_verified', 'Documents have been verified')
                                      }
                                      className="px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium hover:bg-blue-200 transition-colors"
                                    >
                                      Verify
                                    </button>
                                    <button
                                      onClick={() =>
                                        updateApplicationStatus(app.id, 'rejected', 'Application rejected by admin')
                                      }
                                      className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium hover:bg-red-200 transition-colors"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                                {app.currentStatus === 'documents_verified' && (
                                  <button
                                    onClick={() =>
                                      updateApplicationStatus(app.id, 'under_review', 'Application is under review')
                                    }
                                    className="px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium hover:bg-amber-200 transition-colors"
                                  >
                                    Review
                                  </button>
                                )}
                                {app.currentStatus === 'under_review' && (
                                  <>
                                    <button
                                      onClick={() =>
                                        updateApplicationStatus(app.id, 'approved', 'Application approved')
                                      }
                                      className="px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium hover:bg-green-200 transition-colors"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() =>
                                        updateApplicationStatus(app.id, 'rejected', 'Application rejected after review')
                                      }
                                      className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium hover:bg-red-200 transition-colors"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                                {app.currentStatus === 'approved' && (
                                  <button
                                    onClick={() =>
                                      updateApplicationStatus(app.id, 'completed', 'Application completed and document ready')
                                    }
                                    className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium hover:bg-emerald-200 transition-colors"
                                  >
                                    Complete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {filteredApps.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No applications found
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Services Section */}
          {activeSection === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Manage Services ({services.length})</h3>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add New Service
                </button>
              </div>

              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="glass-card p-6 border-l-4 border-l-blue-500 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                    <h4 className="font-bold">Create Dynamic Service</h4>
                    <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleCreateService} className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase text-muted-foreground">Service Name</label>
                      <input
                        type="text"
                        required
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        placeholder="e.g. Labour Licence"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase text-muted-foreground">Category</label>
                      <select
                        value={newService.categoryId}
                        onChange={(e) => setNewService({ ...newService, categoryId: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase text-muted-foreground">Processing Time</label>
                      <input
                        type="text"
                        required
                        value={newService.processingTime}
                        onChange={(e) => setNewService({ ...newService, processingTime: e.target.value })}
                        placeholder="e.g. 5-7 Days"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase text-muted-foreground">Govt Fee (₹)</label>
                        <input
                          type="number"
                          required
                          value={newService.governmentFee}
                          onChange={(e) => setNewService({ ...newService, governmentFee: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase text-muted-foreground">Service Charge (₹)</label>
                        <input
                          type="number"
                          required
                          value={newService.serviceCharge}
                          onChange={(e) => setNewService({ ...newService, serviceCharge: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold mb-1.5 uppercase text-muted-foreground">Description</label>
                      <textarea
                        required
                        rows={2}
                        value={newService.description}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        placeholder="Enter short service details..."
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm resize-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold mb-1.5 uppercase text-muted-foreground">
                        Custom Form Fields (comma-separated labels)
                      </label>
                      <input
                        type="text"
                        value={fieldList}
                        onChange={(e) => setFieldList(e.target.value)}
                        placeholder="full_name, dob, gender, mobile"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                      />
                      <span className="text-[10px] text-muted-foreground">
                        Tip: Typing words containing &ldquo;date&rdquo; creates calendar dates, &ldquo;gender&rdquo; creates radio choices.
                      </span>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold mb-1.5 uppercase text-muted-foreground">
                        Required Documents Checklist (comma-separated labels)
                      </label>
                      <input
                        type="text"
                        value={docList}
                        onChange={(e) => setDocList(e.target.value)}
                        placeholder="photo, signature, aadhaar_card"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Create Service
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div key={service.id} className="glass-card p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold">{service.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${service.active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {service.active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {service.formFields.length} fields · {service.requiredDocuments.length} docs
                      </span>
                      <span className="font-bold text-blue-600">
                        {formatCurrency(service.serviceCharge)}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/50">
                      <Link
                        href={`/services/${service.id}`}
                        className="text-xs px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${service.name}"? This cannot be undone.`)) {
                            deleteService(service.id);
                          }
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories Section */}
          {activeSection === 'categories' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold">Service Categories</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from(new Set(services.map((s) => s.categoryId))).map(
                  (catId) => {
                    const catServices = services.filter(
                      (s) => s.categoryId === catId
                    );
                    return (
                      <div key={catId} className="glass-card p-5">
                        <h4 className="font-bold capitalize mb-2">
                          {catId.replace(/-/g, ' ')}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {catServices.length} services
                        </p>
                        <div className="mt-3 space-y-1">
                          {catServices.map((s) => (
                            <p key={s.id} className="text-xs text-muted-foreground">
                              • {s.name}
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
