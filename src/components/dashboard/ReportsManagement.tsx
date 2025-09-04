import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  Calendar, 
  Settings, 
  TrendingUp, 
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ServiceStats {
  service_id: string;
  service_name: string;
  total_appointments: number;
  completed_appointments: number;
  cancelled_appointments: number;
  pending_appointments: number;
  completion_rate: number;
  total_revenue: number;
}

interface AppointmentStats {
  status: string;
  count: number;
  percentage: number;
}

const ReportsManagement = () => {
  const [reportType, setReportType] = useState<'services' | 'appointments' | 'general'>('services');
  const [serviceStats, setServiceStats] = useState<ServiceStats[]>([]);
  const [appointmentStats, setAppointmentStats] = useState<AppointmentStats[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (reportType === 'services') {
      fetchServiceStats();
    } else if (reportType === 'appointments') {
      fetchAppointmentStats();
    }
  }, [reportType]);

  const fetchServiceStats = async () => {
    try {
      setLoading(true);
      
      // Fetch service statistics
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
          service_id,
          status,
          total_amount,
          services!service_id (
            name
          )
        `);

      if (error) throw error;

      // Process data to calculate statistics
      const statsMap = new Map();
      
      appointments?.forEach((appointment) => {
        const serviceId = appointment.service_id;
        const serviceName = appointment.services?.name || 'Serviço Desconhecido';
        
        if (!statsMap.has(serviceId)) {
          statsMap.set(serviceId, {
            service_id: serviceId,
            service_name: serviceName,
            total_appointments: 0,
            completed_appointments: 0,
            cancelled_appointments: 0,
            pending_appointments: 0,
            total_revenue: 0
          });
        }
        
        const stats = statsMap.get(serviceId);
        stats.total_appointments++;
        
        if (appointment.status === 'completed') {
          stats.completed_appointments++;
          stats.total_revenue += appointment.total_amount;
        } else if (appointment.status === 'cancelled') {
          stats.cancelled_appointments++;
        } else if (appointment.status === 'pending') {
          stats.pending_appointments++;
        }
      });
      
      // Calculate completion rates and convert to array
      const statsArray = Array.from(statsMap.values()).map(stats => ({
        ...stats,
        completion_rate: stats.total_appointments > 0 
          ? (stats.completed_appointments / stats.total_appointments) * 100 
          : 0
      }));
      
      // Sort by total appointments descending
      statsArray.sort((a, b) => b.total_appointments - a.total_appointments);
      
      setServiceStats(statsArray);
    } catch (error) {
      console.error('Erro ao buscar estatísticas de serviços:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estatísticas de serviços",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointmentStats = async () => {
    try {
      setLoading(true);
      
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('status');

      if (error) throw error;

      // Count appointments by status
      const statusCount = {
        pending: 0,
        confirmed: 0,
        in_progress: 0,
        completed: 0,
        cancelled: 0
      };

      appointments?.forEach((appointment) => {
        if (statusCount.hasOwnProperty(appointment.status)) {
          statusCount[appointment.status as keyof typeof statusCount]++;
        }
      });

      const total = appointments?.length || 0;
      
      const statsArray = Object.entries(statusCount).map(([status, count]) => ({
        status,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      }));

      setAppointmentStats(statsArray);
    } catch (error) {
      console.error('Erro ao buscar estatísticas de agendamentos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estatísticas de agendamentos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertTriangle className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      in_progress: 'Em Andamento',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando relatórios...</CardTitle>
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
            <BarChart3 className="h-5 w-5" />
            Relatórios e Estatísticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={reportType} onValueChange={(value: 'services' | 'appointments' | 'general') => setReportType(value)}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tipo de relatório" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="services">Relatório de Serviços</SelectItem>
                <SelectItem value="appointments">Relatório de Agendamentos</SelectItem>
                <SelectItem value="general">Relatório Geral</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Services Report */}
      {reportType === 'services' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Estatísticas por Serviço
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceStats.map((stats, index) => (
                <div key={stats.service_id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{stats.service_name}</h3>
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        {index === 0 ? "Mais Popular" : `${index + 1}º Lugar`}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {stats.total_appointments}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        agendamentos
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {stats.completed_appointments}
                      </div>
                      <div className="text-muted-foreground">Concluídos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-red-600">
                        {stats.cancelled_appointments}
                      </div>
                      <div className="text-muted-foreground">Cancelados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-yellow-600">
                        {stats.pending_appointments}
                      </div>
                      <div className="text-muted-foreground">Pendentes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-primary">
                        {stats.completion_rate.toFixed(1)}%
                      </div>
                      <div className="text-muted-foreground">Taxa de Conclusão</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">
                        R$ {stats.total_revenue.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">Receita Total</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appointments Report */}
      {reportType === 'appointments' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Estatísticas de Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appointmentStats.map((stats) => (
                <div key={stats.status} className="border rounded-lg p-6 text-center">
                  <div className="flex justify-center mb-3">
                    {getStatusIcon(stats.status)}
                  </div>
                  <div className="text-2xl font-bold mb-2">
                    {stats.count}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {getStatusLabel(stats.status)}
                  </div>
                  <div className="text-lg font-semibold text-primary">
                    {stats.percentage.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* General Report */}
      {reportType === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Resumo Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total de Agendamentos</span>
                  <span className="font-bold">{appointmentStats.reduce((sum, stat) => sum + stat.count, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Serviços Ativos</span>
                  <span className="font-bold">{serviceStats.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Conclusão Média</span>
                  <span className="font-bold">
                    {serviceStats.length > 0 
                      ? (serviceStats.reduce((sum, stat) => sum + stat.completion_rate, 0) / serviceStats.length).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Receita Total</span>
                  <span className="font-bold text-green-600">
                    R$ {serviceStats.reduce((sum, stat) => sum + stat.total_revenue, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceStats.length > 0 && (
                  <>
                    <div>
                      <h4 className="font-semibold mb-2">Serviço Mais Popular</h4>
                      <p className="text-sm text-muted-foreground">
                        {serviceStats[0]?.service_name} com {serviceStats[0]?.total_appointments} agendamentos
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Melhor Taxa de Conclusão</h4>
                      <p className="text-sm text-muted-foreground">
                        {serviceStats
                          .filter(s => s.total_appointments > 0)
                          .sort((a, b) => b.completion_rate - a.completion_rate)[0]?.service_name} 
                        ({serviceStats
                          .filter(s => s.total_appointments > 0)
                          .sort((a, b) => b.completion_rate - a.completion_rate)[0]?.completion_rate.toFixed(1)}%)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReportsManagement;