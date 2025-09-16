import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Clock, Plus, Search, Edit, Trash2, Calendar, Users, MapPin } from 'lucide-react';

interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  type: 'morning' | 'evening' | 'night';
  department: string;
  location: string;
  requiredEmployees: number;
  assignedEmployees: string[];
  color: string;
  description?: string;
}

export default function ShiftsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock data
  const [shifts] = useState<Shift[]>([
    {
      id: '1',
      name: 'משמרת בוקר - ייצור',
      startTime: '08:00',
      endTime: '16:00',
      type: 'morning',
      department: 'ייצור',
      location: 'אולם ייצור A',
      requiredEmployees: 4,
      assignedEmployees: ['דני כהן', 'מיכאל אברהם', 'רחל כהן'],
      color: '#3b82f6',
      description: 'משמרת ייצור בוקר עם דגש על יעדי תפוקה'
    },
    {
      id: '2',
      name: 'משמרת ערב - אחזקה',
      startTime: '16:00',
      endTime: '00:00',
      type: 'evening',
      department: 'אחזקה',
      location: 'אולם מכונות',
      requiredEmployees: 2,
      assignedEmployees: ['שרה לוי'],
      color: '#10b981',
      description: 'משמרת אחזקה ותחזוקה מתוכננת'
    },
    {
      id: '3',
      name: 'משמרת לילה - אבטחה',
      startTime: '00:00',
      endTime: '08:00',
      type: 'night',
      department: 'אבטחה',
      location: 'כל המתחם',
      requiredEmployees: 2,
      assignedEmployees: ['יוסי שמיר'],
      color: '#8b5cf6',
      description: 'משמרת אבטחה וניטור ליילי'
    },
    {
      id: '4',
      name: 'משמרת בוקר - בקרת איכות',
      startTime: '09:00',
      endTime: '17:00',
      type: 'morning',
      department: 'בקרת איכות',
      location: 'מעבדת איכות',
      requiredEmployees: 2,
      assignedEmployees: ['נטלי ברק'],
      color: '#f59e0b',
      description: 'בדיקות איכות ומעבדה'
    }
  ]);

  const filteredShifts = shifts.filter(shift =>
    shift.name.includes(searchTerm) ||
    shift.department.includes(searchTerm) ||
    shift.location.includes(searchTerm) ||
    shift.type.includes(searchTerm)
  );

  const getShiftTypeText = (type: string) => {
    switch (type) {
      case 'morning': return 'בוקר';
      case 'evening': return 'ערב';
      case 'night': return 'לילה';
      default: return type;
    }
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'morning': return '#3b82f6';
      case 'evening': return '#10b981';
      case 'night': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
          ניהול משמרות
        </h1>
        <p style={{ color: '#64748b' }}>
          ניהול משמרות, תבניות עבודה וזמני עבודה
        </p>
      </div>

      {/* Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: '300px' }}>
            <Search style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
            <Input
              type="text"
              placeholder="חיפוש משמרות..."
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
          הוסף משמרת חדשה
        </Button>
      </div>

      {/* Shifts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {filteredShifts.map((shift) => (
          <Card key={shift.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
            <CardHeader style={{ paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: shift.color,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <Clock style={{ width: '24px', height: '24px' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <CardTitle style={{ margin: 0, fontSize: '1.125rem', marginBottom: '0.25rem' }}>{shift.name}</CardTitle>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        backgroundColor: getShiftTypeColor(shift.type) + '20',
                        color: getShiftTypeColor(shift.type),
                        fontWeight: '500'
                      }}>
                        {getShiftTypeText(shift.type)}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        {shift.startTime} - {shift.endTime}
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
                {shift.description && (
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{shift.description}</p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MapPin style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>{shift.location}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Users style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                    {shift.assignedEmployees.length} / {shift.requiredEmployees} עובדים
                  </span>
                  <div style={{ flex: 1, backgroundColor: '#f1f5f9', borderRadius: '9999px', height: '6px' }}>
                    <div style={{
                      width: `${(shift.assignedEmployees.length / shift.requiredEmployees) * 100}%`,
                      backgroundColor: shift.assignedEmployees.length >= shift.requiredEmployees ? '#10b981' : '#f59e0b',
                      height: '100%',
                      borderRadius: '9999px',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>

                {shift.assignedEmployees.length > 0 && (
                  <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>עובדים משובצים:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {shift.assignedEmployees.map((employee, index) => (
                        <span key={index} style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: '#f1f5f9',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          color: '#475569'
                        }}>
                          {employee}
                        </span>
                      ))}
                      {shift.assignedEmployees.length < shift.requiredEmployees && (
                        <Button
                          variant="ghost"
                          size="sm"
                          style={{
                            padding: '0.25rem 0.75rem',
                            fontSize: '0.75rem',
                            color: '#3b82f6',
                            border: '1px dashed #3b82f6'
                          }}
                        >
                          + הוסף עובד
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredShifts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
          <Clock style={{ width: '64px', height: '64px', margin: '0 auto 1rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>לא נמצאו משמרות</p>
          <p style={{ fontSize: '0.875rem' }}>נסו לשנות את מילת החיפוש</p>
        </div>
      )}
    </div>
  );
}