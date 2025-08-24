import { ArrowRight,Phone, Mail, MapPin, Clock, Shield, Users, Truck, Award, Star, Wrench, CheckCircle, Zap, Headphones, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import StatsSection from "@/components/StatsSection";

const APropos = () => {
  const values = [
    {
      icon: <Truck className="h-8 w-8 text-blue-600" />,
      title: "Livraison rapide",
      description: "Expédition sous 24h pour tous les produits en stock. Livraison gratuite dès 150€ d'achat."
    },
    {
      icon: <Shield className="h-8 w-8 text-cyan-600" />,
      title: "Pièces 100% originales",
      description: "Toutes nos pièces sont certifiées et garanties par les fabricants. Authenticité garantie."
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      title: "Service client professionnel",
      description: "Notre équipe d'experts vous conseille et vous accompagne dans le choix de vos pièces."
    },
    {
      icon: <Award className="h-8 w-8 text-purple-600" />,
      title: "Expérience depuis 2023",
      description: "Spécialiste reconnu dans le domaine des pièces détachées pour chaudières depuis 2009."
    }
  ];

  const expertiseItems = [
    {
      icon: <CheckCircle className="h-6 w-6 text-indigo-600" />,
      title: "Pièces 100% originales et certifiées"
    },
    {
      icon: <Zap className="h-6 w-6 text-pink-600" />,
      title: "Livraison rapide sous 24-48h"
    },
    {
      icon: <Headphones className="h-6 w-6 text-purple-600" />,
      title: "Support technique professionnel"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
      title: "Garantie sur tous nos produits"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Background */}
<section 
  className="py-20 md:py-28 relative bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.45)), url(/big_boiler1.jpg)`
  }}
>
  <div className="container mx-auto px-6 lg:px-12 relative z-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      
      {/* Left Side Text */}
      <div className="max-w-xl">
        <span className="inline-block mb-4 px-4 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs sm:text-sm md:text-base font-medium">
          Expertise en chauffage depuis 2023
        </span>
        
        <h1 className="font-bold tracking-tight text-white mb-6 leading-tight text-[clamp(2rem,5vw,3.5rem)]">
          Pièces détachées de chaudières, <br />
          <span className="text-cyan-600">livrées rapidement</span> et garanties.
        </h1>
        
        <p className="text-white/80 mb-8 leading-relaxed text-[clamp(1rem,2.5vw,1.25rem)]">
          Pro Chaudière est votre partenaire de confiance pour toutes les marques.  
          Nos pièces sont 100% originales, testées, et prêtes à redonner vie à votre installation.
        </p>
        
{/* Buttons */}
<div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center md:items-center md:justify-center lg:justify-start lg:items-start text-center md:text-center lg:text-left">
  <Button 
    size="lg" 
    className="bg-cyan-600 text-white hover:bg-cyan-700 shadow-lg text-lg px-8 py-6"
    onClick={() => navigate('/products')}
  >
    Parcourir les produits
    <ArrowRight className="ml-2 h-5 w-5" />
  </Button>
  
  <Button 
    size="lg" 
    className="border border-gray-300 text-gray-800 bg-white hover:bg-gray-100 transition duration-300 text-lg px-8 py-6"
    onClick={() => navigate('/contact')}
  >
    Contacter un expert
  </Button>
</div>

        
        {/* Trust Signals */}
        <div className="mt-8 flex flex-wrap gap-6 items-center text-white/70 text-[clamp(0.8rem,1.5vw,0.95rem)]">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Livraison rapide
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Garantie 2 ans
          </div>
        </div>
      </div>
      
      {/* Right Side Visual */}
{/* Right Side Visual */}
<div className="hidden lg:flex justify-center">
  <div className="aspect-square w-full max-w-xl">
    <img 
      src="/blackOne.jpg"
      alt="Pièces de chaudières"
      className="w-full h-full object-cover rounded-2xl shadow-2xl border border-white/10"
    />
  </div>
</div>

    </div>
  </div>
</section>



      <StatsSection />

      {/* Notre Mission with Image */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Notre mission
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Fort d’une expérience débutée en 2002 dans l’installation de chauffage,
                 la plomberie et la réparation de chaudières, nous avons fondé Prochaudiere pour mettre ce savoir-faire au service de nos clients. 
                 Basés à Alger, nous proposons des pièces détachées originales toutes marques, 
                 un service après-vente agréé Facofri et un accompagnement technique fiable pour particuliers et professionnels.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Nous travaillons exclusivement avec des fabricants reconnus pour garantir l'authenticité 
                et la qualité de chaque pièce que nous vendons. Notre stock de plus de 1000 références 
                nous permet de répondre rapidement à vos demandes.
              </p>
              <div className="bg-brand-blue-light p-4 rounded-lg">
                <p className="text-primary font-medium">
                  "Votre satisfaction est notre priorité. Nous mettons tout en œuvre pour vous offrir 
                  un service d'excellence."
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src='https://bcrcheating.com/wp-content/uploads/2023/10/service-img-1-1024x427.jpg' 
                alt="Technicien professionnel travaillant sur des pièces de chaudière" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Expertise with Background and Icons */}
      <section 
        className="py-16 relative bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url(/fixing.jpg)` 
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">Notre expertise</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Avec plus de 1000 pièces en stock et un entrepôt moderne, nous garantissons 
              la disponibilité et la qualité de nos produits.
            </p>
            <div className="grid md:grid-cols-4 gap-6 mt-12">
              {expertiseItems.map((item, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Pourquoi choisir Pro Chaudière ?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Faites confiance à notre expertise et bénéficiez d'un service de qualité pour tous 
              vos besoins en pièces détachées de chaudières.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Notre Équipe with Background */}
      <section 
        className="py-16 relative bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6)), url('/blackOne.jpg')` 
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Notre équipe d'experts
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              Une équipe passionnée et expérimentée à votre service pour vous conseiller 
              et vous accompagner dans tous vos projets de chauffage.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">Experts techniques</h3>
              <p className="text-white/80 text-sm">
                Nos techniciens certifiés vous guident dans le choix des bonnes pièces
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">Service client</h3>
              <p className="text-white/80 text-sm">
                Une équipe dédiée pour répondre à toutes vos questions rapidement
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">Conseillers experts</h3>
              <p className="text-white/80 text-sm">
                Des spécialistes pour vous accompagner dans vos projets
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-lg text-white/90 mb-4 italic">
                "Service exceptionnel ! L'équipe Pro Chaudière a su nous conseiller parfaitement 
                et nous avons reçu nos pièces en moins de 24h. Je recommande vivement !"
              </blockquote>
              <p className="text-white/70 text-sm">
                Marie D. - Chauffagiste professionnelle
              </p>
            </div>
          </div>
        </div>
      </section>


            <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Phone className="h-8 w-8 text-brand-green mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Téléphone</h3>
                <p className="text-primary font-medium">0550 45 24 66</p>
                <p className="text-sm text-muted-foreground">0550 45 24 67</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Lun-Ven: 8h-18h, Sam: 9h-12h
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <p className="text-primary font-medium">contact@prochaudiere.com</p>
                <p className="text-sm text-muted-foreground">Réponse sous 2h</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Support technique disponible
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
<MapPin className="h-8 w-8 text-brand-orange mx-auto mb-4" />
<h3 className="font-semibold text-foreground mb-2">Notre localisation</h3>
<p className="text-sm text-muted-foreground">Siège social</p>
<p className="text-sm text-muted-foreground">Douera, Alger</p>
<p className="text-sm text-muted-foreground">Algérie</p>
<p className="text-xs text-muted-foreground mt-2">
  92 Salem Madani, N°11 bis 01, RDC
</p>

              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default APropos;