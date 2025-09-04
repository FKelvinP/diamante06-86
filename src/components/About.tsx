import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Award, 
  Clock, 
  Shield,
  CheckCircle,
  Star
} from 'lucide-react';

const stats = [
  {
    number: '500+',
    label: 'Carros Atendidos',
    description: 'Mensalmente',
    icon: Users
  },
  {
    number: '5+',
    label: 'Anos de Experiência',
    description: 'No mercado',
    icon: Award
  },
  {
    number: '98%',
    label: 'Satisfação',
    description: 'Dos clientes',
    icon: Star
  },
  {
    number: '24h',
    label: 'Garantia',
    description: 'Em todos os serviços',
    icon: Shield
  }
];

const values = [
  {
    title: 'Qualidade Premium',
    description: 'Utilizamos apenas produtos e equipamentos de primeira linha para garantir o melhor resultado.',
    icon: Award
  },
  {
    title: 'Agilidade',
    description: 'Respeitamos seu tempo. Serviços executados com rapidez sem comprometer a qualidade.',
    icon: Clock
  },
  {
    title: 'Confiabilidade',
    description: 'Profissionais experientes e certificados cuidam do seu veículo com total segurança.',
    icon: Shield
  }
];

const About = () => {
  return (
    <section id="about" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Sobre Nós
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Tradição e{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              inovação
            </span>{' '}
            em estética automotiva
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Há mais de 5 anos no mercado, o Lava Jato e Estética Diamante se consolidou como 
            referência em cuidados automotivos, combinando técnicas tradicionais com as mais 
            modernas tecnologias do setor.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="text-center p-6 hover:shadow-card transition-all duration-300">
                <CardContent className="p-0">
                  <div className="mb-4 mx-auto w-fit p-3 bg-gradient-primary rounded-full">
                    <IconComponent className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                  <div className="font-medium text-foreground">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Nossa História
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Nascemos da paixão por carros e da dedicação em oferecer o melhor cuidado 
                para veículos. O que começou como um pequeno lava-jato familiar se transformou 
                em um centro de excelência em estética automotiva.
              </p>
              <p>
                Nossa missão é simples: fazer com que cada cliente saia completamente satisfeito, 
                com seu veículo impecável e protegido. Para isso, investimos constantemente em 
                treinamento, equipamentos e produtos de alta qualidade.
              </p>
              <p>
                Hoje, somos reconhecidos na região pela qualidade dos nossos serviços e pelo 
                atendimento personalizado que oferecemos a cada cliente.
              </p>
            </div>
          </div>

          <div className="bg-gradient-diamond rounded-2xl p-8 text-primary-foreground">
            <h4 className="text-xl font-bold mb-6">Nossos Diferenciais</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Produtos Profissionais</div>
                  <div className="text-sm opacity-90">Utilizamos apenas marcas reconhecidas no mercado</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Equipe Especializada</div>
                  <div className="text-sm opacity-90">Profissionais treinados e certificados</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Equipamentos Modernos</div>
                  <div className="text-sm opacity-90">Tecnologia de ponta para melhores resultados</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Garantia de Qualidade</div>
                  <div className="text-sm opacity-90">Compromisso com a excelência em cada serviço</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            Nossos Valores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center p-6 hover:shadow-card transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="mb-4 mx-auto w-fit p-3 bg-gradient-primary rounded-full">
                      <IconComponent className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h4 className="text-xl font-bold text-foreground mb-3">{value.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;