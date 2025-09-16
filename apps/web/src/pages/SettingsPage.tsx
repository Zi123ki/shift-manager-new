import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Settings,
  Building2,
  Users,
  Clock,
  Globe,
  Palette,
  Shield,
  Mail,
  Phone,
  MapPin,
  Save,
  Bell,
  Monitor,
  Moon,
  Sun
} from 'lucide-react';

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
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'company' | 'work' | 'notifications' | 'appearance' | 'security'>('company');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    name: 'מפעל הדוגמה בע"מ',
    address: 'רחוב התעשייה 15, פתח תקווה',
    phone: '03-1234567',
    email: 'info@example-factory.co.il',
    website: 'www.example-factory.co.il'
  });

  const [workSettings, setWorkSettings] = useState<WorkSettings>({
    defaultShiftLength: 8,
    workDaysPerWeek: 5,
    overtimeThreshold: 45,
    vacationDaysPerYear: 20
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    shiftReminders: true,
    absenceRequests: true
  });

  const handleSave = () => {
    // Here would be API call to save settings
    alert('הגדרות נשמרו בהצלחה!');
  };

  const tabs = [
    { id: 'company', label: 'פרטי החברה', icon: Building2 },
    { id: 'work', label: 'הגדרות עבודה', icon: Clock },
    { id: 'notifications', label: 'התראות', icon: Bell },
    { id: 'appearance', label: 'תצוגה', icon: Palette },
    { id: 'security', label: 'אבטחה', icon: Shield }
  ];

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
          הגדרות מערכת
        </h1>
        <p style={{ color: '#64748b' }}>
          ניהול הגדרות החברה, עבודה והמערכת
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <div style={{ width: '280px', flexShrink: 0 }}>
          <Card style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
            <CardContent style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      style={{
                        justifyContent: 'flex-start',
                        padding: '0.75rem 1rem',
                        backgroundColor: activeTab === tab.id ? '#eff6ff' : 'transparent',
                        color: activeTab === tab.id ? '#3b82f6' : '#64748b',
                        border: activeTab === tab.id ? '1px solid #bfdbfe' : '1px solid transparent',
                        borderRadius: '8px',
                        fontWeight: activeTab === tab.id ? '600' : '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                    >
                      <Icon style={{ width: '18px', height: '18px' }} />
                      {tab.label}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {activeTab === 'company' && (
            <Card style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
              <CardHeader style={{ borderBottom: '1px solid #f1f5f9' }}>
                <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                  <Building2 style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
                  פרטי החברה
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: '2rem' }}>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                        שם החברה
                      </label>
                      <Input
                        value={companySettings.name}
                        onChange={(e) => setCompanySettings(prev => ({ ...prev, name: e.target.value }))}
                        style={{ height: '44px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                        אתר אינטרנט
                      </label>
                      <Input
                        value={companySettings.website}
                        onChange={(e) => setCompanySettings(prev => ({ ...prev, website: e.target.value }))}
                        style={{ height: '44px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                      כתובת
                    </label>
                    <Input
                      value={companySettings.address}
                      onChange={(e) => setCompanySettings(prev => ({ ...prev, address: e.target.value }))}
                      style={{ height: '44px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                        טלפון
                      </label>
                      <Input
                        value={companySettings.phone}
                        onChange={(e) => setCompanySettings(prev => ({ ...prev, phone: e.target.value }))}
                        style={{ height: '44px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                        אימייל
                      </label>
                      <Input
                        value={companySettings.email}
                        onChange={(e) => setCompanySettings(prev => ({ ...prev, email: e.target.value }))}
                        style={{ height: '44px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <Button
                      onClick={handleSave}
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '0.75rem 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Save style={{ width: '16px', height: '16px' }} />
                      שמור שינויים
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'work' && (
            <Card style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
              <CardHeader style={{ borderBottom: '1px solid #f1f5f9' }}>
                <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                  <Clock style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
                  הגדרות עבודה
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: '2rem' }}>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                        אורך משמרת ברירת מחדל (שעות)
                      </label>
                      <Input
                        type="number"
                        value={workSettings.defaultShiftLength}
                        onChange={(e) => setWorkSettings(prev => ({ ...prev, defaultShiftLength: parseInt(e.target.value) }))}
                        style={{ height: '44px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                        ימי עבודה בשבוע
                      </label>
                      <Input
                        type="number"
                        value={workSettings.workDaysPerWeek}
                        onChange={(e) => setWorkSettings(prev => ({ ...prev, workDaysPerWeek: parseInt(e.target.value) }))}
                        style={{ height: '44px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                        סף שעות נוספות (שעות בשבוע)
                      </label>
                      <Input
                        type="number"
                        value={workSettings.overtimeThreshold}
                        onChange={(e) => setWorkSettings(prev => ({ ...prev, overtimeThreshold: parseInt(e.target.value) }))}
                        style={{ height: '44px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                        ימי חופשה בשנה
                      </label>
                      <Input
                        type="number"
                        value={workSettings.vacationDaysPerYear}
                        onChange={(e) => setWorkSettings(prev => ({ ...prev, vacationDaysPerYear: parseInt(e.target.value) }))}
                        style={{ height: '44px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <Button
                      onClick={handleSave}
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '0.75rem 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Save style={{ width: '16px', height: '16px' }} />
                      שמור שינויים
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
              <CardHeader style={{ borderBottom: '1px solid #f1f5f9' }}>
                <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                  <Bell style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
                  הגדרות התראות
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: '2rem' }}>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {[
                    { key: 'emailNotifications', label: 'התראות במייל', desc: 'קבלת התראות בדואר אלקטרוני' },
                    { key: 'smsNotifications', label: 'התראות SMS', desc: 'קבלת התראות בהודעות טקסט' },
                    { key: 'shiftReminders', label: 'תזכורות משמרות', desc: 'תזכורת לפני תחילת המשמרת' },
                    { key: 'absenceRequests', label: 'בקשות חופשה', desc: 'התראה על בקשות חופשה חדשות' }
                  ].map((setting) => (
                    <div key={setting.key} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                          {setting.label}
                        </div>
                        <div style={{ fontSize: '14px', color: '#64748b' }}>
                          {setting.desc}
                        </div>
                      </div>
                      <Button
                        onClick={() => setNotifications(prev => ({
                          ...prev,
                          [setting.key]: !prev[setting.key as keyof NotificationSettings]
                        }))}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: notifications[setting.key as keyof NotificationSettings] ? '#10b981' : '#e2e8f0',
                          color: notifications[setting.key as keyof NotificationSettings] ? 'white' : '#64748b',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        {notifications[setting.key as keyof NotificationSettings] ? 'פעיל' : 'כבוי'}
                      </Button>
                    </div>
                  ))}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <Button
                      onClick={handleSave}
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '0.75rem 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Save style={{ width: '16px', height: '16px' }} />
                      שמור שינויים
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
              <CardHeader style={{ borderBottom: '1px solid #f1f5f9' }}>
                <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                  <Palette style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
                  הגדרות תצוגה
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: '2rem' }}>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {isDarkMode ? <Moon style={{ width: '20px', height: '20px', color: '#3b82f6' }} /> : <Sun style={{ width: '20px', height: '20px', color: '#f59e0b' }} />}
                      <div>
                        <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                          מצב כהה
                        </div>
                        <div style={{ fontSize: '14px', color: '#64748b' }}>
                          עבור לעיצוב כהה של המערכת
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: isDarkMode ? '#10b981' : '#e2e8f0',
                        color: isDarkMode ? 'white' : '#64748b',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      {isDarkMode ? 'פעיל' : 'כבוי'}
                    </Button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <Button
                      onClick={handleSave}
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '0.75rem 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Save style={{ width: '16px', height: '16px' }} />
                      שמור שינויים
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
              <CardHeader style={{ borderBottom: '1px solid #f1f5f9' }}>
                <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                  <Shield style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
                  הגדרות אבטחה
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: '2rem' }}>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: '#fef3c7',
                    borderRadius: '8px',
                    border: '1px solid #f59e0b'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <Shield style={{ width: '20px', height: '20px', color: '#92400e' }} />
                      <span style={{ fontWeight: '600', color: '#92400e' }}>הגדרות אבטחה</span>
                    </div>
                    <p style={{ color: '#92400e', margin: 0, fontSize: '14px' }}>
                      הגדרות אבטחה מתקדמות יהיו זמינות בגרסה המלאה של המערכת
                    </p>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem'
                  }}>
                    <div style={{
                      padding: '1rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      textAlign: 'center'
                    }}>
                      <Users style={{ width: '24px', height: '24px', color: '#3b82f6', margin: '0 auto 0.5rem' }} />
                      <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                        ניהול משתמשים
                      </div>
                      <div style={{ fontSize: '14px', color: '#64748b' }}>
                        הגדרת הרשאות וזכויות גישה
                      </div>
                    </div>

                    <div style={{
                      padding: '1rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      textAlign: 'center'
                    }}>
                      <Globe style={{ width: '24px', height: '24px', color: '#3b82f6', margin: '0 auto 0.5rem' }} />
                      <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                        גיבוי נתונים
                      </div>
                      <div style={{ fontSize: '14px', color: '#64748b' }}>
                        גיבוי אוטומטי של נתוני המערכת
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}