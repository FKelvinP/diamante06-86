import { useState, useCallback, useEffect } from 'react';
import { BookingFormSchema, bookingRateLimiter, generateClientId, type BookingFormData } from '@/lib/validation';
import { toast } from '@/hooks/use-toast';

interface ValidationErrors {
  [key: string]: string[];
}

interface UseSecureFormOptions {
  onSuccess?: (data: BookingFormData) => void;
  onError?: (error: string) => void;
}

export const useSecureForm = (options: UseSecureFormOptions = {}) => {
  const [clientId] = useState(() => generateClientId());
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [retryAfter, setRetryAfter] = useState<number>(0);

  // Clear rate limit when timer expires
  useEffect(() => {
    if (retryAfter > 0) {
      const timer = setTimeout(() => {
        setRetryAfter(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (isRateLimited && retryAfter === 0) {
      setIsRateLimited(false);
    }
  }, [retryAfter, isRateLimited]);

  const validateField = useCallback((field: string, value: any) => {
    try {
      const fieldSchema = BookingFormSchema.shape[field as keyof typeof BookingFormSchema.shape];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
        return true;
      }
    } catch (error: any) {
      const fieldErrors = error.errors?.map((e: any) => e.message) || [error.message];
      setErrors(prev => ({
        ...prev,
        [field]: fieldErrors
      }));
      return false;
    }
    return true;
  }, []);

  const validateForm = useCallback((data: any): { success: boolean; data?: BookingFormData; errors?: ValidationErrors } => {
    try {
      const validatedData = BookingFormSchema.parse(data);
      setErrors({});
      return { success: true, data: validatedData };
    } catch (error: any) {
      const formErrors: ValidationErrors = {};
      
      error.errors?.forEach((err: any) => {
        const field = err.path[0];
        if (!formErrors[field]) {
          formErrors[field] = [];
        }
        formErrors[field].push(err.message);
      });

      setErrors(formErrors);
      return { success: false, errors: formErrors };
    }
  }, []);

  const submitForm = useCallback(async (data: any, submitHandler: (validatedData: BookingFormData) => Promise<void>) => {
    // Check rate limiting
    const rateLimitResult = bookingRateLimiter.isAllowed(clientId);
    
    if (!rateLimitResult.allowed) {
      setIsRateLimited(true);
      setRetryAfter(rateLimitResult.retryAfter || 0);
      
      toast({
        title: "Muitas tentativas",
        description: `Aguarde ${rateLimitResult.retryAfter} segundos antes de tentar novamente.`,
        variant: "destructive"
      });
      
      options.onError?.("Rate limit exceeded");
      return false;
    }

    // Validate form data
    const validation = validateForm(data);
    
    if (!validation.success) {
      toast({
        title: "Dados inválidos",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive"
      });
      
      options.onError?.("Validation failed");
      return false;
    }

    setIsSubmitting(true);

    try {
      await submitHandler(validation.data!);
      
      // Reset rate limiter on successful submission
      bookingRateLimiter.reset(clientId);
      
      options.onSuccess?.(validation.data!);
      return true;
    } catch (error: any) {
      console.error('Form submission error:', error);
      
      toast({
        title: "Erro no envio",
        description: "Ocorreu um erro ao processar seu agendamento. Tente novamente.",
        variant: "destructive"
      });
      
      options.onError?.(error.message || "Submission failed");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [clientId, validateForm, options]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const hasErrors = Object.keys(errors).length > 0;
  const getFieldError = useCallback((field: string) => errors[field]?.[0], [errors]);

  return {
    errors,
    isSubmitting,
    isRateLimited,
    retryAfter,
    hasErrors,
    validateField,
    validateForm,
    submitForm,
    clearErrors,
    getFieldError
  };
};