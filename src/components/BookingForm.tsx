import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle, Shield, AlertTriangle, CreditCard, Percent } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useSecureForm } from '@/hooks/useSecureForm';
import { formatPhoneNumber, type BookingFormData } from '@/lib/validation';

const services = [
  { id: 'lavagem-simples', name: 'Lavagem Simples', price: 25, duration: '30 min' },
  { id: 'lavagem-completa', name: 'Lavagem Completa', price: 45, duration: '60 min' },
  { id: 'enceramento', name: 'Enceramento Premium', price: 80, duration: '90 min' },
  { id: 'detalhamento', name: 'Detalhamento Completo', price: 150, duration: '180 min' },
];

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];

const BookingForm = () => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    serviceId: '',
    appointmentDate: '',
    appointmentTime: '',
    paymentOption: '100', // 50 ou 100 (percentage)
    notes: ''
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedData, setConfirmedData] = useState<any>(null);

  const {
    errors,
    isSubmitting,
    isRateLimited,
    retryAfter,
    hasErrors,
    validateField,
    submitForm,
    getFieldError
  } = useSecureForm({
    onSuccess: (validatedData) => {
      const selectedService = services.find(s => s.id === validatedData.serviceId);
      const paymentAmount = selectedService ? 
        (validatedData.paymentOption === '50' ? selectedService.price * 0.5 : selectedService.price) : 0;

      setConfirmedData({
        ...validatedData,
        customerName: user?.name,
        customerEmail: user?.email,
        customerPhone: user?.phone,
        paymentAmount
      });
      setShowConfirmation(true);
      
      toast({
        title: "Agendamento realizado!",
        description: "Seu agendamento foi confirmado. Realize o pagamento para garantir sua vaga.",
      });
    },
    onError: (error) => {
      console.error('Booking submission error:', error);
    }
  });

  const selectedService = services.find(s => s.id === formData.serviceId);
  const paymentAmount = selectedService && formData.paymentOption ? 
    (formData.paymentOption === '50' ? selectedService.price * 0.5 : selectedService.price) : 0;

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <section id="booking" className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Login Necessário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Para agendar nossos serviços, você precisa estar logado em sua conta.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => window.location.href = '/login'}>
                  Fazer Login
                </Button>
                <Button variant="hero" className="flex-1" onClick={() => window.location.href = '/register'}>
                  Criar Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      customerName: user?.name || '',
      customerEmail: user?.email || '',
      customerPhone: user?.phone || ''
    };
    
    await submitForm(submitData, async (validatedData: any) => {
      // TODO: Integrate with backend API
      console.log('Secure booking submission:', {
        ...validatedData,
        userId: user?.id,
        paymentAmount,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent.substring(0, 100),
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation for better UX
    if (value.trim()) {
      validateField(field, value);
    }
  };

  if (showConfirmation && confirmedData) {
    const confirmedService = services.find(s => s.id === confirmedData.serviceId);
    
    return (
      <section id="booking" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-gradient-primary rounded-full w-fit">
                  <CheckCircle className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Agendamento Confirmado!
                </CardTitle>
                <CardDescription>
                  Seu agendamento foi realizado com sucesso e validado por nosso sistema de segurança. Confira os detalhes abaixo:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Cliente:</span>
                    <span>{confirmedData.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Telefone:</span>
                    <span>{formatPhoneNumber(confirmedData.customerPhone)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Serviço:</span>
                    <span>{confirmedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Data:</span>
                    <span>{new Date(confirmedData.appointmentDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Horário:</span>
                    <span>{confirmedData.appointmentTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Opção de Pagamento:</span>
                    <span>{confirmedData.paymentOption}% do valor</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Valor a Pagar:</span>
                    <span className="text-lg font-bold text-primary">R$ {confirmedData.paymentAmount?.toFixed(2)}</span>
                  </div>
                </div>
                
                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Para confirmar seu agendamento, realize o pagamento via Pix no valor de R$ {confirmedData.paymentAmount?.toFixed(2)}:
                    </p>
                    <div className="bg-gradient-diamond rounded-lg p-6 text-primary-foreground">
                      <p className="font-medium mb-2">Chave Pix:</p>
                      <p className="text-sm break-all">diamante.lavajato@email.com</p>
                      <p className="text-xs mt-2 opacity-90">
                        Valor: R$ {confirmedData.paymentAmount?.toFixed(2)}
                      </p>
                      <p className="text-xs opacity-90">
                        Envie o comprovante via WhatsApp: (11) 99999-9999
                      </p>
                    </div>
                  </div>

                <Button 
                  variant="hero" 
                  className="w-full mt-6"
                  onClick={() => {
                    setShowConfirmation(false);
                    setConfirmedData(null);
                    setFormData({
                      serviceId: '',
                      appointmentDate: '',
                      appointmentTime: '',
                      paymentOption: '100',
                      notes: ''
                    });
                  }}
                >
                  Fazer Novo Agendamento
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 flex items-center gap-2 w-fit mx-auto">
            <Shield className="h-4 w-4" />
            Agendamento Online Seguro
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Agende seu{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              horário
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha o melhor horário para cuidar do seu veículo. 
            Processo rápido e seguro com validação em tempo real.
          </p>
          
          {isRateLimited && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg max-w-md mx-auto">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">
                  Muitas tentativas. Aguarde {retryAfter}s para tentar novamente.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Info Display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Seus Dados
                </CardTitle>
                <CardDescription>
                  Dados da conta logada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <span className="text-sm font-medium">Nome:</span>
                    <span className="text-sm">{user?.name}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <span className="text-sm font-medium">Telefone:</span>
                    <span className="text-sm">{user?.phone}</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Alguma observação especial sobre seu veículo?"
                    rows={3}
                    maxLength={500}
                    className={getFieldError('notes') ? 'border-destructive' : ''}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <div>
                      {getFieldError('notes') && (
                        <p className="text-sm text-destructive">{getFieldError('notes')}</p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formData.notes.length}/500 caracteres
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service & Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Serviço e Horário
                </CardTitle>
                <CardDescription>
                  Escolha o serviço e o melhor horário para você
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="serviceId">Serviço Desejado *</Label>
                  <Select value={formData.serviceId} onValueChange={(value) => handleInputChange('serviceId', value)} required>
                    <SelectTrigger className={getFieldError('serviceId') ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{service.name}</span>
                            <span className="ml-4 text-primary font-medium">R$ {service.price},00</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getFieldError('serviceId') && (
                    <p className="text-sm text-destructive mt-1">{getFieldError('serviceId')}</p>
                  )}
                  {selectedService && (
                    <div className="mt-2 p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Duração: {selectedService.duration}
                        </span>
                        <span className="font-medium text-primary">
                          R$ {selectedService.price},00
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Option */}
                {selectedService && (
                  <div>
                    <Label className="flex items-center gap-2 mb-3">
                      <CreditCard className="h-4 w-4" />
                      Opção de Pagamento *
                    </Label>
                    <RadioGroup
                      value={formData.paymentOption}
                      onValueChange={(value) => handleInputChange('paymentOption', value)}
                      className="grid grid-cols-1 gap-3"
                    >
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-secondary/30 transition-colors">
                        <RadioGroupItem value="50" id="payment-50" />
                        <Label htmlFor="payment-50" className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">50% Antecipado</span>
                              <p className="text-sm text-muted-foreground">Pague metade agora e metade no local</p>
                            </div>
                            <span className="font-bold text-primary">R$ {(selectedService.price * 0.5).toFixed(2)}</span>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-secondary/30 transition-colors">
                        <RadioGroupItem value="100" id="payment-100" />
                        <Label htmlFor="payment-100" className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">100% Antecipado</span>
                              <p className="text-sm text-muted-foreground">Pagamento completo (Garantia total da vaga)</p>
                            </div>
                            <span className="font-bold text-primary">R$ {selectedService.price.toFixed(2)}</span>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                    {paymentAmount > 0 && (
                      <div className="mt-3 p-3 bg-primary/10 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Valor a pagar via Pix:</span>
                          <span className="text-lg font-bold text-primary">R$ {paymentAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <Label htmlFor="appointmentDate">Data *</Label>
                  <Input
                    id="appointmentDate"
                    required
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    max={(() => {
                      const maxDate = new Date();
                      maxDate.setMonth(maxDate.getMonth() + 6);
                      return maxDate.toISOString().split('T')[0];
                    })()}
                    className={getFieldError('appointmentDate') ? 'border-destructive' : ''}
                  />
                  {getFieldError('appointmentDate') && (
                    <p className="text-sm text-destructive mt-1">{getFieldError('appointmentDate')}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="appointmentTime">Horário *</Label>
                  <Select value={formData.appointmentTime} onValueChange={(value) => handleInputChange('appointmentTime', value)} required>
                    <SelectTrigger className={getFieldError('appointmentTime') ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getFieldError('appointmentTime') && (
                    <p className="text-sm text-destructive mt-1">{getFieldError('appointmentTime')}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  variant="hero" 
                  className="w-full mt-6" 
                  disabled={isSubmitting || isRateLimited || hasErrors || !formData.serviceId}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                      Validando dados...
                    </>
                  ) : isRateLimited ? (
                    <>
                      <AlertTriangle className="h-4 w-4" />
                      Aguarde {retryAfter}s
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      Confirmar Agendamento Seguro
                    </>
                  )}
                </Button>
                
                {hasErrors && (
                  <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Por favor, corrija os erros acima antes de continuar.</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;