import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Sparkles, Shield, Waves, CircleDollarSign, Clock, CheckCircle, Star, Award } from 'lucide-react';

// Import service images
import lavagemSimplesImg from '@/assets/service-lavagem-simples.jpg';
import lavagemCompletaImg from '@/assets/service-lavagem-completa.jpg';
import enceramentoImg from '@/assets/service-enceramento.jpg';
import detalhamentoImg from '@/assets/service-detalhamento.jpg';
const services = [{
  id: 'lavagem-simples',
  title: 'Lavagem Simples',
  description: 'Lavagem completa externa com produtos de qualidade premium para deixar seu carro brilhando',
  price: 'R$ 25,00',
  duration: '30 min',
  icon: Car,
  image: lavagemSimplesImg,
  features: ['Lavagem externa completa com shampoo premium', 'Secagem com toalha de microfibra', 'Limpeza e brilho dos pneus e rodas', 'Aspiração básica do interior', 'Limpeza dos vidros externos'],
  details: ['Produtos biodegradáveis', 'Água tratada', 'Técnicas profissionais'],
  popular: false
}, {
  id: 'lavagem-completa',
  title: 'Lavagem Completa',
  description: 'Serviço completo interno e externo para máximo brilho e proteção do seu veículo',
  price: 'R$ 45,00',
  duration: '60 min',
  icon: Sparkles,
  image: lavagemCompletaImg,
  features: ['Lavagem externa premium com cera líquida', 'Limpeza interna completa (bancos, painel, portas)', 'Aspiração profunda de carpetes e estofados', 'Hidratação e proteção do painel', 'Limpeza interna e externa dos vidros', 'Aromatização do interior'],
  details: ['Produtos de alta qualidade', 'Proteção UV básica', 'Acabamento profissional'],
  popular: true
}, {
  id: 'enceramento',
  title: 'Enceramento Premium',
  description: 'Proteção e brilho duradouro com cera de carnaúba importada de alta qualidade',
  price: 'R$ 80,00',
  duration: '90 min',
  icon: Shield,
  image: enceramentoImg,
  features: ['Lavagem completa preparatória', 'Aplicação de cera de carnaúba premium', 'Proteção UV avançada (até 3 meses)', 'Brilho espelhado duradouro', 'Repelência à água e sujeira', 'Proteção contra oxidação'],
  details: ['Cera de carnaúba importada', 'Proteção de 3 meses', 'Brilho profissional'],
  popular: false
}, {
  id: 'detalhamento',
  title: 'Detalhamento Completo',
  description: 'Serviço premium de restauração e proteção total para resultados excepcionais',
  price: 'R$ 150,00',
  duration: '180 min',
  icon: Waves,
  image: detalhamentoImg,
  features: ['Descontaminação química da tinta', 'Polimento profissional em 3 etapas', 'Enceramento premium com selante', 'Detalhamento interno completo', 'Tratamento e brilho dos pneus', 'Limpeza do motor (externa)', 'Garantia de qualidade de 30 dias'],
  details: ['Produtos profissionais importados', 'Técnicas avançadas de polimento', 'Garantia de 30 dias'],
  popular: false
}];
const Services = () => {
  return <section id="services" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Nossos Serviços
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Escolha o{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              melhor cuidado
            </span>{' '}
            para seu veículo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Oferecemos uma gama completa de serviços profissionais para manter seu carro 
            sempre impecável e protegido.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {services.map(service => {
          const IconComponent = service.icon;
          return <Card key={service.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-card hover:scale-105 ${service.popular ? 'ring-2 ring-primary shadow-elegant' : ''}`}>
                {/* Service Image */}
                <div className="relative h-48 overflow-hidden">
                  <img src={service.image} alt={`Serviço de ${service.title}`} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {service.popular && <Badge className="absolute top-4 right-4 bg-gradient-primary text-primary-foreground flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Mais Popular
                    </Badge>}
                  
                  {/* Price overlay */}
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
                      <CircleDollarSign className="h-4 w-4 text-primary" />
                      <span className="text-xl font-bold text-primary">{service.price}</span>
                    </div>
                  </div>
                  
                  {/* Duration */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-white" />
                      <span className="text-sm text-white">{service.duration}</span>
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-primary rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="text-xs text-primary font-medium">Profissional</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-4 space-y-4">
                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-foreground">Inclui:</h4>
                    <div className="space-y-1">
                      {service.features.slice(0, 4).map((feature, index) => <div key={index} className="flex items-start gap-2 text-xs">
                          <CheckCircle className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground leading-tight">{feature}</span>
                        </div>)}
                      {service.features.length > 4 && <div className="text-xs text-primary font-medium">
                          +{service.features.length - 4} outros benefícios
                        </div>}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="pt-2 border-t border-border">
                    <div className="flex flex-wrap gap-1">
                      {service.details.map((detail, index) => <Badge key={index} variant="secondary" className="text-xs">
                          {detail}
                        </Badge>)}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button variant={service.popular ? 'hero' : 'default'} className="w-full" onClick={() => {
                // Scroll to booking form and pre-select this service
                document.getElementById('booking')?.scrollIntoView({
                  behavior: 'smooth'
                });
                // TODO: Pre-select service in form
              }}>
                    Agendar Agora
                  </Button>
                </CardFooter>
              </Card>;
        })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-diamond rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="mb-4 font-bold text-2xl text-center text-[#ae720b]">
              Garantia de Satisfação
            </h3>
            <p className="mb-6 text-[f6c00c] text-zinc-50 font-semibold">
              Todos os nossos serviços incluem garantia de qualidade. Se não ficar satisfeito, 
              refazemos o serviço sem custo adicional.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-primary-foreground/80 rounded-md bg-transparent">
              <span className="text-base font-semibold">✓ Produtos Premium</span>
              <span className="text-base font-semibold">✓ Profissionais Qualificados</span>
              <span className="text-base font-semibold">✓ Equipamentos Modernos</span>
              <span className="text-base font-semibold">✓ Garantia de Qualidade</span>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Services;