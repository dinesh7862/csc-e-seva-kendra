// ============================================================
// E Seva Kendra — Global State Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Application, Notification, Service } from '@/types';
import { services as defaultServices } from '@/data/services';
import { generateId, generateApplicationNumber } from '@/lib/utils';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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

  // ── Supabase Synchronization ──
  syncWithSupabase: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Services ──
      services: defaultServices,

      addService: (service) => {
        set((state) => ({ services: [...state.services, service] }));
        
        if (isSupabaseConfigured) {
          supabase
            .from('services')
            .insert([{
              id: service.id,
              name: service.name,
              icon: service.icon,
              description: service.description,
              category_id: service.categoryId,
              processing_time: service.processingTime,
              government_fee: service.governmentFee,
              service_charge: service.serviceCharge,
              eligibility: service.eligibility,
              featured: service.featured,
              active: service.active
            }])
            .then(({ error }: { error: any }) => {
              if (error) console.error('Supabase addService error:', error);
            });
        }
      },

      updateService: (id, updates) => {
        set((state) => ({
          services: state.services.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        }));

        if (isSupabaseConfigured) {
          supabase
            .from('services')
            .update({
              name: updates.name,
              icon: updates.icon,
              description: updates.description,
              category_id: updates.categoryId,
              processing_time: updates.processingTime,
              government_fee: updates.governmentFee,
              service_charge: updates.serviceCharge,
              eligibility: updates.eligibility,
              featured: updates.featured,
              active: updates.active,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .then(({ error }: { error: any }) => {
              if (error) console.error('Supabase updateService error:', error);
            });
        }
      },

      deleteService: (id) => {
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        }));

        if (isSupabaseConfigured) {
          supabase
            .from('services')
            .delete()
            .eq('id', id)
            .then(({ error }: { error: any }) => {
              if (error) console.error('Supabase deleteService error:', error);
            });
        }
      },

      // ── Applications ──
      applications: [],
      applicationCounter: 0,

      submitApplication: (data) => {
        const state = get();
        const newCounter = state.applicationCounter + 1;
        const newAppId = generateId(); // UUID like string for local reference or UUID format if supabase creates it
        
        const newApp: Application = {
          ...data,
          id: newAppId,
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

        // Add local notification
        get().addNotification({
          userId: data.userId,
          title: 'Application Submitted',
          message: `Your application ${newApp.applicationNumber} for ${data.serviceName} has been submitted successfully.`,
          type: 'success',
          read: false,
        });

        // Sync with Supabase Database
        if (isSupabaseConfigured) {
          supabase
            .from('applications')
            .insert([{
              id: newApp.id,
              application_number: newApp.applicationNumber,
              service_id: newApp.serviceId,
              service_name: newApp.serviceName,
              user_name: newApp.userName,
              user_email: newApp.userEmail,
              user_phone: newApp.userPhone,
              form_data: newApp.formData,
              current_status: newApp.currentStatus,
              government_fee: newApp.governmentFee,
              service_charge: newApp.serviceCharge,
              total_amount: newApp.totalAmount,
              payment_status: newApp.paymentStatus,
              payment_id: newApp.paymentId || null
            }])
            .then(({ error }: { error: any }) => {
              if (error) {
                console.error('Supabase submitApplication error:', error);
              } else {
                // Insert status history
                supabase
                  .from('status_history')
                  .insert([{
                    application_id: newApp.id,
                    status: 'submitted',
                    note: 'Application submitted successfully'
                  }])
                  .then(({ error: histErr }: { error: any }) => {
                    if (histErr) console.error('Supabase status_history submit error:', histErr);
                  });

                // Insert uploaded files references
                newApp.documents.forEach((doc) => {
                  supabase
                    .from('uploaded_files')
                    .insert([{
                      application_id: newApp.id,
                      document_id: doc.documentId,
                      file_name: doc.fileName,
                      file_size: doc.fileSize,
                      file_type: doc.fileType,
                      storage_path: doc.url,
                      status: 'pending'
                    }])
                    .then(({ error: fileErr }: { error: any }) => {
                      if (fileErr) console.error('Supabase uploaded_files insert error:', fileErr);
                    });
                });
              }
            });
        }

        return newApp;
      },

      updateApplicationStatus: (id, status, note) => {
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
        }));

        if (isSupabaseConfigured) {
          supabase
            .from('applications')
            .update({
              current_status: status,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .then(({ error }: { error: any }) => {
              if (error) {
                console.error('Supabase update status error:', error);
              } else {
                supabase
                  .from('status_history')
                  .insert([{
                    application_id: id,
                    status,
                    note: note || `Status updated to ${status}`
                  }])
                  .then(({ error: histErr }: { error: any }) => {
                    if (histErr) console.error('Supabase status_history write error:', histErr);
                  });
              }
            });
        }
      },

      updateApplication: (id, updates) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id
              ? { ...app, ...updates, updatedAt: new Date().toISOString() }
              : app
          ),
        }));

        if (isSupabaseConfigured) {
          supabase
            .from('applications')
            .update({
              form_data: updates.formData,
              payment_status: updates.paymentStatus,
              payment_id: updates.paymentId,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .then(({ error }: { error: any }) => {
              if (error) console.error('Supabase updateApplication error:', error);
            });
        }
      },

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

      // ── Supabase Sync Implementation ──
      syncWithSupabase: async () => {
        if (!isSupabaseConfigured) return;
        try {
          // Sync Services
          const { data: dbServices } = await supabase.from('services').select('*');
          if (dbServices && dbServices.length > 0) {
            const mappedServices: Service[] = dbServices.map((s: any) => ({
              id: s.id,
              name: s.name,
              icon: s.icon || 'FileText',
              description: s.description || '',
              categoryId: s.category_id || 'identity',
              processingTime: s.processing_time || '3-5 Working Days',
              governmentFee: Number(s.government_fee) || 0,
              serviceCharge: Number(s.service_charge) || 199,
              eligibility: Array.isArray(s.eligibility) ? s.eligibility : [],
              featured: s.featured || false,
              active: s.active || true,
              requiredDocuments: [],
              formFields: []
            }));

            const { data: dbDocs } = await supabase.from('required_documents').select('*');
            const { data: dbFields } = await supabase.from('form_fields').select('*');

            mappedServices.forEach((service) => {
              if (dbDocs) {
                service.requiredDocuments = dbDocs
                  .filter((d: any) => d.service_id === service.id)
                  .map((d: any) => ({
                    id: d.id,
                    name: d.name,
                    acceptedFormats: Array.isArray(d.accepted_formats) ? d.accepted_formats : ['pdf', 'jpg', 'png'],
                    maxSizeMB: d.max_size_mb || 10,
                    required: d.required !== false
                  }));
              }
              if (dbFields) {
                service.formFields = dbFields
                  .filter((f: any) => f.service_id === service.id)
                  .map((f: any) => ({
                    id: f.id,
                    label: f.label,
                    type: f.type || 'text',
                    required: f.required !== false,
                    options: Array.isArray(f.options) ? f.options : undefined
                  }));
              }
            });

            set({ services: mappedServices });
          }

          // Sync Applications
          const { data: dbApps } = await supabase.from('applications').select('*');
          if (dbApps) {
            const mappedApps: Application[] = await Promise.all(
              dbApps.map(async (a: any) => {
                const { data: dbHistory } = await supabase
                  .from('status_history')
                  .select('*')
                  .eq('application_id', a.id)
                  .order('created_at', { ascending: true });

                const { data: dbFiles } = await supabase
                  .from('uploaded_files')
                  .select('*')
                  .eq('application_id', a.id);

                return {
                  id: a.id,
                  applicationNumber: a.application_number,
                  serviceId: a.service_id,
                  serviceName: a.service_name,
                  userId: a.user_id,
                  userName: a.user_name,
                  userEmail: a.user_email,
                  userPhone: a.user_phone,
                  formData: a.form_data || {},
                  currentStatus: a.current_status,
                  governmentFee: Number(a.government_fee) || 0,
                  serviceCharge: Number(a.service_charge) || 0,
                  totalAmount: Number(a.total_amount) || 0,
                  paymentStatus: a.payment_status || 'pending',
                  paymentId: a.payment_id || undefined,
                  submittedAt: a.submitted_at || new Date().toISOString(),
                  updatedAt: a.updated_at || new Date().toISOString(),
                  statusHistory: dbHistory
                    ? dbHistory.map((h: any) => ({
                        status: h.status,
                        timestamp: h.created_at,
                        note: h.note || ''
                      }))
                    : [],
                  documents: dbFiles
                    ? dbFiles.map((f: any) => ({
                        id: f.id,
                        documentId: f.document_id,
                        fileName: f.file_name,
                        fileSize: Number(f.file_size) || 0,
                        fileType: f.file_type || '',
                        url: f.storage_path,
                        uploadedAt: f.uploaded_at,
                        status: f.status
                      }))
                    : []
                };
              })
            );

            set({
              applications: mappedApps,
              applicationCounter: Math.max(...mappedApps.map(a => {
                const match = a.applicationNumber.match(/\d+$/);
                return match ? parseInt(match[0], 10) : 0;
              }), 0)
            });
          }
        } catch (err) {
          console.error('Supabase sync error:', err);
        }
      }
    }),
    {
      name: 'e-seva-kendra-store',
      partialize: (state) => ({
        applications: state.applications,
        applicationCounter: state.applicationCounter,
        notifications: state.notifications,
        currentUser: state.currentUser,
        isAdmin: state.isAdmin,
      }),
    }
  )
);
