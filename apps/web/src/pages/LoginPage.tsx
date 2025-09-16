import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuthStore } from '../stores/authStore';
import LanguageSwitch from '../components/LanguageSwitch';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login, loading } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: '1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#3b82f6',
            borderRadius: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <span style={{ color: 'white', fontSize: '24px' }}>🕒</span>
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            color: '#1e293b'
          }}>
            מערכת ניהול משמרות
          </h1>
          <p style={{ color: '#64748b', margin: 0 }}>
            מערכת מקצועית לניהול עובדים ומשמרות
          </p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <LanguageSwitch />
        </div>

        <Card>
          <CardHeader>
            <CardTitle style={{ textAlign: 'center' }}>
              {t('auth.loginTitle')}
            </CardTitle>
            <p style={{ textAlign: 'center', color: '#64748b' }}>
              {t('auth.loginSubtitle')}
            </p>
          </CardHeader>
          <CardContent>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  {t('auth.usernameOrEmail')}
                </label>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={handleChange('username')}
                  placeholder={t('auth.usernameOrEmail')}
                  required
                  autoComplete="username"
                  style={{ height: '48px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  {t('auth.password')}
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={handleChange('password')}
                  placeholder={t('auth.password')}
                  required
                  autoComplete="current-password"
                  style={{ height: '48px' }}
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !formData.username || !formData.password}
                style={{
                  height: '48px',
                  marginTop: '1rem',
                  backgroundColor: loading ? '#94a3b8' : '#3b82f6',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? t('common.loading') : t('auth.loginButton')}
              </Button>
            </form>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}