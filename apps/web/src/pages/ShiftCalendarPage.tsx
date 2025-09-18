import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Calendar, Plus, Clock, MapPin, Users } from 'lucide-react';
import { useDataStore } from '../stores/dataStore';
import Modal, { ModalFooter } from '../components/ui/modal';
import { Input } from '../components/ui/input';

export default function ShiftCalendarPage() {
  const { shifts, employees, departments, addShift, updateShift } = useDataStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [showPredefinedModal, setShowPredefinedModal] = useState(false);
  const [selectedEmployeeForShift, setSelectedEmployeeForShift] = useState<string | null>(null);
  const [editingShift, setEditingShift] = useState<any>(null);
  const [draggedShift, setDraggedShift] = useState<any>(null);
  const [dropZone, setDropZone] = useState<{employeeId: string, date: Date} | null>(null);
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

  const getWeekDays = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getShiftsForEmployeeAndDate = (employeeId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return shifts.filter(shift =>
      shift.assignedEmployees.includes(employeeId) &&
      shift.date === dateStr
    );
  };

  const predefinedShifts = [
    {
      id: 'template-1',
      name: 'משמרת בוקר - ייצור',
      startTime: '08:00',
      endTime: '16:00',
      type: 'morning' as const,
      department: 'ייצור',
      location: 'אולם ייצור A',
      color: '#3b82f6',
      description: 'משמרת ייצור בוקר עם דגש על יעדי תפוקה',
      breaks: [
        { start: '10:00', end: '10:15', duration: 15 },
        { start: '12:00', end: '12:30', duration: 30 },
        { start: '14:00', end: '14:15', duration: 15 }
      ]
    },
    {
      id: 'template-2',
      name: 'משמרת ערב - אחזקה',
      startTime: '16:00',
      endTime: '00:00',
      type: 'evening' as const,
      department: 'אחזקה',
      location: 'אולם מכונות',
      color: '#10b981',
      description: 'משמרת אחזקה ותחזוקה מתוכננת',
      breaks: [
        { start: '18:00', end: '18:30', duration: 30 },
        { start: '21:00', end: '21:15', duration: 15 }
      ]
    },
    {
      id: 'template-3',
      name: 'משמרת לילה - אבטחה',
      startTime: '00:00',
      endTime: '08:00',
      type: 'night' as const,
      department: 'אבטחה',
      location: 'כל האתר',
      color: '#6366f1',
      description: 'משמרת לילה לאבטחה ובטיחות',
      breaks: [
        { start: '03:00', end: '03:30', duration: 30 }
      ]
    },
    {
      id: 'template-4',
      name: 'משמרת איכות - בוקר',
      startTime: '09:00',
      endTime: '17:00',
      type: 'morning' as const,
      department: 'בקרת איכות',
      location: 'מעבדת איכות',
      color: '#f59e0b',
      description: 'משמרת בקרת איכות ובדיקות מעבדה',
      breaks: [
        { start: '11:00', end: '11:15', duration: 15 },
        { start: '13:00', end: '13:30', duration: 30 }
      ]
    },
    {
      id: 'template-5',
      name: 'משמרת לוגיסטיקה',
      startTime: '08:30',
      endTime: '16:30',
      type: 'morning' as const,
      department: 'לוגיסטיקה',
      location: 'מחסן ראשי',
      color: '#8b5cf6',
      description: 'משמרת ניהול מלאים ולוגיסטיקה',
      breaks: [
        { start: '10:30', end: '10:45', duration: 15 },
        { start: '12:30', end: '13:00', duration: 30 }
      ]
    }
  ];

  const openPredefinedModal = (employeeId?: string) => {
    setSelectedEmployeeForShift(employeeId || null);
    setShowPredefinedModal(true);
  };

  const openAddModal = (employeeId?: string) => {
    setEditingShift(null);
    setFormData({
      name: '',
      startTime: '',
      endTime: '',
      type: 'morning',
      department: '',
      location: '',
      requiredEmployees: 1,
      assignedEmployees: employeeId ? [employeeId] : [],
      color: '#3b82f6',
      description: ''
    });
    setShowModal(true);
  };

  const selectPredefinedShift = (template: any) => {
    const shiftData = {
      name: template.name,
      startTime: template.startTime,
      endTime: template.endTime,
      type: template.type,
      department: template.department,
      departmentId: departments.find(d => d.name === template.department)?.id || '',
      location: template.location,
      requiredEmployees: 1,
      assignedEmployees: selectedEmployeeForShift ? [selectedEmployeeForShift] : [],
      color: template.color,
      description: template.description,
      date: selectedDate.toISOString().split('T')[0],
      status: 'published' as const,
      isRecurring: false,
      breaks: template.breaks || []
    };

    try {
      addShift(shiftData);
      alert('משמרת נוספה בהצלחה!');
      setShowPredefinedModal(false);
      setSelectedEmployeeForShift(null);
    } catch (error) {
      alert('שגיאה בהוספת המשמרת');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.startTime || !formData.endTime) {
      alert('אנא מלא את כל השדות הנדרשים');
      return;
    }

    const shiftData = {
      ...formData,
      date: selectedDate.toISOString().split('T')[0],
      departmentId: '',
      status: 'published' as const,
      isRecurring: false,
      breaks: []
    };

    try {
      if (editingShift) {
        updateShift(editingShift.id, shiftData);
        alert('המשמרת עודכנה בהצלחה!');
      } else {
        addShift(shiftData);
        alert('משמרת חדשה נוספה בהצלחה!');
      }
      setShowModal(false);
      setEditingShift(null);
    } catch (error) {
      alert('שגיאה בשמירת המשמרת');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }).format(date);
  };

  // Drag & Drop functions
  const handleDragStart = (e: React.DragEvent, shift: any) => {
    setDraggedShift(shift);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragOver = (e: React.DragEvent, employeeId: string, date: Date) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropZone({ employeeId, date });
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDropZone(null);
  };

  const handleDrop = (e: React.DragEvent, targetEmployeeId: string, targetDate: Date) => {
    e.preventDefault();

    if (!draggedShift) return;

    const targetDateStr = targetDate.toISOString().split('T')[0];

    // Update the shift with new employee and date
    const updatedShift = {
      ...draggedShift,
      assignedEmployees: [targetEmployeeId],
      date: targetDateStr
    };

    updateShift(draggedShift.id, updatedShift);

    setDraggedShift(null);
    setDropZone(null);

    // Show success message
    alert(`המשמרת הועברה בהצלחה לעובד ${employees.find(emp => emp.id === targetEmployeeId)?.name} בתאריך ${targetDate.toLocaleDateString('he-IL')}`);
  };

  const handleDragEnd = () => {
    setDraggedShift(null);
    setDropZone(null);
  };

  const weekDays = getWeekDays();

  return (
    <div style={{
      padding: '1.5rem',
      background: 'var(--bg-secondary)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '2rem',
        padding: '1.5rem',
        background: 'var(--card-bg)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            <Calendar style={{ width: '24px', height: '24px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.875rem',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 4px 0'
            }}>
              לוח משמרות
            </h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '1rem' }}>
              ניהול וצפייה במשמרות העובדים
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button
            onClick={() => openPredefinedModal()}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem 1.5rem',
              color: 'white',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            הוסף משמרת
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(selectedDate.getDate() - 7);
                setSelectedDate(newDate);
              }}
              style={{
                padding: '0.75rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#3b82f6',
                fontWeight: '600'
              }}
            >
              ◀
            </Button>

            <div style={{
              padding: '0.5rem 1rem',
              background: '#3b82f6',
              color: 'white',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              {selectedDate.toLocaleDateString('he-IL', { year: 'numeric', month: 'long' })}
            </div>

            <Button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(selectedDate.getDate() + 7);
                setSelectedDate(newDate);
              }}
              style={{
                padding: '0.75rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#3b82f6',
                fontWeight: '600'
              }}
            >
              ▶
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Week Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '200px repeat(7, 1fr)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{
            padding: '1rem',
            fontWeight: '700',
            color: '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Users style={{ width: '16px', height: '16px' }} />
            עובדים
          </div>
          {weekDays.map((day, index) => (
            <div key={index} style={{
              padding: '1rem',
              textAlign: 'center',
              fontWeight: '600',
              color: '#374151',
              borderRight: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '0.875rem', marginBottom: '4px' }}>
                {formatDate(day)}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Employee Rows */}
        {employees.map((employee, employeeIndex) => (
          <div key={employee.id} style={{
            display: 'grid',
            gridTemplateColumns: '200px repeat(7, 1fr)',
            borderBottom: employeeIndex < employees.length - 1 ? '1px solid #f1f5f9' : 'none',
            minHeight: '80px'
          }}>
            {/* Employee Info */}
            <div style={{
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: '#fafbfc',
              borderRight: '1px solid #e2e8f0'
            }}>
              <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
                {employee.name}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                {employee.position}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {employee.department}
              </div>
            </div>

            {/* Days */}
            {weekDays.map((day, dayIndex) => {
              const dayShifts = getShiftsForEmployeeAndDate(employee.id, day);
              const isDropZone = dropZone && dropZone.employeeId === employee.id &&
                                dropZone.date.toDateString() === day.toDateString();

              return (
                <div
                  key={dayIndex}
                  style={{
                    padding: '0.5rem',
                    borderRight: dayIndex < 6 ? '1px solid #f1f5f9' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    minHeight: '80px',
                    position: 'relative',
                    background: isDropZone ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    border: isDropZone ? '2px dashed #3b82f6' : 'none',
                    transition: 'all 0.2s'
                  }}
                  onDragOver={(e) => handleDragOver(e, employee.id, day)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, employee.id, day)}
                >
                  {dayShifts.map((shift) => (
                    <div
                      key={shift.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, shift)}
                      onDragEnd={handleDragEnd}
                      style={{
                        background: shift.color,
                        color: 'white',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        position: 'relative',
                        cursor: 'grab',
                        opacity: draggedShift?.id === shift.id ? 0.5 : 1,
                        transform: draggedShift?.id === shift.id ? 'scale(0.95)' : 'scale(1)',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseEnter={(e) => {
                        if (draggedShift?.id !== shift.id) {
                          e.currentTarget.style.transform = 'scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (draggedShift?.id !== shift.id) {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        }
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        marginBottom: '2px',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock style={{ width: '12px', height: '12px' }} />
                          {shift.startTime} - {shift.endTime}
                        </div>
                        <div style={{
                          fontSize: '10px',
                          opacity: 0.7,
                          cursor: 'grab'
                        }}>
                          ⋮⋮
                        </div>
                      </div>
                      <div style={{ fontSize: '11px', opacity: 0.9 }}>
                        {shift.name}
                      </div>
                      {shift.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>
                          <MapPin style={{ width: '10px', height: '10px' }} />
                          {shift.location}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add Shift Button */}
                  <Button
                    onClick={() => openPredefinedModal(employee.id)}
                    style={{
                      width: '100%',
                      height: dayShifts.length === 0 ? '60px' : '24px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '2px dashed #3b82f6',
                      borderRadius: '6px',
                      color: '#3b82f6',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.25rem',
                      opacity: 0.7,
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                  >
                    <Plus style={{ width: '14px', height: '14px' }} />
                    {dayShifts.length === 0 ? 'הוסף משמרת' : '+'}
                  </Button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Drag Instructions */}
      {draggedShift && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '12px',
          fontSize: '1.1rem',
          fontWeight: '600',
          textAlign: 'center',
          zIndex: 1000,
          pointerEvents: 'none',
          animation: 'fadeIn 0.3s'
        }}>
          גרור את המשמרת לעובד או ליום אחר
          <div style={{
            fontSize: '0.9rem',
            fontWeight: '400',
            marginTop: '0.5rem',
            opacity: 0.8
          }}>
            {draggedShift.name} • {draggedShift.startTime}-{draggedShift.endTime}
          </div>
        </div>
      )}

      {/* Predefined Shifts Modal */}
      <Modal isOpen={showPredefinedModal} onClose={() => setShowPredefinedModal(false)} title="בחר משמרת מוגדרת מראש">
        <div style={{ display: 'grid', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
          {predefinedShifts.map((template) => (
            <div
              key={template.id}
              onClick={() => selectPredefinedShift(template)}
              style={{
                background: 'var(--card-bg)',
                border: `2px solid ${template.color}20`,
                borderRadius: '12px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = `0 8px 25px ${template.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: template.color
              }} />

              <div style={{ marginBottom: '0.5rem' }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: '0 0 0.25rem 0'
                }}>
                  {template.name}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  margin: 0
                }}>
                  {template.description}
                </p>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock style={{ width: '14px', height: '14px' }} />
                  {template.startTime} - {template.endTime}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin style={{ width: '14px', height: '14px' }} />
                  {template.location}
                </div>
              </div>

              {template.breaks && template.breaks.length > 0 && (
                <div style={{
                  marginTop: '0.5rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  opacity: 0.7
                }}>
                  הפסקות: {template.breaks.map(b => `${b.start}-${b.end}`).join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>

        <ModalFooter>
          <Button
            onClick={() => setShowPredefinedModal(false)}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#64748b',
              fontWeight: '600'
            }}
          >
            ביטול
          </Button>
          <Button
            onClick={() => openAddModal(selectedEmployeeForShift || undefined)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}
          >
            צור משמרת מותאמת אישית
          </Button>
        </ModalFooter>
      </Modal>

      {/* Add/Edit Shift Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingShift ? 'עריכת משמרת' : 'הוספת משמרת חדשה'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              שם המשמרת *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="הכנס שם משמרת"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                שעת התחלה *
              </label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                שעת סיום *
              </label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              מיקום
            </label>
            <Input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="הכנס מיקום (אופציונלי)"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              תיאור
            </label>
            <Input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="הכנס תיאור (אופציונלי)"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          <ModalFooter>
            <Button
              type="button"
              onClick={() => setShowModal(false)}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#64748b',
                fontWeight: '600'
              }}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
            >
              {editingShift ? 'עדכן משמרת' : 'הוסף משמרת'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translate(-50%, -60%); }
          100% { opacity: 1; transform: translate(-50%, -50%); }
        }

        .shift-dragging {
          cursor: grabbing !important;
        }

        .drop-zone-active {
          background: rgba(59, 130, 246, 0.1) !important;
          border: 2px dashed #3b82f6 !important;
        }
      `}</style>
    </div>
  );
}