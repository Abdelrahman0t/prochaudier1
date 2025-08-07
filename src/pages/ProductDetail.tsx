import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ShoppingCart, Heart, Share2, Star } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product details from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/product/${id}/`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const data = await response.json();
        setProduct(data);
        
        // Fetch related products from the same category
        if (data.categories && data.categories.length > 0) {
          const categoryParam = data.categories[0]; // Use first category
          const relatedResponse = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/products/?categories=${categoryParam}&limit=3`
          );
          
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            // Filter out current product
            const filtered = relatedData.products.filter(p => p.id !== parseInt(id));
            setRelatedProducts(filtered.slice(0, 3));
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
            <Button onClick={() => navigate('/products')}>
              Retour aux produits
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const productImage = product.image 
    ? `${import.meta.env.VITE_API_BASE_URL}${product.image}`
    : "/placeholder.svg";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/products')}
            className="p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour aux produits
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-secondary rounded-lg overflow-hidden">
              <img 
                src={productImage}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/placeholder.svg";
                }}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnail images - you can add multiple images if your API supports them */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-secondary rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-brand' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={productImage}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.categories && product.categories.length > 0 && (
                <Badge variant="secondary" className="mb-2">
                  {product.categories[0]}
                </Badge>
              )}
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < 4 // Default rating since API doesn't provide it
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
              <p className="text-muted-foreground text-lg">
                {product.description || "Description du produit non disponible."}
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
              
              <div className="text-sm font-medium text-success">
                ✓ En stock - Expédition rapide
              </div>

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
                  onClick={handleAddToCart}
                  className="flex-1"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Ajouter au panier
                </Button>

              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
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
                <p className="text-muted-foreground leading-relaxed">
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
                      {product.tags?.join(' , ')}

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
                    <span className="text-success">En stock</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Produits similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const relatedProductImage = relatedProduct.image 
                  ? `${import.meta.env.VITE_API_BASE_URL}${relatedProduct.image}`
                  : "/placeholder.svg";

                return (
                  <Card 
                    key={relatedProduct.id} 
                    className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  >
                    <CardHeader className="p-4">
                      <div className="aspect-square bg-secondary rounded-lg mb-4 overflow-hidden">
                        <img 
                          src={relatedProductImage}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                          alt={relatedProduct.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      {relatedProduct.categories && relatedProduct.categories.length > 0 && (
                        <Badge variant="secondary" className="text-xs mb-2">
                          {relatedProduct.categories[0]}
                        </Badge>
                      )}
                      <CardTitle className="text-lg font-semibold line-clamp-2">
                        {relatedProduct.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-brand">
                          {relatedProduct.price ? `${relatedProduct.price} DZD` : 'Prix non disponible'}
                        </span>
                        <span className="text-xs text-success">
                          En stock
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;