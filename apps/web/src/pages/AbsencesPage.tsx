import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { UserMinus } from 'lucide-react';

export default function AbsencesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t('navigation.absences')}
        </h1>
        <p className="text-muted-foreground mt-2">
          ניהול חופשות, מחלות ובקשות היעדרות
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserMinus className="h-5 w-5 ml-2 rtl:ml-0 rtl:mr-2" />
            בקשות היעדרות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <div className="text-center text-muted-foreground">
              <UserMinus className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">ניהול היעדרויות</p>
              <p className="text-sm">כאן תוכלו לנהל בקשות חופשה ומחלה</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}