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
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl shadow-xl">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H5m14 0H9" />
          </svg>
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-300 bg-clip-text text-transparent">
            שלום! ברוכים הבאים למערכת ניהול המשמרות
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">
            מערכת מקצועית וחדשנית לניהול עובדים, משמרות וחופשות בצורה יעילה ונוחה
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`group hover:shadow-2xl hover:scale-105 transition-all duration-300 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-0 shadow-xl overflow-hidden ${stat.lightBg}`}>
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.subtitle}
                    </p>
                  </div>
                  <div className={`p-4 rounded-2xl shadow-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-blue-50 dark:to-blue-900/20 rounded-full transform translate-x-16 -translate-y-16 opacity-50"></div>
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