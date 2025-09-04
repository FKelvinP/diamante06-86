import { z } from 'zod';

// Security validation schemas
export const BookingFormSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços')
    .transform(val => val.trim()),
  
  customerPhone: z
    .string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(15, 'Telefone deve ter no máximo 15 dígitos')
    .regex(/^[\d\s\(\)\-\+]+$/, 'Telefone deve conter apenas números e símbolos válidos')
    .transform(val => val.replace(/\D/g, '')), // Remove non-digits
  
  customerEmail: z
    .string()
    .email('Email deve ter um formato válido')
    .max(255, 'Email deve ter no máximo 255 caracteres')
    .toLowerCase()
    .transform(val => val.trim()),
  
  serviceId: z
    .string()
    .min(1, 'Selecione um serviço')
    .refine(val => ['lavagem-simples', 'lavagem-completa', 'enceramento', 'detalhamento'].includes(val), 
      'Serviço inválido'),
  
  paymentOption: z
    .string()
    .refine(val => ['50', '100'].includes(val), 'Opção de pagamento inválida'),
  
  appointmentDate: z
    .string()
    .min(1, 'Selecione uma data')
    .refine(val => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, 'Data deve ser hoje ou no futuro')
    .refine(val => {
      const date = new Date(val);
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 6); // Max 6 months ahead
      return date <= maxDate;
    }, 'Data deve ser no máximo 6 meses no futuro'),
  
  appointmentTime: z
    .string()
    .min(1, 'Selecione um horário')
    .refine(val => {
      const validTimes = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30'
      ];
      return validTimes.includes(val);
    }, 'Horário inválido'),
  
  notes: z
    .string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .optional()
    .transform(val => val ? sanitizeInput(val) : val)
});

// Input sanitization function
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframes
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/[<>'"]/g, '') // Remove potentially dangerous characters
    .trim();
};

// Rate limiting utility
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) { // 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const key = identifier;
    const current = this.attempts.get(key);

    if (!current || now > current.resetTime) {
      // First attempt or window expired
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return { allowed: true };
    }

    if (current.count >= this.maxAttempts) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((current.resetTime - now) / 1000);
      return { allowed: false, retryAfter };
    }

    // Increment count
    current.count++;
    return { allowed: true };
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const bookingRateLimiter = new RateLimiter(3, 10 * 60 * 1000); // 3 attempts per 10 minutes

// Security utilities
export const generateClientId = (): string => {
  // Generate a simple client identifier for rate limiting
  return `client_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
};

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

export type BookingFormData = z.infer<typeof BookingFormSchema>;