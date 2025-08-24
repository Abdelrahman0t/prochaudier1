import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Eye, Search } from 'lucide-react';
import { useCart } from "@/hooks/useCart";
import Header from '../components/Header';
import Footer from '../components/Footer';

// BrandLogo component for displaying brand logos
const BrandLogo = ({ brand, className = "" }) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError || !brand.logo) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-2xl font-bold text-gray-400">
          {brand.name ? brand.name.charAt(0).toUpperCase() : 'B'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={`${import.meta.env.VITE_API_BASE_URL}${brand.logo}`}
      alt={brand.name}
      className={`object-contain ${className}`}
      onError={handleImageError}
    />
  );
};

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const [results, setResults] = useState({ products: [], brands: [] });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState('relevance');
  const [filterType, setFilterType] = useState('all'); // 'all', 'products', 'brands'
  const { toast } = useToast();

  // Fetch search results
  const fetchSearchResults = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}api/search/?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setResults({ products: [], brands: [] });
    } finally {
      setLoading(false);
    }
  };

  // Handle search on mount and when search params change
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
      fetchSearchResults(query);
    }
  }, [searchParams]);

  // Handle new search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm });
      fetchSearchResults(searchTerm);
    }
  };

  // Handle add to cart
  const handleAddToCart = async (product) => {
    if (isAddingToCart) return;
    setIsAddingToCart(true);

    try {
      if (!product || !product.id) throw new Error("Invalid product");

      const productPrice = Number(product.price);
      if (!product.price || productPrice === 0 || isNaN(productPrice)) {
        toast({
          title: "Désolé",
          description: "Ce produit n'est pas disponible à la vente pour le moment.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      if (product.stock === 0 || product.in_stock === false) {
        toast({
          title: "Désolé",
          description: "Ce produit est actuellement en rupture de stock.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      const imageUrl = product.main_image
        ? `${import.meta.env.VITE_API_BASE_URL}${product.main_image}`
        : "/placeholder.svg";

      addToCart({
        id: product.id,
        name: product.title || "Produit",
        price: productPrice,
        image: imageUrl,
        quantity: 1
      });

      toast({
        title: "Produit ajouté au panier",
        description: `${product.title || "Produit"} ajouté au panier.`,
        duration: 2000,
      });

    } catch (error) {
      console.error("🛑 Failed to add to cart:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit au panier.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setIsAddingToCart(false), 500);
    }
  };

  // Handle brand click
  const handleBrandClick = (brand) => {
    navigate(`/breadProduct?tags=${encodeURIComponent(brand.name)}&openFilters=true`);
  };

  // Filter and sort results
  const getFilteredResults = () => {
    let filteredProducts = results.products || [];
    let filteredBrands = results.brands || [];

    if (filterType === 'products') {
      filteredBrands = [];
    } else if (filterType === 'brands') {
      filteredProducts = [];
    }

    // Sort products
    if (sortBy === 'price_asc') {
      filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price_desc') {
      filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'name') {
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
    }

    return { products: filteredProducts, brands: filteredBrands };
  };

  const filteredResults = getFilteredResults();
  const totalResults = filteredResults.products.length + filteredResults.brands.length;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50/50">
        {/* Search Header */}



 <div className="w-full px-6 md:px-12 lg:px-20 xl:px-24 2xl:px-32 mx-auto">
        <div className="py-6 border-b border-gray-200">
          <p className="text-lg sm:text-xl font-medium text-gray-400 text-start">
            {loading ? (
              "Recherche en cours..."
            ) : (
              <>
                <span className="font-semibold text-gray-400">
                  {totalResults}
                </span>{" "}
                résultat{totalResults > 1 ? "s" : ""}
                {searchParams.get("q") && (
                  <> pour <span className="italic text-brand">"{searchParams.get("q")}"</span></>
                )}
                {filteredResults.products.length > 0 && (
                  <> • <span className="font-semibold text-gray-400">{filteredResults.products.length}</span> produit{filteredResults.products.length > 1 ? "s" : ""}</>
                )}
                {filteredResults.brands.length > 0 && (
                  <> • <span className="font-semibold text-gray-400">{filteredResults.brands.length}</span> marque{filteredResults.brands.length > 1 ? "s" : ""}</>
                )}
              </>
            )}
          </p>
        </div>
      </div>

        

        {/* Results Content */}
        <div className="px-6 md:px-12 lg:px-20 xl:px-24 2xl:px-32 mx-auto w-full py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-4"></div>
                <p className="text-muted-foreground">Recherche en cours...</p>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h2>
                <p className="text-muted-foreground mb-6">
                  Essayez avec des mots-clés différents ou vérifiez l'orthographe.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Brands Section */}
              {filteredResults.brands.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    Marques ({filteredResults.brands.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
                    {filteredResults.brands.map((brand) => (
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
                          
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg sm:text-xl lg:text-2xl text-center leading-tight group-hover:text-brand transition-colors duration-300">
                              {brand.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Section */}
              {filteredResults.products.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    Produits ({filteredResults.products.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {filteredResults.products.map((product) => (
                      <Card
                        key={product.id}
                        className="flex flex-col h-full group hover:shadow-lg transition-all duration-300"
                      >
                        <CardHeader className="p-2 sm:p-3 md:p-4 pb-0">
                          <div className="aspect-[4/3] mb-2 sm:mb-3 md:mb-4 bg-secondary rounded-md sm:rounded-lg flex items-center justify-center overflow-hidden">
                            <img
                              src={`${import.meta.env.VITE_API_BASE_URL}${product.main_image}`}
                              onClick={() => navigate(`/product/${product.id}`)}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/product_placeholder.jpg";
                              }}
                              alt={product.title || "Produit"}
                              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          
                          <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                            <CardTitle 
                              onClick={() => navigate(`/product/${product.id}`)} 
                              className="cursor-pointer text-sm sm:text-base md:text-lg font-semibold line-clamp-2 hover:text-brand transition-colors"
                            >
                              {product.title}
                            </CardTitle>
                            
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 hidden sm:block">
                              {product.short_description && product.short_description.trim() 
                                ? product.short_description 
                                : "Découvrez ce produit et ses caractéristiques uniques."
                              }
                            </p>

                            {product.tags && product.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 pt-1 sm:pt-1.5 md:pt-2">
                                {product.tags.slice(0, 2).map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-[10px] sm:text-xs font-medium text-muted-foreground border-muted px-1 sm:px-1.5 py-0.5"
                                  >
                                    {typeof tag === 'object' ? tag.name : tag}
                                  </Badge>
                                ))}
                                {product.tags.length > 2 && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] sm:text-xs font-medium text-muted-foreground border-muted px-1 sm:px-1.5 py-0.5"
                                  >
                                    +{product.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </CardHeader> 

                        <CardContent className="p-2 sm:p-3 md:p-4 flex-grow" />

                        <CardFooter className="p-2 sm:p-3 md:p-4 pt-0 flex-col gap-2 sm:gap-3 mt-auto">
                          <div className="flex justify-between items-end w-full">
                            <div className="space-y-0.5 sm:space-y-1">
                              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-brand">
                                {product.price && product.price !== 0 ? product.price + ' DZD' : 'Prix non disponible'} 
                              </p>
                              <p className="text-[10px] sm:text-xs font-medium">
                                {product.stock_status == 'outofstock' ? (
                                  <span className="text-destructive">✗ Rupture de stock</span>
                                ) : (
                                  <span className="text-success">✓ En stock</span>
                                )}
                              </p>
                            </div>
                            <Button 
                              onClick={() => navigate(`/product/${product.id}`)}
                              variant="ghost"
                              size="icon"
                              className="text-black border border-gray-300 bg-gray-50 hover:bg-gray-100 h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                            </Button>
                          </div>

                          <Button 
                            onClick={() => handleAddToCart(product)}
                            size="sm"
                            className="w-full text-xs sm:text-sm h-7 sm:h-8 md:h-9"
                            disabled={
                              !product.price || product.price === 0 || 
                              product.stock === 0 || 
                              product.in_stock === false || 
                              product.stock_status === 'outofstock'
                            }
                          >
                            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="truncate">
                              {!product.price || product.price === 0
                                ? "Indisponible"
                                : product.stock === 0 || product.in_stock === false || product.stock_status === "outofstock"
                                ? "Rupture de stock"
                                : "Ajouter au panier"}
                            </span>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;