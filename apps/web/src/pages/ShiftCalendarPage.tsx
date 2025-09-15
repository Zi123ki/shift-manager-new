import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Plus, Users, Clock, MapPin } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  position: string;
  avatar?: string;
  department: string;
}

interface Shift {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'morning' | 'evening' | 'night';
  location?: string;
  color: string;
}

export default function ShiftCalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  // Mock data
  const employees: Employee[] = [
    { id: '1', name: 'דני כהן', position: 'מנהל משמרת', department: 'ייצור' },
    { id: '2', name: 'שרה לוי', position: 'טכנאית', department: 'אחזקה' },
    { id: '3', name: 'מיכאל אברהם', position: 'עובד ייצור', department: 'ייצור' },
    { id: '4', name: 'רחל כהן', position: 'מפקחת איכות', department: 'בקרת איכות' },
    { id: '5', name: 'יוסי שמיר', position: 'עובד מחסן', department: 'לוגיסטיקה' },
    { id: '6', name: 'נטלי ברק', position: 'מתאמת', department: 'תפעול' },
  ];

  const shifts: Shift[] = [
    { id: '1', employeeId: '1', date: '2024-12-15', startTime: '08:00', endTime: '16:00', type: 'morning', location: 'אזור A', color: '#3b82f6' },
    { id: '2', employeeId: '2', date: '2024-12-15', startTime: '16:00', endTime: '00:00', type: 'evening', location: 'אזור B', color: '#10b981' },
    { id: '3', employeeId: '3', date: '2024-12-16', startTime: '08:00', endTime: '16:00', type: 'morning', location: 'אזור A', color: '#3b82f6' },
    { id: '4', employeeId: '4', date: '2024-12-16', startTime: '00:00', endTime: '08:00', type: 'night', location: 'אזור C', color: '#8b5cf6' },
    { id: '5', employeeId: '5', date: '2024-12-17', startTime: '16:00', endTime: '00:00', type: 'evening', location: 'מחסן', color: '#10b981' },
    { id: '6', employeeId: '6', date: '2024-12-17', startTime: '08:00', endTime: '16:00', type: 'morning', location: 'משרד', color: '#f59e0b' },
  ];

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
    return shifts.filter(shift => shift.employeeId === employeeId && shift.date === dateStr);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }).format(date);
  };

  const weekDays = getWeekDays();

  return (
    <div className="p-6 bg-gradient-to-br from-slate-100 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 p-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1">
              לוח משמרות
            </h1>
            <p className="text-slate-600 m-0">
              ניהול וצפייה במשמרות העובדים
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '2px' }}>
            <Button
              onClick={() => setViewMode('week')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: viewMode === 'week' ? '#3b82f6' : 'transparent',
                color: viewMode === 'week' ? 'white' : '#64748b',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              שבועי
            </Button>
            <Button
              onClick={() => setViewMode('month')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: viewMode === 'month' ? '#3b82f6' : 'transparent',
                color: viewMode === 'month' ? 'white' : '#64748b',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              חודשי
            </Button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(selectedDate.getDate() - (viewMode === 'week' ? 7 : 30));
                setSelectedDate(newDate);
              }}
              style={{
                padding: '0.5rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChevronLeft style={{ width: '16px', height: '16px' }} />
            </Button>

            <div style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
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
                newDate.setDate(selectedDate.getDate() + (viewMode === 'week' ? 7 : 30));
                setSelectedDate(newDate);
              }}
              style={{
                padding: '0.5rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChevronRight style={{ width: '16px', height: '16px' }} />
            </Button>
          </div>

          <Button style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600'
          }}>
            <Plus style={{ width: '16px', height: '16px' }} />
            הוסף משמרת
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Employee List */}
        <div style={{ width: '300px', flexShrink: 0 }}>
          <Card style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px'
          }}>
            <CardHeader style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              borderRadius: '16px 16px 0 0'
            }}>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Users style={{ width: '20px', height: '20px' }} />
                רשימת עובדים
              </CardTitle>
            </CardHeader>
            <CardContent style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {employees.map(employee => (
                  <div
                    key={employee.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.transform = 'translateX(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#3b82f6',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontWeight: '600',
                          color: '#1e293b',
                          margin: 0,
                          fontSize: '14px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {employee.name}
                        </p>
                        <p style={{
                          fontSize: '12px',
                          color: '#64748b',
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {employee.position}
                        </p>
                        <p style={{
                          fontSize: '11px',
                          color: '#94a3b8',
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {employee.department}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar View */}
        <div style={{ flex: 1 }}>
          <Card style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            {/* Calendar Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `120px repeat(${weekDays.length}, 1fr)`,
              backgroundColor: '#f8fafc',
              borderBottom: '2px solid #e2e8f0'
            }}>
              <div style={{
                padding: '1rem',
                fontWeight: '600',
                color: '#64748b',
                borderLeft: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                עובד
              </div>
              {weekDays.map((day, index) => (
                <div
                  key={index}
                  style={{
                    padding: '1rem 0.5rem',
                    textAlign: 'center',
                    borderLeft: index !== weekDays.length - 1 ? '1px solid #e2e8f0' : 'none',
                    backgroundColor: day.toDateString() === new Date().toDateString() ? '#eff6ff' : 'transparent'
                  }}
                >
                  <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
                    {formatDate(day)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    {day.getDate()}
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {employees.map((employee, empIndex) => (
                <div
                  key={employee.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `120px repeat(${weekDays.length}, 1fr)`,
                    borderBottom: empIndex !== employees.length - 1 ? '1px solid #f1f5f9' : 'none',
                    minHeight: '80px'
                  }}
                >
                  {/* Employee Name Cell */}
                  <div style={{
                    padding: '1rem 0.75rem',
                    borderLeft: '1px solid #e2e8f0',
                    backgroundColor: '#fafbfc',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '100%'
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#3b82f6',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '12px'
                      }}>
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontWeight: '600',
                          color: '#1e293b',
                          margin: 0,
                          fontSize: '12px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {employee.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Day Cells */}
                  {weekDays.map((day, dayIndex) => {
                    const employeeShifts = getShiftsForEmployeeAndDate(employee.id, day);
                    const isToday = day.toDateString() === new Date().toDateString();

                    return (
                      <div
                        key={dayIndex}
                        style={{
                          padding: '0.5rem',
                          borderLeft: dayIndex !== weekDays.length - 1 ? '1px solid #f1f5f9' : 'none',
                          backgroundColor: isToday ? '#eff6ff' : 'transparent',
                          minHeight: '80px',
                          position: 'relative'
                        }}
                      >
                        {employeeShifts.map((shift, shiftIndex) => (
                          <div
                            key={shift.id}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: shift.color,
                              color: 'white',
                              borderRadius: '6px',
                              marginBottom: shiftIndex !== employeeShifts.length - 1 ? '0.25rem' : 0,
                              fontSize: '11px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.02)';
                              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                              <Clock style={{ width: '10px', height: '10px' }} />
                              <span>{shift.startTime}-{shift.endTime}</span>
                            </div>
                            {shift.location && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <MapPin style={{ width: '10px', height: '10px' }} />
                                <span>{shift.location}</span>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Add Shift Button */}
                        <Button
                          style={{
                            position: 'absolute',
                            bottom: '4px',
                            right: '4px',
                            width: '20px',
                            height: '20px',
                            padding: 0,
                            backgroundColor: '#10b981',
                            border: 'none',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            color: 'white',
                            opacity: 0.7,
                            transition: 'opacity 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '1';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '0.7';
                          }}
                        >
                          +
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}