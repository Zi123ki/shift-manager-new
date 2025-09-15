import { useTranslation } from 'react-i18next';
import { Button } from '@shift-manager/ui';
import { Languages } from 'lucide-react';

export default function LanguageSwitch() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'he' ? 'en' : 'he';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center space-x-2 rtl:space-x-reverse"
    >
      <Languages className="h-4 w-4" />
      <span className="text-sm">
        {i18n.language === 'he' ? 'English' : 'עברית'}
      </span>
    </Button>
  );
}