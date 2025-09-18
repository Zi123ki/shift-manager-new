import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Modal, { ModalFooter } from './ui/modal';
import { useMfaStore, MfaMethod } from '../stores/mfaStore';
import { useAuthStore } from '../stores/authStore';
import {
  Shield,
  Mail,
  Smartphone,
  QrCode,
  Copy,
  Check,
  Plus,
  Trash2,
  Star,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface MfaSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MfaSetupModal({ isOpen, onClose }: MfaSetupModalProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'add-authenticator' | 'add-email'>('list');
  const [setupMethod, setSetupMethod] = useState<MfaMethod | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const { user } = useAuthStore();
  const {
    getMethods,
    addMethod,
    removeMethod,
    setDefaultMethod,
    verifyMethodSetup
  } = useMfaStore();

  const userMethods = user ? getMethods(user.id) : [];

  useEffect(() => {
    if (!isOpen) {
      setActiveTab('list');
      setSetupMethod(null);
      setVerificationCode('');
      setEmailAddress('');
      setCopiedSecret(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (user) {
      setEmailAddress(user.email);
    }
  }, [user]);

  const handleAddAuthenticator = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const method = await addMethod(user.id, 'authenticator', { email: user.email });
      setSetupMethod(method);
      setActiveTab('add-authenticator');
    } catch (error) {
      console.error('Error adding authenticator:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmail = async () => {
    if (!user || !emailAddress.trim()) {
      toast.error('אנא הכנס כתובת אימייל תקינה');
      return;
    }

    setLoading(true);
    try {
      const method = await addMethod(user.id, 'email', { email: emailAddress.trim() });
      setSetupMethod(method);
      setActiveTab('add-email');

      // Simulate sending verification email
      toast.success(`קוד אימות נשלח לאימייל ${emailAddress}`);
    } catch (error) {
      console.error('Error adding email method:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySetup = async () => {
    if (!user || !setupMethod || !verificationCode.trim()) {
      toast.error('אנא הכנס קוד אימות');
      return;
    }

    setLoading(true);
    try {
      const success = await verifyMethodSetup(user.id, setupMethod.id, verificationCode.trim());
      if (success) {
        setActiveTab('list');
        setSetupMethod(null);
        setVerificationCode('');
        toast.success('שיטת האימות הוגדרה בהצלחה!');
      }
    } catch (error) {
      console.error('Error verifying setup:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMethod = async (methodId: string) => {
    if (!user) return;

    const confirmed = window.confirm('האם אתה בטוח שברצונך להסיר שיטת אימות זו?');
    if (!confirmed) return;

    await removeMethod(user.id, methodId);
  };

  const handleSetDefault = async (methodId: string) => {
    if (!user) return;
    await setDefaultMethod(user.id, methodId);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSecret(true);
      toast.success('הועתק ללוח');
      setTimeout(() => setCopiedSecret(false), 2000);
    });
  };

  const renderMethodsList = () => (
    <div style={{ padding: '1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
        }}>
          <Shield style={{ width: '40px', height: '40px', color: 'white' }} />
        </div>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: '700' }}>
          אימות דו-שלבי
        </h3>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          הגבר את האבטחה של החשבון שלך
        </p>
      </div>

      {/* Current Methods */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
          שיטות אימות פעילות
        </h4>

        {userMethods.length === 0 ? (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <AlertCircle style={{ width: '48px', height: '48px', color: '#94a3b8', margin: '0 auto 1rem' }} />
            <p style={{ color: '#64748b', margin: 0 }}>
              לא הוגדרו שיטות אימות דו-שלבי
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {userMethods.map(method => (
              <div
                key={method.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  backgroundColor: 'white',
                  border: `2px solid ${method.isDefault ? '#10b981' : '#e2e8f0'}`,
                  borderRadius: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {method.type === 'authenticator' ? (
                    <Smartphone style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
                  ) : (
                    <Mail style={{ width: '24px', height: '24px', color: '#10b981' }} />
                  )}
                  <div>
                    <div style={{
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {method.name}
                      {method.isDefault && (
                        <span style={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <Star style={{ width: '12px', height: '12px' }} />
                          ראשי
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      נוצר: {new Date(method.createdAt).toLocaleDateString('he-IL')}
                      {method.lastUsed && (
                        <span> • שימוש אחרון: {new Date(method.lastUsed).toLocaleDateString('he-IL')}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {!method.isDefault && method.verified && (
                    <Button
                      onClick={() => handleSetDefault(method.id)}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        color: '#64748b'
                      }}
                      title="הגדר כראשי"
                    >
                      <Star style={{ width: '14px', height: '14px' }} />
                    </Button>
                  )}
                  <Button
                    onClick={() => handleRemoveMethod(method.id)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      color: '#ef4444'
                    }}
                    title="הסר שיטת אימות"
                  >
                    <Trash2 style={{ width: '14px', height: '14px' }} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Method */}
      <div>
        <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
          הוסף שיטת אימות חדשה
        </h4>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button
            onClick={handleAddAuthenticator}
            disabled={loading}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '1rem',
              backgroundColor: 'white',
              border: '2px solid #3b82f6',
              borderRadius: '8px',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              justifyContent: 'center'
            }}
          >
            <Smartphone style={{ width: '20px', height: '20px' }} />
            אפליקציית אימות
          </Button>
          <Button
            onClick={handleAddEmail}
            disabled={loading}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '1rem',
              backgroundColor: 'white',
              border: '2px solid #10b981',
              borderRadius: '8px',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              justifyContent: 'center'
            }}
          >
            <Mail style={{ width: '20px', height: '20px' }} />
            אימייל
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAuthenticatorSetup = () => {
    if (!setupMethod || !setupMethod.qrCode) return null;

    return (
      <div style={{ padding: '1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Smartphone style={{
            width: '64px',
            height: '64px',
            color: '#3b82f6',
            margin: '0 auto 1rem'
          }} />
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: '700' }}>
            הגדרת אפליקציית אימות
          </h3>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ marginBottom: '1rem', color: '#64748b', lineHeight: '1.6' }}>
            1. הורד אפליקציית אימות כמו Google Authenticator או Microsoft Authenticator
            <br />
            2. סרוק את קוד ה-QR למטה או הכנס את המפתח ידנית
            <br />
            3. הכנס את הקוד בן 6 הספרות מהאפליקציה
          </p>

          {/* QR Code Display */}
          <div style={{
            padding: '2rem',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '200px',
              height: '200px',
              margin: '0 auto',
              backgroundColor: 'white',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <QrCode style={{ width: '120px', height: '120px', color: '#94a3b8' }} />
            </div>
            <p style={{
              margin: '1rem 0 0 0',
              fontSize: '0.875rem',
              color: '#64748b'
            }}>
              סרוק עם אפליקציית האימות
            </p>
          </div>

          {/* Secret Key */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              או הכנס את המפתח ידנית:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Input
                value={setupMethod.secret || ''}
                readOnly
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  backgroundColor: '#f8fafc'
                }}
              />
              <Button
                onClick={() => copyToClipboard(setupMethod.secret || '')}
                style={{
                  padding: '0.75rem',
                  backgroundColor: copiedSecret ? '#10b981' : '#64748b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px'
                }}
              >
                {copiedSecret ? <Check style={{ width: '16px', height: '16px' }} /> : <Copy style={{ width: '16px', height: '16px' }} />}
              </Button>
            </div>
          </div>

          {/* Verification Code Input */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              הכנס קוד אימות מהאפליקציה:
            </label>
            <Input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              style={{
                fontSize: '1.5rem',
                textAlign: 'center',
                letterSpacing: '0.5rem',
                height: '56px',
                fontWeight: '600'
              }}
            />
          </div>
        </div>

        <ModalFooter>
          <Button
            onClick={() => setActiveTab('list')}
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#64748b',
              padding: '0.75rem 1.5rem'
            }}
          >
            חזור
          </Button>
          <Button
            onClick={handleVerifySetup}
            disabled={loading || verificationCode.length !== 6}
            style={{
              backgroundColor: verificationCode.length === 6 ? '#3b82f6' : '#94a3b8',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem'
            }}
          >
            {loading ? 'מאמת...' : 'אמת והפעל'}
          </Button>
        </ModalFooter>
      </div>
    );
  };

  const renderEmailSetup = () => (
    <div style={{ padding: '1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Mail style={{
          width: '64px',
          height: '64px',
          color: '#10b981',
          margin: '0 auto 1rem'
        }} />
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: '700' }}>
          הגדרת אימות באימייל
        </h3>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          קוד אימות נשלח לאימייל {setupMethod?.email}
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          הכנס את הקוד מהאימייל:
        </label>
        <Input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          maxLength={6}
          style={{
            fontSize: '1.5rem',
            textAlign: 'center',
            letterSpacing: '0.5rem',
            height: '56px',
            fontWeight: '600'
          }}
        />
      </div>

      <ModalFooter>
        <Button
          onClick={() => setActiveTab('list')}
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            color: '#64748b',
            padding: '0.75rem 1.5rem'
          }}
        >
          חזור
        </Button>
        <Button
          onClick={handleVerifySetup}
          disabled={loading || verificationCode.length !== 6}
          style={{
            backgroundColor: verificationCode.length === 6 ? '#10b981' : '#94a3b8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem'
          }}
        >
          {loading ? 'מאמת...' : 'אמת והפעל'}
        </Button>
      </ModalFooter>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="lg"
    >
      {activeTab === 'list' && renderMethodsList()}
      {activeTab === 'add-authenticator' && renderAuthenticatorSetup()}
      {activeTab === 'add-email' && renderEmailSetup()}
    </Modal>
  );
}