import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation } from "react-router-dom";

const CategoryPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryTree, setCategoryTree] = useState({});
  const [allTags, setAllTags] = useState([]);
  const [stats, setStats] = useState({ total_categories: 0, total_tags: 0, total_products: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFirstRender, setIsFirstRender] = useState(true);
const topRef = useRef(null);
  // API call to fetch categories and tags
  const fetchCategoriesAndTags = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;
      const response = await fetch(`${API_BASE_URL}/categories-tags-tree/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCategoryTree(data.categories_tree);
      setAllTags(data.all_tags);
      console.log(data.all_tags)
      setStats(data.stats);
      setError(null);
      
      // Auto-select first parent category
      const firstParentName = Object.keys(data.categories_tree)[0];
      if (firstParentName) {
        setSelectedParent(firstParentName);
      }
      
    } catch (err) {
      console.error('Error fetching categories and tags:', err);
      setError('Failed to load categories and tags. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesAndTags();
  }, []);

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const handleParentClick = (parentName) => {
    setSelectedParent(parentName);
    setSelectedCategory(null);
  };

  const handleCategoryClick = (categoryName, parentName = null) => {
    const fullCategoryName = parentName ? `${parentName}/${categoryName}` : categoryName;
    setSelectedCategory(selectedCategory === fullCategoryName ? null : fullCategoryName);
  };

  // Convert category name to slug format (matching your Products page expectation)
  const convertToSlug = (name) => {
    return name.toLowerCase()
      .replace(/[àáâäèéêëìíîïòóôöùúûü]/g, (match) => {
        const map = {
          'à': 'a', 'á': 'a', 'â': 'a', 'ä': 'a',
          'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
          'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
          'ò': 'o', 'ó': 'o', 'ô': 'o', 'ö': 'o',
          'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u'
        };
        return map[match] || match;
      })
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Navigate to products page with category filter
  const handleCategoryNavigate = (categoryName, parentName = null, event) => {
    event.stopPropagation();
    
    // Create the proper category slug - treat children same as parents
    const categorySlug = convertToSlug(categoryName);
    
    console.log('Navigating to products with category:', categorySlug);
    
    // Navigate with the category filter and open filters on mobile
    const searchParams = new URLSearchParams();
    searchParams.set('categories', categorySlug);
    searchParams.set('openFilters', 'true');
    
    navigate(`/breadProduct?${searchParams.toString()}`);
  };

  // Navigate to products page with brand filter only
  const handleBrandNavigate = (brandName, event) => {
    event.stopPropagation();
    
    console.log('Navigating to products with brand:', brandName);
    
    const searchParams = new URLSearchParams();
    searchParams.set('tags', brandName);
    searchParams.set('openFilters', 'true');
    
    navigate(`/breadProduct?${searchParams.toString()}`);
  };

  // Navigate to products page with both category and brand filters
  const handleCategoryAndBrandNavigate = (categoryName, brandName, parentName = null) => {
    // Create the proper category slug - treat children same as parents
    const categorySlug = convertToSlug(categoryName);
    
    console.log('Navigating to products with category and brand:', { categorySlug, brandName });
    
    const searchParams = new URLSearchParams();
    searchParams.set('categories', categorySlug);
    searchParams.set('tags', brandName);
    searchParams.set('openFilters', 'true');
    
    navigate(`/breadProduct?${searchParams.toString()}`);
  };

  // Filter categories based on search term - CATEGORIES ONLY
  const filteredCategoryTree = useMemo(() => {
    if (!searchTerm.trim()) return categoryTree;
    
    const filtered = {};
    const searchLower = searchTerm.toLowerCase();
    
    Object.entries(categoryTree).forEach(([parentName, parentData]) => {
      const parentMatches = parentName.toLowerCase().includes(searchLower);
      
      // Filter children based on child category names only
      const filteredChildren = {};
      Object.entries(parentData.children).forEach(([childName, childData]) => {
        const childMatches = childName.toLowerCase().includes(searchLower);
        
        // Include child if it matches OR if parent matches
        if (childMatches || parentMatches) {
          filteredChildren[childName] = childData;
        }
      });
      
      // Include parent if it matches OR if any children match
      if (parentMatches || Object.keys(filteredChildren).length > 0) {
        filtered[parentName] = {
          ...parentData,
          children: filteredChildren
        };
      }
    });
    
    return filtered;
  }, [categoryTree, searchTerm]);

  const BrandsRow = ({ tags, categoryName, parentName, isOpen }) => (
    <div 
      className={`overflow-hidden transition-all duration-200 ease-out ${
        isOpen ? 'opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-l-2 border-l-blue-400 mx-4 sm:ml-4 lg:ml-8 sm:mr-4 lg:mr-6 mb-2 sm:mb-1 rounded-r">
        <div className="p-4 sm:p-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm sm:text-xs font-medium text-blue-800 flex items-center">
              <div className="w-1.5 h-1.5 sm:w-1 sm:h-1 bg-blue-500 rounded-full mr-2"></div>
              Marques disponibles
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm sm:text-xs text-blue-600 bg-blue-100 px-2 py-1 sm:px-1.5 sm:py-0.5 rounded-full font-medium">
                {tags.length}
              </span>
              {/* Elegant category-only navigation */}
              <button
                className="text-xs sm:text-xs font-medium text-slate-600 hover:text-slate-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-slate-300 hover:border-slate-400 hover:bg-white/80 transition-all duration-150 flex items-center space-x-1 sm:space-x-1.5 min-w-0 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryNavigate(categoryName, parentName, e);
                }}
                title={`Voir tous les produits de la catégorie ${categoryName}`}
              >
                <svg className="w-3 h-3 sm:w-3 sm:h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="hidden xs:inline sm:inline whitespace-nowrap">Voir tout</span>
                <span className="inline xs:hidden sm:hidden">Tout</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-2">
            {tags.map((tag) => (
              <div 
                key={tag.id}
                className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-lg p-2 hover:border-blue-300 hover:bg-white transition-all duration-150 group hover:shadow-md cursor-pointer"
                onClick={() => handleCategoryAndBrandNavigate(categoryName, tag.name, parentName)}
              >
                <div className="flex flex-col items-center space-y-1.5 sm:space-y-1">
                
                  <div className="w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center bg-gray-50 rounded overflow-hidden">
                    
                    {tag.image_url ? (
                      <img
                        src={import.meta.env.VITE_API_BASE_URL + tag.image_url}
                        alt={tag.name}
                        className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-lg"
                      style={{ display: tag.image_url ? 'none' : 'flex' }}
                    >
                      {tag.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <span className="text-xs text-gray-700 font-medium group-hover:text-blue-600 transition-colors text-center leading-tight px-0.5 line-clamp-2">
                    {tag.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div>
        <Header  />
        <div  className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div  className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Chargement des catégories...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchCategoriesAndTags}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      
      <Header />
      <div ></div>
      <div  className="min-h-screen bg-gray-50">
        {/* Header */}
        <div  className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 text-white py-8 sm:py-12 lg:py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-50">
            <div className="w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10">
<div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/20 rounded-full mb-4 sm:mb-6">
  <img src="small_icon.png" alt="" className="w-12 h-12 sm:w-10 sm:h-10" />
</div>
            <h1 ref={topRef} className="text-3xl sm:text-4xl lg:text-5xl font-light mb-3 sm:mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Nos Catégories
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
              Découvrez plus de <span className="text-blue-400 font-semibold">+150 produits</span> répartis dans nos catégories spécialisées pour vos installations de chauffage
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto px-2">
              <div className="relative">
                <Search className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une catégorie..."
                  className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-4 sm:py-5 rounded-2xl text-gray-900 text-base sm:text-lg bg-white/95 backdrop-blur-sm border-0 shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Parent Categories Row */}
          <div className="mb-4 sm:mb-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-lg p-3 sm:p-5">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 sm:mr-3"></div>
              Catégories principales
            </h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filteredCategoryTree).map(([parentName, parentData]) => (
                <button
                  key={parentName}
                  className={`px-2 sm:px-4 py-1.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 whitespace-nowrap ${
                    selectedParent === parentName 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                  onClick={() => handleParentClick(parentName)}
                >
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="truncate text-xs sm:text-sm">{parentName}</span>
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${
                      selectedParent === parentName 
                        ? 'bg-white/20 text-white' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {parentData.product_count}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Category Tree */}
          {selectedParent && filteredCategoryTree[selectedParent] && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-xl overflow-hidden">
              <div className="border-b border-gray-100/80">
                {/* Selected Parent Category */}
                <div
                  className={`p-4 sm:p-5 cursor-pointer hover:bg-gray-50/80 transition-all duration-200 flex items-center justify-between group ${
                    selectedCategory === selectedParent ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => handleCategoryClick(selectedParent)}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-500 transition-all duration-200 group-hover:text-blue-500 flex-shrink-0 ${
                        selectedCategory === selectedParent ? 'transform rotate-180 text-blue-500' : ''
                      }`} 
                    />
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight truncate">{selectedParent}</h3>
                  </div>
                  <div className="hidden sm:flex items-center space-x-2 flex-shrink-0">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                      {filteredCategoryTree[selectedParent].tags.length} marques
                    </span>
                    <button
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg whitespace-nowrap hover:from-blue-600 hover:to-blue-700 transition-all"
                      onClick={(e) => handleCategoryNavigate(selectedParent, null, e)}
                    >
                      {filteredCategoryTree[selectedParent].product_count} produits
                    </button>
                  </div>
                </div>

                {/* Brands row for parent category */}
                <BrandsRow 
                  tags={filteredCategoryTree[selectedParent].tags} 
                  categoryName={selectedParent}
                  parentName={null}
                  isOpen={selectedCategory === selectedParent}
                />

                {/* Child Categories */}
                <div className="bg-gradient-to-b from-gray-50/50 to-gray-100/50">
                  {Object.entries(filteredCategoryTree[selectedParent].children).map(([childName, childData]) => (
                    <React.Fragment key={childName}>
                      <div
                        className={`pl-4 sm:pl-8 lg:pl-12 pr-4 sm:pr-5 py-4 cursor-pointer hover:bg-white/60 transition-all duration-200 flex items-center justify-between border-l-2 ml-4 sm:ml-6 group ${
                          selectedCategory === `${selectedParent}/${childName}` ? 'bg-white/80 border-l-blue-500 shadow-sm' : 'border-l-gray-300'
                        }`}
                        onClick={() => handleCategoryClick(childName, selectedParent)}
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <ChevronRight 
                            className={`w-4 h-4 text-gray-500 transition-all duration-200 group-hover:text-blue-500 flex-shrink-0 ${
                              selectedCategory === `${selectedParent}/${childName}` ? 'transform rotate-90 text-blue-500' : ''
                            }`} 
                          />
                          <h4 className="text-base font-medium text-gray-800 group-hover:text-blue-600 transition-colors leading-tight truncate">{childName}</h4>
                        </div>
                        <div className="hidden sm:flex items-center space-x-2 flex-shrink-0">
                          <span className="text-xs text-gray-500 bg-white/80 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                            {childData.tags.length} marques
                          </span>
                          <button
                            className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap hover:bg-gray-700 transition-all"
                            onClick={(e) => handleCategoryNavigate(childName, selectedParent, e)}
                          >
                            {childData.product_count} produits
                          </button>
                        </div>
                      </div>
                      
                      {/* Brands row for child category */}
                      <BrandsRow 
                        tags={childData.tags} 
                        categoryName={childName}
                        parentName={selectedParent}
                        isOpen={selectedCategory === `${selectedParent}/${childName}`}
                      />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          {selectedParent && !selectedCategory && (
           <div className="mt-4 sm:mt-6 bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200/60 rounded-2xl p-4 sm:p-6 text-center backdrop-blur-sm">

              <div className="text-white-600 text-2xl sm:text-3xl mb-2 sm:mb-3"></div>
              <h3 className="text-base sm:text-lg font-semibold text-white-900 mb-1 sm:mb-2">Explorez les sous-catégories</h3>
              <p className="text-sm sm:text-base text-white-700">Cliquez sur une catégorie pour voir les marques, ou sur le nombre de produits pour filtrer directement</p>
            </div>
          )}

          {/* No results message */}
          {searchTerm && Object.keys(filteredCategoryTree).length === 0 && (
            <div className="mt-8 text-center">
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
                <div className="text-yellow-600 text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Aucune catégorie trouvée</h3>
                <p className="text-yellow-700">Essayez avec d'autres termes de recherche pour les catégories</p>
              </div>
            </div>
          )}


          
          {/* See All Brands Button */}
          <div className="mt-8 sm:mt-12 text-center">
            <div className="bg-cyan-600 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                  Découvrez toutes nos marques
                </h3>
                <p className="text-emerald-100 mb-4 sm:mb-6 text-sm sm:text-base max-w-2xl mx-auto">
                  Explorez notre sélection complète de marques de confiance pour tous vos besoins en chauffage
                </p>
                <button
                  onClick={() => navigate('/allbrands')}
                  className="inline-flex items-center space-x-2 bg-white  px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-50 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <span>Voir toutes nos marques</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>


          {/* Stats Footer */}
          <div className="mt-8 sm:mt-12 text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-gray-200/60 shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 lg:space-x-12">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                    +60
                  </div>
                  <div className="text-gray-600 text-xs sm:text-sm font-medium">Catégories</div>
                </div>
                <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                    +30
                  </div>
                  <div className="text-gray-600 text-xs sm:text-sm font-medium">Marques</div>
                </div>
                <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                    +150
                  </div>
                  <div className="text-gray-600 text-xs sm:text-sm font-medium">Produits</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
