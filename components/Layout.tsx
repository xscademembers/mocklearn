import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from './UI';
import { Bot, Menu, X, ChevronRight, Mail, Phone } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
    // Close mobile menu on route change
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const NavLink = ({ to, label }: { to: string; label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={cn(
          "text-sm font-medium transition-all hover:text-foreground relative group py-1",
          isActive ? "text-foreground" : "text-muted-foreground"
        )}
        onClick={() => setIsMenuOpen(false)}
      >
        {label}
        <span className={cn(
          "absolute inset-x-0 -bottom-0.5 h-px bg-indigo-500 transform transition-transform duration-200 ease-out origin-left",
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        )} />
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground antialiased selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden">
      {/* Header */}
      <header 
        className={cn(
          "fixed top-0 z-50 w-full border-b transition-all duration-300",
          scrolled || isMenuOpen ? "bg-background/95 backdrop-blur-md border-border shadow-sm" : "bg-transparent border-transparent"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg sm:text-xl tracking-tight hover:opacity-80 transition-opacity">
            <div className="bg-indigo-600 text-white p-1 sm:p-1.5 rounded-lg shadow-sm">
              <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span>MockLearn</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <NavLink to="/" label="Home" />
            <NavLink to="/about" label="About" />
            <NavLink to="/for-companies" label="For Companies" />
            <NavLink to="/faq" label="FAQ" />
            <NavLink to="/contact" label="Contact" />
            <NavLink to="/dashboard" label="Dashboard" />
            <div className="pl-2 lg:pl-4">
              <Link to="/interview">
                <button className="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-full bg-indigo-600 px-4 lg:px-6 font-medium text-white text-sm transition-all duration-300 hover:bg-indigo-700 hover:ring-2 hover:ring-indigo-200 hover:ring-offset-2">
                  <span className="mr-1 lg:mr-2">Start Interview</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-foreground -mr-2" 
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        <div className={cn(
          "md:hidden fixed inset-0 top-14 sm:top-16 bg-background z-40 transition-all duration-300",
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}>
          <div className="flex flex-col h-full">
            <nav className="flex-1 overflow-y-auto p-6 space-y-1">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
                { to: "/for-companies", label: "For Companies" },
                { to: "/faq", label: "FAQ" },
                { to: "/contact", label: "Contact" },
                { to: "/dashboard", label: "Dashboard" }
              ].map((item) => (
                <Link 
                  key={item.to}
                  to={item.to} 
                  className={cn(
                    "block text-lg font-medium py-3 px-4 rounded-xl transition-colors",
                    location.pathname === item.to 
                      ? "bg-indigo-50 text-indigo-600" 
                      : "text-foreground hover:bg-muted"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-4">
                <Link to="/interview" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full bg-indigo-600 text-white h-12 rounded-xl font-medium text-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                    Start Interview
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </Link>
              </div>
            </nav>

            {/* Mobile menu footer */}
            <div className="p-6 border-t bg-muted/30">
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="mailto:support@mocklearn.com" className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
                  <Mail className="h-4 w-4" />
                  support@mocklearn.com
                </a>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +91-XXXXXXXXXX
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-14 sm:pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-slate-900 text-slate-300 mt-12 sm:mt-20">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-white">
                <div className="bg-indigo-600 text-white p-1 rounded-md">
                  <Bot className="h-4 w-4" />
                </div>
                <span>MockLearn</span>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed text-sm sm:text-base mb-4 sm:mb-6">
                Empowering candidates with AI-driven interview preparation. Master your skills, gain confidence, and land your dream job.
              </p>
              <div className="space-y-2 text-sm">
                <a href="mailto:support@mocklearn.com" className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="break-all">support@mocklearn.com</span>
                </a>
                <p className="flex items-center gap-2 text-slate-400">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  +91-XXXXXXXXXX
                </p>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Platform</h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <li><Link to="/" className="text-slate-400 hover:text-indigo-400 transition-colors">Home</Link></li>
                <li><Link to="/interview" className="text-slate-400 hover:text-indigo-400 transition-colors">Mock Interview</Link></li>
                <li><Link to="/for-companies" className="text-slate-400 hover:text-indigo-400 transition-colors">For Companies</Link></li>
                <li><Link to="/about" className="text-slate-400 hover:text-indigo-400 transition-colors">How it Works</Link></li>
                <li><Link to="/faq" className="text-slate-400 hover:text-indigo-400 transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Company</h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <li><Link to="/about" className="text-slate-400 hover:text-indigo-400 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-slate-400 hover:text-indigo-400 transition-colors">Contact</Link></li>
                <li><Link to="/terms" className="text-slate-400 hover:text-indigo-400 transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="text-slate-400 hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-slate-500">
            <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} MockLearn.com. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6">
              <Link to="/terms" className="hover:text-indigo-400 transition-colors">Terms</Link>
              <Link to="/privacy" className="hover:text-indigo-400 transition-colors">Privacy</Link>
              <Link to="/faq" className="hover:text-indigo-400 transition-colors">FAQ</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
