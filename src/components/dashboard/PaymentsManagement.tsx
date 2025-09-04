import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  DollarSign, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  CreditCard,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface Payment {
  id: string;
  amount: number;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  pix_code: string | null;
  transaction_id: string | null;
  paid_at: string | null;
  created_at: string;
  appointment_id: string;
  appointments: {
    appointment_date: string;
    appointment_time: string;
    profiles: {
      full_name: string;
      phone: string | null;
    };
    services: {
      name: string;
    };
  };
}

const PaymentsManagement = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          appointments!appointment_id (
            appointment_date,
            appointment_time,
            profiles!customer_id (
              full_name,
              phone
            ),
            services!service_id (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pagamentos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentId: string, newStatus: string) => {
    try {
      const updateData: any = { payment_status: newStatus };
      
      // Se marcar como pago, adicionar a data
      if (newStatus === 'paid') {
        updateData.paid_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', paymentId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Status do pagamento atualizado com sucesso",
      });

      fetchPayments();
    } catch (error) {
      console.error('Erro ao atualizar status do pagamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do pagamento",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', variant: 'secondary' as const, icon: Clock },
      paid: { label: 'Pago', variant: 'default' as const, icon: CheckCircle },
      failed: { label: 'Falhou', variant: 'destructive' as const, icon: XCircle },
      refunded: { label: 'Estornado', variant: 'secondary' as const, icon: AlertTriangle },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method: string) => {
    const methodConfig = {
      pix: { label: 'PIX', color: 'bg-green-100 text-green-800' },
      card: { label: 'Cartão', color: 'bg-blue-100 text-blue-800' },
      cash: { label: 'Dinheiro', color: 'bg-gray-100 text-gray-800' },
    };

    const config = methodConfig[method as keyof typeof methodConfig] || 
                   { label: method, color: 'bg-gray-100 text-gray-800' };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.appointments?.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.appointments?.services?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.payment_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calcular estatísticas
  const totalRevenue = payments
    .filter(p => p.payment_status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.payment_status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPayments = payments.length;
  const paidPayments = payments.filter(p => p.payment_status === 'paid').length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando pagamentos...</CardTitle>
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
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pendente</p>
                <p className="text-2xl font-bold">R$ {pendingAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Pagamentos</p>
                <p className="text-2xl font-bold">{totalPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                <p className="text-2xl font-bold">
                  {totalPayments > 0 ? Math.round((paidPayments / totalPayments) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Gerenciar Pagamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, serviço ou ID da transação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="failed">Falhou</SelectItem>
                <SelectItem value="refunded">Estornado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {payment.appointments?.profiles?.full_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {payment.appointments?.profiles?.phone || 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {payment.appointments?.services?.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(payment.appointments?.appointment_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    R$ {payment.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {getPaymentMethodBadge(payment.payment_method)}
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.payment_status)}</TableCell>
                  <TableCell>
                    <div>
                      <div>{format(new Date(payment.created_at), 'dd/MM/yyyy', { locale: ptBR })}</div>
                      {payment.paid_at && (
                        <div className="text-sm text-muted-foreground">
                          Pago: {format(new Date(payment.paid_at), 'dd/MM HH:mm', { locale: ptBR })}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Pagamento</DialogTitle>
                          </DialogHeader>
                          {selectedPayment && (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold">Cliente</h4>
                                <p>{selectedPayment.appointments?.profiles?.full_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {selectedPayment.appointments?.profiles?.phone}
                                </p>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold">Agendamento</h4>
                                <p>{selectedPayment.appointments?.services?.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {format(new Date(selectedPayment.appointments?.appointment_date), 'dd/MM/yyyy', { locale: ptBR })} às {selectedPayment.appointments?.appointment_time}
                                </p>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold">Pagamento</h4>
                                <p>Valor: R$ {selectedPayment.amount.toFixed(2)}</p>
                                <p>Método: {selectedPayment.payment_method}</p>
                                <p>Status: {getStatusBadge(selectedPayment.payment_status)}</p>
                                {selectedPayment.transaction_id && (
                                  <p className="text-sm text-muted-foreground">
                                    ID: {selectedPayment.transaction_id}
                                  </p>
                                )}
                                {selectedPayment.pix_code && (
                                  <p className="text-sm text-muted-foreground">
                                    PIX: {selectedPayment.pix_code}
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex gap-2">
                                <Select 
                                  value={selectedPayment.payment_status}
                                  onValueChange={(value) => updatePaymentStatus(selectedPayment.id, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pendente</SelectItem>
                                    <SelectItem value="paid">Pago</SelectItem>
                                    <SelectItem value="failed">Falhou</SelectItem>
                                    <SelectItem value="refunded">Estornado</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
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

export default PaymentsManagement;