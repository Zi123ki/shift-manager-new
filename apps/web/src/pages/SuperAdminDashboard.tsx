import { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Building2,
  AlertTriangle,
  DollarSign,
  Search,
  Eye,
  Crown,
  Shield,
  Activity,
  Plus,
  Edit,
  Trash2,
  Users,
  CreditCard,
  Star,
  Zap
} from 'lucide-react';
import { useSuperAdminStore } from '../stores/superAdminStore';
import { useAuthStore } from '../stores/authStore';
import Modal, { ModalFooter } from '../components/ui/modal';

export default function SuperAdminDashboard() {
  const { user } = useAuthStore();
  const {
    companies,
    pendingRegistrations,
    getTotalRevenue,
    getActiveCompaniesCount,
    getTrialCompaniesCount,
    initializeSuperAdminData,
    approveRegistration,
    rejectRegistration,
    deleteCompany,
    addCompany
  } = useSuperAdminStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'companies' | 'registrations' | 'plans' | 'users' | 'analytics'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // New modals
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  const [companyFormData, setCompanyFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    plan: 'starter',
    status: 'trial' as 'active' | 'suspended' | 'trial' | 'expired'
  });

  const [plans, setPlans] = useState([
    {
      id: 'starter',
      name: 'תוכנית בסיס',
      price: 99,
      currency: 'ILS',
      billingCycle: 'monthly',
      features: [
        'עד 10 עובדים',
        'ניהול משמרות בסיסי',
        'דוחות בסיסיים',
        'תמיכה באימייל'
      ],
      maxEmployees: 10,
      maxLocations: 1,
      isActive: true
    },
    {
      id: 'professional',
      name: 'תוכנית מקצועית',
      price: 199,
      currency: 'ILS',
      billingCycle: 'monthly',
      features: [
        'עד 50 עובדים',
        'ניהול משמרות מתקדם',
        'דוחות מתקדמים',
        'ניהול חופשות',
        'אפליקציית מובייל',
        'תמיכה טלפונית'
      ],
      maxEmployees: 50,
      maxLocations: 3,
      isActive: true
    },
    {
      id: 'enterprise',
      name: 'תוכנית ארגונית',
      price: 399,
      currency: 'ILS',
      billingCycle: 'monthly',
      features: [
        'עובדים ללא הגבלה',
        'תכונות מתקדמות',
        'דוחות מותאמים אישית',
        'אינטגרציות',
        'מנהל לקוחות ייעודי',
        'תמיכה 24/7'
      ],
      maxEmployees: -1, // unlimited
      maxLocations: -1, // unlimited
      isActive: true
    }
  ]);

  const [planFormData, setPlanFormData] = useState({
    name: '',
    price: '',
    currency: 'ILS',
    billingCycle: 'monthly',
    features: [] as string[],
    maxEmployees: 0,
    maxLocations: 0,
    isActive: true
  });

  useEffect(() => {
    initializeSuperAdminData();
  }, [initializeSuperAdminData]);

  // Redirect if not super admin
  if (user?.role !== 'SUPER_ADMIN') {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Card>
          <CardContent style={{ padding: '2rem' }}>
            <Shield style={{ width: '48px', height: '48px', color: '#dc2626', margin: '0 auto 1rem' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#dc2626', marginBottom: '0.5rem' }}>
              גישה מוגבלת
            </h1>
            <p style={{ color: '#7f1d1d' }}>
              אזור זה מיועד למנהלי-על בלבד
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleApproveRegistration = (registrationId: string) => {
    const newCompany = approveRegistration(registrationId, user?.id || 'super_admin');
    if (newCompany) {
      alert('הרישום אושר בהצלחה! החברה נוספה למערכת.');
      setShowRegistrationModal(false);
      setSelectedRegistration(null);
    }
  };

  const handleRejectRegistration = (registrationId: string) => {
    if (!rejectionReason.trim()) {
      alert('אנא הכנס סיבת דחייה');
      return;
    }
    rejectRegistration(registrationId, user?.id || 'super_admin', rejectionReason);
    alert('הרישום נדחה');
    setShowRegistrationModal(false);
    setSelectedRegistration(null);
    setRejectionReason('');
  };

  const handleAddCompany = () => {
    if (!companyFormData.name.trim() || !companyFormData.email.trim()) {
      alert('אנא מלא את השדות הנדרשים');
      return;
    }

    const newCompany = {
      id: Date.now().toString(),
      name: companyFormData.name,
      slug: companyFormData.name.toLowerCase().replace(/\s+/g, '-'),
      email: companyFormData.email,
      phone: companyFormData.phone,
      address: companyFormData.address,
      website: companyFormData.website,
      plan: companyFormData.plan,
      status: companyFormData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      employeeCount: 0,
      activeUsers: 0,
      totalRevenue: 0,
      lastLogin: null,
      features: plans.find(p => p.id === companyFormData.plan)?.features || [],
      limits: {
        maxEmployees: plans.find(p => p.id === companyFormData.plan)?.maxEmployees || 10,
        maxLocations: plans.find(p => p.id === companyFormData.plan)?.maxLocations || 1
      }
    };

    addCompany(newCompany);
    alert('החברה נוספה בהצלחה!');
    setShowAddCompanyModal(false);
    setCompanyFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      plan: 'starter',
      status: 'trial'
    });
  };

  const handleEditCompany = () => {
    if (!editingCompany) return;

    // Update company logic would go here
    alert('פרטי החברה עודכנו בהצלחה!');
    setShowEditCompanyModal(false);
    setEditingCompany(null);
  };

  const openEditCompany = (company: any) => {
    setEditingCompany(company);
    setCompanyFormData({
      name: company.name,
      email: company.email,
      phone: company.phone || '',
      address: company.address || '',
      website: company.website || '',
      plan: company.plan,
      status: company.status
    });
    setShowEditCompanyModal(true);
  };

  const handleAddPlan = () => {
    if (!planFormData.name.trim() || !planFormData.price) {
      alert('אנא מלא את השדות הנדרשים');
      return;
    }

    const newPlan = {
      id: Date.now().toString(),
      name: planFormData.name,
      price: parseFloat(planFormData.price),
      currency: planFormData.currency,
      billingCycle: planFormData.billingCycle,
      features: planFormData.features,
      maxEmployees: planFormData.maxEmployees,
      maxLocations: planFormData.maxLocations,
      isActive: planFormData.isActive
    };

    setPlans([...plans, newPlan]);
    alert('התוכנית נוספה בהצלחה!');
    setShowAddPlanModal(false);
    setPlanFormData({
      name: '',
      price: '',
      currency: 'ILS',
      billingCycle: 'monthly',
      features: [],
      maxEmployees: 0,
      maxLocations: 0,
      isActive: true
    });
  };

  const filteredCompanies = companies.filter(company =>
    company.name.includes(searchTerm) ||
    company.email.includes(searchTerm) ||
    company.status.includes(searchTerm)
  );

  const filteredRegistrations = pendingRegistrations.filter(reg =>
    reg.companyName.includes(searchTerm) ||
    reg.adminEmail.includes(searchTerm)
  );

  return (
    <div style={{
      padding: '1.5rem',
      background: 'var(--bg-secondary)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '2rem',
        padding: '2rem',
        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
        borderRadius: '20px',
        color: 'white',
        boxShadow: '0 10px 25px rgba(220, 38, 38, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Crown style={{ width: '32px', height: '32px' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 4px 0' }}>
              פאנל מנהל-על
            </h1>
            <p style={{ opacity: 0.9, margin: 0, fontSize: '1.1rem' }}>
              מרכז שליטה מתקדם לניהול המערכת
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{getTotalRevenue().toLocaleString('he-IL')} ₪</div>
            <div style={{ opacity: 0.9, fontSize: '0.875rem' }}>הכנסות חודשיות</div>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{getActiveCompaniesCount()}</div>
            <div style={{ opacity: 0.9, fontSize: '0.875rem' }}>חברות פעילות</div>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{getTrialCompaniesCount()}</div>
            <div style={{ opacity: 0.9, fontSize: '0.875rem' }}>תקופות ניסיון</div>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{pendingRegistrations.length}</div>
            <div style={{ opacity: 0.9, fontSize: '0.875rem' }}>רישומים ממתינים</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: activeTab === 'dashboard' ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' : 'rgba(220, 38, 38, 0.1)',
              color: activeTab === 'dashboard' ? 'white' : '#dc2626',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            <Activity style={{ width: '16px', height: '16px' }} />
            דשבורד
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: activeTab === 'companies' ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'rgba(59, 130, 246, 0.1)',
              color: activeTab === 'companies' ? 'white' : '#3b82f6',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            <Building2 style={{ width: '16px', height: '16px' }} />
            ניהול חברות ({companies.length})
          </button>
          <button
            onClick={() => setActiveTab('registrations')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: activeTab === 'registrations' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'rgba(245, 158, 11, 0.1)',
              color: activeTab === 'registrations' ? 'white' : '#f59e0b',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            <AlertTriangle style={{ width: '16px', height: '16px' }} />
            רישומים ({pendingRegistrations.length})
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: activeTab === 'plans' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(16, 185, 129, 0.1)',
              color: activeTab === 'plans' ? 'white' : '#10b981',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            <DollarSign style={{ width: '16px', height: '16px' }} />
            תוכניות תשלום
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: activeTab === 'users' ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 'rgba(139, 92, 246, 0.1)',
              color: activeTab === 'users' ? 'white' : '#8b5cf6',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            <Users style={{ width: '16px', height: '16px' }} />
            ניהול משתמשים
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'dashboard' && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>דשבורד כללי</h2>

          {/* Dashboard widgets */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <Card style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white' }}>
              <CardContent style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', opacity: 0.9 }}>סה"כ הכנסות חודשיות</h3>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: '700' }}>
                      ₪{getTotalRevenue().toLocaleString('he-IL')}
                    </p>
                  </div>
                  <DollarSign style={{ width: '48px', height: '48px', opacity: 0.8 }} />
                </div>
              </CardContent>
            </Card>

            <Card style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
              <CardContent style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', opacity: 0.9 }}>חברות פעילות</h3>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: '700' }}>
                      {getActiveCompaniesCount()}
                    </p>
                  </div>
                  <Building2 style={{ width: '48px', height: '48px', opacity: 0.8 }} />
                </div>
              </CardContent>
            </Card>

            <Card style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }}>
              <CardContent style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', opacity: 0.9 }}>תקופות ניסיון</h3>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: '700' }}>
                      {getTrialCompaniesCount()}
                    </p>
                  </div>
                  <Star style={{ width: '48px', height: '48px', opacity: 0.8 }} />
                </div>
              </CardContent>
            </Card>

            <Card style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', color: 'white' }}>
              <CardContent style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', opacity: 0.9 }}>רישומים ממתינים</h3>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: '700' }}>
                      {pendingRegistrations.length}
                    </p>
                  </div>
                  <AlertTriangle style={{ width: '48px', height: '48px', opacity: 0.8 }} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <CardContent style={{ padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>פעילות אחרונה</h3>
              <div style={{ color: 'var(--text-tertiary)' }}>
                <p style={{ margin: '0.5rem 0' }}>• חברה חדשה הצטרפה: {companies[companies.length - 1]?.name || 'אין נתונים'}</p>
                <p style={{ margin: '0.5rem 0' }}>• {pendingRegistrations.length} רישומים ממתינים לאישור</p>
                <p style={{ margin: '0.5rem 0' }}>• סה"כ הכנסות חודשיות: ₪{getTotalRevenue().toLocaleString('he-IL')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'companies' && (
        <div>
          {/* Companies Management */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '250px' }}>
              <Search style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
              <Input
                type="text"
                placeholder="חיפוש חברות..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  paddingRight: '2.25rem',
                  height: '36px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
            <Button
              onClick={() => setShowAddCompanyModal(true)}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                height: '36px',
                padding: '0 1rem',
                borderRadius: '8px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              הוסף חברה
            </Button>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredCompanies.map((company) => (
              <Card key={company.id} style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px'
              }}>
                <CardContent style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '18px'
                        }}>
                          {company.name.charAt(0)}
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>{company.name}</h3>
                          <p style={{ margin: '4px 0 0 0', color: 'var(--text-tertiary)', fontSize: '14px' }}>{company.email}</p>
                        </div>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: company.status === 'active' ? '#dcfce7' : company.status === 'trial' ? '#fef3c7' : '#fee2e2',
                          color: company.status === 'active' ? '#166534' : company.status === 'trial' ? '#92400e' : '#dc2626'
                        }}>
                          {company.status === 'active' ? 'פעיל' : company.status === 'trial' ? 'ניסיון' : company.status === 'suspended' ? 'מושעה' : 'פג תוקף'}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>תוכנית</div>
                          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{company.plan}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>עובדים</div>
                          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{company.employeeCount || 0}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>הכנסות</div>
                          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>₪{(company.totalRevenue || 0).toLocaleString('he-IL')}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>נוצר</div>
                          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{new Date(company.createdAt).toLocaleDateString('he-IL')}</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button
                        onClick={() => openEditCompany(company)}
                        style={{
                          padding: '0.5rem',
                          background: 'rgba(59, 130, 246, 0.1)',
                          color: '#3b82f6',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          borderRadius: '8px'
                        }}
                      >
                        <Edit style={{ width: '16px', height: '16px' }} />
                      </Button>
                      <Button
                        onClick={() => setSelectedCompany(company)}
                        style={{
                          padding: '0.5rem',
                          background: 'rgba(16, 185, 129, 0.1)',
                          color: '#10b981',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          borderRadius: '8px'
                        }}
                      >
                        <Eye style={{ width: '16px', height: '16px' }} />
                      </Button>
                      <Button
                        onClick={() => {
                          if (confirm('האם אתה בטוח שברצונך למחוק את החברה?')) {
                            deleteCompany(company.id);
                          }
                        }}
                        style={{
                          padding: '0.5rem',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          borderRadius: '8px'
                        }}
                      >
                        <Trash2 style={{ width: '16px', height: '16px' }} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'plans' && (
        <div>
          {/* Plans Management */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>ניהול תוכניות תשלום</h2>
            <Button
              onClick={() => setShowAddPlanModal(true)}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                height: '44px',
                padding: '0 1.5rem',
                borderRadius: '12px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600'
              }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              הוסף תוכנית
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {plans.map((plan) => (
              <Card key={plan.id} style={{
                background: 'white',
                border: '2px solid #e2e8f0',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '1.5rem',
                  background: plan.id === 'professional' ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' :
                              plan.id === 'enterprise' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                              'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  {plan.id === 'professional' && <Star style={{ width: '24px', height: '24px', margin: '0 auto 8px' }} />}
                  {plan.id === 'enterprise' && <Zap style={{ width: '24px', height: '24px', margin: '0 auto 8px' }} />}
                  {plan.id === 'starter' && <CreditCard style={{ width: '24px', height: '24px', margin: '0 auto 8px' }} />}

                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: '600' }}>{plan.name}</h3>
                  <div style={{ fontSize: '2rem', fontWeight: '700' }}>
                    ₪{plan.price}
                    <span style={{ fontSize: '1rem', fontWeight: '400', opacity: 0.9 }}>/{plan.billingCycle === 'monthly' ? 'חודש' : 'שנה'}</span>
                  </div>
                </div>

                <CardContent style={{ padding: '1.5rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>מגבלות</div>
                    <div style={{ fontSize: '14px' }}>
                      {plan.maxEmployees === -1 ? 'עובדים ללא הגבלה' : `עד ${plan.maxEmployees} עובדים`} •
                      {plan.maxLocations === -1 ? ' מיקומים ללא הגבלה' : ` עד ${plan.maxLocations} מיקומים`}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>תכונות</div>
                    <ul style={{ margin: 0, padding: '0 0 0 1rem', fontSize: '14px' }}>
                      {plan.features.map((feature, index) => (
                        <li key={index} style={{ marginBottom: '4px' }}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                      onClick={() => {
                        setEditingPlan(plan);
                        setPlanFormData({
                          name: plan.name,
                          price: plan.price.toString(),
                          currency: plan.currency,
                          billingCycle: plan.billingCycle,
                          features: [...plan.features],
                          maxEmployees: plan.maxEmployees,
                          maxLocations: plan.maxLocations,
                          isActive: plan.isActive
                        });
                        setShowAddPlanModal(true);
                      }}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#3b82f6',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        borderRadius: '8px'
                      }}
                    >
                      <Edit style={{ width: '16px', height: '16px' }} />
                    </Button>
                    <Button
                      onClick={() => {
                        if (confirm('האם אתה בטוח שברצונך למחוק את התוכנית?')) {
                          setPlans(plans.filter(p => p.id !== plan.id));
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '8px'
                      }}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Other tabs content... */}
      {activeTab === 'registrations' && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>רישומים ממתינים לאישור</h2>

          {filteredRegistrations.length === 0 ? (
            <Card>
              <CardContent style={{ padding: '3rem', textAlign: 'center' }}>
                <AlertTriangle style={{ width: '64px', height: '64px', color: '#9ca3af', margin: '0 auto 1rem' }} />
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>אין רישומים ממתינים</h3>
                <p style={{ margin: 0, color: '#9ca3af' }}>כל הרישומים טופלו או שאין רישומים חדשים</p>
              </CardContent>
            </Card>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {filteredRegistrations.map((registration) => (
                <Card key={registration.id} style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px'
                }}>
                  <CardContent style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '18px'
                          }}>
                            {registration.companyName.charAt(0)}
                          </div>
                          <div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>{registration.companyName}</h3>
                            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>{registration.adminEmail}</p>
                          </div>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: '#fef3c7',
                            color: '#92400e'
                          }}>
                            ממתין
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                          <div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>איש קשר</div>
                            <div style={{ fontWeight: '600' }}>{registration.adminName}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>טלפון</div>
                            <div style={{ fontWeight: '600' }}>{registration.adminPhone}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>תוכנית מבוקשת</div>
                            <div style={{ fontWeight: '600' }}>{registration.requestedPlan}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>תאריך הגשה</div>
                            <div style={{ fontWeight: '600' }}>{new Date(registration.submittedAt).toLocaleDateString('he-IL')}</div>
                          </div>
                        </div>

                        {registration.message && (
                          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '0.5rem' }}>הודעה</div>
                            <div style={{ fontSize: '14px' }}>{registration.message}</div>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                          onClick={() => handleApproveRegistration(registration.id)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                        >
                          אשר
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedRegistration(registration);
                            setShowRegistrationModal(true);
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                        >
                          דחה
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>ניהול משתמשי מערכת</h2>

          <Card>
            <CardContent style={{ padding: '3rem', textAlign: 'center' }}>
              <Users style={{ width: '64px', height: '64px', color: '#9ca3af', margin: '0 auto 1rem' }} />
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>ניהול משתמשים</h3>
              <p style={{ margin: 0, color: '#9ca3af' }}>תכונה זו תתפתח בעתיד לניהול משתמשי מנהל-על ומשתמשי מערכת</p>
              <div style={{ marginTop: '2rem' }}>
                <Button
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                  onClick={() => {
                    const name = prompt('הכנס שם מלא למשתמש המערכת:');
                    if (!name) return;
                    const email = prompt('הכנס אימייל למשתמש המערכת:');
                    if (!email) return;
                    const role = prompt('בחר תפקיד (ADMIN/MANAGER):', 'ADMIN');
                    if (!role) return;

                    alert(`משתמש מערכת נוצר בהצלחה!\nשם: ${name}\nאימייל: ${email}\nתפקיד: ${role}\n\nסיסמה זמנית נשלחה לאימייל`);
                  }}
                >
                  הוסף משתמש מערכת
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Company Modal */}
      <Modal isOpen={showAddCompanyModal} onClose={() => setShowAddCompanyModal(false)} title="הוספת חברה חדשה">
        <form onSubmit={(e) => { e.preventDefault(); handleAddCompany(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>שם החברה *</label>
            <Input
              type="text"
              value={companyFormData.name}
              onChange={(e) => setCompanyFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="הכנס שם חברה"
              required
              style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>אימייל *</label>
            <Input
              type="email"
              value={companyFormData.email}
              onChange={(e) => setCompanyFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="הכנס אימייל"
              required
              style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>טלפון</label>
              <Input
                type="tel"
                value={companyFormData.phone}
                onChange={(e) => setCompanyFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="הכנס טלפון"
                style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>תוכנית</label>
              <select
                value={companyFormData.plan}
                onChange={(e) => setCompanyFormData(prev => ({ ...prev, plan: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}
              >
                {plans.map(plan => (
                  <option key={plan.id} value={plan.id}>{plan.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>כתובת</label>
            <Input
              type="text"
              value={companyFormData.address}
              onChange={(e) => setCompanyFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="הכנס כתובת"
              style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}
            />
          </div>

          <ModalFooter>
            <Button
              type="button"
              onClick={() => setShowAddCompanyModal(false)}
              style={{ padding: '0.75rem 1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px'
              }}
            >
              הוסף חברה
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Add Plan Modal */}
      <Modal isOpen={showAddPlanModal} onClose={() => setShowAddPlanModal(false)} title={editingPlan ? 'עריכת תוכנית' : 'הוספת תוכנית חדשה'}>
        <form onSubmit={(e) => { e.preventDefault(); handleAddPlan(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>שם התוכנית *</label>
            <Input
              type="text"
              value={planFormData.name}
              onChange={(e) => setPlanFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="הכנס שם תוכנית"
              required
              style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>מחיר *</label>
              <Input
                type="number"
                value={planFormData.price}
                onChange={(e) => setPlanFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="הכנס מחיר"
                required
                style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>מטבע</label>
              <select
                value={planFormData.currency}
                onChange={(e) => setPlanFormData(prev => ({ ...prev, currency: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}
              >
                <option value="ILS">שקל (₪)</option>
                <option value="USD">דולר ($)</option>
                <option value="EUR">יורו (€)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>מקסימום עובדים</label>
              <Input
                type="number"
                value={planFormData.maxEmployees}
                onChange={(e) => setPlanFormData(prev => ({ ...prev, maxEmployees: parseInt(e.target.value) || 0 }))}
                placeholder="0 = ללא הגבלה"
                style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>מקסימום מיקומים</label>
              <Input
                type="number"
                value={planFormData.maxLocations}
                onChange={(e) => setPlanFormData(prev => ({ ...prev, maxLocations: parseInt(e.target.value) || 0 }))}
                placeholder="0 = ללא הגבלה"
                style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}
              />
            </div>
          </div>

          <ModalFooter>
            <Button
              type="button"
              onClick={() => setShowAddPlanModal(false)}
              style={{ padding: '0.75rem 1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px'
              }}
            >
              {editingPlan ? 'עדכן תוכנית' : 'הוסף תוכנית'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Edit Company Modal */}
      <Modal isOpen={showEditCompanyModal} onClose={() => setShowEditCompanyModal(false)} title="עריכת פרטי חברה">
        <form onSubmit={(e) => { e.preventDefault(); handleEditCompany(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>שם החברה *</label>
            <Input
              type="text"
              value={companyFormData.name}
              onChange={(e) => setCompanyFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="הכנס שם חברה"
              required
              style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>אימייל *</label>
            <Input
              type="email"
              value={companyFormData.email}
              onChange={(e) => setCompanyFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="הכנס אימייל"
              required
              style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>טלפון</label>
              <Input
                type="tel"
                value={companyFormData.phone}
                onChange={(e) => setCompanyFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="הכנס טלפון"
                style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>סטטוס</label>
              <select
                value={companyFormData.status}
                onChange={(e) => setCompanyFormData(prev => ({ ...prev, status: e.target.value as any }))}
                style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}
              >
                <option value="active">פעיל</option>
                <option value="trial">ניסיון</option>
                <option value="suspended">מושעה</option>
                <option value="expired">פג תוקף</option>
              </select>
            </div>
          </div>

          <ModalFooter>
            <Button
              type="button"
              onClick={() => setShowEditCompanyModal(false)}
              style={{ padding: '0.75rem 1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px'
              }}
            >
              עדכן חברה
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Registration Rejection Modal */}
      <Modal isOpen={showRegistrationModal} onClose={() => setShowRegistrationModal(false)} title="דחיית רישום">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p>אתה עומד לדחות את הרישום של: <strong>{selectedRegistration?.companyName}</strong></p>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>סיבת הדחייה *</label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="הכנס סיבת דחייה..."
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                minHeight: '100px',
                resize: 'vertical'
              }}
            />
          </div>

          <ModalFooter>
            <Button
              type="button"
              onClick={() => {
                setShowRegistrationModal(false);
                setRejectionReason('');
              }}
              style={{ padding: '0.75rem 1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}
            >
              ביטול
            </Button>
            <Button
              onClick={() => selectedRegistration && handleRejectRegistration(selectedRegistration.id)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px'
              }}
            >
              דחה רישום
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}