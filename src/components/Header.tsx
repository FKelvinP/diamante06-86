import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Calendar, User, LogOut, LogIn, MessageCircle } from 'lucide-react';
import logoImage from '/lovable-uploads/b8a1249e-804e-44d2-a223-77a0b881cc40.png';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    user,
    isAuthenticated,
    logout
  } = useAuth();
  const handleBookingClick = () => {
    if (isAuthenticated) {
      document.getElementById('booking')?.scrollIntoView({
        behavior: 'smooth'
      });
    } else {
      // Will be handled by the protected route
      window.location.href = '/booking';
    }
  };
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };
  return <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logoImage} alt="Lava Jato e Estética Diamante" className="h-16 w-16 object-contain" />
            <div className="logo-text">
              <h1 className="text-xl font-bold">
                <span className="lava-jato">Lava Jato</span>
                <span className="text-foreground"> e </span>
                <span className="estetica-diamante">Estética Diamante</span>
              </h1>
              <p className="text-xs premium-text">Qualidade Premium</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="menu-link">
              Início
            </a>
            <a href="#services" className="menu-link">
              Serviços
            </a>
            <Link to="/about" className="menu-link">
              Sobre Nós
            </Link>
            <Link to="/contact" className="menu-link">
              Contato
            </Link>
          </nav>

          {/* Auth & WhatsApp */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium">{user?.name}</span>
                  {user?.isAdmin && <Badge variant="secondary" className="text-xs">Admin</Badge>}
                </div>
                {user?.isAdmin && <Link to="/dashboard">
                    <Button variant="outline" size="sm">
                      Dashboard
                    </Button>
                  </Link>}
                <Button variant="hero" size="sm" onClick={handleBookingClick}>
                  <Calendar className="h-4 w-4" />
                  Agendar
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div> : <div className="flex items-center gap-2">
                <Link to="/login" className="bg-green-600 hover:bg-green-500">
                  <Button size="sm" className="gold-button rounded-none">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
              </div>}
            
            {/* WhatsApp Button */}
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <Button variant="hero" size="sm">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <nav className="flex flex-col gap-4">
              <a href="#home" className="menu-link py-2">
                Início
              </a>
              <a href="#services" className="menu-link py-2">
                Serviços
              </a>
              <Link to="/about" className="menu-link py-2">
                Sobre Nós
              </Link>
              <Link to="/contact" className="menu-link py-2">
                Contato
              </Link>
              
              {isAuthenticated ? <div className="space-y-3 pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-medium">{user?.name}</span>
                    {user?.isAdmin && <Badge variant="secondary" className="text-xs">Admin</Badge>}
                  </div>
                  {user?.isAdmin && <Link to="/dashboard" className="block">
                      <Button variant="outline" className="w-full">
                        Dashboard
                      </Button>
                    </Link>}
                  <Button variant="hero" className="w-full" onClick={handleBookingClick}>
                    <Calendar className="h-4 w-4" />
                    Agendar Agora
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </div> : <div className="space-y-2 pt-2 border-t border-border">
                  <Link to="/login" className="block">
                    <Button className="w-full gold-button">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                </div>}
              
              {/* WhatsApp Button Mobile */}
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="block pt-2">
                <Button variant="hero" className="w-full">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
              </a>
            </nav>
          </div>}
      </div>
    </header>;
};
export default Header;