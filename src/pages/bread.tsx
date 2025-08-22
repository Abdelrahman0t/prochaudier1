import { useState, useEffect } from 'react';
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Eye, ShoppingCart, ChevronRight, Home, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";

// FilterDisplay component - shows breadcrumb
const FilterDisplay = ({ selectedCategories, selectedTags, categories, onShowAllProducts }) => {
  // Helper function to find category name by slug
  const getCategoryName = (categorySlug) => {
    for (const parent of categories) {
      if (parent.slug === categorySlug) {
        return parent.name;
      }
      if (parent.children) {
        for (const child of parent.children) {
          if (child.slug === categorySlug) {
            return child.name;
          }
        }
      }
    }
    return categorySlug;
  };

  if (selectedCategories.length === 0 && selectedTags.length === 0) {
    return null;
  }

  const handleShowAllProducts = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onShowAllProducts();
  };

  return (
    <div 
     className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200/60 rounded-lg sm:rounded-xl p-4 mb-6"

      onClick={(e) => e.stopPropagation()}
    >
      {/* Mobile: Stack everything vertically */}
      <div className="block sm:hidden space-y-4">
        {/* Filter label and breadcrumb on mobile */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-blue-700 font-medium">Filtré par:</span>
          <Home className="w-4 h-4 text-blue-600" />
        </div>
        
        {/* Categories and tags on mobile */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedCategories.map((categorySlug, index) => (
            <div key={categorySlug} className="flex items-center">
              <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium">
                {getCategoryName(categorySlug)}
              </div>
              {(index < selectedCategories.length - 1 || selectedTags.length > 0) && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
              )}
            </div>
          ))}

          {selectedTags.map((tag, index) => (
            <div key={tag} className="flex items-center">
              <div className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium">
                {tag}
              </div>
              {index < selectedTags.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
              )}
            </div>
          ))}
        </div>
        
        {/* Button on mobile */}
        <Button 
          variant="outline" 
          onClick={handleShowAllProducts}
          className="text-blue-700 border-blue-300 hover:bg-blue-100 hover:border-blue-400 transition-colors w-full h-11 text-sm font-medium"
        >
          <Package className="w-4 h-4 mr-2" />
          Voir tous les produits
        </Button>
      </div>

      {/* Desktop: Keep horizontal layout */}
      <div className="hidden sm:flex sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-blue-700 font-medium">Filtré par:</span>
          
          {/* Home breadcrumb */}
          <div className="flex items-center">
            <Home className="w-4 h-4 text-blue-600" />
            <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
          </div>

          {/* Categories display */}
          {selectedCategories.map((categorySlug, index) => (
            <div key={categorySlug} className="flex items-center">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {getCategoryName(categorySlug)}
              </div>
              {(index < selectedCategories.length - 1 || selectedTags.length > 0) && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
              )}
            </div>
          ))}

          {/* Tags display */}
          {selectedTags.map((tag, index) => (
            <div key={tag} className="flex items-center">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {tag}
              </div>
              {index < selectedTags.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Show All Products Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleShowAllProducts}
          className="text-blue-700 border-blue-300 hover:bg-blue-100 hover:border-blue-400 transition-colors whitespace-nowrap"
        >
          <Package className="w-4 h-4 mr-2" />
          Voir tous les produits
        </Button>
      </div>
    </div>
  );
};

const Bread = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  // Load categories for breadcrumb display
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories-tags/`);
        const data = await res.json();
        setCategories(data.categories);
        setFiltersLoaded(true);
      } catch (err) {
        console.error('❌ Error fetching categories', err);
      }
    };

    fetchCategories();
  }, []);

  // Handle URL parameters
  useEffect(() => {
    if (!filtersLoaded) return;

    const categoriesParam = searchParams.get("categories");
    const tagsParam = searchParams.get("tags");

    // Set filters from URL
    if (categoriesParam) {
      const categoryList = categoriesParam.split(",").filter(Boolean);
      setSelectedCategories(categoryList);
    }

    if (tagsParam) {
      const tagList = tagsParam.split(",").filter(Boolean);
      setSelectedTags(tagList);
    }

    setCurrentPage(1);
  }, [searchParams, filtersLoaded]);

  // Fetch products
  useEffect(() => {
    if (!filtersLoaded) return;

    const fetchProducts = async () => {
      try {
        const query = new URLSearchParams();
        query.append("page", currentPage.toString());

        if (selectedCategories.length > 0) {
          query.append("categories", selectedCategories.join(","));
        }
        if (selectedTags.length > 0) {
          query.append("tags", selectedTags.join(","));
        }

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/?${query}`);
        const data = await res.json();
        
        setProducts(data.products || []);
        setTotalPages(data.total_pages || 1);
        
        // Scroll to top when changing pages
        if (currentPage > 1) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (err) {
        console.error("❌ Error fetching products", err);
      }
    };

    fetchProducts();
  }, [filtersLoaded, selectedCategories, selectedTags, currentPage]);

  // Show all products handler
  const handleShowAllProducts = () => {
    navigate('/products');
  };

  // Add to cart handler
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

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-24 w-full mx-auto pt-0">
        <main className="w-full mb-8 sm:mb-12">
          <div className="flex justify-between items-center mb-4 sm:mb-6 pt-6 sm:pt-12">
            
          </div>

          {/* Filter Display - Always show if there are filters */}
          {(selectedCategories.length > 0 || selectedTags.length > 0) && (
            <FilterDisplay
              selectedCategories={selectedCategories}
              selectedTags={selectedTags}
              categories={categories}
              onShowAllProducts={handleShowAllProducts}
            />
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="flex flex-col h-full group hover:shadow-lg transition-all duration-300"
              >
                <CardHeader className="p-2 sm:p-3 md:p-4 pb-0">
                  <div className="aspect-[4/3] bg-secondary rounded-md sm:rounded-lg mb-2 sm:mb-3 md:mb-4 flex items-center justify-center overflow-hidden">
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
                    disabled={!product.price || product.price === 0 || product.stock === 0 || product.in_stock === false || product.stock_status === 'outofstock'}
                  >
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="truncate">
                      {!product.price || product.price === 0 ? "Indisponible" : 
                       product.stock === 0 || product.in_stock === false || product.stock_status === 'outofstock' ? "Rupture de stock" : "Ajouter au panier"}
                    </span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* No products message */}
          {products.length === 0 && filtersLoaded && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Aucun produit trouvé avec ces filtres.</p>
              <Button variant="outline" onClick={handleShowAllProducts} className="mt-4">
                Voir tous les produits
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Pagination */}
{products.length > 0 && totalPages > 1 && (
  <div className="flex justify-center items-center mt-8 gap-2 pb-16">
    {/* First Page Button */}
    <Button
      variant="ghost"
      className="w-8 h-8 p-0 rounded-full bg-gray-50 hover:bg-gray-200 border-0"
      onClick={() => setCurrentPage(1)}
      disabled={currentPage === 1}
      title="Go to first page"
    >
      <ChevronsLeft className="w-4 h-4" />
    </Button>
    
    {/* Previous Page Button */}
    <Button
      variant="ghost"
      className="w-8 h-8 p-0 rounded-full bg-gray-50 hover:bg-gray-200 border-0"
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      title="Previous page"
    >
      <ChevronLeft className="w-4 h-4" />
    </Button>
    
    {/* Page Number Buttons */}
    {Array.from({ length: Math.min(totalPages, 4) }).map((_, index) => {
      const windowStart = Math.max(
        1,
        Math.min(
          currentPage - 2,
          totalPages - 3
        )
      );
      const page = windowStart + index;

      return (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          className="px-4 py-2 text-sm"
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </Button>
      );
    })}
    
    {/* Next Page Button */}
    <Button
      variant="ghost"
      className="w-8 h-8 p-0 rounded-full bg-gray-50 hover:bg-gray-200 border-0"
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      title="Next page"
    >
      <ChevronRight className="w-4 h-4" />
    </Button>
    
    {/* Last Page Button */}
    <Button
      variant="ghost"
      className="w-8 h-8 p-0 rounded-full bg-gray-50 hover:bg-gray-200 border-0"
      onClick={() => setCurrentPage(totalPages)}
      disabled={currentPage === totalPages}
      title="Go to last page"
    >
      <ChevronsRight className="w-4 h-4" />
    </Button>
  </div>
)}

      <Footer />
    </div>
  );
};

export default Bread;