// Security utilities for the Shift Manager application
import CryptoJS from 'crypto-js';

// Password strength validation
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  score: number;
}

export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];
  let score = 0;

  // Minimum length
  if (password.length < 8) {
    errors.push('הסיסמה חייבת להכיל לפחות 8 תווים');
  } else if (password.length >= 12) {
    score += 2;
  } else if (password.length >= 10) {
    score += 1;
  }

  // Contains lowercase
  if (!/[a-z]/.test(password)) {
    errors.push('הסיסמה חייבת להכיל לפחות אות קטנה אחת');
  } else {
    score += 1;
  }

  // Contains uppercase
  if (!/[A-Z]/.test(password)) {
    errors.push('הסיסמה חייבת להכיל לפחות אות גדולה אחת');
  } else {
    score += 1;
  }

  // Contains numbers
  if (!/\d/.test(password)) {
    errors.push('הסיסמה חייבת להכיל לפחות ספרה אחת');
  } else {
    score += 1;
  }

  // Contains special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('הסיסמה חייבת להכיל לפחות תו מיוחד אחד (!@#$%^&*)');
  } else {
    score += 1;
  }

  // No common patterns
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /abcdef/,
    /111111/,
    /000000/
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push('הסיסמה מכילה דפוס נפוץ - אנא בחר סיסמה יותר מורכבת');
      score -= 1;
      break;
    }
  }

  // No repeated characters
  if (/(.)\1{2,}/.test(password)) {
    errors.push('הסיסמה מכילה יותר מדי תווים חוזרים');
    score -= 1;
  }

  // Additional complexity bonus
  if (password.length >= 14 && /[!@#$%^&*]/.test(password) && /\d.*\d/.test(password)) {
    score += 1;
  }

  const isValid = errors.length === 0;
  let strength: 'weak' | 'medium' | 'strong' | 'very-strong';

  if (score >= 6) {
    strength = 'very-strong';
  } else if (score >= 4) {
    strength = 'strong';
  } else if (score >= 2) {
    strength = 'medium';
  } else {
    strength = 'weak';
  }

  return {
    isValid,
    errors,
    strength,
    score: Math.max(0, Math.min(score, 6))
  };
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// XSS Protection
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Session management
export interface SessionInfo {
  token: string;
  expiry: number;
  refreshToken: string;
}

export const generateSessionToken = (): string => {
  return CryptoJS.lib.WordArray.random(32).toString();
};

export const isSessionExpired = (expiry: number): boolean => {
  return Date.now() > expiry;
};

// Rate limiting simulation
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];

    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);

    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);
    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }

  getTimeUntilReset(identifier: string): number {
    const attempts = this.attempts.get(identifier) || [];
    if (attempts.length === 0) return 0;

    const oldestAttempt = Math.min(...attempts);
    const resetTime = oldestAttempt + this.windowMs;
    return Math.max(0, resetTime - Date.now());
  }
}

// Create global rate limiter instance
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

// Audit logging
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: number;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  details?: any;
}

export class AuditLogger {
  private logs: AuditLog[] = [];
  private readonly maxLogs = 1000;

  log(entry: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const auditEntry: AuditLog = {
      ...entry,
      id: CryptoJS.lib.WordArray.random(16).toString(),
      timestamp: Date.now()
    };

    this.logs.unshift(auditEntry);

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // In production, this would send to a secure logging service
    console.log('🔒 Security Audit:', auditEntry);
  }

  getLogs(userId?: string, action?: string): AuditLog[] {
    return this.logs.filter(log => {
      if (userId && log.userId !== userId) return false;
      if (action && log.action !== action) return false;
      return true;
    });
  }

  getRecentFailedLogins(timeWindowMs: number = 24 * 60 * 60 * 1000): AuditLog[] {
    const cutoff = Date.now() - timeWindowMs;
    return this.logs.filter(log =>
      log.action === 'LOGIN' &&
      !log.success &&
      log.timestamp > cutoff
    );
  }
}

// Create global audit logger
export const auditLogger = new AuditLogger();

// Data encryption utilities
export const encrypt = (data: string, key: string): string => {
  return CryptoJS.AES.encrypt(data, key).toString();
};

export const decrypt = (encryptedData: string, key: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Generate secure random passwords
export const generateSecurePassword = (length: number = 16): string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';

  // Ensure at least one character from each required type
  const required = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    'abcdefghijklmnopqrstuvwxyz',
    '0123456789',
    '!@#$%^&*'
  ];

  // Add one character from each required set
  for (const set of required) {
    const randomIndex = Math.floor(Math.random() * set.length);
    password += set[randomIndex];
  }

  // Fill the rest with random characters
  for (let i = password.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Content Security Policy helpers
export const getCSPHeader = (): string => {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
};

// Security headers
export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': getCSPHeader()
};

// Validate user permissions
export const hasPermission = (userRole: string, requiredRole: string): boolean => {
  const roleHierarchy = {
    'EMPLOYEE': 1,
    'MANAGER': 2,
    'ADMIN': 3,
    'SUPER_ADMIN': 4
  };

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

  return userLevel >= requiredLevel;
};

// Secure random number generation
export const secureRandom = (min: number, max: number): number => {
  const range = max - min + 1;
  const randomBytes = new Uint32Array(1);
  crypto.getRandomValues(randomBytes);
  return min + (randomBytes[0] % range);
};