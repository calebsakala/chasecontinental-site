import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface HeaderProps {
  variant?: 'default' | 'transparent';
}

export const Header = ({ variant = 'default' }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBooking = () => {
    window.open('https://calendar.app.google/8oZYnnuHcaiH64Ky8', '_blank');
  };

  const isTransparent = variant === 'transparent' && !scrolled && !mobileMenuOpen;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isTransparent
          ? 'bg-transparent'
          : 'bg-white border-b border-border shadow-sm'
        }`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            {isTransparent && <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />}
            <img
              src="/static/images/chase-continental-header-logo.png"
              alt="Chase Continental"
              className="h-14 w-auto relative z-10"
            />
          </div>
          <span className="text-sm font-bold tracking-wide text-primary hidden sm:block">CHASE CONTINENTAL</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {isHome ? (
            <>
              <a href="#products" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Products</a>
              <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Services</a>
              <a href="#results" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Results</a>
            </>
          ) : (
            <>
              <Link to="/#products" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Products</Link>
              <Link to="/#services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Services</Link>
              <Link to="/#results" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Results</Link>
            </>
          )}

          <Link to="/blogs" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Blog</Link>

          <Button
            onClick={scrollToBooking}
            variant="outline"
            className="hover-border-swipe rounded-full font-semibold px-6 border-2 border-primary text-primary transition-all cursor-pointer"
          >
            Book a Call
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-0 w-full z-60 bg-white border-b border-border p-6 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-5">
          {isHome ? (
            <>
              <a href="#products" className="text-base font-medium text-foreground py-2" onClick={() => setMobileMenuOpen(false)}>Products</a>
              <a href="#services" className="text-base font-medium text-foreground py-2" onClick={() => setMobileMenuOpen(false)}>Services</a>
              <a href="#results" className="text-base font-medium text-foreground py-2" onClick={() => setMobileMenuOpen(false)}>Results</a>
            </>
          ) : (
            <>
              <Link to="/#products" className="text-base font-medium text-foreground py-2" onClick={() => setMobileMenuOpen(false)}>Products</Link>
              <Link to="/#services" className="text-base font-medium text-foreground py-2" onClick={() => setMobileMenuOpen(false)}>Services</Link>
              <Link to="/#results" className="text-base font-medium text-foreground py-2" onClick={() => setMobileMenuOpen(false)}>Results</Link>
            </>
          )}
          <Link to="/blogs" className="text-base font-medium text-foreground py-2" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
          <Button onClick={scrollToBooking} className="w-full hover-border-swipe rounded-full border-2 border-primary bg-transparent text-primary cursor-pointer shadow-md">Book a Call</Button>
        </div>
      )}
    </nav>
  );
};
