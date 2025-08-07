import { Star, ShoppingCart, Eye } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';

const FeaturedProducts = () => {
  const navigate = useNavigate();
const brands = [
  {
    id: 1,
    name: "Vaillant",
    description: "Chaudières et systèmes de chauffage Vaillant, technologie allemande reconnue.",
    image: "/7-1.png",
    rating: 4.8,
    reviews: 120,
    badge: "Top ventes",
  },
  {
    id: 2,
    name: "Facofri",
    description: "Modules et composants hydrauliques Facofri pour performance optimale.",
    image: "/Design-sans-titre-8.png",
    rating: 4.6,
    reviews: 98,
    badge: "Nouveau",
  },
  {
    id: 3,
    name: "Beretta",
    description: "Chaudières italiennes Beretta, fiabilité et efficacité énergétique.",
    image: "/9.png",
    rating: 4.9,
    reviews: 142,
    badge: "Circulateur star",
  },
  {
    id: 4,
    name: "Baxi",
    description: "Solutions de chauffage Baxi, innovation britannique pour votre confort.",
    image: "/6-1.png",
    rating: 4.7,
    reviews: 88,
    badge: "Top ventes",
  },
  {
    id: 5,
    name: "Ferroli",
    description: "Chaudières et systèmes Ferroli, expertise italienne depuis 1955.",
    image: "/3-1.png",
    rating: 4.5,
    reviews: 76,
    badge: "Circulateur star",
  },
  {
    id: 6,
    name: "Riello",
    description: "Brûleurs et chaudières Riello, technologie de pointe italienne.",
    image: "5-1.png",
    rating: 4.8,
    reviews: 115,
    badge: "Garantie 2 ans",
  },
  {
    id: 7,
    name: "Ariston",
    description: "Systèmes de chauffage Ariston, confort et économie d'énergie.",
    image: "/2-1.png",
    rating: 4.6,
    reviews: 101,
    badge: "Nouveau",
  },
  {
    id: 8,
    name: "Chaffoteaux",
    description: "Chaudières Chaffoteaux, tradition française et innovation moderne.",
    image: "/4-1.png",
    rating: 4.4,
    reviews: 66,
    badge: "Nouveau",
  },
];

  return (
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Marques populaires
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explorez les pièces détachées les plus demandées des grandes marques de chaudières.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.map((brand, index) => (
            <Card
              key={brand.id}
              className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 hover-lift overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden p-4">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badge */}
{/* Badge */}
{brand.badge && (
  <div className="absolute top-3 left-3">
<Badge
  className={
    (brand.badge.toLowerCase().includes("nouveau")
      ? "bg-green-500"
      : brand.badge.toLowerCase().includes("circulateur")
      ? "bg-yellow-500"
      : "bg-blue-500") +
    " text-white pointer-events-none group-hover:scale-100 group-hover:shadow-none transition-none"
  }
>
  {brand.badge}
</Badge>

  </div>
)}


                
                {/* Quick view */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="h-8 w-8 p-0"
                    onClick={() => navigate(`/products?brand=${brand.name.toLowerCase()}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-base mb-1 group-hover:text-brand transition-colors">
                  {brand.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {brand.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(brand.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({brand.reviews})
                  </span>
                </div>

                <Button className="w-full" variant="outline">
                  Voir les produits
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            className="bg-cyan-600 text-white hover:bg-cyan-700 shadow-lg text-lg px-8 py-6"
            onClick={() => navigate('/products')}
          >
            Voir toutes les marques
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
