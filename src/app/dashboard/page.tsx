'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText, Clock, CheckCircle, XCircle, Bell, User,
  ChevronRight, Plus, AlertCircle, Eye,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { formatDate, formatDateShort, formatCurrency } from '@/lib/utils';
import { STATUS_CONFIG } from '@/lib/constants';

export default function DashboardPage() {
  const {
    currentUser, applications, notifications, markNotificationRead, setCurrentUser,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'applications' | 'notifications'>('applications');

  // Demo login if not logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <User className="w-16 h-16 mx-auto text-muted-foreground opacity-30 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className="text-muted-foreground mb-6">
            Please login to view your dashboard and track your applications.
          </p>
          <Link href="/auth/login" className="btn-primary inline-block">
            Login / Register
          </Link>
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-muted-foreground mb-3">Quick Demo Login</p>
            <button
              onClick={() =>
                setCurrentUser({
                  id: 'demo-user',
                  name: 'Demo User',
                  email: 'demo@example.com',
                  phone: '9876543210',
                })
              }
              className="btn-outline text-sm !py-2"
            >
              Login as Demo User
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userApps = applications.filter((a) => a.userId === currentUser.id);
  const pending = userApps.filter((a) => !['approved', 'rejected', 'completed'].includes(a.currentStatus));
  const completed = userApps.filter((a) => ['approved', 'completed'].includes(a.currentStatus));
  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative bg-gradient-hero text-white py-12 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Welcome, {currentUser.name}
              </h1>
              <p className="text-white/70 text-sm">{currentUser.email}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 -mt-10 relative z-10">
          {[
            { label: 'Total Applications', value: userApps.length, icon: FileText, color: 'from-blue-500 to-blue-700' },
            { label: 'In Progress', value: pending.length, icon: Clock, color: 'from-amber-500 to-orange-500' },
            { label: 'Completed', value: completed.length, icon: CheckCircle, color: 'from-green-500 to-emerald-600' },
            { label: 'Notifications', value: unreadNotifications.length, icon: Bell, color: 'from-purple-500 to-purple-700' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-1">
          <Link
            href="/services"
            className="btn-primary flex items-center gap-2 !py-2.5 !px-5 text-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New Application
          </Link>
          <Link
            href="/track"
            className="btn-outline flex items-center gap-2 !py-2.5 !px-5 text-sm whitespace-nowrap"
          >
            <Eye className="w-4 h-4" />
            Track Application
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'applications'
                ? 'bg-white dark:bg-slate-700 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Applications
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
              activeTab === 'notifications'
                ? 'bg-white dark:bg-slate-700 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Bell className="w-4 h-4 inline mr-2" />
            Notifications
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotifications.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'applications' ? (
          <div>
            {userApps.length > 0 ? (
              <div className="space-y-4">
                {userApps.map((app, i) => {
                  const statusConf = STATUS_CONFIG[app.currentStatus];
                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={`/track?number=${app.applicationNumber}`}
                        className="block glass-card p-5 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold">{app.serviceName}</h4>
                              <p className="text-sm text-muted-foreground">
                                <span className="font-mono">{app.applicationNumber}</span>
                                {' · '}
                                {formatDateShort(app.submittedAt)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`status-badge ${statusConf?.bgColor} ${statusConf?.color}`}
                            >
                              {statusConf?.label}
                            </span>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground opacity-30 mb-4" />
                <h3 className="text-xl font-bold mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by browsing our services and submitting your first application.
                </p>
                <Link href="/services" className="btn-primary inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Browse Services
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div>
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notif, i) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`glass-card p-4 cursor-pointer transition-all ${
                      !notif.read ? 'border-l-4 border-l-blue-500' : 'opacity-75'
                    }`}
                    onClick={() => markNotificationRead(notif.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          notif.type === 'success'
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : notif.type === 'warning'
                            ? 'bg-amber-100 dark:bg-amber-900/30'
                            : notif.type === 'error'
                            ? 'bg-red-100 dark:bg-red-900/30'
                            : 'bg-blue-100 dark:bg-blue-900/30'
                        }`}
                      >
                        {notif.type === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : notif.type === 'warning' ? (
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                        ) : notif.type === 'error' ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <Bell className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{notif.title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {notif.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(notif.createdAt)}
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <Bell className="w-16 h-16 mx-auto text-muted-foreground opacity-30 mb-4" />
                <h3 className="text-xl font-bold mb-2">No Notifications</h3>
                <p className="text-muted-foreground">
                  You&apos;ll receive notifications here about your application updates.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
