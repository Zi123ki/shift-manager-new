import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Clock, Plus, Search, Edit, Trash2, Calendar, Users, MapPin, AlertTriangle } from 'lucide-react';
import { useDataStore } from '../stores/dataStore';
import Modal, { ModalFooter } from '../components/ui/modal';

export default function ShiftsPage() {
  const { t } = useTranslation();
  const { shifts, employees, departments, addShift, updateShift, deleteShift } = useDataStore();

  console.log('ShiftsPage data:', { shifts: shifts.length, employees: employees.length, departments: departments.length });

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingShift, setEditingShift] = useState<any>(null);
  const [deletingShift, setDeletingShift] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    type: 'morning' as 'morning' | 'evening' | 'night',
    department: '',
    location: '',
    requiredEmployees: 1,
    assignedEmployees: [] as string[],
    color: '#3b82f6',
    description: ''
  });

  const filteredShifts = shifts.filter(shift =>
    shift.name.includes(searchTerm) ||
    shift.department.includes(searchTerm) ||
    shift.location.includes(searchTerm) ||
    shift.type.includes(searchTerm)
  );

  const resetForm = () => {
    setFormData({
      name: '',
      startTime: '',
      endTime: '',
      type: 'morning',
      department: '',
      location: '',
      requiredEmployees: 1,
      assignedEmployees: [],
      color: '#3b82f6',
      description: ''
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (shift: any) => {
    setEditingShift(shift);
    setFormData({
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      type: shift.type,
      department: shift.department,
      location: shift.location,
      requiredEmployees: shift.requiredEmployees,
      assignedEmployees: shift.assignedEmployees,
      color: shift.color,
      description: shift.description || ''
    });
    setShowEditModal(true);
  };

  const handleOpenDelete = (shift: any) => {
    setDeletingShift(shift);
    setShowDeleteModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.startTime || !formData.endTime || !formData.department.trim()) {
      alert('אנא מלא את כל השדות הנדרשים');
      return;
    }

    const shiftData = {
      ...formData,
      requiredEmployees: Number(formData.requiredEmployees)
    };

    try {
      if (editingShift) {
        updateShift(editingShift.id, shiftData);
        alert('המשמרת עודכנה בהצלחה!');
        setShowEditModal(false);
        setEditingShift(null);
      } else {
        addShift(shiftData);
        alert('משמרת חדשה נוספה בהצלחה!');
        setShowAddModal(false);
      }
      resetForm();
    } catch (error) {
      alert('שגיאה בשמירת המשמרת');
    }
  };

  const handleDelete = () => {
    if (deletingShift) {
      try {
        deleteShift(deletingShift.id);
        alert('המשמרת נמחקה בהצלחה!');
        setShowDeleteModal(false);
        setDeletingShift(null);
      } catch (error) {
        alert('שגיאה במחיקת המשמרת');
      }
    }
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setEditingShift(null);
    setDeletingShift(null);
    resetForm();
  };

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
          onClick={handleOpenAdd}
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
                    onClick={() => handleOpenEdit(shift)}
                    style={{ padding: '0.5rem' }}
                    title="ערוך משמרת"
                  >
                    <Edit style={{ width: '14px', height: '14px' }} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDelete(shift)}
                    style={{ padding: '0.5rem', color: '#ef4444' }}
                    title="מחק משמרת"
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={handleCloseModals}
        title={editingShift ? 'ערוך משמרת' : 'הוסף משמרת חדשה'}
        size="lg"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                שם המשמרת *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="הכנס שם משמרת"
                required
                style={{ height: '44px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                מחלקה *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                <option value="">בחר מחלקה</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                שעת התחלה *
              </label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
                style={{ height: '44px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                שעת סיום *
              </label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
                style={{ height: '44px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                סוג משמרת
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'morning' | 'evening' | 'night' })}
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                <option value="morning">בוקר</option>
                <option value="evening">ערב</option>
                <option value="night">לילה</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                מיקום
              </label>
              <Input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="מיקום המשמרת"
                style={{ height: '44px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                מספר עובדים נדרש
              </label>
              <Input
                type="number"
                min="1"
                value={formData.requiredEmployees}
                onChange={(e) => setFormData({ ...formData, requiredEmployees: parseInt(e.target.value) || 1 })}
                style={{ height: '44px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              צבע המשמרת
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'].map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: color,
                    border: formData.color === color ? '3px solid #1f2937' : '2px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              תיאור
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="תיאור המשמרת..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <ModalFooter>
            <Button
              type="button"
              onClick={handleCloseModals}
              style={{
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db'
              }}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              style={{
                backgroundColor: '#3b82f6',
                color: 'white'
              }}
            >
              {editingShift ? 'עדכן משמרת' : 'הוסף משמרת'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleCloseModals}
        title="מחיקת משמרת"
        size="sm"
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#fef2f2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <AlertTriangle style={{ width: '32px', height: '32px', color: '#ef4444' }} />
          </div>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
            האם אתה בטוח שברצונך למחוק?
          </h3>
          <p style={{ margin: '0 0 2rem 0', color: '#6b7280' }}>
            משמרת "{deletingShift?.name}" תימחק לצמיתות. פעולה זו לא ניתנת לביטול.
          </p>
        </div>

        <ModalFooter>
          <Button
            onClick={handleCloseModals}
            style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db'
            }}
          >
            ביטול
          </Button>
          <Button
            onClick={handleDelete}
            style={{
              backgroundColor: '#ef4444',
              color: 'white'
            }}
          >
            מחק משמרת
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}