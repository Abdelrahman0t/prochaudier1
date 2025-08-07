
import { ArrowRight, Shield, Truck, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import heroImage from "@/assets/hero-boiler.jpg";

const Hero = () => {
  const navigate = useNavigate();
  return (
<section className="relative bg-white overflow-hidden mb-4">
  {/* Top fade */}
<div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />

{/* Bottom fade */}
<div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

  {/* Pattern background */}
  <div
    className="absolute inset-0 bg-[url('/patternpng2.png')] bg-cover bg-center pointer-events-none z-0"
    style={{ opacity: 0.07 }}
  />

  {/* Geometric shapes */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-20 left-20 w-64 h-64 border-2 border-gray-300 rounded-full"></div>
    <div className="absolute bottom-32 right-16 w-48 h-48 border border-gray-200 rounded-full"></div>
    <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gray-100 rounded-2xl rotate-45"></div>
  </div>

  {/* Semi-dark overlay */}
  <div className="absolute inset-0 bg-black/5" />

  <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      
      {/* Content */}
      <div className="text-center lg:text-left animate-fade-in">
  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
    Pièces détachées pour 
    <span className="text-cyan-600 inline"> chaudières</span>
   <span className="block">de toutes marques</span>
  </h1>
  <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-xl md:mx-auto lg:mx-0">
    Commandez facilement des pièces originales pour votre chaudière. 
    Livraison rapide, qualité garantie et service client professionnel.
  </p>

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
            className="border border-gray-300 text-gray-800 bg-transparent hover:bg-gray-100 transition duration-300 text-lg px-8 py-6"
            onClick={() => navigate('/contact')}
          >
            Contacter un expert
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-700">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Truck className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <div className="font-semibold">Livraison rapide</div>
              <div className="text-sm text-gray-500">24-48h</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <div className="font-semibold">Pièces originales</div>
              <div className="text-sm text-gray-500">100% garanties</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <div className="font-semibold">Support expert</div>
              <div className="text-sm text-gray-500">7j/7</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          <img
            src={heroImage}
            alt="Chaudière moderne avec pièces détachées"
            className="w-full h-[400px] lg:h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>

        {/* Floating stats */}
        <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-xl animate-bounce-in">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-600">1000+</div>
            <div className="text-sm text-gray-600">Pièces en stock</div>
          </div>
        </div>

        <div className="absolute -top-6 -right-6 bg-white rounded-xl p-6 shadow-xl animate-bounce-in" style={{ animationDelay: '0.2s' }}>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-600">24h</div>
            <div className="text-sm text-gray-600">Livraison</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

  );
};

export default Hero;





/*
  
  
  
import { ArrowRight, Shield, Truck, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Headphones, Check, Star } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-cyan-50 text-cyan-700 rounded-full text-sm font-medium border border-cyan-200">
                  <Star className="w-4 h-4 mr-2 fill-current" />
                  #1 des pièces détachées
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Pièces détachées pour 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600"> chaudières</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  Commandez facilement des pièces originales pour votre chaudière. Livraison rapide, qualité garantie et service client professionnel.
                </p>
              </div>

    
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Parcourir les produits
                </button>
                <button className="border-2 border-cyan-600 text-cyan-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-cyan-50 transition-all duration-300 transform hover:scale-105">
                  Contacter un expert
                </button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-600">1000+</div>
                  <div className="text-sm text-gray-600">Produits disponibles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-600">24h</div>
                  <div className="text-sm text-gray-600">Livraison express</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-600">99%</div>
                  <div className="text-sm text-gray-600">Clients satisfaits</div>
                </div>
              </div>
            </div>


            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Livraison rapide</h3>
                    <p className="text-gray-600 mb-3">Recevez vos pièces détachées en express</p>
                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                      24-48h
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Pièces originales</h3>
                    <p className="text-gray-600 mb-3">Qualité constructeur certifiée</p>
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                      100% garanties
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                    <Headphones className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Support expert</h3>
                    <p className="text-gray-600 mb-3">Assistance technique professionnelle</p>
                    <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                      7j/7
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-cyan-50 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-blue-50 to-transparent opacity-30"></div>

        <div className="absolute top-20 right-20 w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-2000"></div>
        <div className="absolute bottom-32 left-16 w-4 h-4 bg-cyan-300 rounded-full animate-bounce"></div>
      </section>


      <section className="bg-gradient-to-r from-cyan-600 to-blue-600 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-white">
            <div className="flex items-center justify-center gap-3">
              <Check className="w-5 h-5" />
              <span className="font-medium">Paiement sécurisé</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Livraison 24-48h</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Garantie 2 ans</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Headphones className="w-5 h-5" />
              <span className="font-medium">Support 7j/7</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
  
  */