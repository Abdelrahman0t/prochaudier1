import { Shield, Truck, Clock, CreditCard, Users, Award } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const WhyChooseUs = () => {
  const features = [
    {
      icon: Truck,
      title: "Livraison rapide",
      description: "Expédition sous 24h pour tous les produits en stock. Livraison gratuite dès 150€ d'achat.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Shield,
      title: "Pièces 100% originales",
      description: "Toutes nos pièces sont certifiées et garanties par les fabricants. Authenticité garantie.",
      color: "text-green-600", 
      bgColor: "bg-green-50",
    },
    {
      icon: Users,
      title: "Service client professionnel",
      description: "Notre équipe d'experts vous conseille et vous accompagne dans le choix de vos pièces.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: CreditCard,
      title: "Paiement sécurisé",
      description: "Transactions 100% sécurisées. Paiement par carte bancaire, PayPal ou virement.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Clock,
      title: "Support 7j/7",
      description: "Disponible par téléphone, email ou WhatsApp pour répondre à toutes vos questions.",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      icon: Award,
      title: "15 ans d'expérience",
      description: "Spécialiste reconnu dans le domaine des pièces détachées pour chaudières depuis 2009.",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pourquoi choisir Pro Chaudière ?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Faites confiance à notre expertise et bénéficiez d'un service de qualité
            pour tous vos besoins en pièces détachées de chaudières.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={feature.title}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift bg-white/90 backdrop-blur-sm group"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`h-10 w-10 ${feature.color}`} />
                  </div>
                  
                  <h3 className="font-bold text-xl mb-4 group-hover:text-brand transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats section */}
        <div className="mt-20 bg-brand/5 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold text-brand mb-2 group-hover:scale-110 transition-transform">
                1000+
              </div>
              <div className="text-muted-foreground font-medium">
                Pièces en stock
              </div>
            </div>
            
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold text-brand mb-2 group-hover:scale-110 transition-transform">
                5000+
              </div>
              <div className="text-muted-foreground font-medium">
                Clients satisfaits
              </div>
            </div>
            
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold text-brand mb-2 group-hover:scale-110 transition-transform">
                24h
              </div>
              <div className="text-muted-foreground font-medium">
                Délai de livraison
              </div>
            </div>
            
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold text-brand mb-2 group-hover:scale-110 transition-transform">
                15ans
              </div>
              <div className="text-muted-foreground font-medium">
                D'expérience
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;