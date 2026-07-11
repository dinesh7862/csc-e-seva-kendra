// ============================================================
// E Seva Kendra — Global State Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Application, Notification, Service } from '@/types';
import { services as defaultServices } from '@/data/services';
import { generateId, generateApplicationNumber } from '@/lib/utils';

interface AppState {
  // ── Services ──
  services: Service[];
  addService: (service: Service) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;

  // ── Applications ──
  applications: Application[];
  applicationCounter: number;
  submitApplication: (data: Omit<Application, 'id' | 'applicationNumber' | 'currentStatus' | 'statusHistory' | 'submittedAt' | 'updatedAt'>) => Application;
  updateApplicationStatus: (id: string, status: Application['currentStatus'], note?: string) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  getApplicationByNumber: (number: string) => Application | undefined;
  getApplicationsByPhone: (phone: string) => Application[];
  getApplicationsByUser: (userId: string) => Application[];

  // ── Notifications ──
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // ── Auth (simplified) ──
  currentUser: { id: string; name: string; email: string; phone: string } | null;
  isAdmin: boolean;
  setCurrentUser: (user: { id: string; name: string; email: string; phone: string } | null) => void;
  setIsAdmin: (value: boolean) => void;
  loginAsAdmin: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Services ──
      services: defaultServices,

      addService: (service) =>
        set((state) => ({ services: [...state.services, service] })),

      updateService: (id, updates) =>
        set((state) => ({
          services: state.services.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      deleteService: (id) =>
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        })),

      // ── Applications ──
      applications: [],
      applicationCounter: 0,

      submitApplication: (data) => {
        const state = get();
        const newCounter = state.applicationCounter + 1;
        const newApp: Application = {
          ...data,
          id: generateId(),
          applicationNumber: generateApplicationNumber(newCounter),
          currentStatus: 'submitted',
          statusHistory: [
            {
              status: 'submitted',
              timestamp: new Date().toISOString(),
              note: 'Application submitted successfully',
            },
          ],
          submittedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set({
          applications: [newApp, ...state.applications],
          applicationCounter: newCounter,
        });

        // Add notification
        get().addNotification({
          userId: data.userId,
          title: 'Application Submitted',
          message: `Your application ${newApp.applicationNumber} for ${data.serviceName} has been submitted successfully.`,
          type: 'success',
          read: false,
        });

        return newApp;
      },

      updateApplicationStatus: (id, status, note) =>
        set((state) => ({
          applications: state.applications.map((app) => {
            if (app.id === id) {
              const newEntry = {
                status,
                timestamp: new Date().toISOString(),
                note: note || `Status updated to ${status}`,
              };
              return {
                ...app,
                currentStatus: status,
                statusHistory: [...app.statusHistory, newEntry],
                updatedAt: new Date().toISOString(),
              };
            }
            return app;
          }),
        })),

      updateApplication: (id, updates) =>
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id
              ? { ...app, ...updates, updatedAt: new Date().toISOString() }
              : app
          ),
        })),

      getApplicationByNumber: (number) =>
        get().applications.find((a) => a.applicationNumber === number),

      getApplicationsByPhone: (phone) =>
        get().applications.filter((a) => a.userPhone === phone),

      getApplicationsByUser: (userId) =>
        get().applications.filter((a) => a.userId === userId),

      // ── Notifications ──
      notifications: [],

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: generateId(),
              createdAt: new Date().toISOString(),
            },
            ...state.notifications,
          ],
        })),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      clearNotifications: () => set({ notifications: [] }),

      // ── Auth ──
      currentUser: null,
      isAdmin: false,

      setCurrentUser: (user) => set({ currentUser: user }),
      setIsAdmin: (value) => set({ isAdmin: value }),

      loginAsAdmin: (email, password) => {
        // Simple demo admin credentials
        if (email === 'admin@esevakendra.in' && password === 'admin123') {
          set({
            isAdmin: true,
            currentUser: {
              id: 'admin-1',
              name: 'Admin',
              email: 'admin@esevakendra.in',
              phone: '9876543210',
            },
          });
          return true;
        }
        return false;
      },

      logout: () =>
        set({
          currentUser: null,
          isAdmin: false,
        }),
    }),
    {
      name: 'e-seva-kendra-store',
      partialize: (state) => ({
        applications: state.applications,
        applicationCounter: state.applicationCounter,
        notifications: state.notifications,
        currentUser: state.currentUser,
        isAdmin: state.isAdmin,
        // Don't persist services to avoid stale custom data conflicts
      }),
    }
  )
);
