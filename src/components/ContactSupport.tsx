import { Phone, Mail, MessageCircle, Clock, MapPin, Send } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ContactSupport = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: "Téléphone",
      primary: "0550 45 24 66",
      secondary: "0550 45 24 67",
      description: "Lun-Ven: 8h-18h, Sam: 9h-12h",
      color: "text-green-600",
      bgColor: "bg-green-50",
      action: "Appeler maintenant",
    },
    {
      icon: Mail,
      title: "Email",
      primary: "contact@prochaudiere.com",
      secondary: "Réponse sous 2h",
      description: "Support technique disponible",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      action: "Envoyer un email",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      primary: "Chat en direct",
      secondary: "Réponse immédiate",
      description: "Service client instantané",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      action: "Ouvrir WhatsApp",
    },
  ];

  const workingHours = [
    { day: "Lundi - Vendredi", hours: "8h00 - 18h00" },
    { day: "Samedi", hours: "9h00 - 12h00" },
    { day: "Dimanche", hours: "Fermé" },
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Contact & Support
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Notre équipe d'experts est à votre disposition pour vous conseiller
            et vous accompagner dans le choix de vos pièces détachées.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <Card
                key={method.title}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift group bg-white"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${method.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`h-8 w-8 ${method.color}`} />
                  </div>
                  
                  <h3 className="font-bold text-xl mb-4 group-hover:text-brand transition-colors">
                    {method.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="font-semibold text-lg text-foreground">
                      {method.primary}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {method.secondary}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {method.description}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    variant="outline"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional info section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Working hours */}
          <Card className="border-0 shadow-lg bg-brand/5">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand/10 mr-4">
                  <Clock className="h-6 w-6 text-brand" />
                </div>
                <h3 className="font-bold text-xl">Horaires d'ouverture</h3>
              </div>
              
              <div className="space-y-3">
                {workingHours.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                    <span className="font-medium">{item.day}</span>
                    <span className="text-brand font-semibold">{item.hours}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="border-0 shadow-lg bg-secondary/50">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand/10 mr-4">
                  <MapPin className="h-6 w-6 text-brand" />
                </div>
                <h3 className="font-bold text-xl">Notre localisation</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-foreground mb-2">Siège social</p>
                  <p className="text-muted-foreground">
                    Zone industrielle<br />
                    France<br />
                  </p>
                </div>
                
                <div className="pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground mb-3">
                    Livraison dans toute la France métropolitaine et DOM-TOM
                  </p>
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    Voir sur la carte
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency contact */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center justify-center bg-destructive/10 text-destructive px-6 py-3 rounded-xl">
            <Phone className="h-5 w-5 mr-2" />
            <span className="font-semibold">
              Urgence ? Appelez le 0550 45 24 66 - Support 7j/7
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSupport;