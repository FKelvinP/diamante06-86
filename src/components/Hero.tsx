import { Button } from '@/components/ui/button';
import { Sparkles, Shield, Clock, Star } from 'lucide-react';
import heroBackground from '@/assets/hero-background.jpg';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Animado */}
      <div className="absolute inset-0">
        {/* Fundo base com imagem */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        
        {/* Overlays animados que se movem */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/50 to-primary/80 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary-glow/30 to-transparent animate-bounce" style={{ animationDuration: '3s' }}></div>
        
        {/* Elementos flutuantes que se movem */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-20 h-20 bg-primary-glow/30 rounded-full blur-xl animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="absolute bottom-32 left-20 w-16 h-16 bg-diamond-light/25 rounded-full blur-lg animate-bounce" style={{ animationDelay: '1s', animationDuration: '2.5s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-primary-foreground/20 rounded-full blur animate-pulse opacity-60" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/3 left-1/3 w-8 h-8 bg-primary-glow/40 rounded-full animate-ping" style={{ animationDelay: '0.5s', animationDuration: '1.8s' }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
            <span className="text-sm text-primary-foreground font-medium premium-text">
              Profissionais em Estética Automotiva
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Brilho de{' '}
            <span className="premium-text">
              Diamante
            </span>{' '}
            para seu carro
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            Transformamos seu veículo com serviços profissionais de lavagem e estética automotiva. 
            Qualidade premium e resultados que impressionam.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 bg-primary backdrop-blur-sm rounded-lg p-3">
              <Shield className="h-5 w-5 text-primary-foreground" />
              <span className="text-sm text-primary-foreground font-medium">Produtos Premium</span>
            </div>
            <div className="flex items-center gap-3 bg-primary backdrop-blur-sm rounded-lg p-3">
              <Clock className="h-5 w-5 text-primary-foreground" />
              <span className="text-sm text-primary-foreground font-medium">Serviço Rápido</span>
            </div>
            <div className="flex items-center gap-3 bg-primary backdrop-blur-sm rounded-lg p-3">
              <Star className="h-5 w-5 text-primary-foreground" />
              <span className="text-sm text-primary-foreground font-medium">Resultado Garantido</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-8 py-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Sparkles className="h-5 w-5" />
              Agendar Agora
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 right-10 animate-float hidden lg:block">
        <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-full p-4">
          <Sparkles className="h-8 w-8 text-primary-glow" />
        </div>
      </div>
    </section>
  );
};

export default Hero;