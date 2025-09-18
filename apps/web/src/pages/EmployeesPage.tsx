import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Modal, { ModalFooter } from '../components/ui/modal';
import { useDataStore, Employee } from '../stores/dataStore';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building2,
  AlertTriangle,
  Save,
  X
} from 'lucide-react';

export default function EmployeesPage() {
  const {} = useTranslation();
  const {
    employees,
    departments,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    initializeData
  } = useDataStore();

  console.log('EmployeesPage data:', { employees: employees.length, departments: departments.length });

  // Initialize data if empty
  useEffect(() => {
    if (employees.length === 0 && departments.length === 0) {
      console.log('Initializing data...');
      initializeData();
    }
  }, [employees.length, departments.length, initializeData]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Employee | null>(null);

  // Initialize data if empty
  useEffect(() => {
    if (employees.length === 0) {
      initializeData();
    }
  }, [employees.length, initializeData]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    departmentId: '',
    salary: 0,
    address: '',
    startDate: new Date().toISOString().split('T')[0],
    status: 'active' as const,
    skills: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      departmentId: '',
      salary: 0,
      address: '',
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      skills: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: ''
    });
  };

  const openAddModal = () => {
    resetForm();
    setEditingEmployee(null);
    setShowModal(true);
  };

  const openEditModal = (employee: Employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      departmentId: employee.departmentId,
      salary: employee.salary,
      address: employee.address,
      startDate: employee.startDate,
      status: 'active' as const,
      skills: employee.skills.join(', '),
      emergencyContactName: employee.emergencyContact.name,
      emergencyContactPhone: employee.emergencyContact.phone,
      emergencyContactRelation: employee.emergencyContact.relation
    });
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const department = departments.find(d => d.id === formData.departmentId);
    if (!department) {
      alert('אנא בחר מחלקה');
      return;
    }

    const employeeData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      department: department.name,
      departmentId: formData.departmentId,
      salary: formData.salary,
      address: formData.address,
      startDate: formData.startDate,
      status: formData.status,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relation: formData.emergencyContactRelation
      },
      workHours: {
        sunday: { start: '08:00', end: '16:00', isWorking: true },
        monday: { start: '08:00', end: '16:00', isWorking: true },
        tuesday: { start: '08:00', end: '16:00', isWorking: true },
        wednesday: { start: '08:00', end: '16:00', isWorking: true },
        thursday: { start: '08:00', end: '16:00', isWorking: true },
        friday: { start: '08:00', end: '14:00', isWorking: true },
        saturday: { start: '00:00', end: '00:00', isWorking: false }
      }
    };

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, employeeData);
      alert(`פרטי העובד ${formData.name} עודכנו בהצלחה`);
    } else {
      addEmployee(employeeData);
      alert(`העובד ${formData.name} נוסף בהצלחה למערכת`);
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (employee: Employee) => {
    deleteEmployee(employee.id);
    alert(`העובד ${employee.name} נמחק מהמערכת`);
    setDeleteConfirm(null);
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.includes(searchTerm) ||
                         employee.email.includes(searchTerm) ||
                         employee.department.includes(searchTerm) ||
                         employee.position.includes(searchTerm);
    const matchesDepartment = filterDepartment === 'all' || employee.departmentId === filterDepartment;
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    inactive: employees.filter(e => e.status === 'inactive').length,
    avgSalary: employees.length > 0 ? employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length : 0
  };

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

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Card style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
          <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>סה"כ עובדים</div>
          </CardContent>
        </Card>
        <Card style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
          <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
              {stats.active}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>עובדים פעילים</div>
          </CardContent>
        </Card>
        <Card style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
          <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
              ₪{Math.round(stats.avgSalary).toLocaleString()}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>שכר ממוצע</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px', minWidth: '200px' }}>
            <Search style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
            <Input
              type="text"
              placeholder="חיפוש עובדים..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingRight: '2.5rem', height: '36px' }}
            />
          </div>

          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            style={{
              height: '36px',
              padding: '0 1rem',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              fontSize: '0.875rem'
            }}
          >
            <option value="all">כל המחלקות</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            style={{
              height: '36px',
              padding: '0 1rem',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              fontSize: '0.875rem'
            }}
          >
            <option value="all">כל הסטטוסים</option>
            <option value="active">פעיל</option>
            <option value="inactive">לא פעיל</option>
          </select>
        </div>

        <Button
          onClick={openAddModal}
          style={{ backgroundColor: '#3b82f6', color: 'white', height: '36px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          הוסף עובד חדש
        </Button>
      </div>

      {/* Employees Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
            <CardHeader style={{ paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    backgroundColor: employee.status === 'active' ? '#3b82f6' : '#94a3b8',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}>
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <CardTitle style={{ margin: 0, fontSize: '1.125rem' }}>{employee.name}</CardTitle>
                    <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>{employee.position}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <Building2 style={{ width: '14px', height: '14px', color: '#64748b' }} />
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{employee.department}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    onClick={() => openEditModal(employee)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      color: '#3b82f6',
                      cursor: 'pointer'
                    }}
                  >
                    <Edit style={{ width: '14px', height: '14px' }} />
                  </Button>
                  <Button
                    onClick={() => setDeleteConfirm(employee)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      color: '#ef4444',
                      cursor: 'pointer'
                    }}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MapPin style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>{employee.address}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>שכר</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#10b981' }}>₪{employee.salary.toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>תחילת עבודה</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                      {new Date(employee.startDate).toLocaleDateString('he-IL')}
                    </div>
                  </div>
                  <div>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      backgroundColor: employee.status === 'active' ? '#dcfce7' : '#fee2e2',
                      color: employee.status === 'active' ? '#166534' : '#dc2626',
                      fontWeight: '500'
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
          <p style={{ fontSize: '0.875rem' }}>נסו לשנות את מילת החיפוש או הסננים</p>
        </div>
      )}

      {/* Add/Edit Employee Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingEmployee ? 'עריכת עובד' : 'הוספת עובד חדש'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>שם מלא</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                style={{ height: '44px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>אימייל</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                style={{ height: '44px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>טלפון</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
                style={{ height: '44px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>תפקיד</label>
              <Input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                required
                style={{ height: '44px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>מחלקה</label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData(prev => ({ ...prev, departmentId: e.target.value }))}
                required
                style={{
                  width: '100%',
                  height: '36px',
                  padding: '0 1rem',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white'
                }}
              >
                <option value="">בחר מחלקה</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>שכר</label>
              <Input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: parseInt(e.target.value) || 0 }))}
                required
                style={{ height: '44px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>כתובת</label>
              <Input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                required
                style={{ height: '44px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>תאריך תחילת עבודה</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
                style={{ height: '44px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>כישורים (מופרדים בפסיק)</label>
            <Input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
              placeholder="דוגמה: ניהול, בטיחות, תפעול"
              style={{ height: '44px' }}
            />
          </div>

          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600' }}>איש קשר לחירום</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>שם</label>
                <Input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                  style={{ height: '44px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>טלפון</label>
                <Input
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                  style={{ height: '44px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>קרבה</label>
                <Input
                  type="text"
                  value={formData.emergencyContactRelation}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactRelation: e.target.value }))}
                  placeholder="דוגמה: בן/בת זוג"
                  style={{ height: '44px' }}
                />
              </div>
            </div>
          </div>

          <ModalFooter>
            <Button
              type="button"
              onClick={() => setShowModal(false)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#64748b'
              }}
            >
              <X style={{ width: '16px', height: '16px', marginLeft: '0.5rem' }} />
              ביטול
            </Button>
            <Button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px'
              }}
            >
              <Save style={{ width: '16px', height: '16px', marginLeft: '0.5rem' }} />
              {editingEmployee ? 'עדכן' : 'הוסף'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="מחיקת עובד"
        size="sm"
      >
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <AlertTriangle style={{ width: '48px', height: '48px', color: '#ef4444', margin: '0 auto 1rem' }} />
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
            אתה בטוח שברצונך למחוק את העובד?
          </h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            {deleteConfirm?.name} ימחק לצמיתות מהמערכת. פעולה זו לא ניתנת לביטול.
          </p>
          <ModalFooter align="center">
            <Button
              onClick={() => setDeleteConfirm(null)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#64748b'
              }}
            >
              ביטול
            </Button>
            <Button
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px'
              }}
            >
              מחק
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}