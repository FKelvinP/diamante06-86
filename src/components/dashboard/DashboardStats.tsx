import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Clock,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StatsData {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  totalCustomers: number;
  totalRevenue: number;
  todayAppointments: number;
}

const DashboardStats = () => {
  const [stats, setStats] = useState<StatsData>({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    todayAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Total de agendamentos
      const { count: totalAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true });

      // Agendamentos pendentes
      const { count: pendingAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Agendamentos confirmados
      const { count: confirmedAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'confirmed');

      // Total de clientes
      const { count: totalCustomers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer');

      // Agendamentos de hoje
      const today = new Date().toISOString().split('T')[0];
      const { count: todayAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('appointment_date', today);

      // Receita total (soma dos pagamentos confirmados)
      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('payment_status', 'paid');

      const totalRevenue = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

      setStats({
        totalAppointments: totalAppointments || 0,
        pendingAppointments: pendingAppointments || 0,
        confirmedAppointments: confirmedAppointments || 0,
        totalCustomers: totalCustomers || 0,
        totalRevenue,
        todayAppointments: todayAppointments || 0,
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estatísticas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total de Agendamentos",
      value: stats.totalAppointments,
      icon: Calendar,
      description: "Todos os agendamentos",
      trend: "+12% este mês",
      color: "text-primary"
    },
    {
      title: "Agendamentos Hoje",
      value: stats.todayAppointments,
      icon: Clock,
      description: "Agendamentos para hoje",
      trend: "3 confirmados",
      color: "text-accent"
    },
    {
      title: "Total de Clientes",
      value: stats.totalCustomers,
      icon: Users,
      description: "Clientes cadastrados",
      trend: "+8% este mês",
      color: "text-diamond"
    },
    {
      title: "Receita Total",
      value: `R$ ${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: "Receita confirmada",
      trend: "+15% este mês",
      color: "text-green-600"
    },
    {
      title: "Pendentes",
      value: stats.pendingAppointments,
      icon: AlertTriangle,
      description: "Aguardando confirmação",
      trend: "Requer atenção",
      color: "text-orange-600"
    },
    {
      title: "Confirmados",
      value: stats.confirmedAppointments,
      icon: CheckCircle,
      description: "Agendamentos confirmados",
      trend: "Em andamento",
      color: "text-green-600"
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-4 w-4 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
                <div className="flex items-center mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {card.trend}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span>Novo agendamento confirmado</span>
                <Badge variant="secondary" className="ml-auto">2min</Badge>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <span>Cliente cadastrado</span>
                <Badge variant="secondary" className="ml-auto">15min</Badge>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                <span>Pagamento pendente</span>
                <Badge variant="secondary" className="ml-auto">1h</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Próximos Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span>Lavagem Completa</span>
                <div className="text-right">
                  <div>14:00</div>
                  <Badge variant="outline" className="text-xs">Hoje</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Enceramento</span>
                <div className="text-right">
                  <div>15:30</div>
                  <Badge variant="outline" className="text-xs">Hoje</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Detalhamento</span>
                <div className="text-right">
                  <div>09:00</div>
                  <Badge variant="outline" className="text-xs">Amanhã</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardStats;