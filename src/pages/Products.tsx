import { useState, useEffect , useMemo } from 'react';
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import {Eye, Search, Filter, X, ShoppingCart,ChevronRight, ChevronDown  } from 'lucide-react';
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
        <h3 className="font-semibold text-foreground mb-3">Tags populaires</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag.slug}
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

const Products = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 175000]);
  const [priceChanged, setPriceChanged] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [openParents, setOpenParents] = useState<Record<string, boolean>>({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [urlParamsProcessed, setUrlParamsProcessed] = useState(false);

  // Handle brand and category parameters from URL - FIXED VERSION
  useEffect(() => {
    const brandParam = searchParams.get('brand');
    const categoryParam = searchParams.get('category');
    
    // Create a unique key for current URL params
    const currentUrlKey = `${brandParam || ''}-${categoryParam || ''}`;
    const previousUrlKey = `${selectedTags.length > 0 && selectedTags[0] ? selectedTags[0].toLowerCase() : ''}-${selectedCategories.length > 0 ? selectedCategories[0] : ''}`;
    
    // Only process if URL params exist and are different from current state
    if ((brandParam || categoryParam) && currentUrlKey !== previousUrlKey && !urlParamsProcessed) {
      setSelectedTags([]);
      setSelectedCategories([]);
      setCurrentPage(1);
      setUrlParamsProcessed(true);
      
      if (brandParam) {
        // Convert brand slug to tag name (capitalize first letter)
        const brandTagName = brandParam.charAt(0).toUpperCase() + brandParam.slice(1).toLowerCase();
        setSelectedTags([brandTagName]);
      }
      
      if (categoryParam) {
        setSelectedCategories([categoryParam]);
        
        // Wait for categories to be loaded if they're not yet
        if (categories.length > 0) {
          // Find the parent category and expand it
          const findParentAndExpand = () => {
            let parentSlug = null;
            
            // Check if it's a direct parent category
            const directParent = categories.find(cat => cat.slug === categoryParam);
            if (directParent) {
              parentSlug = categoryParam;
            } else {
              // Check if it's a child category
              const parentWithChild = categories.find(cat => 
                cat.children && cat.children.some(child => child.slug === categoryParam)
              );
              if (parentWithChild) {
                parentSlug = parentWithChild.slug;
              }
            }
            
            if (parentSlug) {
              setOpenParents(prev => ({
                ...prev,
                [parentSlug]: true
              }));
              
              // Scroll to the category within the sidebar
              setTimeout(() => {
                const categoryElement = document.getElementById(`category-${categoryParam}`);
                const sidebarContainer = document.querySelector('aside.overflow-y-auto');
                
                if (categoryElement && sidebarContainer) {
                  const categoryTop = categoryElement.offsetTop;
                  const sidebarHeight = sidebarContainer.clientHeight;
                  const categoryHeight = categoryElement.offsetHeight;
                  
                  // Calculate scroll position to center the category in the sidebar
                  const scrollPosition = categoryTop - (sidebarHeight / 2) + (categoryHeight / 2);
                  
                  sidebarContainer.scrollTo({
                    top: Math.max(0, scrollPosition),
                    behavior: 'smooth'
                  });
                }
              }, 300);
            }
          };
          
          findParentAndExpand();
        }
      }
    } else if (!brandParam && !categoryParam && urlParamsProcessed) {
      // Reset when no URL params are present
      setUrlParamsProcessed(false);
    }
  }, [searchParams, categories]);
  
  // Separate effect to handle category selection when categories load
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.length > 0 && selectedCategories.length === 0 && !urlParamsProcessed) {
      setSelectedCategories([categoryParam]);
      setUrlParamsProcessed(true);
      
      // Handle parent expansion and scrolling
      const handleCategoryDisplay = () => {
        let parentSlug = null;
        
        // Check if it's a direct parent category
        const directParent = categories.find(cat => cat.slug === categoryParam);
        if (directParent) {
          parentSlug = categoryParam;
        } else {
          // Check if it's a child category
          const parentWithChild = categories.find(cat => 
            cat.children && cat.children.some(child => child.slug === categoryParam)
          );
          if (parentWithChild) {
            parentSlug = parentWithChild.slug;
          }
        }
        
        if (parentSlug) {
          setOpenParents(prev => ({ ...prev, [parentSlug]: true }));
          
          // Scroll to the category within the sidebar
          setTimeout(() => {
            const categoryElement = document.getElementById(`category-${categoryParam}`);
            const sidebarContainer = document.querySelector('aside.overflow-y-auto');
            
            if (categoryElement && sidebarContainer) {
              const categoryTop = categoryElement.offsetTop;
              const sidebarHeight = sidebarContainer.clientHeight;
              const categoryHeight = categoryElement.offsetHeight;
              
              // Calculate scroll position to center the category in the sidebar
              const scrollPosition = categoryTop - (sidebarHeight / 2) + (categoryHeight / 2);
              
              sidebarContainer.scrollTo({
                top: Math.max(0, scrollPosition),
                behavior: 'smooth'
              });
            }
          }, 300);
        }
      };
      
      handleCategoryDisplay();
    }
    
    // Also handle the case where category is already selected but we need to expand/scroll
    if (categoryParam && categories.length > 0 && selectedCategories.includes(categoryParam)) {
      const handleCategoryDisplay = () => {
        let parentSlug = null;
        
        // Check if it's a direct parent category
        const directParent = categories.find(cat => cat.slug === categoryParam);
        if (directParent) {
          parentSlug = categoryParam;
        } else {
          // Check if it's a child category
          const parentWithChild = categories.find(cat => 
            cat.children && cat.children.some(child => child.slug === categoryParam)
          );
          if (parentWithChild) {
            parentSlug = parentWithChild.slug;
          }
        }
        
        if (parentSlug && !openParents[parentSlug]) {
          setOpenParents(prev => ({ ...prev, [parentSlug]: true }));
          
          // Scroll to the category within the sidebar
          setTimeout(() => {
            const categoryElement = document.getElementById(`category-${categoryParam}`);
            const sidebarContainer = document.querySelector('aside.overflow-y-auto');
            
            if (categoryElement && sidebarContainer) {
              const categoryTop = categoryElement.offsetTop;
              const sidebarHeight = sidebarContainer.clientHeight;
              const categoryHeight = categoryElement.offsetHeight;
              
              // Calculate scroll position to center the category in the sidebar
              const scrollPosition = categoryTop - (sidebarHeight / 2) + (categoryHeight / 2);
              
              sidebarContainer.scrollTo({
                top: Math.max(0, scrollPosition),
                behavior: 'smooth'
              });
            }
          }, 500); // Slightly longer delay to ensure parent is expanded
        }
      };
      
      handleCategoryDisplay();
    }
  }, [categories, searchParams, selectedCategories, openParents]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories-tags/`);
        const data = await res.json();
        setCategories(data.categories);
        setTags(data.tags);
      } catch (err) {
        console.error('❌ Error fetching filters', err);
      }
    };

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

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/?${query}`);
        const data = await res.json();
        setProducts(data.products);
        setTotalPages(data.total_pages || 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error("❌ Error fetching products", err);
      }
    };

    fetchFilters();
    fetchProducts();
  }, [debouncedSearch, selectedCategories, priceRange, currentPage, selectedTags]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // FIXED handleCategoryChange function
  const handleCategoryChange = (category: string, checked: boolean) => {
    setCurrentPage(1);

    setSelectedCategories(prev => {
      let newCategories;
      if (checked) {
        newCategories = [...prev, category];
        const parent = categories.find(cat => cat.slug === category && cat.children?.length > 0);
        if (parent) {
          setOpenParents(prevOpen => ({ ...prevOpen, [category]: true }));
        }
      } else {
        newCategories = prev.filter(c => c !== category);
      }
      
      // Clear URL parameters when manually changing filters
      if (searchParams.get('brand') || searchParams.get('category')) {
        navigate('/products', { replace: true });
        setUrlParamsProcessed(false);
      }
      
      return newCategories;
    });
  };

  // FIXED handleTagToggle function
  const handleTagToggle = (tag: string) => {
    setCurrentPage(1);
    setSelectedTags(prev => {
      const newTags = prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag];
      
      // Clear URL parameters when manually changing filters
      if (searchParams.get('brand') || searchParams.get('category')) {
        navigate('/products', { replace: true });
        setUrlParamsProcessed(false);
      }
      
      return newTags;
    });
  };

  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
    setPriceChanged(true);
    
    // Clear URL parameters when manually changing filters
    if (searchParams.get('brand') || searchParams.get('category')) {
      navigate('/products', { replace: true });
      setUrlParamsProcessed(false);
    }
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

      const imageUrl = product.image
        ? `${import.meta.env.VITE_API_BASE_URL}${product.image}`
        : "/placeholder.svg";

      requestAnimationFrame(() => {
        addToCart({
          id: product.id,
          name: product.title || "Produit",
          price: productPrice,
          image: imageUrl,
          quantity: 1
        });

        setTimeout(() => {
          toast({
            title: "Produit ajouté au panier",
            description: `${product.title || "Produit"} ajouté au panier.`,
            duration: 2000,
          });
        }, 100);
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

  // FIXED clearFilters function
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedTags([]);
    setPriceRange([0, 175000]);
    setPriceChanged(false);
    setCurrentPage(1);
    
    // Clear URL parameters as well
    if (searchParams.get('brand') || searchParams.get('category')) {
      navigate('/products', { replace: true });
      setUrlParamsProcessed(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 2xl:px-32 w-full mx-auto pt-0 ">

        <div className="mb-4 w-full flex flex-wrap gap-8 lg:flex-nowrap">
          {/* Desktop Sidebar */}
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
/>

</aside>

          {/* Products Grid */}
          <main  className="flex-1 mb-12">
            <div className="flex justify-between items-center mb-6 pt-12">
              <h1 className="text-3xl font-bold text-foreground">Produits</h1>
<div className="lg:hidden w-full flex justify-end">
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
/>

    </div>
  </div>
</SheetContent>

  </Sheet>
</div>
            </div>

   <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 [@media(min-width:1400px)]:grid-cols-4 gap-6">

{products.map((product) => (
<Card
  key={product.id}
  className="flex flex-col h-full group hover:shadow-lg transition-all duration-300"
>
  <CardHeader className="p-4 pb-0 max-[559px]:p-3 max-[559px]:pb-0">
    <div className="aspect-[4/3] bg-secondary rounded-lg max-[559px]:rounded-md mb-4 max-[559px]:mb-3 flex items-center justify-center overflow-hidden">
<img
  src={`${import.meta.env.VITE_API_BASE_URL}${product.image}`}
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/product_placeholder.jpg";
  }}
  alt={product.title || "Produit"}
  className="w-full  object-cover"
/>
    </div>
    <div className="space-y-2 max-[559px]:space-y-1.5">
<CardTitle className="text-lg font-semibold line-clamp-2 max-[425px]:text-xs max-[425px]:font-normal">
        {product.title}
      </CardTitle>
      <p className="text-sm text-muted-foreground line-clamp-2 max-[559px]:text-xs">
        Produit sans description
      </p>

      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 max-[559px]:gap-1.5 max-[559px]:pt-1">
          {product.tags.map((tag: string, index: number) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs font-medium text-muted-foreground border-muted max-[559px]:text-[10px] max-[559px]:px-1.5 max-[559px]:py-0.5"
            >
              {tag}
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
          {product.stock === 0 || product.in_stock === false ? (
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
  disabled={!product.price || product.price === 0 || product.stock === 0 || product.in_stock === false}
>
  <ShoppingCart className="h-4 w-4 mr-2 max-[1200px]:mr-0 max-[559px]:mr-1.5 max-[425px]:h-3.5 max-[425px]:w-3.5 max-[425px]:mr-1" />
  {!product.price || product.price === 0 ? "Indisponible" : 
   product.stock === 0 || product.in_stock === false ? "Rupture de stock" : "Ajouter au panier"}
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

    {/* Prev button */}
    <Button
      variant="outline"
      className="px-3 py-2 text-sm"
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
    >
      «
    </Button>

    {/* Dynamic page window */}
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

    {/* Next button */}
    <Button
      variant="outline"
      className="px-3 py-2 text-sm"
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      »
    </Button>
  </div>
)}

      <Footer />
    </div>
  );
};

export default Products;