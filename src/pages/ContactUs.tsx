import { Phone, Mail, MessageCircle, Clock, MapPin, Send } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Ticket created:", formData);
    alert("Votre ticket a été envoyé !");
    setFormData({ firstName: "", lastName: "", email: "", message: "" });
  };

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
      primary: "tboody23456@gmail.com",
      secondary: "Réponse sous 2h",
      description: "Support technique disponible",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      action: "Envoyer un email",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      primary: "0550 45 24 66",
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
    <div>
      <Header />
      <section id="contact" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prenez contact
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Notre équipe d'experts est à votre disposition pour vous conseiller
              et vous accompagner dans le choix de vos pièces détachées.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card
                  key={method.title}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-white"
                >
                  <CardContent className="p-8 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${method.bgColor} mb-6 group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`h-8 w-8 ${method.color}`} />
                    </div>
                    <h3 className="font-bold text-xl mb-4">{method.title}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="font-semibold text-lg">{method.primary}</div>
                      <div className="text-sm text-muted-foreground">{method.secondary}</div>
                      <div className="text-sm text-muted-foreground">{method.description}</div>
                    </div>
                    <Button 
                      className="w-full border-2 border-blue-100" 
                      variant="outline"
                      onClick={() => {
                        if (method.title === "Téléphone") {
                          window.location.href = `tel:${method.primary.replace(/\s+/g, '')}`;
                        } else if (method.title === "Email") {
                          window.location.href = `mailto:${method.primary}`;
                        } else if (method.title === "WhatsApp") {
                          // Convert French phone number to international format for WhatsApp
                          const phoneNumber = method.primary.replace(/\s+/g, '').replace(/^0/, '33');
                          window.open(`https://wa.me/${phoneNumber}`, '_blank');
                        }
                      }}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Working hours & Location */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
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
                <div className="mb-4">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1597.7592543287128!2d2.9817415975532704!3d36.78211671038063!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb13379f87abf%3A0xc4b9f5fe0e4d3d00!2sParagon%20Reisen!5e0!3m2!1sfr!2sdz!4v1754693175938!5m2!1sfr!2sdz"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ticket creation form */}
          <Card className="border-0 shadow-lg bg-white max-w-8xl w-full mx-auto">
            <CardContent className="p-8">
              <h3 className="font-bold text-2xl mb-6 text-center">Créer un ticket</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Prénom"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="border p-3 rounded-md w-full"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Nom"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="border p-3 rounded-md w-full"
                    required
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border p-3 rounded-md w-full"
                  required
                />
                <textarea
                  name="message"
                  placeholder="Votre message"
                  value={formData.message}
                  onChange={handleChange}
                  className="border p-3 rounded-md w-full h-32"
                  required
                ></textarea>
                <Button type="submit" className="bg-cyan-600 text-white hover:bg-cyan-700 shadow-lg text-lg px-8 py-6 w-full">Envoyer</Button>
              </form>
            </CardContent>
          </Card>

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
      <Footer />
    </div>
  );
};

export default ContactUs;