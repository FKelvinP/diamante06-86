import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  CalendarIcon, 
  Clock, 
  Plus,
  User,
  Settings
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
}

interface Customer {
  id: string;
  full_name: string;
  phone: string | null;
  user_id: string;
}

interface CreateAppointmentProps {
  onAppointmentCreated?: () => void;
}

const CreateAppointment = ({ onAppointmentCreated }: CreateAppointmentProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customer_id: '',
    service_id: '',
    appointment_time: '',
    notes: ''
  });

  useEffect(() => {
    fetchServices();
    fetchCustomers();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, price, duration_minutes')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone, user_id')
        .eq('role', 'customer')
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      toast({
        title: "Erro",
        description: "Selecione uma data para o agendamento",
        variant: "destructive",
      });
      return;
    }

    const selectedService = services.find(s => s.id === formData.service_id);
    if (!selectedService) {
      toast({
        title: "Erro",
        description: "Selecione um serviço",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('appointments')
        .insert([{
          customer_id: formData.customer_id,
          service_id: formData.service_id,
          appointment_date: format(selectedDate, 'yyyy-MM-dd'),
          appointment_time: formData.appointment_time,
          total_amount: selectedService.price,
          notes: formData.notes || null,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Agendamento criado com sucesso",
      });

      // Reset form
      setFormData({
        customer_id: '',
        service_id: '',
        appointment_time: '',
        notes: ''
      });
      setSelectedDate(undefined);

      // Notify parent to refresh appointments list
      if (onAppointmentCreated) {
        onAppointmentCreated();
      }

    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o agendamento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(s => s.id === formData.service_id);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Criar Novo Agendamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cliente */}
          <div>
            <Label htmlFor="customer">Cliente</Label>
            <Select 
              value={formData.customer_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, customer_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{customer.full_name}</span>
                      {customer.phone && (
                        <span className="text-sm text-muted-foreground">
                          - {customer.phone}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Serviço */}
          <div>
            <Label htmlFor="service">Serviço</Label>
            <Select 
              value={formData.service_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, service_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>{service.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{service.duration_minutes}min</span>
                        <span>R$ {service.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedService && (
              <div className="mt-2 p-3 bg-muted rounded-md">
                <div className="flex justify-between items-center text-sm">
                  <span>Duração: {selectedService.duration_minutes} minutos</span>
                  <span className="font-medium">Valor: R$ {selectedService.price.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Data */}
          <div>
            <Label>Data do Agendamento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Horário */}
          <div>
            <Label htmlFor="time">Horário</Label>
            <Input
              id="time"
              type="time"
              value={formData.appointment_time}
              onChange={(e) => setFormData(prev => ({ ...prev, appointment_time: e.target.value }))}
              required
            />
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Adicione observações sobre o agendamento..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                // Reset form
                setFormData({
                  customer_id: '',
                  service_id: '',
                  appointment_time: '',
                  notes: ''
                });
                setSelectedDate(undefined);
                if (onAppointmentCreated) {
                  onAppointmentCreated();
                }
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Criando..." : "Criar Agendamento"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateAppointment;