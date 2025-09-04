import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Navigation,
  MessageCircle
} from 'lucide-react';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Endereço',
    primary: 'Rua das Flores, 123',
    secondary: 'Centro - São Paulo/SP',
    action: 'Ver no Mapa',
    href: 'https://maps.google.com'
  },
  {
    icon: Phone,
    title: 'Telefone',
    primary: '(11) 99999-9999',
    secondary: 'WhatsApp disponível',
    action: 'Ligar Agora',
    href: 'tel:+5511999999999'
  },
  {
    icon: Mail,
    title: 'E-mail',
    primary: 'contato@diamantelava.com.br',
    secondary: 'Resposta em até 2h',
    action: 'Enviar E-mail',
    href: 'mailto:contato@diamantelava.com.br'
  }
];

const workingHours = [
  { day: 'Segunda a Sexta', hours: '08:00 - 18:00' },
  { day: 'Sábado', hours: '08:00 - 17:00' },
  { day: 'Domingo', hours: '08:00 - 12:00' }
];

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Contato
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Entre em{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              contato
            </span>{' '}
            conosco
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Estamos sempre prontos para atender você. Entre em contato para tirar dúvidas, 
            fazer agendamentos ou solicitar orçamentos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <Card key={index} className="text-center p-6 hover:shadow-card transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="mb-4 mx-auto w-fit p-3 bg-gradient-primary rounded-full">
                        <IconComponent className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h3 className="font-bold text-foreground mb-2">{info.title}</h3>
                      <p className="text-foreground font-medium mb-1">{info.primary}</p>
                      <p className="text-sm text-muted-foreground mb-4">{info.secondary}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        className="hover:bg-primary hover:text-primary-foreground"
                      >
                        <a href={info.href} target="_blank" rel="noopener noreferrer">
                          {info.action}
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Map Section */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Nossa Localização
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-gradient-diamond h-64 flex items-center justify-center text-primary-foreground">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-lg font-medium">Mapa Interativo</p>
                    <p className="text-sm opacity-90 mb-4">
                      Rua das Flores, 123 - Centro, São Paulo/SP
                    </p>
                    <Button 
                      variant="outline" 
                      className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                      asChild
                    >
                      <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                        <Navigation className="h-4 w-4 mr-2" />
                        Abrir no Google Maps
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Working Hours & Quick Contact */}
          <div className="space-y-6">
            {/* Working Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horário de Funcionamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {workingHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{schedule.day}</span>
                    <span className="font-medium text-primary">{schedule.hours}</span>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Atenção:</strong> Recomendamos agendamento prévio para garantir seu horário.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card className="bg-gradient-diamond text-primary-foreground">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Atendimento Rápido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm opacity-90">
                  Precisa de atendimento imediato? Entre em contato conosco pelo WhatsApp 
                  e receba resposta em poucos minutos.
                </p>
                <Button 
                  className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  asChild
                >
                  <a 
                    href="https://wa.me/5511999999999" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Conversar no WhatsApp
                  </a>
                </Button>
                
                <div className="pt-4 border-t border-primary-foreground/20">
                  <h4 className="font-medium mb-2">Dúvidas Frequentes:</h4>
                  <ul className="text-sm space-y-1 opacity-90">
                    <li>• Valores e formas de pagamento</li>
                    <li>• Disponibilidade de horários</li>
                    <li>• Serviços especializados</li>
                    <li>• Orçamentos personalizados</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-2 border-primary">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-bold text-foreground mb-2">Emergência?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Para casos urgentes, ligue diretamente:
                </p>
                <Button variant="hero" asChild>
                  <a href="tel:+5511999999999">
                    <Phone className="h-4 w-4 mr-2" />
                    (11) 99999-9999
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;