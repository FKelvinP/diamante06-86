import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Award, Users, Clock, Shield, Heart } from 'lucide-react';
import logoImage from '/lovable-uploads/b8a1249e-804e-44d2-a223-77a0b881cc40.png';

const About = () => {
  const values = [
    {
      icon: <Star className="h-6 w-6" />,
      title: "Qualidade Premium",
      description: "Utilizamos apenas produtos de alta qualidade e técnicas avançadas para garantir o melhor resultado."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Atendimento Personalizado",
      description: "Cada cliente é único. Adaptamos nossos serviços às suas necessidades específicas."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Pontualidade",
      description: "Respeitamos seu tempo. Nossos agendamentos são sempre cumpridos no horário marcado."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Confiança",
      description: "Transparência em todos os processos, desde o orçamento até a entrega do serviço."
    }
  ];

  const stats = [
    { number: "5000+", label: "Carros Atendidos" },
    { number: "98%", label: "Satisfação" },
    { number: "5", label: "Anos no Mercado" },
    { number: "15", label: "Especialistas" }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6 text-foreground">
            <Heart className="h-4 w-4 mr-2" />
            Nossa História
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sobre o Lava Jato e{' '}
            <span className="text-diamond-light">
              Estética Diamante
            </span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90 leading-relaxed">
            Há mais de 5 anos transformando a relação entre você e seu veículo, 
            oferecendo serviços de estética automotiva com excelência e paixão.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={logoImage} 
                alt="Logo Diamante" 
                className="h-32 w-32 object-contain mx-auto lg:mx-0 mb-8"
              />
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Nascemos da paixão por carros
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                O Lava Jato e Estética Diamante nasceu do sonho de transformar a experiência 
                de cuidar do seu veículo. Começamos como um pequeno negócio familiar e hoje 
                somos referência em qualidade e atendimento na região.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Nossa missão é simples: fazer seu carro brilhar como um diamante, 
                cuidando de cada detalhe com a dedicação que você merece.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center p-6 shadow-card">
                  <CardContent className="space-y-2">
                    <div className="text-3xl font-bold text-primary">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Award className="h-4 w-4 mr-2" />
              Nossos Valores
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              O que nos{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                move
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Estes são os pilares que guiam nosso trabalho e nossa relação com cada cliente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 shadow-card hover:shadow-elegant transition-all duration-300 hover:scale-105">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-fit p-3 bg-gradient-primary rounded-full text-primary-foreground">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4">
            <Users className="h-4 w-4 mr-2" />
            Nossa Equipe
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Profissionais{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              especializados
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Nossa equipe é formada por profissionais experientes e apaixonados por estética automotiva, 
            sempre em busca da perfeição em cada detalhe.
          </p>
          
          <Card className="max-w-2xl mx-auto p-8 shadow-elegant">
            <CardContent className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground">Equipe Especializada</h3>
              <p className="text-muted-foreground">
                Contamos com profissionais certificados e em constante atualização, 
                garantindo que seu veículo receba o melhor cuidado possível.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;