import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Clock, 
  Star, 
  CheckCircle, 
  Award, 
  Shield, 
  Sparkles,
  Eye,
  ArrowRight
} from 'lucide-react';

// Import service images
import lavagemSimplesImg from '@/assets/service-lavagem-simples.jpg';
import lavagemCompletaImg from '@/assets/service-lavagem-completa.jpg';
import enceramentoImg from '@/assets/service-enceramento.jpg';
import detalhamentoImg from '@/assets/service-detalhamento.jpg';

const servicesGallery = [
  {
    id: 'lavagem-simples',
    title: 'Lavagem Simples',
    subtitle: 'Cuidado essencial para seu veículo',
    price: 'R$ 25,00',
    duration: '30 min',
    image: lavagemSimplesImg,
    category: 'Básico',
    rating: 4.8,
    description: 'Nosso serviço de lavagem simples oferece cuidado profissional com produtos premium para manter seu veículo sempre limpo e brilhante.',
    features: [
      'Pré-lavagem com jato de alta pressão',
      'Aplicação de shampoo neutro premium',
      'Lavagem manual com luvas de microfibra',
      'Secagem com toalhas absorventes',
      'Limpeza e brilho dos pneus',
      'Aspiração do interior (bancos dianteiros)',
      'Limpeza dos vidros externos'
    ],
    process: [
      'Inspeção inicial do veículo',
      'Pré-lavagem para remoção de sujeira grossa',
      'Aplicação do shampoo com técnica de duas baldes',
      'Enxágue completo',
      'Secagem profissional'
    ],
    benefits: [
      'Remove sujeira e poeira do dia a dia',
      'Preserva a pintura original',
      'Melhora a visibilidade dos vidros',
      'Mantém o valor do veículo'
    ]
  },
  {
    id: 'lavagem-completa',
    title: 'Lavagem Completa',
    subtitle: 'Cuidado completo interno e externo',
    price: 'R$ 45,00',
    duration: '60 min',
    image: lavagemCompletaImg,
    category: 'Completo',
    rating: 4.9,
    description: 'Serviço completo que inclui limpeza externa premium e detalhamento interno para deixar seu carro como novo.',
    features: [
      'Tudo da lavagem simples +',
      'Aspiração completa (todos os bancos)',
      'Limpeza e hidratação do painel',
      'Limpeza das portas e molduras',
      'Limpeza dos vidros internos',
      'Aromatização do ambiente',
      'Aplicação de cera líquida protetiva',
      'Brilho dos pneus com silicone'
    ],
    process: [
      'Inspeção detalhada do veículo',
      'Remoção de objetos pessoais',
      'Aspiração completa do interior',
      'Limpeza de todas as superfícies internas',
      'Lavagem externa premium',
      'Aplicação de proteções'
    ],
    benefits: [
      'Interior completamente higienizado',
      'Proteção básica da pintura',
      'Ambiente interno fresh e limpo',
      'Maior durabilidade da limpeza'
    ]
  },
  {
    id: 'enceramento',
    title: 'Enceramento Premium',
    subtitle: 'Proteção e brilho duradouro',
    price: 'R$ 80,00',
    duration: '90 min',
    image: enceramentoImg,
    category: 'Premium',
    rating: 4.9,
    description: 'Tratamento premium com cera de carnaúba importada que oferece proteção superior e brilho espelhado duradouro.',
    features: [
      'Lavagem completa preparatória',
      'Descontaminação leve da pintura',
      'Aplicação de cera de carnaúba premium',
      'Proteção UV por até 3 meses',
      'Brilho espelhado profissional',
      'Repelência à água e sujeira',
      'Proteção contra oxidação',
      'Acabamento em pneus e para-choques'
    ],
    process: [
      'Lavagem preparatória completa',
      'Secagem total da superfície',
      'Aplicação da cera em movimentos circulares',
      'Tempo de cura adequado',
      'Remoção e polimento final'
    ],
    benefits: [
      'Proteção de 3 meses contra intempéries',
      'Facilita limpezas futuras',
      'Realça a cor original da tinta',
      'Adiciona valor ao veículo'
    ]
  },
  {
    id: 'detalhamento',
    title: 'Detalhamento Completo',
    subtitle: 'Restauração e proteção total',
    price: 'R$ 150,00',
    duration: '180 min',
    image: detalhamentoImg,
    category: 'Premium+',
    rating: 5.0,
    description: 'Nosso serviço mais completo: restauração profissional da pintura com polimento, proteção premium e garantia estendida.',
    features: [
      'Descontaminação química completa',
      'Clay bar para remoção de contaminantes',
      'Polimento em 3 etapas (cutting, polishing, finishing)',
      'Enceramento premium com selante sintético',
      'Detalhamento interno premium',
      'Limpeza externa do motor',
      'Tratamento de pneus e para-choques',
      'Restauração de faróis opacos',
      'Garantia de qualidade de 30 dias'
    ],
    process: [
      'Avaliação completa da pintura',
      'Lavagem e descontaminação',
      'Processo de polimento progressivo',
      'Aplicação de proteções premium',
      'Detalhamento fino de todos os componentes',
      'Inspeção final e entrega'
    ],
    benefits: [
      'Remove micro riscos e oxidação',
      'Restaura o brilho original da tinta',
      'Proteção de longa duração',
      'Resultado de showroom'
    ]
  }
];

const ServiceGallery = () => {
  const [selectedService, setSelectedService] = useState<typeof servicesGallery[0] | null>(null);

  return (
    <section id="service-gallery" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 flex items-center gap-2 w-fit mx-auto">
            <Eye className="h-4 w-4" />
            Detalhes dos Serviços
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Conheça cada{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              serviço em detalhes
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparência total: veja exatamente o que está incluído em cada serviço e 
            escolha o melhor para seu veículo.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicesGallery.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-card transition-all duration-300">
              <div className="relative h-64">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Category Badge */}
                <Badge className="absolute top-4 left-4 bg-gradient-primary text-primary-foreground">
                  {service.category}
                </Badge>
                
                {/* Rating */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{service.rating}</span>
                </div>

                {/* Price & Duration */}
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-2xl font-bold">{service.price}</p>
                  <div className="flex items-center gap-1 text-sm opacity-90">
                    <Clock className="h-3 w-3" />
                    {service.duration}
                  </div>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {service.subtitle}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Principais benefícios:</h4>
                  <div className="grid grid-cols-1 gap-1">
                    {service.benefits.slice(0, 3).map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full" onClick={() => setSelectedService(service)}>
                      Ver Detalhes Completos
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl flex items-center gap-2">
                        <Award className="h-6 w-6 text-primary" />
                        {service.title}
                      </DialogTitle>
                      <DialogDescription>{service.subtitle}</DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      {/* Service Image */}
                      <div className="relative h-64 rounded-lg overflow-hidden">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <p className="text-2xl font-bold">{service.price}</p>
                          <p className="text-sm opacity-90">Duração: {service.duration}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Features */}
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            O que está incluído
                          </h3>
                          <div className="space-y-2">
                            {service.features.map((feature, index) => (
                              <div key={index} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Process */}
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Processo de execução
                          </h3>
                          <div className="space-y-2">
                            {service.process.map((step, index) => (
                              <div key={index} className="flex items-start gap-2 text-sm">
                                <div className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                                  {index + 1}
                                </div>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Benefits */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Award className="h-5 w-5 text-primary" />
                          Benefícios duradouros
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {service.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm p-2 bg-secondary/50 rounded-lg">
                              <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <Button 
                          className="w-full" 
                          variant="hero"
                          onClick={() => {
                            document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          Agendar {service.title} - {service.price}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceGallery;