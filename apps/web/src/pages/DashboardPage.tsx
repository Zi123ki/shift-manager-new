import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, Clock, Users, Building2, UserMinus, TrendingUp, AlertCircle } from 'lucide-react';

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
    <div className="p-6 bg-gradient-to-br from-slate-100 to-blue-50 min-h-screen">
      {/* Welcome Header */}
      <div className="mb-8 p-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-1">
              דשבורד ניהול משמרות
            </h1>
            <p className="text-slate-600 text-lg">
              מרכז הבקרה המרכזי לניהול עובדים, משמרות וחופשות
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-xl mt-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-green-600 font-semibold">+12% פעילות השבוע</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span className="text-amber-600 font-semibold">5 בקשות ממתינות</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer">
              <div className={`h-1 ${stat.bgColor}`} />
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-3 font-medium uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-slate-800 mb-2 leading-none">
                      {stat.value}
                    </p>
                    <p className="text-sm text-slate-600 font-medium">
                      {stat.subtitle}
                    </p>
                  </div>
                  <div className={`p-4 rounded-2xl ${stat.lightBg} ${stat.borderColor} border-2`}>
                    <Icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6">
            <CardTitle className="flex items-center gap-2 m-0">
              <Calendar className="w-6 h-6" />
              משמרות השבוע הקרוב
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div>
                  <p className="font-semibold text-slate-800 mb-1">משמרת בוקר</p>
                  <p className="text-sm text-slate-600">08:00 - 16:00</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">ראשון</p>
                  <p className="text-xs text-slate-600">3 עובדים</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                <div>
                  <p className="font-semibold text-slate-800 mb-1">משמרת ערב</p>
                  <p className="text-sm text-slate-600">16:00 - 00:00</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">ראשון</p>
                  <p className="text-xs text-slate-600">2 עובדים</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div>
                  <p className="font-semibold text-slate-800 mb-1">משמרת בוקר</p>
                  <p className="text-sm text-slate-600">08:00 - 16:00</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-orange-600">שני</p>
                  <p className="text-xs text-slate-600">4 עובדים</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6">
            <CardTitle className="flex items-center gap-2 m-0">
              <UserMinus className="w-6 h-6" />
              בקשות חופשה ממתינות
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div>
                  <p className="font-semibold text-slate-800 mb-1">דני כהן</p>
                  <p className="text-sm text-slate-600">חופשה שנתית</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600 mb-1">15-20 דצמבר</p>
                  <span className="px-3 py-1 rounded-full text-xs bg-yellow-200 text-yellow-800 font-semibold">
                    ממתין
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div>
                  <p className="font-semibold text-slate-800 mb-1">שרה לוי</p>
                  <p className="text-sm text-slate-600">דיווח מחלה</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600 mb-1">22 דצמבר</p>
                  <span className="px-3 py-1 rounded-full text-xs bg-yellow-200 text-yellow-800 font-semibold">
                    ממתין
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                <div>
                  <p className="font-semibold text-slate-800 mb-1">מיכאל אברהם</p>
                  <p className="text-sm text-slate-600">חופשה חירום</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600 mb-1">25-26 דצמבר</p>
                  <span className="px-3 py-1 rounded-full text-xs bg-red-200 text-red-800 font-semibold">
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