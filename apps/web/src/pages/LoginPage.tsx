import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuthStore } from '../stores/authStore';
import LanguageSwitch from '../components/LanguageSwitch';
import { Eye, EyeOff, Lock, User, Shield, Building2 } from 'lucide-react';

export default function LoginPage() {
  const {} = useTranslation();
  const { login, loading } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return;

    await login(formData.username, formData.password);
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '100px',
        height: '100px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: '70%',
        right: '15%',
        width: '80px',
        height: '80px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        animation: 'float 4s ease-in-out infinite reverse'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '20%',
        width: '60px',
        height: '60px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        animation: 'float 5s ease-in-out infinite'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '480px',
        zIndex: 10
      }}>
        {/* Modern Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
            borderRadius: '30px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}>
            <Building2 style={{
              color: 'white',
              fontSize: '48px',
              width: '48px',
              height: '48px'
            }} />
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              width: '30px',
              height: '30px',
              background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s infinite'
            }}>
              <Shield style={{ width: '16px', height: '16px', color: 'white' }} />
            </div>
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            margin: '0 0 12px 0',
            color: 'white',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px'
          }}>
            ShiftManager Pro
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0,
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>
            מערכת ניהול משמרות מתקדמת לעסקים מודרניים
          </p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <LanguageSwitch />
        </div>

        {/* Modern Login Card */}
        <Card style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <CardHeader style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            padding: '2rem'
          }}>
            <CardTitle style={{
              textAlign: 'center',
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1e293b',
              margin: 0
            }}>
              כניסה למערכת
            </CardTitle>
            <p style={{
              textAlign: 'center',
              color: '#64748b',
              margin: '0.5rem 0 0 0',
              fontSize: '1rem'
            }}>
              היכנס עם פרטי המשתמש שלך
            </p>
          </CardHeader>

          <CardContent style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  שם משתמש או אימייל
                </label>
                <div style={{ position: 'relative' }}>
                  <User style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    color: '#9ca3af',
                    zIndex: 10
                  }} />
                  <Input
                    type="text"
                    value={formData.username}
                    onChange={handleChange('username')}
                    placeholder="הכנס שם משתמש או אימייל"
                    required
                    autoComplete="username"
                    style={{
                      height: '56px',
                      paddingRight: '3rem',
                      paddingLeft: '1rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      transition: 'all 0.2s',
                      background: '#ffffff'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  סיסמה
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    color: '#9ca3af',
                    zIndex: 10
                  }} />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange('password')}
                    placeholder="הכנס סיסמה"
                    required
                    autoComplete="current-password"
                    style={{
                      height: '56px',
                      paddingRight: '3rem',
                      paddingLeft: '3rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      transition: 'all 0.2s',
                      background: '#ffffff'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0',
                      color: '#9ca3af'
                    }}
                  >
                    {showPassword ?
                      <EyeOff style={{ width: '20px', height: '20px' }} /> :
                      <Eye style={{ width: '20px', height: '20px' }} />
                    }
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !formData.username || !formData.password}
                style={{
                  height: '56px',
                  marginTop: '1rem',
                  background: loading ? 'linear-gradient(135deg, #94a3b8, #64748b)' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(59, 130, 246, 0.3)',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(59, 130, 246, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    נכנס למערכת...
                  </div>
                ) : (
                  'כניסה למערכת'
                )}
              </Button>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <p style={{
                  color: '#64748b',
                  fontSize: '0.9rem',
                  margin: 0
                }}>
                  שכחת סיסמה? <a href="#" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>לחץ כאן</a>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)'
        }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0,
            fontSize: '0.9rem'
          }}>
            <strong>להדגמה:</strong> admin / password
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}