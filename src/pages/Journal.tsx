import { Search, Filter, TrendingUp, Video, Wrench, Youtube, Instagram, Facebook, Twitter, Play, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import VideoCard from "@/components/VideoCard";

import heroJournal from "@/assets/hero-journal.jpg";
import installationVideo from "@/assets/installation-video.jpg";
import troubleshooting from "@/assets/troubleshooting.jpg";
import seasonalMaintenance from "@/assets/seasonal-maintenance.jpg";
import repairGuide from "@/assets/repair-guide.jpg";

const Journal = () => {
  const featuredVideos = [
    {
      title: "Installation complète d'une chaudière à gaz moderne",
      thumbnail: 'installationVideo',
      duration: "15:30",
      views: "12.5K",
      category: "Installation",
      description: "Guide étape par étape pour l'installation d'une chaudière à gaz, incluant les normes de sécurité et les bonnes pratiques."
    },
    {
      title: "Diagnostic et dépannage des pannes courantes",
      thumbnail: 'troubleshooting',
      duration: "22:15",
      views: "8.9K",
      category: "Dépannage",
      description: "Apprenez à diagnostiquer et résoudre les problèmes les plus fréquents sur les chaudières domestiques."
    },
    {
      title: "Maintenance préventive avant l'hiver",
      thumbnail: 'seasonalMaintenance',
      duration: "18:45",
      views: "15.2K",
      category: "Maintenance",
      description: "Checklist complète pour préparer votre chaudière avant la saison de chauffe hivernale."
    }
  ];

  const categories = ["Tous", "Installation", "Maintenance", "Dépannage", "Réparation", "Efficacité"];

  const socialLinks = [
    { name: "YouTube", icon: Youtube, followers: "12.5K", color: "bg-red-500", link: "#" },
    { name: "Instagram", icon: Instagram, followers: "8.2K", color: "bg-pink-500", link: "#" },
    { name: "Facebook", icon: Facebook, followers: "15.1K", color: "bg-blue-600", link: "#" },
    { name: "Twitter", icon: Twitter, followers: "6.8K", color: "bg-blue-400", link: "#" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <img 
          src={'/blackOne2.jpg'} 
          alt="Journal Pro Chaudière - Tutoriels Vidéo"
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="text-white max-w-3xl animate-fade-in">
              <div className="mb-6">
                <Badge className="bg-primary/20 border-primary/30 text-white backdrop-blur-sm mb-4">
                  Nouveau • Formation Professionnelle
                </Badge>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Tutoriels Vidéo Pro
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
                Maîtrisez l'installation, la maintenance et la réparation de chaudières grâce à nos tutoriels vidéo experts. 
                <span className="block mt-2 text-primary/90">Formation pratique par des professionnels.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <Play className="mr-2 h-5 w-5" />
                  Regarder maintenant
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all duration-300">
                  <Users className="mr-2 h-5 w-5" />
                  Rejoindre la communauté
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16 -mt-20 relative z-10">
          <Card className="text-center p-8 bg-card/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 group">
            <div className="bg-gradient-to-br from-primary/20 to-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Video className="h-8 w-8 text-primary" />
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">150+</div>
            <div className="text-muted-foreground font-medium">Tutoriels vidéo</div>
          </Card>
          <Card className="text-center p-8 bg-card/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 group">
            <div className="bg-gradient-to-br from-primary/20 to-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Play className="h-8 w-8 text-primary" />
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">500K+</div>
            <div className="text-muted-foreground font-medium">Vues totales</div>
          </Card>
          <Card className="text-center p-8 bg-card/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 group">
            <div className="bg-gradient-to-br from-primary/20 to-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Wrench className="h-8 w-8 text-primary" />
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">300+</div>
            <div className="text-muted-foreground font-medium">Techniques couvertes</div>
          </Card>
          <Card className="text-center p-8 bg-card/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 group">
            <div className="bg-gradient-to-br from-primary/20 to-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">25K+</div>
            <div className="text-muted-foreground font-medium">Abonnés formés</div>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher une vidéo..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filtres avancés
          </Button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((category) => (
            <Badge 
              key={category}
              variant={category === "Tous" ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-6 py-2 text-sm"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Featured Videos Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
              Contenu Premium
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Vidéos en vedette
            </h2>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Découvrez nos tutoriels les plus populaires, conçus par des experts pour vous accompagner dans tous vos projets. 
              <span className="block mt-2 text-primary">Formation pratique garantie.</span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredVideos.map((video, index) => (
              <div key={index} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <VideoCard {...video} />
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-12 py-4 text-lg">
              <Video className="mr-3 h-6 w-6" />
              Voir toute la bibliothèque
              <span className="ml-2">→</span>
            </Button>
          </div>
        </div>

        {/* Social Media Section */}
        <section className="mb-16 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Suivez-nous sur les réseaux</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Rejoignez notre communauté de professionnels et restez informé des dernières techniques et nouveautés
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <Card key={social.name} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${social.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{social.name}</h4>
                    <p className="text-muted-foreground text-sm mb-1">{social.followers} abonnés</p>
                    <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Suivre
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-4">Newsletter Professionnelle</h3>
            <p className="text-muted-foreground mb-6 text-lg">
              Recevez chaque semaine nos nouveaux tutoriels, conseils d'experts et actualités du secteur directement dans votre boîte mail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Votre adresse email professionnelle"
                className="flex-1"
              />
              <Button className="bg-primary hover:bg-primary/90 px-6">
                S'abonner
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Plus de 8000 professionnels nous font déjà confiance • Désinscription facile
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Journal;