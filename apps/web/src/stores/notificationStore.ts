import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export interface Notification {
  id: string;
  userId: string;
  type: 'shift_assigned' | 'shift_changed' | 'shift_cancelled' | 'schedule_updated' | 'payroll_ready' | 'system_announcement' | 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  createdBy: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    shiftId?: string;
    date?: string;
    oldTime?: string;
    newTime?: string;
    reason?: string;
  };
}

interface NotificationState {
  notifications: Notification[];
  settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    soundEnabled: boolean;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  loading: boolean;

  // Notification management
  getNotifications: (userId: string) => Notification[];
  getUnreadCount: (userId: string) => number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: (userId: string) => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: (userId: string) => void;

  // Bulk operations
  notifyShiftChange: (employeeIds: string[], shiftData: any, changeType: 'assigned' | 'changed' | 'cancelled', createdBy: string) => void;
  notifyScheduleUpdate: (employeeIds: string[], scheduleData: any, createdBy: string) => void;
  sendSystemAnnouncement: (userIds: string[], announcement: { title: string; message: string; priority?: 'low' | 'medium' | 'high' | 'urgent' }, createdBy: string) => void;

  // Settings
  updateSettings: (userId: string, settings: Partial<NotificationState['settings']>) => void;

  // Demo data initialization
  initializeDemoNotifications: (userId: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      settings: {
        emailNotifications: true,
        pushNotifications: true,
        soundEnabled: true,
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '07:00'
        }
      },
      loading: false,

      getNotifications: (userId: string) => {
        return get().notifications
          .filter(n => n.userId === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getUnreadCount: (userId: string) => {
        return get().notifications.filter(n => n.userId === userId && !n.read).length;
      },

      addNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };

        set(state => ({
          notifications: [...state.notifications, newNotification]
        }));

        // Show toast for high/urgent priority notifications
        if (notificationData.priority === 'high' || notificationData.priority === 'urgent') {
          toast(newNotification.title, {
            icon: notificationData.priority === 'urgent' ? '🚨' : '⚠️',
            duration: notificationData.priority === 'urgent' ? 8000 : 5000
          });
        }
      },

      markAsRead: (notificationId: string) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
          )
        }));
      },

      markAllAsRead: (userId: string) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.userId === userId ? { ...n, read: true } : n
          )
        }));
      },

      deleteNotification: (notificationId: string) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== notificationId)
        }));
      },

      clearAllNotifications: (userId: string) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.userId !== userId)
        }));
      },

      notifyShiftChange: (employeeIds: string[], shiftData: any, changeType: 'assigned' | 'changed' | 'cancelled', createdBy: string) => {
        const templates = {
          assigned: { title: 'משמרת חדשה הוקצתה', priority: 'medium' as const },
          changed: { title: 'שינוי במשמרת', priority: 'high' as const },
          cancelled: { title: 'משמרת בוטלה', priority: 'high' as const }
        };

        const template = templates[changeType];
        let message = '';
        let actionUrl = '/shifts';

        if (changeType === 'assigned') {
          message = `הוקצתה לך משמרת חדשה ב${new Date(shiftData.date).toLocaleDateString('he-IL')} בשעות ${shiftData.startTime}-${shiftData.endTime}`;
        } else if (changeType === 'changed') {
          message = `המשמרת שלך ב${new Date(shiftData.date).toLocaleDateString('he-IL')} שונתה ל${shiftData.startTime}-${shiftData.endTime}`;
        } else if (changeType === 'cancelled') {
          message = `המשמרת שלך ב${new Date(shiftData.date).toLocaleDateString('he-IL')} בוטלה${shiftData.reason ? `. סיבה: ${shiftData.reason}` : ''}`;
        }

        employeeIds.forEach(employeeId => {
          get().addNotification({
            userId: employeeId,
            type: `shift_${changeType}` as any,
            title: template.title,
            message,
            read: false,
            createdBy,
            priority: template.priority,
            actionUrl,
            actionLabel: 'צפה בלוח משמרות',
            metadata: {
              shiftId: shiftData.id,
              date: shiftData.date,
              oldTime: shiftData.oldTime,
              newTime: `${shiftData.startTime}-${shiftData.endTime}`,
              reason: shiftData.reason
            }
          });
        });

        toast.success(`הודעות נשלחו ל-${employeeIds.length} עובדים`);
      },

      notifyScheduleUpdate: (employeeIds: string[], scheduleData: any, createdBy: string) => {
        employeeIds.forEach(employeeId => {
          get().addNotification({
            userId: employeeId,
            type: 'schedule_updated',
            title: 'לוח הזמנים עודכן',
            message: 'לוח הזמנים שלך עבור השבוע הקרוב עודכן',
            read: false,
            createdBy,
            priority: 'medium',
            actionUrl: '/shifts',
            actionLabel: 'צפה בלוח זמנים'
          });
        });

        toast.success(`עדכון לוח זמנים נשלח ל-${employeeIds.length} עובדים`);
      },

      sendSystemAnnouncement: (userIds: string[], announcement: { title: string; message: string; priority?: 'low' | 'medium' | 'high' | 'urgent' }, createdBy: string) => {
        userIds.forEach(userId => {
          get().addNotification({
            userId,
            type: 'system_announcement',
            title: announcement.title,
            message: announcement.message,
            read: false,
            createdBy,
            priority: announcement.priority || 'medium',
            actionUrl: undefined,
            actionLabel: undefined
          });
        });

        toast.success(`הודעת מערכת נשלחה ל-${userIds.length} משתמשים`);
      },

      updateSettings: (userId: string, newSettings: Partial<NotificationState['settings']>) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings }
        }));
        toast.success('הגדרות התראות עודכנו');
      },

      initializeDemoNotifications: (userId: string) => {
        const existingNotifications = get().getNotifications(userId);
        if (existingNotifications.length > 0) return;

        // Create demo notifications
        const demoNotifications = [
          {
            userId,
            type: 'shift_assigned' as const,
            title: 'משמרת חדשה הוקצתה',
            message: 'הוקצתה לך משמרת חדשה ביום ראשון 22/12 בשעות 08:00-16:00',
            read: false,
            createdBy: 'manager',
            priority: 'medium' as const,
            actionUrl: '/shifts',
            actionLabel: 'צפה בלוח משמרות',
            metadata: {
              shiftId: 'shift_123',
              date: '2024-12-22',
              newTime: '08:00-16:00'
            }
          },
          {
            userId,
            type: 'schedule_updated' as const,
            title: 'לוח הזמנים עודכן',
            message: 'לוח הזמנים שלך עבור השבוע הקרוב עודכן',
            read: false,
            createdBy: 'manager',
            priority: 'medium' as const,
            actionUrl: '/shifts',
            actionLabel: 'צפה בלוח זמנים'
          },
          {
            userId,
            type: 'system_announcement' as const,
            title: 'עדכון מערכת',
            message: 'המערכת עודכנה עם תכונות חדשות. ניתן כעת לראות התראות וקבל עדכונים על שינויים במשמרות',
            read: true,
            createdBy: 'system',
            priority: 'low' as const
          }
        ];

        demoNotifications.forEach(notification => {
          get().addNotification(notification);
        });
      }
    }),
    {
      name: 'notification-storage',
      version: 1,
    }
  )
);