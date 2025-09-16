import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Users, Plus, Search, Edit, Trash2, Mail, Phone } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  startDate: string;
  status: 'active' | 'inactive';
}

export default function EmployeesPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock data
  const [employees] = useState<Employee[]>([
    {
      id: '1',
      name: 'דני כהן',
      email: 'danny@company.com',
      phone: '050-1234567',
      position: 'מנהל משמרת',
      department: 'ייצור',
      salary: 8000,
      startDate: '2023-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'שרה לוי',
      email: 'sara@company.com',
      phone: '050-2345678',
      position: 'טכנאית',
      department: 'אחזקה',
      salary: 6500,
      startDate: '2023-03-20',
      status: 'active'
    },
    {
      id: '3',
      name: 'מיכאל אברהם',
      email: 'michael@company.com',
      phone: '050-3456789',
      position: 'עובד ייצור',
      department: 'ייצור',
      salary: 5500,
      startDate: '2023-06-10',
      status: 'active'
    },
    {
      id: '4',
      name: 'רחל כהן',
      email: 'rachel@company.com',
      phone: '050-4567890',
      position: 'מפקחת איכות',
      department: 'בקרת איכות',
      salary: 7000,
      startDate: '2023-02-28',
      status: 'active'
    }
  ]);

  const filteredEmployees = employees.filter(employee =>
    employee.name.includes(searchTerm) ||
    employee.email.includes(searchTerm) ||
    employee.department.includes(searchTerm) ||
    employee.position.includes(searchTerm)
  );

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
          ניהול עובדים
        </h1>
        <p style={{ color: '#64748b' }}>
          ניהול עובדים, תפקידים ופרטיהם האישיים
        </p>
      </div>

      {/* Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: '300px' }}>
            <Search style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
            <Input
              type="text"
              placeholder="חיפוש עובדים..."
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
          הוסף עובד חדש
        </Button>
      </div>

      {/* Employees Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
            <CardHeader style={{ paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#3b82f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <CardTitle style={{ margin: 0, fontSize: '1.125rem' }}>{employee.name}</CardTitle>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.875rem' }}>{employee.position}</p>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>{employee.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Phone style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>{employee.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>מחלקה</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{employee.department}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>שכר</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>₪{employee.salary.toLocaleString()}</div>
                  </div>
                  <div>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      backgroundColor: employee.status === 'active' ? '#dcfce7' : '#fee2e2',
                      color: employee.status === 'active' ? '#166534' : '#dc2626'
                    }}>
                      {employee.status === 'active' ? 'פעיל' : 'לא פעיל'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
          <Users style={{ width: '64px', height: '64px', margin: '0 auto 1rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>לא נמצאו עובדים</p>
          <p style={{ fontSize: '0.875rem' }}>נסו לשנות את מילת החיפוש</p>
        </div>
      )}
    </div>
  );
}