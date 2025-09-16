import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Building2,
  Clock,
  Palette,
  Shield,
  Save,
  Bell,
  Moon,
  Sun,
  Settings as SettingsIcon,
  User,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface CompanySettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo?: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  shiftReminders: boolean;
  absenceRequests: boolean;
}

interface WorkSettings {
  defaultShiftLength: number;
  workDaysPerWeek: number;
  overtimeThreshold: number;
  vacationDaysPerYear: number;
}

export default function SettingsPage() {
  const {} = useTranslation();
  const { company, user, updateCompany } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'company' | 'work' | 'notifications' | 'appearance' | 'security'>('company');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    name: company?.name || 'מערכת ניהול משמרות',
    address: 'רחוב התעשייה 15, פתח תקווה',
    phone: '03-1234567',
    email: 'info@shift-manager.co.il',
    website: 'www.shift-manager.co.il'
  });

  const [workSettings, setWorkSettings] = useState<WorkSettings>({
    defaultShiftLength: 8,
    workDaysPerWeek: 5,
    overtimeThreshold: 40,
    vacationDaysPerYear: 22
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    shiftReminders: true,
    absenceRequests: true
  });

  const handleSaveCompanySettings = () => {
    updateCompany({ name: companySettings.name });
    alert('הגדרות החברה נשמרו בהצלחה!');
  };

  const tabs = [
    { id: 'company', label: 'פרטי החברה', icon: Building2 },
    { id: 'work', label: 'הגדרות עבודה', icon: Clock },
    { id: 'notifications', label: 'התראות', icon: Bell },
    { id: 'appearance', label: 'מראה', icon: Palette },
    { id: 'security', label: 'אבטחה', icon: Shield }
  ];

  return (
    <div style={{
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '2rem',
        padding: '1.5rem',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            <SettingsIcon style={{ width: '24px', height: '24px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.875rem',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 4px 0'
            }}>
              הגדרות מערכת
            </h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '1rem' }}>
              נהל הגדרות החברה והמערכת שלך
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Sidebar */}
        <Card style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}>
          <CardContent style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      padding: '0.875rem 1rem',
                      background: activeTab === tab.id ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'transparent',
                      color: activeTab === tab.id ? 'white' : '#64748b',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '500',
                      fontSize: '14px',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <Icon style={{ width: '16px', height: '16px' }} />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}>
          <CardContent style={{ padding: '2rem' }}>
            {/* Company Settings */}
            {activeTab === 'company' && (
              <div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Building2 style={{ width: '20px', height: '20px' }} />
                  פרטי החברה
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        שם החברה *
                      </label>
                      <Input
                        type="text"
                        value={companySettings.name}
                        onChange={(e) => setCompanySettings(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="הכנס שם החברה"
                        style={{
                          padding: '0.75rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          width: '100%'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        טלפון
                      </label>
                      <Input
                        type="text"
                        value={companySettings.phone}
                        onChange={(e) => setCompanySettings(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="03-1234567"
                        style={{
                          padding: '0.75rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          width: '100%'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '14px'
                    }}>
                      כתובת
                    </label>
                    <Input
                      type="text"
                      value={companySettings.address}
                      onChange={(e) => setCompanySettings(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="כתובת החברה"
                      style={{
                        padding: '0.75rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        width: '100%'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        אימייל
                      </label>
                      <Input
                        type="email"
                        value={companySettings.email}
                        onChange={(e) => setCompanySettings(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="info@company.com"
                        style={{
                          padding: '0.75rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          width: '100%'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        אתר אינטרנט
                      </label>
                      <Input
                        type="text"
                        value={companySettings.website}
                        onChange={(e) => setCompanySettings(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="www.company.com"
                        style={{
                          padding: '0.75rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          width: '100%'
                        }}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveCompanySettings}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.75rem 1.5rem',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '14px',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      alignSelf: 'flex-start'
                    }}
                  >
                    <Save style={{ width: '16px', height: '16px' }} />
                    שמור הגדרות
                  </Button>
                </div>
              </div>
            )}

            {/* Work Settings */}
            {activeTab === 'work' && (
              <div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Clock style={{ width: '20px', height: '20px' }} />
                  הגדרות עבודה
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        אורך משמרת ברירת מחדל (שעות)
                      </label>
                      <Input
                        type="number"
                        value={workSettings.defaultShiftLength}
                        onChange={(e) => setWorkSettings(prev => ({ ...prev, defaultShiftLength: parseInt(e.target.value) }))}
                        min="1"
                        max="24"
                        style={{
                          padding: '0.75rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          width: '100%'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        ימי עבודה בשבוע
                      </label>
                      <Input
                        type="number"
                        value={workSettings.workDaysPerWeek}
                        onChange={(e) => setWorkSettings(prev => ({ ...prev, workDaysPerWeek: parseInt(e.target.value) }))}
                        min="1"
                        max="7"
                        style={{
                          padding: '0.75rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          width: '100%'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        סף שעות נוספות (שבועי)
                      </label>
                      <Input
                        type="number"
                        value={workSettings.overtimeThreshold}
                        onChange={(e) => setWorkSettings(prev => ({ ...prev, overtimeThreshold: parseInt(e.target.value) }))}
                        min="20"
                        max="80"
                        style={{
                          padding: '0.75rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          width: '100%'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        ימי חופשה בשנה
                      </label>
                      <Input
                        type="number"
                        value={workSettings.vacationDaysPerYear}
                        onChange={(e) => setWorkSettings(prev => ({ ...prev, vacationDaysPerYear: parseInt(e.target.value) }))}
                        min="0"
                        max="50"
                        style={{
                          padding: '0.75rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          width: '100%'
                        }}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => alert('הגדרות העבודה נשמרו בהצלחה!')}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.75rem 1.5rem',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '14px',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      alignSelf: 'flex-start'
                    }}
                  >
                    <Save style={{ width: '16px', height: '16px' }} />
                    שמור הגדרות
                  </Button>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Bell style={{ width: '20px', height: '20px' }} />
                  הגדרות התראות
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { key: 'emailNotifications', label: 'התראות דוא"ל' },
                    { key: 'smsNotifications', label: 'הודעות SMS' },
                    { key: 'shiftReminders', label: 'תזכורות משמרת' },
                    { key: 'absenceRequests', label: 'בקשות היעדרות' }
                  ].map((setting) => (
                    <div key={setting.key} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <span style={{ fontWeight: '500', color: '#374151' }}>{setting.label}</span>
                      <Button
                        onClick={() => setNotificationSettings(prev => ({
                          ...prev,
                          [setting.key]: !prev[setting.key as keyof NotificationSettings]
                        }))}
                        style={{
                          width: '50px',
                          height: '24px',
                          borderRadius: '12px',
                          border: 'none',
                          background: notificationSettings[setting.key as keyof NotificationSettings]
                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                            : '#e5e7eb',
                          position: 'relative',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: 'white',
                          position: 'absolute',
                          top: '2px',
                          right: notificationSettings[setting.key as keyof NotificationSettings] ? '2px' : '28px',
                          transition: 'all 0.2s',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }} />
                      </Button>
                    </div>
                  ))}

                  <Button
                    onClick={() => alert('הגדרות ההתראות נשמרו בהצלחה!')}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.75rem 1.5rem',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '14px',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      alignSelf: 'flex-start',
                      marginTop: '1rem'
                    }}
                  >
                    <Save style={{ width: '16px', height: '16px' }} />
                    שמור הגדרות
                  </Button>
                </div>
              </div>
            )}

            {/* Appearance */}
            {activeTab === 'appearance' && (
              <div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Palette style={{ width: '20px', height: '20px' }} />
                  מראה המערכת
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {isDarkMode ? <Moon style={{ width: '20px', height: '20px', color: '#374151' }} /> : <Sun style={{ width: '20px', height: '20px', color: '#374151' }} />}
                      <span style={{ fontWeight: '500', color: '#374151' }}>מצב כהה</span>
                    </div>
                    <Button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      style={{
                        width: '50px',
                        height: '24px',
                        borderRadius: '12px',
                        border: 'none',
                        background: isDarkMode ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#e5e7eb',
                        position: 'relative',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'white',
                        position: 'absolute',
                        top: '2px',
                        right: isDarkMode ? '2px' : '28px',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }} />
                    </Button>
                  </div>

                  <div style={{
                    padding: '1rem',
                    background: '#fef3c7',
                    border: '1px solid #f59e0b',
                    borderRadius: '8px',
                    color: '#92400e'
                  }}>
                    <strong>בקרוב:</strong> תכונות נושא מתקדמות יהיו זמינות בגרסה הבאה של המערכת
                  </div>

                  <Button
                    onClick={() => alert('הגדרות המראה נשמרו בהצלחה!')}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.75rem 1.5rem',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '14px',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      alignSelf: 'flex-start'
                    }}
                  >
                    <Save style={{ width: '16px', height: '16px' }} />
                    שמור הגדרות
                  </Button>
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Shield style={{ width: '20px', height: '20px' }} />
                  אבטחה והרשאות
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Current User Info */}
                  <div style={{
                    padding: '1rem',
                    background: '#f0f9ff',
                    border: '1px solid #0ea5e9',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <User style={{ width: '16px', height: '16px', color: '#0284c7' }} />
                      <span style={{ fontWeight: '600', color: '#0284c7' }}>משתמש נוכחי</span>
                    </div>
                    <div style={{ color: '#374151' }}>
                      <div>שם: {user?.username}</div>
                      <div>אימייל: {user?.email}</div>
                      <div>תפקיד: {user?.role === 'ADMIN' ? 'מנהל' : user?.role === 'MANAGER' ? 'מנהל' : 'עובד'}</div>
                    </div>
                  </div>

                  {/* Security Features */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div>
                        <div style={{ fontWeight: '500', color: '#374151' }}>אימות דו-שלבי</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          הגן על החשבון שלך עם שכבת אבטחה נוספת
                        </div>
                      </div>
                      <Button
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#f59e0b',
                          border: 'none',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        בקרוב
                      </Button>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div>
                        <div style={{ fontWeight: '500', color: '#374151' }}>יומן פעילות</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          עקוב אחר פעולות במערכת
                        </div>
                      </div>
                      <Button
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#f59e0b',
                          border: 'none',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        בקרוב
                      </Button>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div>
                        <div style={{ fontWeight: '500', color: '#374151' }}>ניהול הרשאות מתקדם</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          הגדר הרשאות מפורטות לכל משתמש
                        </div>
                      </div>
                      <Button
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#f59e0b',
                          border: 'none',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        בקרוב
                      </Button>
                    </div>
                  </div>

                  <div style={{
                    padding: '1rem',
                    background: '#fef3c7',
                    border: '1px solid #f59e0b',
                    borderRadius: '8px',
                    color: '#92400e'
                  }}>
                    <strong>שדרוג מערכת:</strong> הגדרות אבטחה מתקדמות יהיו זמינות בגרסה המלאה של המערכת
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}