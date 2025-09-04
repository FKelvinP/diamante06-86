import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  Filter,
  Download,
  CreditCard,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface FinancialData {
  service_id: string;
  service_name: string;
  total_revenue: number;
  completed_appointments: number;
  average_ticket: number;
}

interface MonthlyData {
  month: string;
  revenue: number;
  appointments: number;
}

interface PaymentData {
  payment_method: string;
  total_amount: number;
  count: number;
}

const FinancialManagement = () => {
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [paymentData, setPaymentData] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{from: Date; to: Date}>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [averageTicket, setAverageTicket] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchFinancialData();
    fetchMonthlyData();
    fetchPaymentData();
  }, [selectedService, dateRange]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('appointments')
        .select(`
          service_id,
          total_amount,
          status,
          appointment_date,
          services!service_id (
            name
          )
        `)
        .eq('status', 'completed')
        .gte('appointment_date', format(dateRange.from, 'yyyy-MM-dd'))
        .lte('appointment_date', format(dateRange.to, 'yyyy-MM-dd'));

      if (selectedService !== 'all') {
        query = query.eq('service_id', selectedService);
      }

      const { data: appointments, error } = await query;

      if (error) throw error;

      // Process data by service
      const serviceMap = new Map();
      let totalRev = 0;
      let totalAppts = 0;

      appointments?.forEach((appointment) => {
        const serviceId = appointment.service_id;
        const serviceName = appointment.services?.name || 'Serviço Desconhecido';
        const amount = appointment.total_amount;

        totalRev += amount;
        totalAppts++;

        if (!serviceMap.has(serviceId)) {
          serviceMap.set(serviceId, {
            service_id: serviceId,
            service_name: serviceName,
            total_revenue: 0,
            completed_appointments: 0
          });
        }

        const serviceData = serviceMap.get(serviceId);
        serviceData.total_revenue += amount;
        serviceData.completed_appointments++;
      });

      // Calculate average ticket for each service
      const processedData = Array.from(serviceMap.values()).map(service => ({
        ...service,
        average_ticket: service.completed_appointments > 0 
          ? service.total_revenue / service.completed_appointments 
          : 0
      }));

      // Sort by revenue
      processedData.sort((a, b) => b.total_revenue - a.total_revenue);

      setFinancialData(processedData);
      setTotalRevenue(totalRev);
      setTotalAppointments(totalAppts);
      setAverageTicket(totalAppts > 0 ? totalRev / totalAppts : 0);

    } catch (error) {
      console.error('Erro ao buscar dados financeiros:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados financeiros",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyData = async () => {
    try {
      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const start = startOfMonth(date);
        const end = endOfMonth(date);

        const { data, error } = await supabase
          .from('appointments')
          .select('total_amount')
          .eq('status', 'completed')
          .gte('appointment_date', format(start, 'yyyy-MM-dd'))
          .lte('appointment_date', format(end, 'yyyy-MM-dd'));

        if (error) throw error;

        const revenue = data?.reduce((sum, apt) => sum + apt.total_amount, 0) || 0;
        const appointments = data?.length || 0;

        last6Months.push({
          month: format(date, 'MMM/yy', { locale: ptBR }),
          revenue,
          appointments
        });
      }

      setMonthlyData(last6Months);
    } catch (error) {
      console.error('Erro ao buscar dados mensais:', error);
    }
  };

  const fetchPaymentData = async () => {
    try {
      let query = supabase
        .from('payments')
        .select(`
          payment_method,
          amount,
          payment_status,
          appointments!appointment_id (
            appointment_date
          )
        `)
        .eq('payment_status', 'paid');

      const { data: payments, error } = await query;

      if (error) throw error;

      // Filter by date range
      const filteredPayments = payments?.filter(payment => {
        if (!payment.appointments?.appointment_date) return false;
        const appointmentDate = new Date(payment.appointments.appointment_date);
        return appointmentDate >= dateRange.from && appointmentDate <= dateRange.to;
      });

      // Process payment methods
      const methodMap = new Map();

      filteredPayments?.forEach((payment) => {
        const method = payment.payment_method;
        
        if (!methodMap.has(method)) {
          methodMap.set(method, {
            payment_method: method,
            total_amount: 0,
            count: 0
          });
        }

        const methodData = methodMap.get(method);
        methodData.total_amount += payment.amount;
        methodData.count++;
      });

      const processedPaymentData = Array.from(methodMap.values())
        .sort((a, b) => b.total_amount - a.total_amount);

      setPaymentData(processedPaymentData);
    } catch (error) {
      console.error('Erro ao buscar dados de pagamento:', error);
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: { [key: string]: string } = {
      'cash': 'Dinheiro',
      'credit_card': 'Cartão de Crédito',
      'debit_card': 'Cartão de Débito',
      'pix': 'PIX',
      'bank_transfer': 'Transferência'
    };
    return labels[method] || method;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando dados financeiros...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Controle Financeiro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-2">
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Serviços</SelectItem>
                  {financialData.map((service) => (
                    <SelectItem key={service.service_id} value={service.service_id}>
                      {service.service_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} - {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-4 space-y-4">
                    <div>
                      <Label>Data Inicial</Label>
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => date && setDateRange(prev => ({ ...prev, from: date }))}
                        initialFocus
                      />
                    </div>
                    <div>
                      <Label>Data Final</Label>
                      <Calendar
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => date && setDateRange(prev => ({ ...prev, to: date }))}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalRevenue.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600 ml-auto" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Agendamentos Concluídos</p>
                <p className="text-2xl font-bold">
                  {totalAppointments}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary ml-auto" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
                <p className="text-2xl font-bold">
                  R$ {averageTicket.toFixed(2)}
                </p>
              </div>
              <PieChart className="h-8 w-8 text-blue-600 ml-auto" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Revenue Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Receita por Serviço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financialData.map((service, index) => (
              <div key={service.service_id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-semibold">{service.service_name}</h3>
                    <Badge variant={index === 0 ? "default" : "secondary"}>
                      {index === 0 ? "Maior Receita" : `${index + 1}º Lugar`}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">
                      R$ {service.total_revenue.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {service.completed_appointments} agendamentos
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Ticket Médio:</span>
                  <span className="font-semibold">R$ {service.average_ticket.toFixed(2)}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${totalRevenue > 0 ? (service.total_revenue / totalRevenue) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tendência Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((month) => (
                <div key={month.month} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <div className="font-semibold">{month.month}</div>
                    <div className="text-sm text-muted-foreground">
                      {month.appointments} agendamentos
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      R$ {month.revenue.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Métodos de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentData.map((payment) => (
                <div key={payment.payment_method} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <div className="font-semibold">
                      {getPaymentMethodLabel(payment.payment_method)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {payment.count} transações
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      R$ {payment.total_amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialManagement;