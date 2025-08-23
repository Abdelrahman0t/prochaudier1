import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Building2, ChevronRight, Grid, List } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLocation } from "react-router-dom";

const CategoryBrandsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [brands, setBrands] = useState([]); // These will be tags associated with the category
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name'); // 'name' or 'count'

  useEffect(() => {
    const fetchCategoryBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch category details and associated tags (brands)
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/category/${slug}/brands/`);
        
        if (!response.ok) {
          throw new Error('Catégorie non trouvée');
        }
        
        const data = await response.json();
        console.log(data.brands)
        setCategory(data.category);
        setBrands(data.brands); // These will be the tags
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryBrands();
  }, [slug]);

 const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname]);
  // Sort brands based on selected criteria
  const sortedBrands = [...brands].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name, 'fr');
    } else if (sortBy === 'count') {
      return b.product_count - a.product_count;
    }
    return 0;
  });

  const handleBrandClick = (brand) => {
    // Navigate to filtered products page with category and tag filters
    // Set openFilters=true to indicate coming from category/brands page
    const searchParams = new URLSearchParams();
    searchParams.set('categories', slug);
    searchParams.set('tags', brand.name);
    
    navigate(`/breadProduct?${searchParams.toString()}`);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleViewAllProducts = () => {
    // Also set openFilters=true when viewing all products from this page
    const searchParams = new URLSearchParams();
    searchParams.set('categories', slug);
    
    navigate(`/breadProduct?${searchParams.toString()}`);
  };

  // Handle image load errors
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  const BrandLogo = ({ brand, className }) => {
    if (brand.logo) {
      return (
        <div className={`relative ${className}`}>
          <img
            src={import.meta.env.VITE_API_BASE_URL + brand.logo}
            alt={`Logo ${brand.name}`}
            className="w-full h-full object-contain rounded-lg shadow-sm"
            onError={handleImageError}
          />
          {/* Fallback icon - hidden by default, shown when image fails */}
          <div 
            className="absolute inset-0 bg-brand/10 rounded-lg flex items-center justify-center shadow-sm"
            style={{ display: 'none' }}
          >
            <img
            src='/product_placeholder.jpg'
            alt={`Logo ${brand.name}`}
            className="w-full h-full object-contain rounded-lg"
            onError={handleImageError}
          />
          </div>
        </div>
      );
    }
    
    // No image available - show placeholder
    return (
      <div className={`${className} bg-brand/10 rounded-lg flex items-center justify-center shadow-sm`}>
        <img
          src='/product_placeholder.jpg'
          alt={`Logo ${brand.name}`}
          className="w-full h-full object-contain rounded-lg"
          onError={handleImageError}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 text-sm sm:text-base">Chargement des marques...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 mb-4 text-sm sm:text-base">{error}</div>
            <Button onClick={handleBackClick} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-24 mx-auto py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            {/* Mobile Header */}
            <div className="block sm:hidden mb-4">

              
              <div className="text-center">
                <h1 className="text-xl font-bold text-gray-900 mb-2">
                  {category?.name}
                </h1>
                <p className="text-sm text-gray-600 mb-2">
                  {brands.length} marque{brands.length !== 1 ? 's' : ''} disponible{brands.length !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center justify-center text-xs text-gray-500 mb-4">
                  <span>Catégories</span>
                  <ChevronRight className="h-3 w-3 mx-1" />
                  <span>{category?.name}</span>
                  <ChevronRight className="h-3 w-3 mx-1" />
                  <span className="text-brand font-medium">Marques</span>
                </div>
              </div>

              {/* Mobile Actions - Show Products Button */}
              <div className="mt-4">
                <Button 
                  onClick={handleViewAllProducts}
                  variant="outline"
                  className="hover:bg-brand/10 hover:border-brand transition-colors w-full text-base py-3"
                  size="lg"
                >
                  <Package className="h-5 w-5 mr-3" />
                  Tous les produits
                </Button>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden sm:block">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">

                  
                  <div className="flex-1">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span>Catégories</span>
                      <ChevronRight className="h-4 w-4 mx-2" />
                      <span>{category?.name}</span>
                      <ChevronRight className="h-4 w-4 mx-2" />
                      <span className="text-brand font-medium">Marques</span>
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                      Marques - {category?.name}
                    </h1>
                    <p className="text-gray-600 mt-2">
                      Découvrez les {brands.length} marque{brands.length !== 1 ? 's' : ''} disponible{brands.length !== 1 ? 's' : ''} 
                      dans la catégorie "{category?.name}"
                    </p>
                  </div>
                </div>

                {/* Desktop Actions - Show Products Button on the right */}
                <div className="flex-shrink-0">
                  <Button 
                    onClick={handleViewAllProducts}
                    variant="outline"
                    className="hover:bg-brand/10 hover:border-brand transition-colors text-sm px-4 py-2 h-10"
                    size="default"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Tous les produits
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Brands Display */}
          {brands.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-white rounded-lg shadow-sm">
              <Building2 className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Aucune marque trouvée</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Il n'y a actuellement aucune marque disponible dans cette catégorie.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              {sortedBrands.map((brand) => (
                <div
                  key={brand.id}
                  onClick={() => handleBrandClick(brand)}
                  className="bg-white p-6 sm:p-8 lg:p-10 xl:p-12 rounded-2xl shadow-lg border-2 border-transparent hover:border-brand/40 hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:bg-gradient-to-br hover:from-white hover:to-brand/5 group"
                >
                  <div className="text-center">
                    <div className="mb-6 sm:mb-8 lg:mb-10 flex items-center justify-center">
                      <BrandLogo 
                        brand={brand}
                        className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 xl:h-48 xl:w-48 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="font-bold text-gray-900 text-lg sm:text-xl lg:text-2xl text-center leading-tight group-hover:text-brand transition-colors duration-300">
                        {brand.name}
                      </h3>
                      <Badge 
                        variant="secondary" 
                        className="text-sm sm:text-base px-4 py-2 bg-brand/10 text-brand hover:bg-brand hover:text-white transition-all duration-300 font-semibold"
                      >
                        {brand.product_count} produit{brand.product_count !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Stats */}
          <div className="mt-8 sm:mt-12 bg-white p-4 sm:p-6 rounded-lg shadow-sm border text-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-brand">{brands.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Marque{brands.length !== 1 ? 's' : ''} disponible{brands.length !== 1 ? 's' : ''}</div>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl sm:text-2xl font-bold text-brand">{category?.name}</div>
                <div className="text-xs sm:text-sm text-gray-600">Catégorie sélectionnée</div>
              </div>
            </div>
          </div>

          {/* Show All Brands Button */}
          <div className="mt-6 sm:mt-8 text-center">
            <Button 
              onClick={() => navigate('/allbrands')}
              variant="outline"
              className="hover:bg-brand/10 hover:border-brand transition-colors text-base px-8 py-3 h-12"
              size="lg"
            >
              <Building2 className="h-5 w-5 mr-3" />
              Voir toutes nos marques
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryBrandsPage;