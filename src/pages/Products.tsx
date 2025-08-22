import { useState, useEffect , useMemo } from 'react';
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import {Eye, Search, Filter, X, ShoppingCart,ChevronRight, ChevronDown, Home, Package  } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";

const FilterSidebar = ({
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategories,
  handleCategoryChange,
  tags,
  selectedTags,
  handleTagToggle,
  priceRange,
  handlePriceChange,
  clearFilters,
  openParents,
  setOpenParents,
  isMobile = false,
}) => {

  const toggleParent = (slug) => {
    setOpenParents((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-3">Recherche</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            autoFocus={false}
            tabIndex={isMobile ? -1 : 0}
            onFocus={(e) => {
              if (isMobile && window.innerWidth < 1024) {
                e.target.blur();
              }
            }}
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3">Catégories</h3>
        <div className="space-y-3">
          {categories.map((parent) => (
            <div key={parent.id} id={`category-${parent.slug}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={parent.slug}
                    checked={selectedCategories.includes(parent.slug)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(parent.slug, checked)
                    }
                  />
                  <Label htmlFor={parent.slug} className="text-sm font-medium">
                    {parent.name}
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({parent.count})
                    </span>
                  </Label>
                </div>
                {parent.children?.length > 0 && (
                  <button
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => toggleParent(parent.slug)}
                  >
                    {openParents[parent.slug] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                )}
              </div>
              {parent.children && parent.children.length > 0 && openParents[parent.slug] && (
                <div className="ml-6 mt-2 space-y-2">
                  {parent.children.map((child) => (
                    <div key={child.id} className="flex items-center space-x-2" id={`category-${child.slug}`}>
                      <Checkbox
                        id={child.slug}
                        checked={selectedCategories.includes(child.slug)}
                        onCheckedChange={(checked) =>
                          handleCategoryChange(child.slug, checked)
                        }
                      />
                      <Label htmlFor={child.slug} className="text-sm text-muted-foreground">
                        {child.name}
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({child.count})
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3">Nos Marques</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag.name}
              variant={selectedTags.includes(tag.name) ? "default" : "outline"}
              className={`cursor-pointer text-xs ${
                selectedTags.includes(tag.name)
                  ? "bg-brand text-white"
                  : "text-muted-foreground border-muted"
              }`}
              onClick={() => handleTagToggle(tag.name)}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3">Prix (DZD)</h3>
        <div className="flex items-center gap-3">
          <SliderPrimitive.Root
            value={priceRange}
            onValueChange={handlePriceChange}
            min={0}
            max={175000}
            step={1000}
            className="relative flex w-full items-center"
          >
            <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-secondary">
              <SliderPrimitive.Range className="absolute h-full bg-primary" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb
              style={{ touchAction: "none" }}
              className="block h-4 w-4 border-2 border-primary rounded-full bg-white border border-muted shadow hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <SliderPrimitive.Thumb
              style={{ touchAction: "none" }}
              className="block h-4 w-4 border-2 border-primary rounded-full bg-white border border-muted shadow hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </SliderPrimitive.Root>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>{priceRange[0]} DZD</span>
          <span>{priceRange[1]} DZD</span>
        </div>
      </div>

      <Button variant="outline" onClick={clearFilters} className="w-full">
        Effacer les filtres
      </Button>
    </div>
  );
};

  // Simple breadcrumb display component
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

    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
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
            onClick={onShowAllProducts}
            className="text-blue-700 border-blue-300 hover:bg-blue-100 hover:border-blue-400 transition-colors whitespace-nowrap"
          >
            <Package className="w-4 h-4 mr-2" />
            Voir tous les produits
          </Button>
        </div>
      </div>
    );
  };

const Products = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 175000]);
  const [priceChanged, setPriceChanged] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

const [scrollHandled, setScrollHandled] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [openParents, setOpenParents] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [filtersLoaded, setFiltersLoaded] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [cameFromCategoryPage, setCameFromCategoryPage] = useState(false);
const [initialLoad, setInitialLoad] = useState(true);
  // Check if user came from category page
// Handle URL parameters and mobile behavior
// Handle URL parameters and mobile behavior - ONLY on initial load
useEffect(() => {
  const openFilters = searchParams.get('openFilters') === 'true';
  const hasFilters = searchParams.get('categories') || searchParams.get('tags');
  const isMobile = window.innerWidth < 1024;
  
  // Only set cameFromCategoryPage if openFilters=true (coming from external page)
  if (openFilters && hasFilters) {
    setCameFromCategoryPage(true);
  }
  
  // Handle mobile filter opening - only if no filters in URL
  if (isMobile && openFilters && !hasFilters) {
    setIsMobileFiltersOpen(true);
  }
  
  // Clean up URL parameter
  if (openFilters) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('openFilters');
    navigate(`/products?${newSearchParams.toString()}`, { replace: true });
  }
}, [searchParams, navigate]);

  // Scroll to top on first render
  useEffect(() => {
    if (isFirstRender) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsFirstRender(false);
    }
  }, [isFirstRender]);

  // Handle mobile filter opening
// Handle mobile filter opening
useEffect(() => {
  const isMobile = window.innerWidth < 1024;
  const openFilters = searchParams.get('openFilters') === 'true';
  
  // Only open mobile filters if NOT coming from category page
  if (isMobile && openFilters && !cameFromCategoryPage) {
    setIsMobileFiltersOpen(true);
  }
  
  // Always clean up the URL parameter
  if (openFilters) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('openFilters');
    navigate(`/products?${newSearchParams.toString()}`, { replace: true });
  }
}, [searchParams, navigate, cameFromCategoryPage]);

  // Load filters once
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories-tags/`);
        const data = await res.json();
        console.log('Fetched filters:', data);
        setCategories(data.categories);
        setTags(data.tags);
        setFiltersLoaded(true);
      } catch (err) {
        console.error('❌ Error fetching filters', err);
      }
    };

    if (!filtersLoaded) {
      fetchFilters();
    }
  }, [filtersLoaded]);

  // Handle URL parameters ONLY when filters are loaded and URL changes
useEffect(() => {
  if (!filtersLoaded || categories.length === 0) return;

  const categoriesParam = searchParams.get("categories");
  const tagsParam = searchParams.get("tags");

  console.log("Processing URL Parameters:", { categoriesParam, tagsParam });

  // Handle categories
  if (categoriesParam) {
    const categoryList = categoriesParam.split(",").filter(Boolean);
    console.log("Setting categories from URL:", categoryList);
    setSelectedCategories(categoryList);

    // Expand parent categories
    categoryList.forEach((categorySlug) => {
      const parentWithChild = categories.find(
        (cat) => cat.children && cat.children.some((child) => child.slug === categorySlug)
      );
      if (parentWithChild) {
        setOpenParents((prev) => ({ ...prev, [parentWithChild.slug]: true }));
      }

      const directParent = categories.find((cat) => cat.slug === categorySlug);
      if (directParent && directParent.children?.length > 0) {
        setOpenParents((prev) => ({ ...prev, [categorySlug]: true }));
      }
    });

    // ✅ Scroll only the first time
    if (!scrollHandled) {
      setTimeout(() => {
        categoryList.forEach((categorySlug) => {
          const categoryElement = document.getElementById(`category-${categorySlug}`);
          const desktopSidebar = document.querySelector("aside.overflow-y-auto");

          if (categoryElement && desktopSidebar && window.innerWidth >= 1024) {
            const elementTop = categoryElement.offsetTop;
            const scrollPosition = Math.max(0, elementTop - 100);

            desktopSidebar.scrollTo({
              top: scrollPosition,
              behavior: "smooth",
            });
          }
        });
      }, 100);

      setScrollHandled(true); // mark scroll as done
    }
  } else {
    setSelectedCategories([]);
  }

  // Handle tags
  if (tagsParam) {
    const tagList = tagsParam.split(",").filter(Boolean);
    console.log("Setting tags from URL:", tagList);
    setSelectedTags(tagList);
  } else {
    setSelectedTags([]);
  }

  setCurrentPage(1);
}, [searchParams, filtersLoaded, categories, scrollHandled]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch products - ONLY when dependencies actually change
  useEffect(() => {
    if (!filtersLoaded) return;

    const fetchProducts = async () => {
      try {
        const query = new URLSearchParams();
        query.append("page", currentPage.toString());

        if (debouncedSearch) query.append("search", debouncedSearch);
        if (selectedCategories.length > 0) query.append("categories", selectedCategories.join(","));
        if (selectedTags.length > 0) query.append("tags", selectedTags.join(","));
        if (priceChanged && priceRange.length === 2) {
          query.append("min_price", priceRange[0].toString());
          query.append("max_price", priceRange[1].toString());
        }

        console.log('Fetching products with query:', query.toString());
        
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/?${query}`);
        const data = await res.json();
        console.log('Products fetched:', data.products?.length || 0);
        
        setProducts(data.products || []);
        setTotalPages(data.total_pages || 1);
        
        // Only scroll to top when changing pages manually
        if (currentPage > 1) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (err) {
        console.error("❌ Error fetching products", err);
      }
    };

    fetchProducts();
  }, [filtersLoaded, debouncedSearch, selectedCategories, selectedTags, priceRange, priceChanged, currentPage]);

const handleCategoryChange = (category, checked) => {
  setCameFromCategoryPage(false); // This will hide the breadcrumb
  setCurrentPage(1);
  
  let newCategories;
  if (checked) {
    newCategories = [...selectedCategories, category];
    // Expand parent if needed
    const parent = categories.find(cat => cat.slug === category && cat.children?.length > 0);
    if (parent) {
      setOpenParents(prev => ({ ...prev, [category]: true }));
    }
  } else {
    newCategories = selectedCategories.filter(c => c !== category);
  }
  
  setSelectedCategories(newCategories);
  
  // Update URL WITHOUT openFilters parameter
  const newSearchParams = new URLSearchParams();
  if (newCategories.length > 0) {
    newSearchParams.set('categories', newCategories.join(','));
  }
  if (selectedTags.length > 0) {
    newSearchParams.set('tags', selectedTags.join(','));
  }
  
  const newUrl = newSearchParams.toString() ? `/products?${newSearchParams.toString()}` : '/products';
  navigate(newUrl, { replace: true });
};

const handleTagToggle = (tag) => {
  setCameFromCategoryPage(false); // This will hide the breadcrumb
  setCurrentPage(1);
  
  const newTags = selectedTags.includes(tag) 
    ? selectedTags.filter(t => t !== tag) 
    : [...selectedTags, tag];
  
  setSelectedTags(newTags);
  
  // Update URL WITHOUT openFilters parameter
  const newSearchParams = new URLSearchParams();
  if (selectedCategories.length > 0) {
    newSearchParams.set('categories', selectedCategories.join(','));
  }
  if (newTags.length > 0) {
    newSearchParams.set('tags', newTags.join(','));
  }
  
  const newUrl = newSearchParams.toString() ? `/products?${newSearchParams.toString()}` : '/products';
  navigate(newUrl, { replace: true });
};

  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
    setPriceChanged(true);
    setCurrentPage(1);
  };

  // Show all products handler
  const handleShowAllProducts = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedTags([]);
    setPriceRange([0, 175000]);
    setPriceChanged(false);
    setCurrentPage(1);
    setCameFromCategoryPage(false); // Reset category page state
    navigate('/products', { replace: true });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedTags([]);
    setPriceRange([0, 175000]);
    setPriceChanged(false);
    setCurrentPage(1);
    setCameFromCategoryPage(false); // Reset category page state
    navigate('/products', { replace: true });
    
    // Scroll to top when clearing filters
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 2xl:px-32 w-full mx-auto pt-0 ">

        <div className="mb-4 w-full flex flex-wrap gap-8 lg:flex-nowrap">
          {/* Desktop Sidebar - Hidden when coming from category page */}
          {!cameFromCategoryPage && (
            <aside className="hidden lg:flex flex-col w-80 bg-card rounded-lg p-6 sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto pt-12 pb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Filtres</h2>
              </div>
              <FilterSidebar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                categories={categories}
                selectedCategories={selectedCategories}
                handleCategoryChange={handleCategoryChange}
                tags={tags}
                selectedTags={selectedTags}
                handleTagToggle={handleTagToggle}
                priceRange={priceRange}
                handlePriceChange={handlePriceChange}
                clearFilters={clearFilters}
                openParents={openParents}
                setOpenParents={setOpenParents}
                isMobile={false}
              />
            </aside>
          )}

          {/* Products Grid */}
          <main className={`flex-1 mb-12 ${cameFromCategoryPage ? 'w-full' : ''}`}>
            <div className="flex justify-between items-center mb-6 pt-12">
              <h1 className="text-3xl font-bold text-foreground">Produits</h1>
              <div className="lg:hidden w-full flex justify-end">
                {!cameFromCategoryPage && (
                <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className=" px-4 py-2 text-sm bg-card border-muted-foreground text-foreground"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filtres
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0">
                    <div className="flex flex-col h-full">
                      <SheetHeader className="p-4">
                        <SheetTitle>Filtres</SheetTitle>
                      </SheetHeader>
                      <div className="flex-1 overflow-y-auto px-4 pb-6">
                        <FilterSidebar
                          searchQuery={searchQuery}
                          setSearchQuery={setSearchQuery}
                          categories={categories}
                          selectedCategories={selectedCategories}
                          handleCategoryChange={handleCategoryChange}
                          tags={tags}
                          selectedTags={selectedTags}
                          handleTagToggle={handleTagToggle}
                          priceRange={priceRange}
                          handlePriceChange={handlePriceChange}
                          clearFilters={clearFilters}
                          openParents={openParents}
                          setOpenParents={setOpenParents}
                          isMobile={true}
                        />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                )}
              </div>
            </div>

            {/* Filter Display - Show only when coming from category page */}
{/* Filter Display - Show when coming from category page OR on mobile with active filters */}
{cameFromCategoryPage && (selectedCategories.length > 0 || selectedTags.length > 0) && (
  <FilterDisplay
    selectedCategories={selectedCategories}
    selectedTags={selectedTags}
    categories={categories}
    onShowAllProducts={handleShowAllProducts}
  />
)}

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 [@media(min-width:1400px)]:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="flex flex-col h-full group hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader className="p-4 pb-0 max-[559px]:p-3 max-[559px]:pb-0">
                    <div className="aspect-[4/3] bg-secondary rounded-lg max-[559px]:rounded-md mb-4 max-[559px]:mb-3 flex items-center justify-center overflow-hidden">
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
                    <div className="space-y-2 max-[559px]:space-y-1.5">
                      <CardTitle onClick={() => navigate(`/product/${product.id}`)} className="cursor-pointer text-lg font-semibold line-clamp-2 max-[425px]:text-xs max-[425px]:font-normal hover:text-brand transition-colors">
                        {product.title}
                      </CardTitle>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 max-[559px]:text-xs">
                        {product.short_description && product.short_description.trim() 
                          ? product.short_description 
                          : "Découvrez ce produit et ses caractéristiques uniques."
                        }
                      </p>

                      {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2 max-[559px]:gap-1.5 max-[559px]:pt-1">
                          {product.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs font-medium text-muted-foreground border-muted max-[559px]:text-[10px] max-[559px]:px-1.5 max-[559px]:py-0.5"
                            >
                              {typeof tag === 'object' ? tag.name : tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardHeader> 

                  <CardContent className="p-4 flex-grow max-[559px]:p-3" />

                  <CardFooter className="p-4 pt-0 flex-col gap-3 mt-auto max-[559px]:p-3 max-[559px]:gap-2">
                    <div className="flex justify-between items-end w-full">
                      <div className="space-y-1 max-[559px]:space-y-0.5">
                        <p className="text-2xl max-[1469px]:text-lg font-bold text-brand max-[1200px]:text-lg max-[559px]:text-lg max-[425px]:text-base">
                          {product.price && product.price !== 0 ? product.price + ' DZD' : 'Prix non disponible'} 
                        </p>
                        <p className="text-xs font-medium max-[559px]:text-[11px]">
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
                        className="text-black border border-gray-300 bg-gray-50 hover:bg-gray-100 max-[559px]:h-8 max-[559px]:w-8"
                      >
                        <Eye className="h-5 w-5 max-[559px]:h-4 max-[559px]:w-4" />
                      </Button>
                    </div>

                    <Button 
                      onClick={() => handleAddToCart(product)}
                      size="sm"
                      className="w-full max-[1200px]:text-xs max-[559px]:text-sm max-[559px]:h-8 max-[425px]:text-xs max-[425px]:h-7"
                      disabled={!product.price || product.price === 0 || product.stock === 0 || product.in_stock === false || product.stock_status === 'outofstock'}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2 max-[1200px]:mr-0 max-[559px]:mr-1.5 max-[425px]:h-3.5 max-[425px]:w-3.5 max-[425px]:mr-1" />
                      {!product.price || product.price === 0 ? "Indisponible" : 
                       product.stock === 0 || product.in_stock === false || product.stock_status === 'outofstock' ? "Rupture de stock" : "Ajouter au panier"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Aucun produit trouvé avec ces filtres.</p>
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Effacer les filtres
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

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

export default Products;