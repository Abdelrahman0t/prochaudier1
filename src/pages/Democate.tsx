import React, { useState } from 'react';
import { ChevronRight, Flame, Settings, Wrench, Zap, Search, ArrowRight, Star, Eye, Grid, Package, Filter, ArrowLeft, Thermometer, Droplets, ShoppingCart, Users } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const CategoriesBrandsPage = () => {
  const [currentView, setCurrentView] = useState('categories'); // 'categories' or 'brands'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentView('brands');
    setSelectedSubCategory(null);
  };

  const handleBrandClick = (brand, categoryName) => {
    console.log(`Navigating to products for brand: ${brand} in category: ${categoryName}`);
    window.location.href = `/products?brand=${encodeURIComponent(brand)}&category=${encodeURIComponent(categoryName)}`;
  };

  // Scalable categories data - all using consistent styling
  const categoriesData = [
    {
      id: 1,
      name: "Chaudières au sol",
      icon: Flame,
      description: "Solutions de chauffage au sol professionnelles et économiques",
      productCount: 145,
      subCategories: [
        { name: "Chaudières gaz condensation", count: 45 },
        { name: "Chaudières fioul", count: 32 },
        { name: "Chaudières bois", count: 28 },
        { name: "Chaudières électriques", count: 40 }
      ],
      brands: [
        {
          name: "BAXI",
          description: "Solutions de chauffage Baxi, innovation britannique pour votre confort thermique optimal.",
          rating: 4.5,
          reviewCount: 120,
          badge: { text: "Top ventes", color: "primary" },
          productCount: 32,
          priceRange: "3400 - 8500 DZD",
          inStock: true
        },
        {
          name: "Vaillant",
          description: "Chaudières et systèmes de chauffage Vaillant, technologie allemande reconnue mondialement.",
          rating: 4.6,
          reviewCount: 89,
          badge: { text: "Nouveau", color: "success" },
          productCount: 28,
          priceRange: "4200 - 9800 DZD",
          inStock: true
        },
        {
          name: "Facofri",
          description: "Modules et composants hydrauliques Facofri pour performance optimale de vos installations.",
          rating: 4.3,
          reviewCount: 76,
          badge: { text: "Recommandé", color: "warning" },
          productCount: 45,
          priceRange: "2800 - 6500 DZD",
          inStock: true
        },
        {
          name: "Beretta",
          description: "Chaudières italiennes Beretta, fiabilité et efficacité énergétique depuis des décennies.",
          rating: 4.4,
          reviewCount: 142,
          badge: { text: "Top ventes", color: "primary" },
          productCount: 40,
          priceRange: "3600 - 7800 DZD",
          inStock: true
        }
      ]
    },
    {
      id: 2,
      name: "Chaudières murales",
      icon: Settings,
      description: "Large gamme de chaudières murales haute performance et compactes",
      productCount: 230,
      subCategories: [
        { name: "Chaudières gaz murales", count: 85 },
        { name: "Chaudières condensation", count: 67 },
        { name: "Chaudières mixtes", count: 45 },
        { name: "Chaudières ventouse", count: 33 }
      ],
      brands: [
        {
          name: "Ferroli",
          description: "Chaudières et systèmes Ferroli, expertise italienne moderne depuis 1955 avec innovation constante.",
          rating: 4.1,
          reviewCount: 78,
          badge: { text: "Qualité Pro", color: "warning" },
          productCount: 65,
          priceRange: "4500 - 12000 DZD",
          inStock: true
        },
        {
          name: "RIELLO",
          description: "Brûleurs et chaudières Riello, technologie de pointe italienne reconnue internationalement.",
          rating: 4.3,
          reviewCount: 115,
          badge: { text: "Garantie 2 ans", color: "primary" },
          productCount: 58,
          priceRange: "5800 - 15000 DZD",
          inStock: true
        },
        {
          name: "ARISTON",
          description: "Systèmes de chauffage Ariston, confort et économie d'énergie pour tous vos besoins.",
          rating: 4.2,
          reviewCount: 101,
          badge: { text: "Nouveau", color: "success" },
          productCount: 72,
          priceRange: "3900 - 11500 DZD",
          inStock: true
        }
      ]
    },
    {
      id: 3,
      name: "Pièces détachées",
      icon: Wrench,
      description: "Composants et pièces de rechange originales pour tous types de chaudières",
      productCount: 520,
      subCategories: [
        { name: "Brûleurs et électrodes", count: 145 },
        { name: "Échangeurs thermiques", count: 89 },
        { name: "Vannes et régulation", count: 123 },
        { name: "Circulateurs", count: 87 },
        { name: "Soupapes sécurité", count: 76 }
      ],
      brands: [
        {
          name: "Chappee",
          description: "Pièces détachées originales Chappée, qualité et fiabilité garanties pour durabilité maximale.",
          rating: 4.4,
          reviewCount: 94,
          badge: { text: "Pièces originales", color: "success" },
          productCount: 180,
          priceRange: "850 - 4500 DZD",
          inStock: true
        },
        {
          name: "DE DIETRICH",
          description: "Composants De Dietrich, expertise française depuis 1684, tradition et innovation réunies.",
          rating: 4.5,
          reviewCount: 128,
          badge: { text: "Livraison rapide", color: "primary" },
          productCount: 165,
          priceRange: "1200 - 6800 DZD",
          inStock: true
        },
        {
          name: "Saunier Duval",
          description: "Pièces détachées Saunier Duval pour maintenir vos équipements en parfait état de fonctionnement.",
          rating: 4.2,
          reviewCount: 87,
          badge: { text: "Top ventes", color: "primary" },
          productCount: 95,
          priceRange: "950 - 3800 DZD",
          inStock: true
        }
      ]
    },
    {
      id: 4,
      name: "Pompes & Circulateurs",
      icon: Zap,
      description: "Circulateurs haute efficacité énergétique pour optimiser vos installations",
      productCount: 85,
      subCategories: [
        { name: "Circulateurs électroniques", count: 35 },
        { name: "Pompes de charge", count: 25 },
        { name: "Accélérateurs", count: 15 },
        { name: "Accessoires pompes", count: 10 }
      ],
      brands: [
        {
          name: "Grundfos",
          description: "Pompes et circulateurs Grundfos, leader mondial des solutions de pompage et circulation d'eau.",
          rating: 4.7,
          reviewCount: 156,
          badge: { text: "Leader mondial", color: "primary" },
          productCount: 45,
          priceRange: "2800 - 8500 DZD",
          inStock: true
        },
        {
          name: "Wilo",
          description: "Circulateurs haute efficacité énergétique Wilo, innovation allemande pour économies d'énergie.",
          rating: 4.5,
          reviewCount: 98,
          badge: { text: "Économie énergie", color: "success" },
          productCount: 40,
          priceRange: "3200 - 9200 DZD",
          inStock: true
        }
      ]
    },
    // Example of how easy it is to add more categories
    {
      id: 5,
      name: "Radiateurs & Émetteurs",
      icon: Thermometer,
      description: "Radiateurs et systèmes d'émission de chaleur haute performance",
      productCount: 320,
      subCategories: [
        { name: "Radiateurs acier", count: 120 },
        { name: "Radiateurs aluminium", count: 85 },
        { name: "Radiateurs fonte", count: 65 },
        { name: "Sèche-serviettes", count: 50 }
      ],
      brands: [
        {
          name: "Acova",
          description: "Radiateurs et sèche-serviettes Acova, design français et performance énergétique.",
          rating: 4.3,
          reviewCount: 142,
          badge: { text: "Design français", color: "primary" },
          productCount: 95,
          priceRange: "1200 - 4500 DZD",
          inStock: true
        }
      ]
    },
    {
      id: 6,
      name: "Plomberie & Sanitaire",
      icon: Droplets,
      description: "Équipements de plomberie et solutions sanitaires complètes",
      productCount: 180,
      subCategories: [
        { name: "Robinetterie", count: 65 },
        { name: "Évacuation", count: 45 },
        { name: "Alimentation", count: 40 },
        { name: "Accessoires", count: 30 }
      ],
      brands: [
        {
          name: "Grohe",
          description: "Robinetterie et solutions sanitaires Grohe, qualité allemande premium.",
          rating: 4.6,
          reviewCount: 98,
          badge: { text: "Qualité premium", color: "primary" },
          productCount: 78,
          priceRange: "890 - 3200 DZD",
          inStock: true
        }
      ]
    }
  ];

  const getBadgeColors = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-cyan-500 text-white';
      case 'success':
        return 'bg-green-500 text-white';
      case 'warning':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.floor(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-2">({rating})</span>
      </div>
    );
  };

  const filteredCategories = categoriesData.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.brands.some(brand => brand.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const CategoriesView = () => (
    <div>
      <Header />
      {/* Hero Section - Consistent Styling */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Nos Catégories</h1>
            <p className="text-xl text-slate-200 mb-10 max-w-3xl mx-auto">
              Découvrez plus de <span className="text-cyan-400 font-semibold">1000 produits</span> répartis dans nos catégories spécialisées pour vos installations de chauffage
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher une catégorie ou marque..."
                className="block w-full pl-14 pr-6 py-4 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Grid - Responsive and Scalable */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => {
            const IconComponent = category.icon;
            
            return (
              <div 
                key={category.id} 
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="p-6">
                  {/* Header - Consistent Layout */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-slate-100 rounded-xl">
                      <IconComponent className="h-8 w-8 text-slate-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-800">{category.productCount}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">produits</div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-slate-800 line-clamp-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">{category.description}</p>
                  
                  {/* Sub-categories - Consistent Styling */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sous-catégories</div>
                    <div className="space-y-1">
                      {category.subCategories.slice(0, 2).map((subCat, index) => (
                        <div key={index} className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">{subCat.name}</span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                            {subCat.count}
                          </span>
                        </div>
                      ))}
                      {category.subCategories.length > 2 && (
                        <div className="text-xs text-cyan-600 font-medium">
                          +{category.subCategories.length - 2} autres
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Brands & Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex -space-x-2">
                      {category.brands.slice(0, 3).map((brand, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 bg-slate-100 border-2 border-white rounded-full flex items-center justify-center text-xs font-bold text-slate-600"
                          title={brand.name}
                        >
                          {brand.name.substring(0, 1)}
                        </div>
                      ))}
                      {category.brands.length > 3 && (
                        <div className="w-8 h-8 bg-cyan-100 border-2 border-white rounded-full flex items-center justify-center text-xs font-bold text-cyan-600">
                          +{category.brands.length - 3}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1 text-cyan-600">
                      <span className="text-sm font-medium">Explorer</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="group">
              <div className="text-3xl font-bold text-slate-700 mb-2 group-hover:text-cyan-600 transition-colors">
                {categoriesData.length}
              </div>
              <div className="text-gray-600 font-medium text-sm">Catégories</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-slate-700 mb-2 group-hover:text-cyan-600 transition-colors">
                {categoriesData.reduce((total, cat) => total + cat.brands.length, 0)}
              </div>
              <div className="text-gray-600 font-medium text-sm">Marques</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-slate-700 mb-2 group-hover:text-cyan-600 transition-colors">
                {categoriesData.reduce((total, cat) => total + cat.productCount, 0)}+
              </div>
              <div className="text-gray-600 font-medium text-sm">Produits</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-slate-700 mb-2 group-hover:text-cyan-600 transition-colors">24h</div>
              <div className="text-gray-600 font-medium text-sm">Livraison</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

    </div>
  );

  const BrandsView = () => (
    <div>
      {/* Breadcrumb & Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <button 
                onClick={() => setCurrentView('categories')}
                className="hover:text-cyan-600 cursor-pointer font-medium"
              >
                Catégories
              </button>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-gray-900 font-semibold">{selectedCategory?.name}</span>
            </div>
            
            <button
              onClick={() => setCurrentView('categories')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Hero - Consistent Styling */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              {selectedCategory && <selectedCategory.icon className="h-12 w-12" />}
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{selectedCategory?.name}</h1>
              <p className="text-xl text-slate-200 mb-4">{selectedCategory?.description}</p>
              <div className="flex items-center space-x-6 text-slate-300">
                <span>{selectedCategory?.productCount} produits</span>
                <span>•</span>
                <span>{selectedCategory?.brands.length} marques</span>
                <span>•</span>
                <span>Livraison 24h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Sub-categories Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtrer par sous-catégorie:</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedSubCategory(null)}
              className={`px-4 py-2 rounded-full transition-colors ${
                !selectedSubCategory 
                  ? 'bg-cyan-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes ({selectedCategory?.productCount})
            </button>
            {selectedCategory?.subCategories.map((subCat, index) => (
              <button
                key={index}
                onClick={() => setSelectedSubCategory(subCat)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedSubCategory?.name === subCat.name 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {subCat.name} ({subCat.count})
              </button>
            ))}
          </div>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {selectedCategory?.brands.map((brand, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-cyan-200 transition-all duration-300 cursor-pointer group"
              onClick={() => handleBrandClick(brand.name, selectedCategory.name)}
            >
              {/* Badge */}
              <div className="flex justify-between items-start mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColors(brand.badge.color)}`}>
                  {brand.badge.text}
                </span>
                <Eye className="h-5 w-5 text-gray-400 group-hover:text-cyan-500 transition-colors" />
              </div>
              
              {/* Brand Logo */}
              <div className="h-20 flex items-center justify-center bg-slate-50 rounded-xl mb-6">
                <span className="text-2xl font-bold text-slate-700">{brand.name}</span>
              </div>
              
              {/* Brand Info */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">{brand.name}</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">{brand.description}</p>
              
              {/* Rating */}
              <div className="mb-6">
                {renderStars(brand.rating)}
                <span className="text-xs text-gray-500 mt-1 block">{brand.reviewCount} avis clients</span>
              </div>
              
              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">Produits:</span>
                  <span className="font-semibold text-gray-900">{brand.productCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">Prix:</span>
                  <span className="font-semibold text-cyan-600">{brand.priceRange}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">Stock:</span>
                  <span className="text-green-600 font-semibold flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {brand.inStock ? 'En stock' : 'Rupture'}
                  </span>
                </div>
              </div>
              
              {/* CTA Button */}
              <button className="w-full py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-xl transition-colors font-semibold flex items-center justify-center space-x-2">
                <Package className="h-4 w-4" />
                <span>Voir les produits</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'categories' ? <CategoriesView /> : <BrandsView />}
    </div>
  );
};

export default CategoriesBrandsPage;