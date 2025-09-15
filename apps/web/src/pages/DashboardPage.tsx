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
    <div style={{
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      {/* Welcome Header */}
      <div style={{
        marginBottom: '2rem',
        padding: '2rem',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)'
          }}>
            <Building2 style={{ width: '32px', height: '32px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #1e293b, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.25rem'
            }}>
              דשבורד ניהול משמרות
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
              מרכז הבקרה המרכזי לניהול עובדים, משמרות וחופשות
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f1f5f9',
          borderRadius: '12px',
          marginTop: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp style={{ width: '20px', height: '20px', color: '#10b981' }} />
            <span style={{ color: '#10b981', fontWeight: '600' }}>+12% פעילות השבוע</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
            <span style={{ color: '#f59e0b', fontWeight: '600' }}>5 בקשות ממתינות</span>
          </div>
        </div>
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
          const iconColor = stat.color === 'text-blue-600' ? '#3b82f6' :
                           stat.color === 'text-emerald-600' ? '#10b981' :
                           stat.color === 'text-purple-600' ? '#8b5cf6' : '#f59e0b';
          return (
            <Card key={index} style={{
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 20px 40px rgba(0, 0, 0, 0.15), 0 0 20px ${iconColor}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${iconColor}, ${iconColor}cc)`
              }} />
              <CardContent style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '14px',
                      color: '#64748b',
                      marginBottom: '0.75rem',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {stat.title}
                    </p>
                    <p style={{
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      color: '#1e293b',
                      marginBottom: '0.5rem',
                      lineHeight: '1'
                    }}>
                      {stat.value}
                    </p>
                    <p style={{
                      fontSize: '13px',
                      color: '#64748b',
                      fontWeight: '500'
                    }}>
                      {stat.subtitle}
                    </p>
                  </div>
                  <div style={{
                    padding: '1.25rem',
                    borderRadius: '20px',
                    background: `linear-gradient(135deg, ${iconColor}, ${iconColor}dd)`,
                    boxShadow: `0 8px 20px ${iconColor}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon style={{ width: '28px', height: '28px', color: 'white' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <Card style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <CardHeader style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', color: 'white', padding: '1.5rem' }}>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Calendar style={{ width: '24px', height: '24px' }} />
              משמרות השבוע הקרוב
            </CardTitle>
          </CardHeader>
          <CardContent style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                borderRadius: '12px',
                border: '1px solid #bfdbfe'
              }}>
                <div>
                  <p style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>משמרת בוקר</p>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>08:00 - 16:00</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: '600', color: '#3b82f6' }}>ראשון</p>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>3 עובדים</p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                borderRadius: '12px',
                border: '1px solid #bbf7d0'
              }}>
                <div>
                  <p style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>משמרת ערב</p>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>16:00 - 00:00</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: '600', color: '#10b981' }}>ראשון</p>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>2 עובדים</p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'linear-gradient(135deg, #fef3e2, #fed7aa)',
                borderRadius: '12px',
                border: '1px solid #fdba74'
              }}>
                <div>
                  <p style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>משמרת בוקר</p>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>08:00 - 16:00</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: '600', color: '#f59e0b' }}>שני</p>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>4 עובדים</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <CardHeader style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', padding: '1.5rem' }}>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <UserMinus style={{ width: '24px', height: '24px' }} />
              בקשות חופשה ממתינות
            </CardTitle>
          </CardHeader>
          <CardContent style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                borderRadius: '12px',
                border: '1px solid #fde68a'
              }}>
                <div>
                  <p style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>דני כהן</p>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>חופשה שנתית</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '0.25rem' }}>15-20 דצמבר</p>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '11px',
                    backgroundColor: '#fbbf24',
                    color: 'white',
                    fontWeight: '600'
                  }}>
                    ממתין
                  </span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                borderRadius: '12px',
                border: '1px solid #fde68a'
              }}>
                <div>
                  <p style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>שרה לוי</p>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>דיווח מחלה</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '0.25rem' }}>22 דצמבר</p>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '11px',
                    backgroundColor: '#fbbf24',
                    color: 'white',
                    fontWeight: '600'
                  }}>
                    ממתין
                  </span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'linear-gradient(135deg, #fef2f2, #fecaca)',
                borderRadius: '12px',
                border: '1px solid #fca5a5'
              }}>
                <div>
                  <p style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>מיכאל אברהם</p>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>חופשה חירום</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '0.25rem' }}>25-26 דצמבר</p>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '11px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontWeight: '600'
                  }}>
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