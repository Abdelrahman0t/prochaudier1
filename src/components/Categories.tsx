import { Wrench } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const navigate = useNavigate();
  
  const categories = [
    {
      name: "Carte électronique",
      slug: "carte-electronique",
      count: "17 produits",
      image: "/cate_icones/motherboard.png",

    },
    {
      name: "Modules Hydrauliques",
      slug: "modules-hydraulyques",
      count: "24 produits",
      image: "/cate_icones/hydraulic-energy.png",

    },
    {
      name: "Pompe",
      slug: "pompe",
      count: "19 produits",
      image: "/cate_icones/revolve.png",

    },
    {
      name: "Vannes 3 voies",
      slug: "vannes-3-voies",
      count: "16 produits",
      image: "/cate_icones/pipe.png",

    },
    {
      name: "Capteur",
      slug: "capteur",
      count: "11 produits",
      image: "/cate_icones/temperature-sensor.png",

    },
    {
      name: "ÉCHANGEURS",
      slug: "echangeurs",
      count: "15 produits",
      image: "/cate_icones/data.png",

    },
    {
      name: "Ventilateurs chaudière",
      slug: "ventilateurs-chaudiere",
      count: "7 produits",
      image: "/cate_icones/fan.png",

    },
    {
      name: "Soupape chaudière",
      slug: "soupape-chaudiere",
      count: "6 produits",
      image: "/cate_icones/pressure-gauge.png",
    // pink-600

    },
  ];

  const handleCategoryClick = (category) => {
    navigate(`/breadProduct?categories=${category.slug}`);
  };

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
          {categories.map((category, index) => (
            <Card
              key={category.name}
              className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 hover-lift bg-white/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleCategoryClick(category)}
            >
              <CardContent className="p-6 text-center">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: category.bgColor }}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-16 w-16 object-contain"
                    style={{ filter: `drop-shadow(0 0 2px ${category.color})` }}
                  />
                </div>
                
                <h3 className="font-semibold text-lg mb-2 group-hover:text-brand transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-muted-foreground text-sm">
                  {category.count}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            className="inline-flex items-center text-brand font-semibold hover:text-brand-dark transition-colors"
            onClick={() => navigate('/categorypage')}
          >
            Voir toutes les catégories
            <Wrench className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;