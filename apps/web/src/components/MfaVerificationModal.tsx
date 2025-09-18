import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Modal, { ModalFooter } from './ui/modal';
import { useMfaStore, MfaSession } from '../stores/mfaStore';
import { useAuthStore } from '../stores/authStore';
import { Shield, Mail, Smartphone, RefreshCw, Clock } from 'lucide-react';

interface MfaVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: MfaSession | null;
}

export default function MfaVerificationModal({ isOpen, onClose, session }: MfaVerificationModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const { verifyMfaCode, sendEmailCode, pendingLogin } = useMfaStore();
  const { loginWithoutMfa } = useAuthStore();

  // Calculate time left until session expires
  useEffect(() => {
    if (!session) return;

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const expires = new Date(session.expiresAt).getTime();
      const remaining = Math.max(0, Math.floor((expires - now) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        onClose();
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [session, onClose]);

  const handleVerify = async () => {
    if (!session || !code.trim()) return;

    setLoading(true);

    try {
      const success = await verifyMfaCode(session.id, code.trim());

      if (success && pendingLogin) {
        // Complete the login process without MFA since it's already verified
        loginWithoutMfa(pendingLogin.user, pendingLogin.company);
        onClose();
        setCode('');
      }
    } catch (error) {
      console.error('MFA verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!session || session.method !== 'email') return;

    setLoading(true);
    try {
      await sendEmailCode(session.id);
      setCode('');
    } catch (error) {
      console.error('Resend email error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!session) return null;

  const isAuthenticator = session.method === 'authenticator';
  const isEmail = session.method === 'email';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="אימות דו-שלבי"
      size="md"
    >
      <div style={{ padding: '1rem', textAlign: 'center' }}>
        {/* Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
        }}>
          {isAuthenticator ? (
            <Smartphone style={{ width: '40px', height: '40px', color: 'white' }} />
          ) : (
            <Mail style={{ width: '40px', height: '40px', color: 'white' }} />
          )}
        </div>

        {/* Title and Description */}
        <h3 style={{
          margin: '0 0 0.5rem 0',
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#1e293b'
        }}>
          {isAuthenticator ? 'קוד מאפליקציית האימות' : 'קוד מהאימייל'}
        </h3>

        <p style={{
          color: '#64748b',
          marginBottom: '2rem',
          fontSize: '1rem',
          lineHeight: '1.5'
        }}>
          {isAuthenticator
            ? 'הכנס את הקוד בן 6 הספרות מאפליקציית האימות שלך'
            : 'הכנס את הקוד בן 6 הספרות שנשלח לאימייל שלך'
          }
        </p>

        {/* Timer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          padding: '0.75rem',
          backgroundColor: '#f1f5f9',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <Clock style={{ width: '18px', height: '18px', color: '#64748b' }} />
          <span style={{
            fontSize: '0.875rem',
            color: timeLeft < 60 ? '#ef4444' : '#64748b',
            fontWeight: '600'
          }}>
            זמן נותר: {formatTime(timeLeft)}
          </span>
        </div>

        {/* Code Input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="הכנס קוד 6 ספרות"
            maxLength={6}
            style={{
              fontSize: '1.5rem',
              textAlign: 'center',
              letterSpacing: '0.5rem',
              height: '56px',
              fontWeight: '600'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && code.length === 6) {
                handleVerify();
              }
            }}
          />
        </div>

        {/* Attempts remaining */}
        {session.attempts > 0 && (
          <div style={{
            marginBottom: '1rem',
            padding: '0.5rem',
            backgroundColor: '#fef3c7',
            borderRadius: '6px',
            fontSize: '0.875rem',
            color: '#92400e'
          }}>
            נותרו {session.maxAttempts - session.attempts} ניסיונות
          </div>
        )}

        {/* Resend Email Button */}
        {isEmail && (
          <div style={{ marginBottom: '1.5rem' }}>
            <Button
              onClick={handleResendEmail}
              disabled={loading}
              style={{
                backgroundColor: 'transparent',
                color: '#3b82f6',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '0 auto'
              }}
            >
              <RefreshCw style={{
                width: '16px',
                height: '16px',
                animation: loading ? 'spin 1s linear infinite' : 'none'
              }} />
              שלח קוד מחדש
            </Button>
          </div>
        )}

        <ModalFooter align="center">
          <Button
            onClick={onClose}
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#64748b',
              padding: '0.75rem 2rem'
            }}
          >
            ביטול
          </Button>
          <Button
            onClick={handleVerify}
            disabled={loading || code.length !== 6 || timeLeft === 0}
            style={{
              backgroundColor: code.length === 6 ? '#3b82f6' : '#94a3b8',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 2rem',
              cursor: code.length === 6 ? 'pointer' : 'not-allowed'
            }}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                מאמת...
              </div>
            ) : (
              <>
                <Shield style={{ width: '16px', height: '16px', marginLeft: '0.5rem' }} />
                אמת
              </>
            )}
          </Button>
        </ModalFooter>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Modal>
  );
}