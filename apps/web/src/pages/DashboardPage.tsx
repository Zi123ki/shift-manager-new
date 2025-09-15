import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, Clock, Users, Building2, UserMinus } from 'lucide-react';

export default function DashboardPage() {
  const { t } = useTranslation();

  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: t('shifts.shifts'),
      value: '24',
      subtitle: 'השבוע',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-400 to-blue-600',
      lightBg: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      title: t('employees.employees'),
      value: '12',
      subtitle: 'פעילים',
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
      lightBg: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
    },
    {
      title: t('departments.departments'),
      value: '3',
      subtitle: 'מחלקות',
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-400 to-purple-600',
      lightBg: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
    {
      title: t('absences.absences'),
      value: '5',
      subtitle: 'ממתינות לאישור',
      icon: UserMinus,
      color: 'text-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-400 to-amber-600',
      lightBg: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800',
    },
  ];

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
          שלום! ברוכים הבאים למערכת ניהול המשמרות
        </h1>
        <p style={{ color: '#64748b' }}>
          כאן תוכלו לנהל את כל המשמרות, העובדים והחופשות של החברה
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} style={{ transition: 'box-shadow 0.2s' }}>
              <CardContent style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '0.5rem' }}>
                      {stat.title}
                    </p>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.25rem' }}>
                      {stat.value}
                    </p>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>
                      {stat.subtitle}
                    </p>
                  </div>
                  <div style={{
                    padding: '1rem',
                    borderRadius: '50%',
                    backgroundColor: stat.color === 'text-blue-600' ? '#3b82f6' :
                                    stat.color === 'text-emerald-600' ? '#10b981' :
                                    stat.color === 'text-purple-600' ? '#8b5cf6' : '#f59e0b'
                  }}>
                    <Icon style={{ width: '24px', height: '24px', color: 'white' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 ml-2 rtl:ml-0 rtl:mr-2" />
              משמרות השבוע הקרוב
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm md:text-base truncate">משמרת בוקר</p>
                  <p className="text-xs md:text-sm text-muted-foreground">08:00 - 16:00</p>
                </div>
                <div className="text-right rtl:text-left flex-shrink-0 ml-3 rtl:ml-0 rtl:mr-3">
                  <p className="text-sm font-medium">ראשון</p>
                  <p className="text-xs text-muted-foreground">3 עובדים</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm md:text-base truncate">משמרת ערב</p>
                  <p className="text-xs md:text-sm text-muted-foreground">16:00 - 00:00</p>
                </div>
                <div className="text-right rtl:text-left flex-shrink-0 ml-3 rtl:ml-0 rtl:mr-3">
                  <p className="text-sm font-medium">ראשון</p>
                  <p className="text-xs text-muted-foreground">2 עובדים</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm md:text-base truncate">משמרת בוקר</p>
                  <p className="text-xs md:text-sm text-muted-foreground">08:00 - 16:00</p>
                </div>
                <div className="text-right rtl:text-left flex-shrink-0 ml-3 rtl:ml-0 rtl:mr-3">
                  <p className="text-sm font-medium">שני</p>
                  <p className="text-xs text-muted-foreground">4 עובדים</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserMinus className="h-5 w-5 ml-2 rtl:ml-0 rtl:mr-2" />
              בקשות חופשה ממתינות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm md:text-base truncate">דני כהן</p>
                  <p className="text-xs md:text-sm text-muted-foreground">חופשה שנתית</p>
                </div>
                <div className="text-right rtl:text-left flex-shrink-0 ml-3 rtl:ml-0 rtl:mr-3">
                  <p className="text-xs md:text-sm">15-20 דצמבר</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 mt-1">
                    ממתין
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm md:text-base truncate">שרה לוי</p>
                  <p className="text-xs md:text-sm text-muted-foreground">דיווח מחלה</p>
                </div>
                <div className="text-right rtl:text-left flex-shrink-0 ml-3 rtl:ml-0 rtl:mr-3">
                  <p className="text-xs md:text-sm">22 דצמבר</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 mt-1">
                    ממתין
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm md:text-base truncate">מיכאל אברהם</p>
                  <p className="text-xs md:text-sm text-muted-foreground">חופשה חירום</p>
                </div>
                <div className="text-right rtl:text-left flex-shrink-0 ml-3 rtl:ml-0 rtl:mr-3">
                  <p className="text-xs md:text-sm">25-26 דצמבר</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 mt-1">
                    דחוף
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}