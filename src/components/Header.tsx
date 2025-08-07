import { useState } from 'react';
import { Menu, X, Search, Phone, Mail, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems, openCart } = useCart();

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Produits', href: '/products' },
    { name: 'Catégories', href: '#categories' },
    { name: 'Contact', href: '#contact' },
    { name: 'À propos', href: '#about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      {/* Top bar with contact info */}
      <div className="hidden md:block bg-brand/5 border-b border-brand/10">
        <div className="px-6 md:px-12 lg:px-20 xl:px-24 2xl:px-32 mx-auto w-full mx-auto px-4 py-2">
          <div className="flex justify-between items-center max-[860px]:text-[0.7rem] text-sm text-muted-foreground">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-brand" />
                <span>0550 45 24 66 / 0550 45 24 67</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-brand" />
                <span>contact@prochaudiere.com</span>
              </div>
            </div>
            <div className="text-sm max-[860px]:text-[0.7rem]">
              <span className="text-brand font-medium">Livraison rapide</span> • <span className="text-brand font-medium">Pièces 100% originales</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="px-6 md:px-12 lg:px-20 xl:px-24 2xl:px-32 mx-auto w-full mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
<div className="flex items-center space-x-2">
  <img
    src="/Design-sans-titre-2.png"
    alt="Pro Chaudière Logo"
    className="h-14 w-auto object-contain max-[993px]:h-12 max-[860px]:h-10 max-[767px]:h-12"
  />

</div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Rechercher des pièces détachées..."
                className="pl-10 bg-secondary/50 border-border/50 focus:border-brand transition-colors"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
<nav className="hidden md:flex items-center space-x-6 max-[992px]:space-x-4">
  {navigation.map((item) => (
    <a
      key={item.name}
      href={item.href}
      className="text-foreground hover:text-brand transition-colors font-medium max-[1400px]:text-sm max-[992px]:text-[0.8rem] "
    >
      {item.name}
    </a>
  ))}
</nav>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative max-[1400px]:ml-4"
              onClick={openCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <Badge 
                  variant="default" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs rounded-full flex items-center justify-center bg-brand text-white"
                >
                  {getTotalItems()}
                </Badge>
              )}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-10 bg-secondary/50"
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block text-foreground hover:text-brand transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-brand" />
                <span>0550 45 24 66</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-brand" />
                <span>contact@prochaudiere.com</span>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;