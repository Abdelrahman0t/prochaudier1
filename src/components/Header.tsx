import { useState, useRef, useEffect } from 'react';
import { User, Menu, X, Search, Phone, Mail, ShoppingCart,LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom'; // ⬅ Add this at the top
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems, openCart } = useCart();
  const location = useLocation(); // ⬅ Current route
  const navigate = useNavigate();
  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Produits', href: '/products' },
    { name: 'À propos', href: '/Apropos' },
    { name: 'Contact', href: '/contactus' },
    
  ];  
  const accessToken = localStorage.getItem("access_token");

  // 🔍 Shared search component (used in both mobile and desktop)
  const SearchWithDropdown = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
      if (!searchTerm.trim()) {
        setSuggestions([]);
        return;
      }

      const delayDebounce = setTimeout(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}api/search-suggestions/?q=${encodeURIComponent(searchTerm)}`)
          .then(res => res.json())
          .then(data => {
            setSuggestions(data);
            console.log(data)
            setDropdownOpen(true);
          });
      }, 300);

      return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
          setDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (productId) => {
      navigate(`/product/${productId}`);
      setDropdownOpen(false);
      setSearchTerm('');
    };

    return (
      <div className="relative w-full" ref={wrapperRef}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher des pièces détachées..."
          className="pl-10 bg-secondary/50 border-border/50 focus:border-brand transition-colors"
          onFocus={() => searchTerm && setDropdownOpen(true)}
        />
        {/* Animated search suggestions dropdown */}
        <div 
          className={`absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto transition-all duration-200 ease-in-out ${
            dropdownOpen && suggestions.length > 0 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          {suggestions.map((item) => (
            <div
              key={item.id}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
              onClick={() => handleSelect(item.id)}
            >
              {item.image && (
                <img src={`${import.meta.env.VITE_API_BASE_URL}${item.image}`} alt={item.title} className="h-8 w-8 object-cover rounded mr-2" />
              )}
              <span className="text-sm">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      {/* Top Contact Bar */}
      <div className="hidden md:block bg-brand/5 border-b border-brand/10">
        <div className="px-6 md:px-12 lg:px-20 xl:px-24 2xl:px-32 mx-auto w-full py-2">
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

      {/* Main Navigation */}
      <div className="px-6 md:px-12 lg:px-20 xl:px-24 2xl:px-32 mx-auto w-full px-4">
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
          <div className="hidden min-[875px]:flex flex-1 max-w-md mx-8">
            <SearchWithDropdown />
          </div>

          {/* Navigation Links */}
  <nav className="hidden md:flex items-center space-x-6 max-[992px]:space-x-4">
    {navigation.map((item) => {
      const isActive = location.pathname === item.href;
      return (
        <a
          key={item.name}
          href={item.href}
          className={`font-medium transition-colors max-[1400px]:text-sm max-[992px]:text-[0.8rem] ${
            isActive ? 'text-brand' : 'text-foreground hover:text-brand'
          }`}
        >
          {item.name}
        </a>
      );
    })}
  </nav>

          {/* Cart & Mobile Menu */}
<div className="flex items-center space-x-4">

  {/* Desktop: Profile or Login */}
  {accessToken ? (
    <Button
      variant="ghost"
      size="sm"
      className="hidden md:flex items-center gap-1 text-sm font-medium hover:text-brand transition-colors"
      onClick={() => navigate('/profile')}
    >
      <User className="h-5 w-5" />
    </Button>
  ) : (
    <Button
      variant="ghost"
      size="sm"
      className="hidden md:flex items-center gap-1 text-sm font-medium hover:text-brand transition-colors"
      onClick={() => navigate('/login')}
    >
      <LogIn className="h-5 w-5" />
      <span className="hidden sm:inline">Se connecter</span>
    </Button>
  )}

  {/* Mobile: Profile or Login icon */}
{accessToken && (
  <Button
    variant="ghost"
    size="sm"
    className="md:hidden"
    onClick={() => navigate('/profile')}
  >
    <User className="h-5 w-5" />
  </Button>
)}


  {/* Cart */}
  <Button
    variant="ghost"
    size="sm"
    onClick={openCart}
    className="relative"
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

  {/* Mobile Menu */}
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
        <div className="block min-[875px]:hidden pb-4">
          <SearchWithDropdown />
        </div>
      </div>

      {/* Mobile Navigation */}
<div 
  className={`md:hidden border-t border-border bg-background overflow-hidden transition-all duration-300 ease-in-out ${
    isMenuOpen 
      ? 'max-h-96 opacity-100' 
      : 'max-h-0 opacity-0'
  }`}
>
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

    {/* Mobile Login Button */}
{!accessToken && (
  <Button
    variant="outline"
    size="sm"
    className="w-full flex items-center gap-2 justify-center"
    onClick={() => {
      navigate('/login');
      setIsMenuOpen(false);
    }}
  >
    <LogIn className="h-4 w-4" />
    Se connecter
  </Button>
)}


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
    </header>
  );
};

export default Header;