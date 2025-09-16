import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Building2, Plus, Search, Edit, Trash2, Users, MapPin, BarChart3, AlertTriangle } from 'lucide-react';
import { useDataStore } from '../stores/dataStore';
import Modal, { ModalFooter } from '../components/ui/modal';

export default function DepartmentsPage() {
  const {} = useTranslation();
  const { departments, employees, addDepartment, updateDepartment, deleteDepartment } = useDataStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  const [deletingDepartment, setDeletingDepartment] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manager: '',
    location: '',
    color: '#3b82f6',
    budget: 0,
    status: 'active' as 'active' | 'inactive'
  });

  const filteredDepartments = departments.filter(dept =>
    dept.name.includes(searchTerm) ||
    dept.description.includes(searchTerm) ||
    dept.manager.includes(searchTerm) ||
    dept.location.includes(searchTerm)
  );

  // Calculate employee count for each department
  const departmentsWithEmployeeCount = filteredDepartments.map(dept => ({
    ...dept,
    employeeCount: employees.filter(emp => emp.department === dept.name).length
  }));

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      manager: '',
      location: '',
      color: '#3b82f6',
      budget: 0,
      status: 'active'
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (department: any) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description,
      manager: department.manager,
      location: department.location,
      color: department.color,
      budget: department.budget || 0,
      status: department.status
    });
    setShowEditModal(true);
  };

  const handleOpenDelete = (department: any) => {
    setDeletingDepartment(department);
    setShowDeleteModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) {
      alert('אנא מלא את כל השדות הנדרשים');
      return;
    }

    const departmentData = {
      ...formData,
      budget: Number(formData.budget)
    };

    try {
      if (editingDepartment) {
        updateDepartment(editingDepartment.id, departmentData);
        alert('המחלקה עודכנה בהצלחה!');
        setShowEditModal(false);
        setEditingDepartment(null);
      } else {
        addDepartment({...departmentData, managerId: '', costCenter: 'DEFAULT'});
        alert('מחלקה חדשה נוספה בהצלחה!');
        setShowAddModal(false);
      }
      resetForm();
    } catch (error) {
      alert('שגיאה בשמירת המחלקה');
    }
  };

  const handleDelete = () => {
    if (deletingDepartment) {
      try {
        deleteDepartment(deletingDepartment.id);
        alert('המחלקה נמחקה בהצלחה!');
        setShowDeleteModal(false);
        setDeletingDepartment(null);
      } catch (error) {
        alert('שגיאה במחיקת המחלקה');
      }
    }
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setEditingDepartment(null);
    setDeletingDepartment(null);
    resetForm();
  };

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
          onClick={handleOpenAdd}
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
              {employees.length}
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
        {departmentsWithEmployeeCount.map((department) => (
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
                    onClick={() => handleOpenEdit(department)}
                    style={{ padding: '0.5rem' }}
                    title="ערוך מחלקה"
                  >
                    <Edit style={{ width: '14px', height: '14px' }} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDelete(department)}
                    style={{ padding: '0.5rem', color: '#ef4444' }}
                    title="מחק מחלקה"
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

      {departmentsWithEmployeeCount.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
          <Building2 style={{ width: '64px', height: '64px', margin: '0 auto 1rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>לא נמצאו מחלקות</p>
          <p style={{ fontSize: '0.875rem' }}>נסו לשנות את מילת החיפוש</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={handleCloseModals}
        title={editingDepartment ? 'ערוך מחלקה' : 'הוסף מחלקה חדשה'}
        size="lg"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                שם המחלקה *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="הכנס שם מחלקה"
                required
                style={{ height: '44px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                מנהל המחלקה
              </label>
              <Input
                type="text"
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                placeholder="שם מנהל המחלקה"
                style={{ height: '44px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              תיאור המחלקה *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="תיאור המחלקה ותפקידה..."
              required
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                מיקום
              </label>
              <Input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="מיקום המחלקה"
                style={{ height: '44px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                תקציב (₪)
              </label>
              <Input
                type="number"
                min="0"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                placeholder="תקציב המחלקה"
                style={{ height: '44px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                סטטוס
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                <option value="active">פעילה</option>
                <option value="inactive">לא פעילה</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                צבע המחלקה
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
              {editingDepartment ? 'עדכן מחלקה' : 'הוסף מחלקה'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleCloseModals}
        title="מחיקת מחלקה"
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
            מחלקה "{deletingDepartment?.name}" תימחק לצמיתות. פעולה זו לא ניתנת לביטול.
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
            מחק מחלקה
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}