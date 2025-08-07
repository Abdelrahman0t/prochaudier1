import { Mail, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate subscription
    setIsSubscribed(true);
    toast({
      title: "Inscription réussie !",
      description: "Vous allez recevoir notre newsletter avec les dernières nouveautés.",
    });
    
    setTimeout(() => {
      setIsSubscribed(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section className="py-20 bg-brand/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Content */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-brand/10 rounded-2xl mb-4">
                    <Mail className="h-8 w-8 text-brand" />
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Restez informé des nouveautés
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    Inscrivez-vous à notre newsletter et recevez toute l'actualité sur nos 
                    promotions et nouvel arrivage de pièces détachées.
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success mr-3" />
                    <span className="text-sm">Promotions exclusives</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success mr-3" />
                    <span className="text-sm">Nouveaux produits en avant-première</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success mr-3" />
                    <span className="text-sm">Conseils techniques d'experts</span>
                  </div>
                </div>

                {/* Form */}
                {!isSubscribed ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="email"
                        placeholder="Votre adresse email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1"
                        required
                      />
                      <Button 
                        type="submit" 
                        className="bg-brand hover:bg-brand-dark px-8"
                      >
                        S'inscrire
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Vous pouvez vous désinscrire à tout moment. Consulter notre{' '}
                      <a href="#" className="text-brand hover:underline">
                        politique de confidentialité
                      </a>
                      .
                    </p>
                  </form>
                ) : (
                  <div className="flex items-center space-x-3 p-4 bg-success/10 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-success" />
                    <div>
                      <p className="font-semibold text-success">Inscription réussie !</p>
                      <p className="text-sm text-muted-foreground">
                        Vérifiez votre boîte email.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Visual */}
              <div className="bg-gradient-primary p-8 md:p-12 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 text-center text-white">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="h-12 w-12 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Newsletter Pro Chaudière</h4>
                  <p className="text-white/90 text-sm">
                    Rejoignez plus de 2000 professionnels qui nous font confiance
                  </p>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/5 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;