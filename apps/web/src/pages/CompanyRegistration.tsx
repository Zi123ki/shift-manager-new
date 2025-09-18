import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Building2,
  User,
  CheckCircle,
  Crown,
  MessageSquare
} from 'lucide-react';
import { useSuperAdminStore } from '../stores/superAdminStore';

export default function CompanyRegistration() {
  const { addPendingRegistration } = useSuperAdminStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'professional' | 'enterprise'>('basic');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    companyPhone: '',
    companyAddress: '',
    message: ''
  });

  const plans = [
    {
      id: 'basic' as const,
      name: 'תוכנית בסיסית',
      price: 299,
      maxEmployees: 50,
      features: [
        'ניהול משמרות',
        'ניהול עובדים',
        'ניהול מחלקות',
        'תמיכה בסיסית',
        '5GB אחסון'
      ],
      color: '#10b981',
      popular: false
    },
    {
      id: 'professional' as const,
      name: 'תוכנית מקצועית',
      price: 599,
      maxEmployees: 200,
      features: [
        'כל התכונות הבסיסיות',
        'דוחות מתקדמים',
        'אינטגרציות',
        'ברנדינג מותאם אישית',
        'תמיכה מועדפת',
        '50GB אחסון'
      ],
      color: '#3b82f6',
      popular: true
    },
    {
      id: 'enterprise' as const,
      name: 'תוכנית ארגונית',
      price: 1299,
      maxEmployees: 1000,
      features: [
        'כל התכונות המקצועיות',
        'API מלא',
        'אבטחה מתקדמת',
        'תמיכה 24/7',
        'מנהל חשבון ייעודי',
        'אחסון ללא הגבלה'
      ],
      color: '#8b5cf6',
      popular: false
    }
  ];

  const handleSubmit = () => {
    if (!formData.companyName || !formData.adminName || !formData.adminEmail) {
      alert('אנא מלא את כל השדות החובה');
      return;
    }

    addPendingRegistration({
      companyName: formData.companyName,
      adminName: formData.adminName,
      adminEmail: formData.adminEmail,
      adminPhone: formData.adminPhone,
      companyPhone: formData.companyPhone,
      companyAddress: formData.companyAddress,
      requestedPlan: selectedPlan,
      message: formData.message
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <Card style={{
          maxWidth: '500px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center'
        }}>
          <CardContent style={{ padding: '3rem 2rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
            }}>
              <CheckCircle style={{ width: '40px', height: '40px', color: 'white' }} />
            </div>

            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              בקשתך נשלחה בהצלחה!
            </h1>

            <p style={{
              color: '#64748b',
              fontSize: '1rem',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              תודה {formData.adminName}! בקשת הרישום של <strong>{formData.companyName}</strong> נתקבלה במערכת.
              <br /><br />
              צוות המכירות שלנו יצור איתך קשר תוך 24 שעות לסיום התהליך.
            </p>

            <div style={{
              padding: '1rem',
              background: '#f0f9ff',
              border: '1px solid #0ea5e9',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <strong style={{ color: '#0284c7' }}>פרטי הבקשה:</strong><br />
              <div style={{ fontSize: '0.875rem', color: '#0369a1', marginTop: '0.5rem' }}>
                תוכנית: <strong>{plans.find(p => p.id === selectedPlan)?.name}</strong><br />
                מחיר: <strong>₪{plans.find(p => p.id === selectedPlan)?.price}/חודש</strong>
              </div>
            </div>

            <Button
              onClick={() => window.location.href = '/login'}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 2rem',
                color: 'white',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              חזרה למסך הכניסה
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
            borderRadius: '30px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}>
            <Building2 style={{ color: 'white', width: '48px', height: '48px' }} />
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            margin: '0 0 12px 0',
            color: 'white',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            הצטרפו לשירות ניהול המשמרות המתקדם
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0,
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>
            פתרון מקצועי לניהול משמרות ועובדים לעסקים מודרניים
          </p>
        </div>

        {/* Step 1: Plan Selection */}
        {currentStep === 1 && (
          <div>
            <h2 style={{
              textAlign: 'center',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '2rem'
            }}>
              שלב 1: בחירת תוכנית
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {plans.map((plan) => (
                <Card key={plan.id} style={{
                  background: selectedPlan === plan.id
                    ? 'rgba(255, 255, 255, 1)'
                    : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: selectedPlan === plan.id
                    ? `3px solid ${plan.color}`
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  boxShadow: selectedPlan === plan.id
                    ? `0 25px 50px ${plan.color}30`
                    : '0 25px 50px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  position: 'relative'
                }} onClick={() => setSelectedPlan(plan.id)}>
                  {plan.popular && (
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '20px',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                    }}>
                      פופולרי
                    </div>
                  )}

                  <CardContent style={{ padding: '2rem' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}cc 100%)`,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}>
                      <Crown style={{ width: '30px', height: '30px', color: 'white' }} />
                    </div>

                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#1e293b',
                      marginBottom: '0.5rem'
                    }}>
                      {plan.name}
                    </h3>

                    <div style={{
                      fontSize: '2rem',
                      fontWeight: '800',
                      color: plan.color,
                      marginBottom: '0.5rem'
                    }}>
                      ₪{plan.price}
                      <span style={{ fontSize: '1rem', fontWeight: '400', color: '#64748b' }}>
                        /חודש
                      </span>
                    </div>

                    <div style={{
                      fontSize: '0.875rem',
                      color: '#64748b',
                      marginBottom: '1.5rem'
                    }}>
                      עד {plan.maxEmployees} עובדים
                    </div>

                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      {plan.features.map((feature, index) => (
                        <li key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem',
                          color: '#374151'
                        }}>
                          <CheckCircle style={{ width: '16px', height: '16px', color: plan.color }} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Button
                onClick={() => setCurrentStep(2)}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem 2rem',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
              >
                המשך לפרטי החברה
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Company Details */}
        {currentStep === 2 && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{
              textAlign: 'center',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '2rem'
            }}>
              שלב 2: פרטי החברה והמנהל
            </h2>

            <Card style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <CardHeader style={{ padding: '2rem 2rem 1rem' }}>
                <CardTitle style={{ textAlign: 'center', color: '#1e293b' }}>
                  מלא פרטי החברה
                </CardTitle>
                <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    background: plans.find(p => p.id === selectedPlan)?.color,
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {plans.find(p => p.id === selectedPlan)?.name}
                  </span>
                </div>
              </CardHeader>

              <CardContent style={{ padding: '0 2rem 2rem' }}>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Company Info */}
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                      <Building2 style={{ width: '16px', height: '16px', display: 'inline', marginLeft: '0.5rem' }} />
                      פרטי החברה
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                          שם החברה *
                        </label>
                        <Input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                          placeholder="הכנס שם החברה"
                          required
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                            טלפון החברה
                          </label>
                          <Input
                            type="tel"
                            value={formData.companyPhone}
                            onChange={(e) => setFormData(prev => ({ ...prev, companyPhone: e.target.value }))}
                            placeholder="03-1234567"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                          כתובת החברה
                        </label>
                        <Input
                          type="text"
                          value={formData.companyAddress}
                          onChange={(e) => setFormData(prev => ({ ...prev, companyAddress: e.target.value }))}
                          placeholder="רחוב התעשייה 15, תל אביב"
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Admin Info */}
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                      <User style={{ width: '16px', height: '16px', display: 'inline', marginLeft: '0.5rem' }} />
                      פרטי המנהל
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                          שם מלא *
                        </label>
                        <Input
                          type="text"
                          value={formData.adminName}
                          onChange={(e) => setFormData(prev => ({ ...prev, adminName: e.target.value }))}
                          placeholder="הכנס שם מלא"
                          required
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                            אימייל *
                          </label>
                          <Input
                            type="email"
                            value={formData.adminEmail}
                            onChange={(e) => setFormData(prev => ({ ...prev, adminEmail: e.target.value }))}
                            placeholder="admin@company.com"
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                            טלפון
                          </label>
                          <Input
                            type="tel"
                            value={formData.adminPhone}
                            onChange={(e) => setFormData(prev => ({ ...prev, adminPhone: e.target.value }))}
                            placeholder="050-1234567"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                      <MessageSquare style={{ width: '16px', height: '16px', display: 'inline', marginLeft: '0.5rem' }} />
                      הודעה נוספת (אופציונלי)
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="ספר לנו על החברה שלך ועל הצרכים שלכם..."
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '0.75rem 1.5rem',
                        color: '#64748b',
                        fontWeight: '600'
                      }}
                    >
                      חזור
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.75rem 2rem',
                        color: 'white',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                      }}
                    >
                      שלח בקשה
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}