import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Michel D.",
      location: "Lyon",
      rating: 5,
      text: "Service impeccable ! J'ai reçu ma pièce en 24h comme promis. L'équipe m'a parfaitement conseillé pour ma chaudière Saunier Duval. Je recommande vivement.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      verified: true,
    },
    {
      id: 2,
      name: "Sophie L.",
      location: "Paris",
      rating: 5,
      text: "Excellente expérience ! La pièce était parfaitement compatible avec ma chaudière Beretta. Prix compétitif et livraison ultra rapide. Merci Pro Chaudière !",
      avatar: "https://i.pinimg.com/236x/db/1f/9a/db1f9a3eaca4758faae5f83947fa807c.jpg",
      verified: true,
    },
    {
      id: 3,
      name: "Jean-Paul M.",
      location: "Marseille", 
      rating: 5,
      text: "15 ans que je fais confiance à Pro Chaudière. Toujours des pièces de qualité et un service client au top. C'est rare de nos jours !",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      verified: true,
    },
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez les avis de nos clients satisfaits qui nous font confiance
            pour leurs pièces détachées de chaudières.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift bg-white/90 backdrop-blur-sm relative overflow-hidden"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Decorative quote */}
              <div className="absolute top-4 right-4 opacity-10">
                <Quote className="h-16 w-16 text-brand" />
              </div>

              <CardContent className="p-8 relative z-10">
                {/* Rating */}
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial text */}
                <blockquote className="text-muted-foreground leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </blockquote>

                {/* Author info */}
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-foreground flex items-center">
                      {testimonial.name}
                      {testimonial.verified && (
                        <span className="ml-2 text-brand">✓</span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg">
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-brand">4.8/5</div>
                <div className="text-sm text-muted-foreground">Note moyenne</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-brand">500+</div>
                <div className="text-sm text-muted-foreground">Avis clients</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-brand">98%</div>
                <div className="text-sm text-muted-foreground">Recommandent</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;