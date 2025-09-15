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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">

      <div className="w-full max-w-md space-y-6">
        {/* Logo and branding */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              מערכת ניהול משמרות
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">מערכת מקצועית לניהול עובדים ומשמרות</p>
          </div>
        </div>

        <div className="flex justify-center">
          <LanguageSwitch />
        </div>

        <Card className="w-full shadow-lg">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-xl md:text-2xl font-bold text-center">
              {t('auth.loginTitle')}
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              {t('auth.loginSubtitle')}
            </p>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium block">
                  {t('auth.usernameOrEmail')}
                </label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange('username')}
                  placeholder={t('auth.usernameOrEmail')}
                  required
                  autoComplete="username"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium block">
                  {t('auth.password')}
                </label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange('password')}
                  placeholder={t('auth.password')}
                  required
                  autoComplete="current-password"
                  className="h-12 text-base"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium mt-6"
                disabled={loading || !formData.username || !formData.password}
              >
                {loading ? t('common.loading') : t('auth.loginButton')}
              </Button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-center space-y-2">
                <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                  🎯 מצב הדגמה פעיל
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  האפליקציה פועלת במצב הדגמה ללא צורך בשרת API
                </p>
                <div className="pt-2 border-t border-green-200 dark:border-green-700">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    <span className="font-semibold">פרטי התחברות:</span>
                  </p>
                  <div className="flex justify-center items-center gap-4 mt-1">
                    <code className="font-mono bg-green-100 dark:bg-green-800 px-2 py-1 rounded text-xs">zvika</code>
                    <span className="text-green-600">|</span>
                    <code className="font-mono bg-green-100 dark:bg-green-800 px-2 py-1 rounded text-xs">Zz321321</code>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}