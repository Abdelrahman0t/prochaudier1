import React, { useState, useEffect } from 'react';
import { ShoppingBag, CreditCard, Truck, MapPin, User, Phone, Mail, CheckCircle, Plus, Minus, Trash2, ArrowLeft, ArrowRight, LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from 'react-router-dom';
const getCsrfToken = () => {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

// Helper function to generate UUID (if crypto.randomUUID is not available)
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Helper function to check if user is authenticated
const isUserAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  return !!token;
};

const CheckoutPage = () => {
  const { 
    items: cartItems, 
    getTotalPrice, 
    getTotalItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();
  
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [guestId, setGuestId] = useState(null);
const [showMobileOrderSummary, setShowMobileOrderSummary] = useState(false);
const navigate = useNavigate();

  useEffect(() => {
    // Only generate guest ID if user is not authenticated
    if (!isUserAuthenticated()) {
      let id = localStorage.getItem("guest_id");

      // If not present, generate a new UUID and store it
      if (!id) {
        id = generateUUID();
        localStorage.setItem("guest_id", id);
        console.log("Generated new guest ID:", id);
      } else {
        console.log("Using existing guest ID:", id);
      }

      setGuestId(id);
    } else {
      // User is authenticated, clear any existing guest_id
      localStorage.removeItem("guest_id");
      setGuestId(null);
      console.log("User authenticated, guest ID cleared");
    }
  }, []); 

  // Form states
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    region: '',
    additionalInfo: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [deliveryMethod, setDeliveryMethod] = useState('standard');

const [wilayas, setWilayas] = useState([]);
const [selectedWilayaPrice, setSelectedWilayaPrice] = useState(0);
const [loadingWilayas, setLoadingWilayas] = useState(false);

const fetchWilayas = async () => {
  setLoadingWilayas(true);
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/wilayas/`);
    if (response.ok) {
      const data = await response.json();
      setWilayas(data);
    }
  } catch (error) {
    console.error('Error fetching wilayas:', error);
  } finally {
    setLoadingWilayas(false);
  }
};

useEffect(() => {
  fetchWilayas();
}, []);

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Paiement à la livraison',
      description: 'Payez en espèces lors de la réception',
      icon: <Truck className="w-6 h-6" />,
      available: true
    },
    {
      id: 'card',
      name: 'Carte de crédit/débit',
      description: 'Visa, Mastercard, CIB',
      icon: <CreditCard className="w-6 h-6" />,
      available: false
    }
  ];

  const total = getTotalPrice();
  const itemCount = getTotalItems();
  const deliveryPrice = selectedWilayaPrice;
  const finalTotal = total + deliveryPrice;

  const formatPrice = (price) => {
    return `${price.toFixed(2)} DZD`;
  };

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleShippingInfoChange = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return cartItems.length > 0;
      case 2:
        return customerInfo.firstName && customerInfo.lastName && customerInfo.email && customerInfo.phone;
      case 3:
        return shippingInfo.address && shippingInfo.city && shippingInfo.region;
      case 4:
        return paymentMethod;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    } else {
      toast({
        title: "Information manquante",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmitOrder = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    
    try {
      const isAuthenticated = isUserAuthenticated();
      
      // Prepare order data for your Django backend
      const orderData = {
        customer: customerInfo,
        shipping: {
    ...shippingInfo,
    postalCode: shippingInfo.postalCode.trim() === '' ? 'unset' : shippingInfo.postalCode
  },
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        })),
        payment_method: paymentMethod,
        delivery_method: 'standard',
        subtotal: total,
        delivery_price: deliveryPrice,
        total: finalTotal
      };

      // Only include guest_id if user is not authenticated
      if (!isAuthenticated && guestId) {
        orderData.guest_id = guestId;
        console.log("Including guest_id in order:", guestId);
      }

      console.log('Submitting order:', orderData);

      // Prepare headers
      const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken(),
      };

      // Add auth token if user is authenticated
      if (isAuthenticated) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
      }

      // Make the actual API call to your Django backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/orders/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(orderData)
      });

      // Check if the response is ok
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      // Parse the success response
      const result = await response.json();
      console.log('Order created successfully:', result);

      // Clear cart after successful order
      clearCart();
      
      // For guest users, keep the guest_id for potential future orders
      // It will be cleared when they authenticate
      
      setOrderPlaced(true);
      setCurrentStep(5);

      toast({
        title: "Commande confirmée !",
        description: `Votre commande #${result.order_id} a été enregistrée avec succès.`
      });

    } catch (error) {
      console.error('Order submission failed:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la commande. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

const StepIndicator = () => (
  <div className="flex items-center justify-center mb-6 sm:mb-8 px-4">
    <div className="flex items-center w-full max-w-md">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center flex-1">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium border-2 ${
            step <= currentStep 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-gray-400 border-gray-300'
          }`}>
            {step === 5 && orderPlaced ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : step}
          </div>
          {step < 5 && (
            <div className={`flex-1 h-0.5 mx-1 sm:mx-2 ${
              step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  </div>
);

const OrderSummary = ({ isMobile = false }) => (
  <div className={`bg-white rounded-lg shadow-sm border ${isMobile ? 'p-4' : 'sticky top-6 p-6'}`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <ShoppingBag className="w-5 h-5" />
        Résumé de la commande
      </h3>
      {isMobile && (
        <button
          onClick={() => setShowMobileOrderSummary(!showMobileOrderSummary)}
          className="text-blue-600 text-sm font-medium"
        >
          {showMobileOrderSummary ? 'Masquer' : 'Afficher'}
        </button>
      )}
    </div>

    <div className={`space-y-4 ${isMobile && !showMobileOrderSummary ? 'hidden' : ''}`}>
      <div className="space-y-3">
  {cartItems.map((item) => (
    <div key={item.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/api/placeholder/48/48";
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{item.name}</h4>
          <p className="text-xs text-gray-600">Prix unitaire: {formatPrice(item.price)}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-xs">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= 10}
              className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <p className="font-semibold text-sm w-16 text-right">{formatPrice(item.price * item.quantity)}</p>
          <button
            onClick={() => removeFromCart(item.id)}
            className="w-6 h-6 rounded text-red-600 hover:bg-red-50 flex items-center justify-center"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

      <hr className="border-gray-200" />

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Sous-total ({itemCount} articles)</span>
          <span>{formatPrice(total)}</span>
        </div>
<div className="flex justify-between text-sm">
  <span className="text-gray-600">Livraison</span>
  <span>{formatPrice(deliveryPrice)}</span>
</div>
        <hr className="border-gray-200" />
        <div className="flex justify-between font-semibold text-base sm:text-lg">
          <span>Total</span>
          <span className="text-blue-600">{formatPrice(finalTotal)}</span>
        </div>
      </div>
    </div>
  </div>
);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Vérification du panier</CardTitle>
              <CardDescription>Vérifiez les articles dans votre panier</CardDescription>
            </CardHeader>
            <CardContent>
              {cartItems.length === 0 ? (
<div className="text-center py-12">
  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
    <ShoppingBag className="w-10 h-10 text-gray-400" />
  </div>
  
  <h3 className="text-xl font-semibold text-gray-900 mb-3">Votre panier est vide</h3>
  <p className="text-gray-600 mb-8 max-w-sm mx-auto">
    Découvrez nos produits et ajoutez-les à votre panier pour commencer vos achats
  </p>
  
  {/* Buttons with improved styling */}
  <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
    {/* Primary Button */}
    <Button 
      onClick={() => window.history.back()}
      className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
    >
      Continuer vos achats
    </Button>
    
    {/* Secondary Button */}
{isUserAuthenticated() ? (
  <Button 
    onClick={() => navigate('/profile', { replace: true })}
    variant="secondary"
    className="border-2"
  >
    <User className="w-4 h-4" />
    Voir vos commandes dans votre profil
  </Button>
) : (
  <Button 
    onClick={() => navigate('/login', { replace: true })}
    variant="secondary"
    className="border-2"
  >
    <LogIn className="w-4 h-4" />
    Se connecter pour suivre vos commandes
  </Button>
)}
  </div>
</div>

              ) : (
                <div className="space-y-3">
  {cartItems.map((item) => (
    <div key={item.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/api/placeholder/48/48";
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{item.name}</h4>
          <p className="text-xs text-gray-600">Prix unitaire: {formatPrice(item.price)}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-xs">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= 10}
              className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <p className="font-semibold text-sm w-16 text-right">{formatPrice(item.price * item.quantity)}</p>
          <button
            onClick={() => removeFromCart(item.id)}
            className="w-6 h-6 rounded text-red-600 hover:bg-red-50 flex items-center justify-center"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
              )}
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-6 h-6" />
                Informations personnelles
              </CardTitle>
              <CardDescription>Renseignez vos informations de contact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={customerInfo.firstName}
                    onChange={(e) => handleCustomerInfoChange('firstName', e.target.value)}
                    placeholder="Votre prénom"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={customerInfo.lastName}
                    onChange={(e) => handleCustomerInfoChange('lastName', e.target.value)}
                    placeholder="Votre nom"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                    placeholder="votre@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    Téléphone *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                    placeholder="XX XXX XXX"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  Adresse de livraison
                </CardTitle>
                <CardDescription>Où souhaitez-vous recevoir votre commande ?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse complète *</Label>
                  <Input
                    id="address"
                    type="text"
                    value={shippingInfo.address}
                    onChange={(e) => handleShippingInfoChange('address', e.target.value)}
                    placeholder="Rue, numéro, appartement..."
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => handleShippingInfoChange('city', e.target.value)}
                      placeholder="Votre ville"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">
  Code postal <span className="text-xs text-gray-500 font-normal">(optionnel)</span>
</Label>
                    <Input
                      id="postalCode"
                      type="text"
                      value={shippingInfo.postalCode}
                      onChange={(e) => handleShippingInfoChange('postalCode', e.target.value)}
                      placeholder="Code postal"
                    />
                  </div>
                </div>
<div className="space-y-2">
  <Label htmlFor="region">Wilaya *</Label>
  <Select
    value={shippingInfo.region}
    onValueChange={(value) => {
      handleShippingInfoChange('region', value);
      const selectedWilaya = wilayas.find(w => w.name.toLowerCase().replace(/\s+/g, '-') === value);
      setSelectedWilayaPrice(selectedWilaya ? parseFloat(selectedWilaya.price) : 0);
    }}
    disabled={loadingWilayas}
  >
    <SelectTrigger>
      <SelectValue placeholder={loadingWilayas ? "Chargement..." : "Choisir la wilaya"} />
    </SelectTrigger>
    <SelectContent>
      {wilayas.map((wilaya) => (
        <SelectItem 
          key={wilaya.id} 
          value={wilaya.name.toLowerCase().replace(/\s+/g, '-')}
        >
          {wilaya.name} - {formatPrice(parseFloat(wilaya.price))}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Informations supplémentaires</Label>
                  <Textarea
                    id="additionalInfo"
                    value={shippingInfo.additionalInfo}
                    onChange={(e) => handleShippingInfoChange('additionalInfo', e.target.value)}
                    placeholder="Instructions spéciales pour la livraison..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>


          </div>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-6 h-6" />
                Mode de paiement
              </CardTitle>
              <CardDescription>Comment souhaitez-vous payer votre commande ?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id} 
                    className={`flex items-center space-x-3 p-4 border rounded-lg ${
                      !method.available ? 'opacity-50' : ''
                    } ${paymentMethod === method.id ? 'border-primary bg-primary/5' : ''}`}
                  >
                    <RadioGroupItem 
                      value={method.id} 
                      id={method.id} 
                      disabled={!method.available}
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-muted-foreground">{method.icon}</div>
                      <div className="flex-1">
                        <Label htmlFor={method.id} className={`font-medium ${method.available ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                          {method.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                        {!method.available && (
                          <Badge variant="outline" className="text-xs mt-1">
                            Bientôt disponible
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              {paymentMethod === 'cod' && (
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Paiement à la livraison</h4>
                    <p className="text-sm text-yellow-700">
                      Vous payerez en espèces au livreur lors de la réception de votre commande. 
                      Assurez-vous d'avoir le montant exact : {formatPrice(finalTotal)}
                    </p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        );

      case 5:
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="text-center py-8 sm:py-12 px-4 sm:px-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-4">Commande confirmée !</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Merci {customerInfo.firstName} pour votre commande. 
          Nous vous contacterons sous peu pour confirmer les détails de livraison.
        </p>

        {/* Enhanced login prompt for non-authenticated users */}
{/* Enhanced login prompt for non-authenticated users */}
{!isUserAuthenticated() ? (
  <div className="max-w-md mx-auto mb-6">
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-4">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <LogIn className="w-6 h-6 text-blue-600" />
        </div>
      </div>
      <h4 className="font-semibold text-blue-900 mb-2 text-lg">Suivez votre commande</h4>
      <p className="text-sm text-blue-800 mb-4">
        Connectez-vous pour suivre l'état de votre commande en temps réel et accéder à votre historique d'achats.
      </p>
      <button 
        onClick={() => window.location.href = '/login'}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
      >
        <LogIn className="w-4 h-4" />
        Se connecter pour suivre votre commande
      </button>
    </div>
  </div>
) : (
  <div className="max-w-md mx-auto mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
    <h4 className="font-medium text-green-800 mb-2">Commande enregistrée</h4>
    <p className="text-sm text-green-700">
      Vous recevrez un email de confirmation à {customerInfo.email}
    </p>
  </div>
)}

        <div className="max-w-md mx-auto bg-gray-50 rounded-lg p-4 sm:p-6">
          <h3 className="text-base font-semibold mb-4">Détails de la commande</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Mode de paiement:</span>
              <span className="font-medium">Paiement à la livraison</span>
            </div>
<div className="flex justify-between">
  <span className="text-gray-600">Livraison:</span>
  <span className="font-medium">{formatPrice(deliveryPrice)}</span>
</div>
            <div className="flex justify-between items-center py-2 border-t">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg text-blue-600">{formatPrice(finalTotal)}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 pt-2 border-t">
              <span className="text-gray-600">Adresse:</span>
              <span className="font-medium text-right max-w-xs break-words">
                {shippingInfo.address}, {shippingInfo.city}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 space-y-3 max-w-md mx-auto">
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Continuer vos achats
          </button>
        </div>
      </div>
    </div>
  );

      default:
        return null;
    }
  };

  // Redirect if cart is empty and not on confirmation step
  useEffect(() => {
    if (cartItems.length === 0 && currentStep > 1 && !orderPlaced) {
      setCurrentStep(1);
    }
  }, [cartItems.length, currentStep, orderPlaced]);

return (
  <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto py-4 sm:py-8 px-4">
      {/* Header */}
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Finaliser votre commande</h1>
        <p className="text-gray-600 text-sm sm:text-base">Suivez les étapes pour compléter votre achat</p>
      </div>

      <StepIndicator />

      {/* Mobile Order Summary */}
      {currentStep < 5 && (
        <div className="lg:hidden mb-6">
          <OrderSummary isMobile={true} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          {renderStepContent()}

          {currentStep < 5 && (
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Précédent
              </button>

              {currentStep === 4 ? (
                <button
                  onClick={handleSubmitOrder}
                  disabled={!validateStep(currentStep) || isSubmitting}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Traitement...
                    </>
                  ) : (
                    <>
                      Confirmer la commande
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Suivant
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Desktop Order Summary */}
        {currentStep < 5 && (
          <div className="hidden lg:block lg:col-span-1">
            <OrderSummary />
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default CheckoutPage;