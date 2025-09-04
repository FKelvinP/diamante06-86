import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Instagram,
  Facebook,
  MessageCircle,
  Car
} from 'lucide-react';
const logoImage = '/lovable-uploads/22f03b5d-f5ea-4512-800d-ea135115977c.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={logoImage} 
                alt="Lava Jato e Estética Diamante" 
                className="h-12 w-12 object-contain"
              />
              <div>
                <h3 className="text-xl font-bold">Diamante</h3>
                <p className="text-sm text-primary-foreground/80">Lava Jato & Estética</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Há mais de 5 anos oferecendo os melhores serviços de estética automotiva 
              com qualidade premium e atendimento personalizado.
            </p>
            <div className="flex gap-3">
              <Button size="icon" variant="outline" className="border-primary-foreground/30 hover:bg-primary-foreground/10" asChild>
                <a href="#" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button size="icon" variant="outline" className="border-primary-foreground/30 hover:bg-primary-foreground/10" asChild>
                <a href="#" aria-label="Facebook">
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
              <Button size="icon" variant="outline" className="border-primary-foreground/30 hover:bg-primary-foreground/10" asChild>
                <a href="https://wa.me/5511999999999" aria-label="WhatsApp">
                  <MessageCircle className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4">Nossos Serviços</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="#services" className="hover:text-primary-foreground transition-colors">
                  Lavagem Simples
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary-foreground transition-colors">
                  Lavagem Completa
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary-foreground transition-colors">
                  Enceramento Premium
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary-foreground transition-colors">
                  Detalhamento Completo
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary-foreground transition-colors">
                  Polimento Profissional
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4">Contato</h4>
            <div className="space-y-3 text-sm text-primary-foreground/80">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>Rua das Flores, 123</p>
                  <p>Centro - São Paulo/SP</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+5511999999999" className="hover:text-primary-foreground transition-colors">
                  (11) 99999-9999
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:contato@diamantelava.com.br" className="hover:text-primary-foreground transition-colors">
                  contato@diamantelava.com.br
                </a>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="font-bold mb-4">Funcionamento</h4>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4" />
                <span>Horário de Atendimento</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Seg - Sex</span>
                  <span>08:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábado</span>
                  <span>08:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingo</span>
                  <span>08:00 - 12:00</span>
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-primary-foreground/30 hover:bg-primary-foreground/10"
                  onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Car className="h-4 w-4 mr-2" />
                  Agendar Agora
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
          <div>
            <p>&copy; {currentYear} Lava Jato e Estética Diamante. Todos os direitos reservados.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary-foreground transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-primary-foreground transition-colors">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;