import { Wrench, Zap, Droplets, Gauge, Filter, Settings, Flame, Shield } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const Categories = () => {
  const categories = [
    {
      name: "Cartes électroniques",
      count: "17 produits",
      icon: Zap,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "Modules Hydrauliques",
      count: "24 produits", 
      icon: Droplets,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      name: "Pompes",
      count: "19 produits",
      icon: Settings,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Vannes 3 voies",
      count: "16 produits",
      icon: Wrench,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      name: "Capteurs",
      count: "11 produits",
      icon: Gauge,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      name: "Échangeurs",
      count: "9 produits",
      icon: Filter,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      name: "Ventilateurs",
      count: "7 produits",
      icon: Flame,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      name: "Soupapes",
      count: "6 produits",
      icon: Shield,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <section id="categories" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Catégories de pièces détachées
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trouvez facilement la pièce qu'il vous faut parmi nos catégories organisées
            pour toutes les marques de chaudières.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card
                key={category.name}
                className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 hover-lift bg-white/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${category.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`h-8 w-8 ${category.color}`} />
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-brand transition-colors">
                    {category.name}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm">
                    {category.count}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center text-brand font-semibold hover:text-brand-dark transition-colors">
            Voir toutes les catégories
            <Wrench className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;