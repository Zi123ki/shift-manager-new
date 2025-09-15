import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar } from 'lucide-react';

export default function CalendarPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t('navigation.calendar')}
        </h1>
        <p className="text-muted-foreground mt-2">
          תצוגת לוח שנה עם יכולות גרירה ושחרור
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 ml-2 rtl:ml-0 rtl:mr-2" />
            לוח שנה אינטראקטיבי
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <div className="text-center text-muted-foreground">
              <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">תצוגת לוח שנה</p>
              <p className="text-sm">כאן יופיע לוח השנה האינטראקטיבי עם FullCalendar</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}