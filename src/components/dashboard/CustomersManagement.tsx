import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Users, 
  Search, 
  Eye, 
  Phone, 
  Mail, 
  Calendar,
  User,
  Activity
} from 'lucide-react';

interface Customer {
  id: string;
  full_name: string;
  phone: string | null;
  user_id: string;
  is_active: boolean;
  created_at: string;
  role: string;
}

interface CustomerStats {
  totalAppointments: number;
  completedAppointments: number;
  totalSpent: number;
  lastAppointment: string | null;
}

const CustomersManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerStats, setCustomerStats] = useState<CustomerStats | null>(null);
  const [customerAppointments, setCustomerAppointments] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async (customerId: string) => {
    try {
      // Buscar estatísticas do cliente
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          *,
          services!service_id (
            name,
            price
          ),
          payments!appointment_id (
            amount,
            payment_status
          )
        `)
        .eq('customer_id', customerId);

      if (appointmentsError) throw appointmentsError;

      const totalAppointments = appointments?.length || 0;
      const completedAppointments = appointments?.filter(apt => apt.status === 'completed').length || 0;
      
      // Calcular total gasto com pagamentos confirmados
      const totalSpent = appointments?.reduce((sum, apt) => {
        const paidPayments = apt.payments?.filter((p: any) => p.payment_status === 'paid') || [];
        return sum + paidPayments.reduce((paySum: number, payment: any) => paySum + payment.amount, 0);
      }, 0) || 0;

      const lastAppointment = appointments && appointments.length > 0 
        ? appointments.sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())[0].appointment_date
        : null;

      setCustomerStats({
        totalAppointments,
        completedAppointments,
        totalSpent,
        lastAppointment
      });

      setCustomerAppointments(appointments || []);
    } catch (error) {
      console.error('Erro ao buscar detalhes do cliente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes do cliente",
        variant: "destructive",
      });
    }
  };

  const openCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    fetchCustomerDetails(customer.id);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando clientes...</CardTitle>
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
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gerenciar Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Clientes</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Clientes Ativos</p>
                <p className="text-2xl font-bold">
                  {customers.filter(c => c.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Cadastros este Mês</p>
                <p className="text-2xl font-bold">
                  {customers.filter(c => {
                    const created = new Date(c.created_at);
                    const now = new Date();
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{customer.full_name}</div>
                        <div className="text-sm text-muted-foreground">ID: {customer.id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {customer.phone || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.is_active ? 'default' : 'secondary'}>
                      {customer.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(customer.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openCustomerDetails(customer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detalhes do Cliente</DialogTitle>
                        </DialogHeader>
                        {selectedCustomer && (
                          <div className="space-y-6">
                            {/* Customer Info */}
                            <div className="grid gap-4 md:grid-cols-2">
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base">Informações Pessoais</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  <div>
                                    <span className="text-sm font-medium">Nome:</span>
                                    <p>{selectedCustomer.full_name}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">Telefone:</span>
                                    <p>{selectedCustomer.phone || 'Não informado'}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">Status:</span>
                                    <Badge className="ml-2" variant={selectedCustomer.is_active ? 'default' : 'secondary'}>
                                      {selectedCustomer.is_active ? 'Ativo' : 'Inativo'}
                                    </Badge>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">Cadastro:</span>
                                    <p>{format(new Date(selectedCustomer.created_at), 'dd/MM/yyyy', { locale: ptBR })}</p>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base">Estatísticas</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  {customerStats && (
                                    <>
                                      <div>
                                        <span className="text-sm font-medium">Total de Agendamentos:</span>
                                        <p>{customerStats.totalAppointments}</p>
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium">Concluídos:</span>
                                        <p>{customerStats.completedAppointments}</p>
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium">Total Gasto:</span>
                                        <p>R$ {customerStats.totalSpent.toFixed(2)}</p>
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium">Último Agendamento:</span>
                                        <p>
                                          {customerStats.lastAppointment 
                                            ? format(new Date(customerStats.lastAppointment), 'dd/MM/yyyy', { locale: ptBR })
                                            : 'Nenhum agendamento'
                                          }
                                        </p>
                                      </div>
                                    </>
                                  )}
                                </CardContent>
                              </Card>
                            </div>

                            {/* Customer Appointments */}
                            <div>
                              <h4 className="font-semibold mb-3">Histórico de Agendamentos</h4>
                              <div className="max-h-60 overflow-y-auto border rounded-lg">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Serviço</TableHead>
                                      <TableHead>Data</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead>Valor</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {customerAppointments.map((appointment) => (
                                      <TableRow key={appointment.id}>
                                        <TableCell>{appointment.services?.name}</TableCell>
                                        <TableCell>
                                          {format(new Date(appointment.appointment_date), 'dd/MM/yyyy', { locale: ptBR })}
                                        </TableCell>
                                        <TableCell>
                                          <Badge variant="secondary">
                                            {appointment.status === 'pending' && 'Pendente'}
                                            {appointment.status === 'confirmed' && 'Confirmado'}
                                            {appointment.status === 'completed' && 'Concluído'}
                                            {appointment.status === 'cancelled' && 'Cancelado'}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>R$ {appointment.total_amount.toFixed(2)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersManagement;