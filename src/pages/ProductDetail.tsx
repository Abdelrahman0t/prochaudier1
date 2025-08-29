import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ShoppingCart, Heart, Share2, Star, ZoomIn, ZoomOut, ExternalLink, RotateCcw, Tag, Folder } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedProductsInfo, setRelatedProductsInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  // Advanced zoom and pan state
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPointerPos, setLastPointerPos] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef(null);
      useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset zoom when image changes
  useEffect(() => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  }, [selectedImage]);

  // Scroll to top when component mounts or product ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Fetch product details and related products from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Fetch main product details
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/product/${id}/`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const data = await response.json();
        setProduct(data);
        
        // Fetch related products using the enhanced endpoint
        const relatedResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/product/${id}/related/?limit=4`
        );
        
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedProducts(relatedData.related_products || []);
          setRelatedProductsInfo(relatedData);
        } else {
          // Fallback to the old method if the new endpoint doesn't exist yet
          console.warn('New related products endpoint not available, using fallback');
          if (data.categories && data.categories.length > 0) {
            const categoryParam = data.categories[0]; 
            const fallbackResponse = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/api/products/?categories=${categoryParam}&limit=4`
            );
            
            if (fallbackResponse.ok) {
              const fallbackData = await fallbackResponse.json();
              const filtered = fallbackData.products.filter(p => p.id !== parseInt(id));
              setRelatedProducts(filtered.slice(0, 4));
            }
          }
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    try {
      const imageUrl = product.image
        ? `${import.meta.env.VITE_API_BASE_URL}${product.image}`
        : "/placeholder.svg";

      addToCart({
        id: product.id,
        name: product.title || "Produit",
        price: Number(product.price) || 0,
        image: imageUrl,
        quantity
      });

      toast({
        title: "Produit ajouté au panier",
        description: `${quantity}x ${product.title} ajouté(s) au panier.`,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit au panier.",
        variant: "destructive"
      });
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  // Zoom functions
  const zoomIn = () => {
    setScale(prev => Math.min(prev * 1.5, 5)); // Max 5x zoom
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev / 1.5, 1)); // Min 1x zoom
  };

  const resetZoom = () => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  };

  // Handle pointer events (works for both mouse and touch)
  const handlePointerDown = (e) => {
    if (scale <= 1) return; // Only allow dragging when zoomed
    
    setIsDragging(true);
    const pointer = e.touches ? e.touches[0] : e;
    setLastPointerPos({ x: pointer.clientX, y: pointer.clientY });
    e.preventDefault();
  };

  const handlePointerMove = (e) => {
    if (!isDragging || scale <= 1) return;
    
    const pointer = e.touches ? e.touches[0] : e;
    const deltaX = pointer.clientX - lastPointerPos.x;
    const deltaY = pointer.clientY - lastPointerPos.y;
    
    // Calculate movement constraints based on zoom level
    const container = imageContainerRef.current;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const maxTranslateX = (containerRect.width * (scale - 1)) / 2;
      const maxTranslateY = (containerRect.height * (scale - 1)) / 2;
      
      setTranslateX(prev => Math.max(-maxTranslateX, Math.min(maxTranslateX, prev + deltaX)));
      setTranslateY(prev => Math.max(-maxTranslateY, Math.min(maxTranslateY, prev + deltaY)));
    }
    
    setLastPointerPos({ x: pointer.clientX, y: pointer.clientY });
    e.preventDefault();
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Handle wheel zoom on desktop
  const handleWheel = (e) => {
    if (!e.ctrlKey && !isMobile) return; // Only zoom with Ctrl+scroll on desktop
    
    e.preventDefault();
    const delta = e.deltaY;
    
    if (delta < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  // Handle pinch-to-zoom on mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // Pinch gesture detected
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      setLastPointerPos({ x: 0, y: distance }); // Store initial pinch distance
      e.preventDefault();
    } else {
      handlePointerDown(e);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      // Handle pinch-to-zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      
      const scaleChange = distance / lastPointerPos.y;
      setScale(prev => Math.max(1, Math.min(5, prev * scaleChange)));
      setLastPointerPos({ x: 0, y: distance });
      e.preventDefault();
    } else {
      handlePointerMove(e);
    }
  };

  // Open image in new tab
  const openImageInNewTab = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  // Helper function to get relation type badge
  const getRelationBadge = (relationType) => {
    switch(relationType) {
      case 'category':
        return <Badge variant="secondary" className="text-xs"><Folder className="h-3 w-3 mr-1" />Même catégorie</Badge>;
      case 'tag':
        return <Badge variant="outline" className="text-xs"><Tag className="h-3 w-3 mr-1" />Même marque</Badge>;
      case 'general':
        return <Badge variant="ghost" className="text-xs">Récent</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chargement du produit...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {error || "Produit non trouvé"}
            </h1>
            <Button onClick={() => {
  if (window.history.length > 1) {
    navigate(-1);
  } else {
    navigate('/products');
  }
}}>
              Retour
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Build product image gallery from multiple sources
  const getProductImages = () => {
    const images = [];
    
    // Add main image first if exists
    if (product.image) {
      images.push(`${import.meta.env.VITE_API_BASE_URL}${product.image}`);
    } else if (product.image_url) {
      images.push(product.image_url);
    }
    
    // Add additional images from ProductImage model
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        let imageUrl = null;
        if (img.image_url) {
          imageUrl = img.image_url;
        } else if (img.image) {
          imageUrl = `${import.meta.env.VITE_API_BASE_URL}${img.image}`;
        }
        
        // Only add if we have a URL and it's not already in the array
        if (imageUrl && !images.includes(imageUrl)) {
          images.push(imageUrl);
        }
      });
    }
    
    // Fallback to placeholder if no images
    return images.length > 0 ? images : ["/placeholder.svg"];
  };

  const productImages = getProductImages();
  const currentImage = productImages[selectedImage] || productImages[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm md:text-base text-muted-foreground mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
  if (window.history.length > 1) {
    navigate(-1);
  } else {
    navigate('/products');
  }
}}
            className="p-0 h-auto text-xs sm:text-sm md:text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour 
          </Button>
          <span>/</span>
          {product.categories && product.categories.length > 0 && (
            <>
              <span>{product.categories[0]}</span>
              <span>/</span>
            </>
          )}
          <span className="text-foreground">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-12">
          {/* Product Images */}
          <div className="space-y-3 lg:space-y-4">
            <div 
              ref={imageContainerRef}
              className="relative group aspect-square bg-secondary rounded-lg overflow-hidden select-none"
              onWheel={handleWheel}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handlePointerUp}
              style={{ touchAction: scale > 1 ? 'none' : 'auto' }}
            >
              <div
                className="w-full h-full transition-transform duration-200 ease-out"
                style={{
                  transform: `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`,
                  cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                }}
              >
                <img 
                  src={currentImage}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                  alt={product.title}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
              </div>
              
              {/* Enhanced control buttons */}
              <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-100 lg:opacity-80 lg:group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 shadow-lg"
                  onClick={zoomIn}
                  disabled={scale >= 5}
                  title="Zoomer (Ctrl+Molette)"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 shadow-lg"
                  onClick={zoomOut}
                  disabled={scale <= 1}
                  title="Dézoomer"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 shadow-lg"
                  onClick={resetZoom}
                  disabled={scale === 1 && translateX === 0 && translateY === 0}
                  title="Réinitialiser"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 shadow-lg"
                  onClick={() => openImageInNewTab(currentImage)}
                  title="Ouvrir dans un nouvel onglet"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Dynamic status indicator */}
              <div className="absolute bottom-2 left-2 bg-black/75 text-white px-2 py-1 rounded text-xs opacity-80">
                {scale > 1 ? (
                  <div className="flex items-center gap-1">
                    <span>{Math.round(scale * 100)}%</span>
                    <span>•</span>
                    <span>{isMobile ? 'Glisser ou pincer' : 'Glisser ou Ctrl+Molette'}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <ZoomIn className="h-3 w-3" />
                    <span>{isMobile ? 'Pincer pour zoomer' : 'Cliquer ou Ctrl+Molette'}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Thumbnail gallery */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {productImages.slice(0, isMobile ? 3 : 4).map((imageUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-secondary rounded-lg overflow-hidden border-2 transition-all duration-200 hover:border-brand/50 ${
                      selectedImage === index ? 'border-brand ring-2 ring-brand/20' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={imageUrl}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.categories && product.categories.length > 0 && (
                <Badge variant="secondary" className="mb-2">
                  {product.categories[0]}
                </Badge>
              )}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < 4 
                          ? 'fill-brand text-brand' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    (Reviews coming soon)
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground text-lg whitespace-pre-line">
                {product.short_description || "Description du produit non disponible."}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-brand">
                  {product.price ? `${product.price} DZD` : 'Prix non disponible'}
                </span>
                <span className="text-sm text-muted-foreground">
                  TTC
                </span>
              </div>
              
              {product.stock_status?.toLowerCase() === 'outofstock' ? (
                <span className="text-destructive">✗ Rupture de stock</span>
              ) : (
                <span className="text-success">✓ En stock</span>
              )}

              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="text-sm font-medium">
                  Quantité:
                </label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="px-2"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 text-center min-w-[3rem]">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={incrementQuantity}
                    disabled={quantity >= 10}
                    className="px-2"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
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
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-8 lg:mb-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Caractéristiques</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Description détaillée</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description || product.title || "Description détaillée non disponible pour ce produit."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Caractéristiques techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="font-medium">Référence:</span>
                    <span className="text-muted-foreground">#{product.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="font-medium">Marques:</span>
                    <span className="text-muted-foreground">
                      {product.tags?.length > 0 ? product.tags.join(', ') : 'Non spécifié'}
                    </span>
                  </div>
                  {product.categories && product.categories.length > 0 && (
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="font-medium">Catégories:</span>
                      <span className="text-muted-foreground">
                        {product.categories.join(', ')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="font-medium">Disponibilité:</span>
                    {product.stock_status === 'outofstock' ? (
                      <span className="text-destructive">✗ Rupture de stock</span>
                    ) : (
                      <span className="text-success">✓ En stock</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Produits similaires</h2>
              
              {/* Show relationship info if available */}
              {relatedProductsInfo && (
                <div className="text-sm text-muted-foreground">
                  {relatedProductsInfo.total_found} produit{relatedProductsInfo.total_found > 1 ? 's' : ''} trouvé{relatedProductsInfo.total_found > 1 ? 's' : ''}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const relatedProductImage = relatedProduct.main_image 
                  ? (relatedProduct.main_image.startsWith('http') 
                     ? relatedProduct.main_image 
                     : `${import.meta.env.VITE_API_BASE_URL}${relatedProduct.main_image}`)
                  : "/placeholder.svg";

                return (
                  <Card 
                    key={relatedProduct.id} 
                    className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  >
                    <CardHeader className="p-4">
                      <div className="aspect-square bg-secondary rounded-lg mb-4 overflow-hidden relative">
                        <img 
                          src={relatedProductImage}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                          alt={relatedProduct.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Show relationship badge */}
                        <div className="absolute top-2 left-2">
                          {getRelationBadge(relatedProduct.relation_type)}
                        </div>
                      </div>
                      
                      {relatedProduct.categories && relatedProduct.categories.length > 0 && (
                        <Badge variant="secondary" className="text-xs mb-2 w-fit">
                          {relatedProduct.categories[0]}
                        </Badge>
                      )}
                      <CardTitle className="text-lg font-semibold line-clamp-2">
                        {relatedProduct.title}
                      </CardTitle>
                      
                      {/* Short description if available */}
                      {relatedProduct.short_description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {relatedProduct.short_description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-bold text-brand">
                          {relatedProduct.price ? `${relatedProduct.price} DZD` : 'Prix non disponible'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        {relatedProduct.stock_status?.toLowerCase() === 'outofstock' ? (
                          <span className="text-destructive text-sm">✗ Rupture de stock</span>
                        ) : (
                          <span className="text-success text-sm">✓ En stock</span>
                        )}
                        
                        {/* Show tags as small badges */}
                        {relatedProduct.tags && relatedProduct.tags.length > 0 && (
                          <div className="flex gap-1">
                            {relatedProduct.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs py-0">
                                {tag}
                              </Badge>
                            ))}
                            {relatedProduct.tags.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{relatedProduct.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Debug info for development */}
            {relatedProductsInfo && process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-4 bg-secondary rounded-lg">
                <h3 className="text-sm font-semibold mb-2">Debug Info:</h3>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Target Product Categories: {relatedProductsInfo.target_product?.categories?.join(', ') || 'None'}</p>
                  <p>Target Product Tags: {relatedProductsInfo.target_product?.tags?.join(', ') || 'None'}</p>
                  <p>Related Products Found: {relatedProductsInfo.total_found}</p>
                  <p>Relation Types: {relatedProducts.map(p => p.relation_type).join(', ')}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;