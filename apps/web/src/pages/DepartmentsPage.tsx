import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Building2, Plus, Search, Edit, Trash2, Users, MapPin, BarChart3 } from 'lucide-react';

interface Department {
  id: string;
  name: string;
  description: string;
  manager: string;
  location: string;
  employeeCount: number;
  color: string;
  budget?: number;
  status: 'active' | 'inactive';
}

export default function DepartmentsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock data
  const [departments] = useState<Department[]>([
    {
      id: '1',
      name: 'ייצור',
      description: 'מחלקת הייצור הראשית אחראית על כל פעילויות הייצור והתפוקה',
      manager: 'דני כהן',
      location: 'אולם ייצור A-B',
      employeeCount: 15,
      color: '#3b82f6',
      budget: 250000,
      status: 'active'
    },
    {
      id: '2',
      name: 'אחזקה',
      description: 'מחלקת האחזקה מתאמת תחזוקה מתוכננת ותחזוקה שוטפת',
      manager: 'שרה לוי',
      location: 'מתחם המכונות',
      employeeCount: 8,
      color: '#10b981',
      budget: 150000,
      status: 'active'
    },
    {
      id: '3',
      name: 'בקרת איכות',
      description: 'מחלקת בקרת האיכות מבטיחה עמידה בתקנים ובדרישות איכות',
      manager: 'רחל כהן',
      location: 'מעבדת איכות',
      employeeCount: 5,
      color: '#f59e0b',
      budget: 120000,
      status: 'active'
    },
    {
      id: '4',
      name: 'לוגיסטיקה',
      description: 'מחלקת הלוגיסטיקה מנהלת מלאים, רכש וחלוקה',
      manager: 'יוסי שמיר',
      location: 'מחסן ראשי',
      employeeCount: 12,
      color: '#8b5cf6',
      budget: 180000,
      status: 'active'
    },
    {
      id: '5',
      name: 'משאבי אנוש',
      description: 'מחלקת משאבי האנוש מנהלת גיוס, הכשרה ורווחת עובדים',
      manager: 'נטלי ברק',
      location: 'בניין המשרדים',
      employeeCount: 4,
      color: '#ef4444',
      budget: 100000,
      status: 'active'
    }
  ]);

  const filteredDepartments = departments.filter(dept =>
    dept.name.includes(searchTerm) ||
    dept.description.includes(searchTerm) ||
    dept.manager.includes(searchTerm) ||
    dept.location.includes(searchTerm)
  );

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
          ניהול מחלקות
        </h1>
        <p style={{ color: '#64748b' }}>
          ניהול מחלקות, צוותים ומנהלים
        </p>
      </div>

      {/* Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: '300px' }}>
            <Search style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
            <Input
              type="text"
              placeholder="חיפוש מחלקות..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingRight: '2.5rem', height: '44px' }}
            />
          </div>
        </div>

        <Button
          onClick={() => setShowAddForm(true)}
          style={{ backgroundColor: '#3b82f6', color: 'white', height: '44px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          הוסף מחלקה חדשה
        </Button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Card style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
          <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {departments.filter(d => d.status === 'active').length}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>מחלקות פעילות</div>
          </CardContent>
        </Card>
        <Card style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
          <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
              {departments.reduce((sum, d) => sum + d.employeeCount, 0)}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>סה"כ עובדים</div>
          </CardContent>
        </Card>
        <Card style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
          <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
              ₪{(departments.reduce((sum, d) => sum + (d.budget || 0), 0) / 1000).toFixed(0)}K
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>סה"כ תקציב</div>
          </CardContent>
        </Card>
      </div>

      {/* Departments Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {filteredDepartments.map((department) => (
          <Card key={department.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
            <CardHeader style={{ paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: department.color,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <Building2 style={{ width: '24px', height: '24px' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <CardTitle style={{ margin: 0, fontSize: '1.25rem', marginBottom: '0.25rem' }}>{department.name}</CardTitle>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        backgroundColor: department.status === 'active' ? '#dcfce7' : '#fee2e2',
                        color: department.status === 'active' ? '#166534' : '#dc2626',
                        fontWeight: '500'
                      }}>
                        {department.status === 'active' ? 'פעילה' : 'לא פעילה'}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    style={{ padding: '0.5rem' }}
                  >
                    <Edit style={{ width: '14px', height: '14px' }} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    style={{ padding: '0.5rem', color: '#ef4444' }}
                  >
                    <Trash2 style={{ width: '14px', height: '14px' }} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent style={{ paddingTop: 0 }}>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, lineHeight: '1.4' }}>
                  {department.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Users style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                    מנהל: {department.manager}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MapPin style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>{department.location}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>{department.employeeCount}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>עובדים</div>
                  </div>
                  {department.budget && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>
                        ₪{(department.budget / 1000).toFixed(0)}K
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>תקציב</div>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: '#3b82f6' }}
                  >
                    <BarChart3 style={{ width: '14px', height: '14px', marginLeft: '0.5rem' }} />
                    דו"ח
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDepartments.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
          <Building2 style={{ width: '64px', height: '64px', margin: '0 auto 1rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>לא נמצאו מחלקות</p>
          <p style={{ fontSize: '0.875rem' }}>נסו לשנות את מילת החיפוש</p>
        </div>
      )}
    </div>
  );
}