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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-lg space-y-8 relative z-10">
        {/* Logo and branding */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              מערכת ניהול משמרות
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">מערכת מקצועית לניהול עובדים ומשמרות</p>
          </div>
        </div>

        <div className="flex justify-center">
          <LanguageSwitch />
        </div>

        <Card className="backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-0 shadow-2xl shadow-blue-500/10">
          <CardHeader className="space-y-2 pb-6 text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('auth.loginTitle')}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              {t('auth.loginSubtitle')}
            </p>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
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
                  className="h-14 text-base border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
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
                  className="h-14 text-base border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-base font-semibold mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transform hover:scale-[1.02] transition-all duration-200 rounded-lg"
                disabled={loading || !formData.username || !formData.password}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {t('common.loading')}
                  </div>
                ) : (
                  t('auth.loginButton')
                )}
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