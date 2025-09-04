import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Settings, 
  Activity,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  LogOut,
  Menu,
  Bell
} from 'lucide-react';
import AppointmentsManagement from '@/components/dashboard/AppointmentsManagement';
import ServicesManagement from '@/components/dashboard/ServicesManagement';
import CustomersManagement from '@/components/dashboard/CustomersManagement';
import UsersManagement from '@/components/dashboard/UsersManagement';
import PaymentsManagement from '@/components/dashboard/PaymentsManagement';
import ReportsManagement from '@/components/dashboard/ReportsManagement';
import FinancialManagement from '@/components/dashboard/FinancialManagement';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import logoImage from '/lovable-uploads/b8a1249e-804e-44d2-a223-77a0b881cc40.png';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const sidebarItems = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'appointments', label: 'Agendamentos', icon: Calendar },
    { id: 'services', label: 'Serviços', icon: Settings },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'payments', label: 'Pagamentos', icon: DollarSign },
    { id: 'reports', label: 'Relatórios', icon: Activity },
    { id: 'financial', label: 'Financeiro', icon: DollarSign },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-sidebar-background">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 p-6 border-b border-sidebar-border hover:opacity-80 transition-opacity">
        <img 
          src={logoImage} 
          alt="Diamante" 
          className="h-10 w-10 object-contain"
        />
        <div>
          <h2 className="font-bold text-sidebar-foreground">Dashboard Admin</h2>
          <p className="text-xs text-sidebar-foreground/70">Painel de Controle</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3 h-11"
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs font-semibold text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-sidebar-foreground">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/70">Administrador</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full gap-2"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 border-r border-border">
          <SidebarContent />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-background border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-64">
                    <SidebarContent />
                  </SheetContent>
                </Sheet>
                
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Gerencie seu negócio de forma eficiente
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
                <Badge variant="secondary" className="hidden sm:inline-flex">
                  Online
                </Badge>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsContent value="overview" className="mt-0 h-full">
                <DashboardStats />
              </TabsContent>
              
              <TabsContent value="appointments" className="mt-0 h-full">
                <AppointmentsManagement />
              </TabsContent>
              
              <TabsContent value="services" className="mt-0 h-full">
                <ServicesManagement />
              </TabsContent>
              
              <TabsContent value="customers" className="mt-0 h-full">
                <CustomersManagement />
              </TabsContent>
              
              <TabsContent value="users" className="mt-0 h-full">
                <UsersManagement />
              </TabsContent>
              
              <TabsContent value="payments" className="mt-0 h-full">
                <PaymentsManagement />
              </TabsContent>
              
              <TabsContent value="reports" className="mt-0 h-full">
                <ReportsManagement />
              </TabsContent>
              
              <TabsContent value="financial" className="mt-0 h-full">
                <FinancialManagement />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;