import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { UserMinus, Plus, Search, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import Modal, { ModalFooter } from '../components/ui/modal';

interface AbsenceRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  type: 'vacation' | 'sick' | 'personal' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  approver?: string;
  responseDate?: string;
  notes?: string;
}

export default function AbsencesPage() {
  const {} = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AbsenceRequest | null>(null);
  const [newRequestForm, setNewRequestForm] = useState({
    employeeName: '',
    type: 'vacation' as 'vacation' | 'sick' | 'personal' | 'emergency',
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Mock data
  const [absenceRequests, setAbsenceRequests] = useState<AbsenceRequest[]>([
    {
      id: '1',
      employeeName: 'דני כהן',
      employeeId: '1',
      type: 'vacation',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      days: 6,
      reason: 'חופשה משפחתית מתוכננת',
      status: 'pending',
      requestDate: '2024-01-01',
    },
    {
      id: '2',
      employeeName: 'שרה לוי',
      employeeId: '2',
      type: 'sick',
      startDate: '2024-01-08',
      endDate: '2024-01-08',
      days: 1,
      reason: 'חולה - לא מרגישה טוב',
      status: 'approved',
      requestDate: '2024-01-08',
      approver: 'מנהל משמרת',
      responseDate: '2024-01-08',
    },
    {
      id: '3',
      employeeName: 'מיכאל אברהם',
      employeeId: '3',
      type: 'emergency',
      startDate: '2024-01-12',
      endDate: '2024-01-13',
      days: 2,
      reason: 'חירום משפחתי - דחוף',
      status: 'approved',
      requestDate: '2024-01-12',
      approver: 'מנהל כללי',
      responseDate: '2024-01-12',
    },
    {
      id: '4',
      employeeName: 'רחל כהן',
      employeeId: '4',
      type: 'personal',
      startDate: '2024-01-25',
      endDate: '2024-01-25',
      days: 1,
      reason: 'עניינים אישיים',
      status: 'rejected',
      requestDate: '2024-01-10',
      approver: 'מנהל מחלקה',
      responseDate: '2024-01-11',
      notes: 'תאריך לא מתאים - צפויה עומס בתפוקה'
    },
    {
      id: '5',
      employeeName: 'יוסי שמיר',
      employeeId: '5',
      type: 'vacation',
      startDate: '2024-02-01',
      endDate: '2024-02-05',
      days: 5,
      reason: 'חופשה שנתית',
      status: 'pending',
      requestDate: '2024-01-05',
    }
  ]);

  const filteredRequests = absenceRequests.filter(request => {
    const matchesSearch = request.employeeName.includes(searchTerm) ||
                         request.reason.includes(searchTerm) ||
                         request.type.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTypeText = (type: string) => {
    switch (type) {
      case 'vacation': return 'חופשה';
      case 'sick': return 'מחלה';
      case 'personal': return 'אישי';
      case 'emergency': return 'חירום';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vacation': return '#3b82f6';
      case 'sick': return '#ef4444';
      case 'personal': return '#8b5cf6';
      case 'emergency': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', text: '#92400e' };
      case 'approved': return { bg: '#dcfce7', text: '#166534' };
      case 'rejected': return { bg: '#fee2e2', text: '#dc2626' };
      default: return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'ממתין';
      case 'approved': return 'אושר';
      case 'rejected': return 'נדחה';
      default: return status;
    }
  };

  const handleApproveRequest = (requestId: string) => {
    setAbsenceRequests(prev => prev.map(request =>
      request.id === requestId
        ? {
            ...request,
            status: 'approved' as const,
            approver: 'מנהל משמרת',
            responseDate: new Date().toISOString().split('T')[0]
          }
        : request
    ));
    alert('הבקשה אושרה בהצלחה!');
  };

  const handleRejectRequest = (requestId: string) => {
    setAbsenceRequests(prev => prev.map(request =>
      request.id === requestId
        ? {
            ...request,
            status: 'rejected' as const,
            approver: 'מנהל משמרת',
            responseDate: new Date().toISOString().split('T')[0],
            notes: 'נדחה ע"י המנהל'
          }
        : request
    ));
    alert('הבקשה נדחתה');
  };

  const handleViewDetails = (request: AbsenceRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleNewRequest = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newRequestForm.employeeName || !newRequestForm.startDate || !newRequestForm.endDate || !newRequestForm.reason) {
      alert('אנא מלא את כל השדות הנדרשים');
      return;
    }

    const startDate = new Date(newRequestForm.startDate);
    const endDate = new Date(newRequestForm.endDate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    const newRequest: AbsenceRequest = {
      id: (absenceRequests.length + 1).toString(),
      ...newRequestForm,
      employeeId: (absenceRequests.length + 1).toString(),
      days,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0]
    };

    setAbsenceRequests(prev => [...prev, newRequest]);
    setNewRequestForm({
      employeeName: '',
      type: 'vacation',
      startDate: '',
      endDate: '',
      reason: ''
    });
    setShowNewRequestModal(false);
    alert('בקשת החופשה נשלחה בהצלחה!');
  };

  const pendingCount = absenceRequests.filter(r => r.status === 'pending').length;
  const approvedCount = absenceRequests.filter(r => r.status === 'approved').length;
  const totalDays = absenceRequests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.days, 0);

  return (
    <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          ניהול חופשות ונישורים
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          ניהול בקשות חופשה, מחלה ונישורים של העובדים
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Card style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
              {pendingCount}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>בקשות ממתינות</div>
          </CardContent>
        </Card>
        <Card style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
              {approvedCount}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>בקשות מאושרות</div>
          </CardContent>
        </Card>
        <Card style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {totalDays}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>ימי חופשה השנה</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
        background: 'white',
        padding: '1.5rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
            <Search style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
            <Input
              type="text"
              placeholder="חיפוש בקשות..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                paddingRight: '2.5rem',
                height: '44px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.875rem',
                backgroundColor: 'white',
                transition: 'all 0.2s'
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            style={{
              height: '44px',
              padding: '0 1rem',
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
              backgroundColor: 'white',
              fontSize: '0.875rem',
              minWidth: '140px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <option value="all">כל הסטטוסים</option>
            <option value="pending">ממתין</option>
            <option value="approved">מאושר</option>
            <option value="rejected">נדחה</option>
          </select>
        </div>

        <Button
          onClick={() => setShowNewRequestModal(true)}
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            borderRadius: '12px',
            border: 'none',
            padding: '0 1.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(59, 130, 246, 0.3)';
          }}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          בקשת חופשה חדשה
        </Button>
      </div>

      {/* Requests List */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredRequests.map((request) => {
          const statusColor = getStatusColor(request.status);
          const typeColor = getTypeColor(request.type);

          return (
            <Card key={request.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
              <CardContent style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: typeColor,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {request.employeeName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600' }}>{request.employeeName}</h3>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          backgroundColor: typeColor + '20',
                          color: typeColor,
                          fontWeight: '500'
                        }}>
                          {getTypeText(request.type)}
                        </span>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                          fontWeight: '500'
                        }}>
                          {getStatusText(request.status)}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>{request.reason}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {request.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => handleApproveRequest(request.id)}
                          style={{
                            padding: '0.5rem',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                          title="אשר בקשה"
                        >
                          <CheckCircle style={{ width: '16px', height: '16px' }} />
                        </Button>
                        <Button
                          onClick={() => handleRejectRequest(request.id)}
                          style={{
                            padding: '0.5rem',
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                          title="דחה בקשה"
                        >
                          <XCircle style={{ width: '16px', height: '16px' }} />
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => handleViewDetails(request)}
                      style={{
                        padding: '0.5rem',
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#3b82f6',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      title="הצג פרטים"
                    >
                      <Eye style={{ width: '16px', height: '16px' }} />
                    </Button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>תאריכים</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                        {new Date(request.startDate).toLocaleDateString('he-IL')} - {new Date(request.endDate).toLocaleDateString('he-IL')}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>משך</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{request.days} ימים</div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>תאריך בקשה</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                      {new Date(request.requestDate).toLocaleDateString('he-IL')}
                    </div>
                  </div>

                  {request.approver && (
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>מאשר</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{request.approver}</div>
                    </div>
                  )}
                </div>

                {request.notes && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fef3c7', borderRadius: '6px', borderRight: '4px solid #f59e0b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <AlertCircle style={{ width: '16px', height: '16px', color: '#92400e' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#92400e' }}>הערות</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400e' }}>{request.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRequests.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <UserMinus style={{ width: '64px', height: '64px', margin: '0 auto 1rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>לא נמצאו בקשות</p>
          <p style={{ fontSize: '0.875rem' }}>נסו לשנות את מילת החיפוש או הסנן</p>
        </div>
      )}

      {/* New Request Modal */}
      <Modal isOpen={showNewRequestModal} onClose={() => setShowNewRequestModal(false)} title="בקשת חופשה חדשה">
        <form onSubmit={handleNewRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              שם העובד *
            </label>
            <Input
              type="text"
              value={newRequestForm.employeeName}
              onChange={(e) => setNewRequestForm(prev => ({ ...prev, employeeName: e.target.value }))}
              placeholder="הכנס שם העובד"
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
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              סוג הבקשה *
            </label>
            <select
              value={newRequestForm.type}
              onChange={(e) => setNewRequestForm(prev => ({ ...prev, type: e.target.value as any }))}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              <option value="vacation">חופשה</option>
              <option value="sick">מחלה</option>
              <option value="personal">אישי</option>
              <option value="emergency">חירום</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                תאריך התחלה *
              </label>
              <Input
                type="date"
                value={newRequestForm.startDate}
                onChange={(e) => setNewRequestForm(prev => ({ ...prev, startDate: e.target.value }))}
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                תאריך סיום *
              </label>
              <Input
                type="date"
                value={newRequestForm.endDate}
                onChange={(e) => setNewRequestForm(prev => ({ ...prev, endDate: e.target.value }))}
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
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              סיבה/תיאור *
            </label>
            <textarea
              value={newRequestForm.reason}
              onChange={(e) => setNewRequestForm(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="הכנס סיבה או תיאור לבקשה"
              required
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)',
                resize: 'vertical'
              }}
            />
          </div>

          <ModalFooter>
            <Button
              type="button"
              onClick={() => setShowNewRequestModal(false)}
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
              שלח בקשה
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={selectedRequest ? `פרטי בקשה - ${selectedRequest.employeeName}` : 'פרטי בקשה'}
      >
        {selectedRequest && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '600' }}>שם העובד</label>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', color: 'var(--text-primary)' }}>{selectedRequest.employeeName}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '600' }}>סוג הבקשה</label>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', color: 'var(--text-primary)' }}>{getTypeText(selectedRequest.type)}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '600' }}>תאריך התחלה</label>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
                  {new Date(selectedRequest.startDate).toLocaleDateString('he-IL')}
                </p>
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '600' }}>תאריך סיום</label>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
                  {new Date(selectedRequest.endDate).toLocaleDateString('he-IL')}
                </p>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '600' }}>משך הבקשה</label>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', color: 'var(--text-primary)' }}>{selectedRequest.days} ימים</p>
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '600' }}>סיבה</label>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', color: 'var(--text-primary)' }}>{selectedRequest.reason}</p>
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '600' }}>סטטוס</label>
              <div style={{
                margin: '0.25rem 0 0 0',
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                backgroundColor: getStatusColor(selectedRequest.status).bg,
                color: getStatusColor(selectedRequest.status).text,
                fontWeight: '500'
              }}>
                {getStatusText(selectedRequest.status)}
              </div>
            </div>

            {selectedRequest.approver && (
              <div>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '600' }}>מאשר</label>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', color: 'var(--text-primary)' }}>{selectedRequest.approver}</p>
              </div>
            )}

            {selectedRequest.responseDate && (
              <div>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '600' }}>תאריך מענה</label>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
                  {new Date(selectedRequest.responseDate).toLocaleDateString('he-IL')}
                </p>
              </div>
            )}

            {selectedRequest.notes && (
              <div>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '600' }}>הערות</label>
                <p style={{
                  margin: '0.25rem 0 0 0',
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)'
                }}>
                  {selectedRequest.notes}
                </p>
              </div>
            )}
          </div>
        )}

        <ModalFooter>
          <Button
            onClick={() => setShowDetailsModal(false)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-secondary)',
              fontWeight: '600'
            }}
          >
            סגור
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}