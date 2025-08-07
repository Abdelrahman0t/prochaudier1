import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Accueil', href: '#' },
    { name: 'Produits', href: '#products' },
    { name: 'Catégories', href: '#categories' },
    { name: 'À propos', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const categories = [
    { name: 'Cartes électroniques', href: '#' },
    { name: 'Modules hydrauliques', href: '#' },
    { name: 'Pompes', href: '#' },
    { name: 'Vannes 3 voies', href: '#' },
    { name: 'Capteurs', href: '#' },
  ];

  const brands = [
    { name: 'Saunier Duval', href: '#' },
    { name: 'Beretta', href: '#' },
    { name: 'Baxi', href: '#' },
    { name: 'Facofri', href: '#' },
    { name: 'Riello', href: '#' },
  ];

  const legal = [
    { name: 'Conditions générales de vente', href: '#' },
    { name: 'Mentions légales', href: '#' },
    { name: 'Politique de confidentialité', href: '#' },
    { name: 'Politique de retour', href: '#' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ];

  return (
    <footer className="bg-foreground text-background">  {/*container before mx-auto */}
      <div className="px-6 md:px-12 lg:px-20 xl:px-24 2xl:px-32 mx-auto w-full mx-auto px-4">
        {/* Main footer content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">

                  <img
    src="/Design-sans-titre-2.png"
    alt="Pro Chaudière Logo"
    className="h-14 w-auto object-contain "
  />

              </div>
              
              <p className="text-background/70 leading-relaxed mb-6 max-w-md">
                Spécialiste depuis 15 ans dans la vente de pièces détachées pour chaudières 
                de toutes marques. Qualité, rapidité et expertise à votre service.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-brand mr-3" />
                  <span className="text-background/90">0550 45 24 66 / 0550 45 24 67</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-brand mr-3" />
                  <span className="text-background/90">contact@prochaudiere.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-brand mr-3" />
                  <span className="text-background/90">Zone industrielle, France</span>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="font-semibold text-lg mb-6 text-brand">Navigation</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-background/70 hover:text-brand transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold text-lg mb-6 text-brand">Catégories</h3>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.name}>
                    <a
                      href={category.href}
                      className="text-background/70 hover:text-brand transition-colors"
                    >
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brands */}
            <div>
              <h3 className="font-semibold text-lg mb-6 text-brand">Marques</h3>
              <ul className="space-y-3">
                {brands.map((brand) => (
                  <li key={brand.name}>
                    <a
                      href={brand.href}
                      className="text-background/70 hover:text-brand transition-colors"
                    >
                      {brand.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-background/20 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Legal links */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              {legal.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-background/60 hover:text-brand transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Social links */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-background/60 mr-2">Suivez-nous :</span>
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="h-10 w-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-brand transition-colors group"
                    aria-label={social.name}
                  >
                    <IconComponent className="h-5 w-5 text-background/70 group-hover:text-white" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-background/20 text-center">
            <p className="text-sm text-background/60">
              © 2024 Pro Chaudière. Tous droits réservés. | 
              <span className="text-brand ml-1">Développé par Zebra Com</span> | 
              <span className="ml-1">Tous les droits réservés à Pro Chaudière</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;