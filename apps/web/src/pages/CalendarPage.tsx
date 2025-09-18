import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, MapPin } from 'lucide-react';
import { useDataStore } from '../stores/dataStore';
import Modal, { ModalFooter } from '../components/ui/modal';
import { Input } from '../components/ui/input';

export default function CalendarPage() {
  const { t } = useTranslation();
  const { shifts, addShift, updateShift } = useDataStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [draggedShift, setDraggedShift] = useState<any>(null);
  const [dropZone, setDropZone] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    color: '#3b82f6'
  });

  const monthNames = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];

  const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getShiftsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return shifts.filter(shift => shift.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const openAddModal = (date: Date) => {
    setSelectedDate(date);
    setFormData({
      name: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      color: '#3b82f6'
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.startTime || !formData.endTime || !selectedDate) {
      alert('אנא מלא את כל השדות הנדרשים');
      return;
    }

    const shiftData = {
      ...formData,
      date: selectedDate.toISOString().split('T')[0],
      type: 'morning' as const,
      department: '',
      departmentId: '',
      requiredEmployees: 1,
      assignedEmployees: [],
      status: 'published' as const,
      isRecurring: false,
      breaks: []
    };

    try {
      addShift(shiftData);
      alert('אירוע נוסף בהצלחה!');
      setShowModal(false);
      setSelectedDate(null);
    } catch (error) {
      alert('שגיאה בשמירת האירוע');
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Drag & Drop functions for calendar
  const handleDragStart = (e: React.DragEvent, shift: any) => {
    setDraggedShift(shift);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragOver = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropZone(date);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDropZone(null);
  };

  const handleDrop = (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();

    if (!draggedShift) return;

    const targetDateStr = targetDate.toISOString().split('T')[0];

    // Update the shift with new date
    const updatedShift = {
      ...draggedShift,
      date: targetDateStr
    };

    updateShift(draggedShift.id, updatedShift);

    setDraggedShift(null);
    setDropZone(null);

    // Show success message
    alert(`האירוע הועבר בהצלחה לתאריך ${targetDate.toLocaleDateString('he-IL')}`);
  };

  const handleDragEnd = () => {
    setDraggedShift(null);
    setDropZone(null);
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div style={{ padding: '1.5rem', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        marginBottom: '2rem',
        padding: '1.5rem',
        background: 'var(--card-bg)',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{
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
                color: 'var(--text-primary)',
                margin: '0 0 4px 0'
              }}>
                {t('navigation.calendar')}
              </h1>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1rem' }}>
                לוח שנה חודשי עם ניהול אירועים
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <Card style={{
        background: 'var(--card-bg)',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        <CardHeader style={{
          background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <CardTitle style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Calendar style={{ width: '20px', height: '20px' }} />
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Button
                onClick={() => navigateMonth('prev')}
                style={{
                  padding: '0.75rem',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </Button>

              <Button
                onClick={() => setCurrentDate(new Date())}
                style={{
                  padding: '0.75rem 1rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                היום
              </Button>

              <Button
                onClick={() => navigateMonth('next')}
                style={{
                  padding: '0.75rem',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronLeft style={{ width: '16px', height: '16px' }} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent style={{ padding: 0 }}>
          {/* Day Headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)'
          }}>
            {dayNames.map((dayName) => (
              <div key={dayName} style={{
                padding: '1rem',
                textAlign: 'center',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                borderLeft: '1px solid var(--border-color)'
              }}>
                {dayName}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gridTemplateRows: 'repeat(6, 120px)'
          }}>
            {days.map((day, index) => {
              if (!day) {
                return (
                  <div key={index} style={{
                    borderLeft: '1px solid var(--border-color)',
                    borderBottom: '1px solid var(--border-color)',
                    background: 'var(--bg-tertiary)'
                  }} />
                );
              }

              const dayShifts = getShiftsForDate(day);
              const isTodayDate = isToday(day);
              const isDropZoneActive = dropZone && dropZone.toDateString() === day.toDateString();

              return (
                <div
                  key={index}
                  style={{
                    borderLeft: '1px solid var(--border-color)',
                    borderBottom: '1px solid var(--border-color)',
                    padding: '0.5rem',
                    background: isDropZoneActive ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-primary)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: isDropZoneActive ? '2px dashed #3b82f6' : '1px solid var(--border-color)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isDropZoneActive) {
                      e.currentTarget.style.background = 'var(--hover-bg)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDropZoneActive) {
                      e.currentTarget.style.background = 'var(--bg-primary)';
                    }
                  }}
                  onClick={() => openAddModal(day)}
                  onDragOver={(e) => handleDragOver(e, day)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, day)}
                >
                  {/* Date Number */}
                  <div style={{
                    fontSize: '14px',
                    fontWeight: isTodayDate ? '700' : '500',
                    color: isTodayDate ? '#3b82f6' : 'var(--text-primary)',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      padding: isTodayDate ? '2px 6px' : '0',
                      borderRadius: isTodayDate ? '50%' : '0',
                      background: isTodayDate ? '#3b82f6' : 'transparent',
                      color: isTodayDate ? 'white' : 'inherit',
                      minWidth: isTodayDate ? '20px' : 'auto',
                      textAlign: 'center'
                    }}>
                      {day.getDate()}
                    </span>
                    {dayShifts.length === 0 && (
                      <Plus style={{
                        width: '12px',
                        height: '12px',
                        color: 'var(--text-tertiary)',
                        opacity: 0.5
                      }} />
                    )}
                  </div>

                  {/* Events */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {dayShifts.slice(0, 3).map((shift) => (
                      <div
                        key={shift.id}
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation();
                          handleDragStart(e, shift);
                        }}
                        onDragEnd={handleDragEnd}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          background: shift.color,
                          color: 'white',
                          padding: '2px 4px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '500',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'grab',
                          opacity: draggedShift?.id === shift.id ? 0.5 : 1,
                          transform: draggedShift?.id === shift.id ? 'scale(0.95)' : 'scale(1)',
                          transition: 'all 0.2s',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                          if (draggedShift?.id !== shift.id) {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.15)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (draggedShift?.id !== shift.id) {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                          }
                        }}
                      >
                        <Clock style={{ width: '10px', height: '10px', flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {shift.startTime} {shift.name}
                        </span>
                        <div style={{
                          fontSize: '8px',
                          opacity: 0.7,
                          marginLeft: 'auto',
                          cursor: 'grab'
                        }}>
                          ⋮⋮
                        </div>
                      </div>
                    ))}
                    {dayShifts.length > 3 && (
                      <div style={{
                        fontSize: '10px',
                        color: 'var(--text-tertiary)',
                        textAlign: 'center',
                        marginTop: '2px'
                      }}>
                        +{dayShifts.length - 3} נוספים
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

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
          גרור את האירוע ליום אחר
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

      {/* Add Event Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="הוספת אירוע חדש">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}>
              שם האירוע *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="הכנס שם אירוע"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
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
                  border: '2px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'var(--input-bg)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
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
                  border: '2px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'var(--input-bg)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}>
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
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}>
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
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}>
              צבע
            </label>
            <Input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              style={{
                width: '60px',
                height: '40px',
                padding: '0',
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            />
          </div>

          <ModalFooter>
            <Button
              type="button"
              onClick={() => setShowModal(false)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-secondary)',
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
              הוסף אירוע
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translate(-50%, -60%); }
          100% { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
    </div>
  );
}