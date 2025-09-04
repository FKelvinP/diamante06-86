import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Award, 
  Clock, 
  Users, 
  CheckCircle, 
  Star,
  ThumbsUp,
  Trophy,
  Zap
} from 'lucide-react';
import beforeAfterImg from '@/assets/before-after-comparison.jpg';

const ResultsShowcase = () => {
  const guarantees = [
    {
      icon: Shield,
      title: 'Garantia de Qualidade',
      description: 'Se não ficar satisfeito, refazemos o serviço gratuitamente',
      period: '100% garantido'
    },
    {
      icon: Clock,
      title: 'Pontualidade',
      description: 'Cumprimos rigorosamente os horários agendados',
      period: 'No horário marcado'
    },
    {
      icon: Award,
      title: 'Produtos Premium',
      description: 'Utilizamos apenas produtos de alta qualidade importados',
      period: 'Qualidade superior'
    },
    {
      icon: Users,
      title: 'Profissionais Certificados',
      description: 'Equipe treinada e experiente em detalhamento automotivo',
      period: 'Mão de obra qualificada'
    }
  ];

  const stats = [
    {
      icon: Trophy,
      number: '2000+',
      label: 'Carros Atendidos',
      description: 'Clientes satisfeitos'
    },
    {
      icon: Star,
      number: '4.9',
      label: 'Avaliação Média',
      description: 'Google Reviews'
    },
    {
      icon: Zap,
      number: '5',
      label: 'Anos de Experiência',
      description: 'No mercado'
    },
    {
      icon: ThumbsUp,
      number: '98%',
      label: 'Clientes Satisfeitos',
      description: 'Voltam sempre'
    }
  ];

  return (
    <section id="results-showcase" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 flex items-center gap-2 w-fit mx-auto">
            <Trophy className="h-4 w-4" />
            Resultados Comprovados
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Veja a{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              transformação
            </span>{' '}
            do seu veículo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nosso compromisso com a excelência se reflete em cada serviço realizado. 
            Confira nossos resultados e garantias.
          </p>
        </div>

        {/* Before/After Section */}
        <div className="mb-16">
          <Card className="overflow-hidden">
            <div className="relative h-64 md:h-96">
              <img 
                src={beforeAfterImg} 
                alt="Comparação antes e depois do serviço de detalhamento"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              
              {/* Before/After Labels */}
              <div className="absolute top-4 left-4">
                <Badge className="bg-red-500 text-white">ANTES</Badge>
              </div>
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-500 text-white">DEPOIS</Badge>
              </div>
              
              {/* Central Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-2xl md:text-4xl font-bold mb-4">
                    Resultados Profissionais
                  </h3>
                  <p className="text-lg md:text-xl opacity-90 mb-6">
                    Transformação completa do seu veículo
                  </p>
                  <Button 
                    variant="hero" 
                    size="lg"
                    onClick={() => {
                      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Agendar Meu Serviço
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-card transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <stat.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">{stat.number}</h3>
                <p className="font-medium text-foreground mb-1">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Guarantees Section */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Nossas Garantias
            </h3>
            <p className="text-lg text-muted-foreground">
              Trabalhamos com total transparência e compromisso com a qualidade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((guarantee, index) => (
              <Card key={index} className="text-center hover:shadow-card transition-all duration-300 border-2 hover:border-primary/20">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gradient-diamond rounded-full">
                      <guarantee.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-2">{guarantee.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {guarantee.description}
                  </p>
                  <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">
                    {guarantee.period}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-hero rounded-2xl p-8 max-w-4xl mx-auto text-primary-foreground">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white/20 rounded-full">
                <CheckCircle className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Pronto para transformar seu veículo?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Agende agora e experimente a diferença de um serviço profissional 
              com garantia de qualidade e satisfação total.
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => {
                document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Agendar Agora
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsShowcase;