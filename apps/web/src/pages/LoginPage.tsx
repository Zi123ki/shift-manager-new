import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@shift-manager/ui';
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

          </CardContent>
        </Card>
      </div>
    </div>
  );
}