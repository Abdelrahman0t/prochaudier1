import React, { useState, useEffect } from 'react';
import { User, Package, Calendar, Mail, Phone, MapPin, CreditCard, Truck, LogOut, Loader2, ChevronDown, ChevronUp, Eye, Settings, Shield, Users, ShoppingBag, BarChart3, Database } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  useEffect(() => {
    fetchUserProfile();
    fetchUserOrders();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/user/profile/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError('Failed to load user profile');
      console.error('Error fetching user profile:', err);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/user/orders/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
        console.log('User orders fetched:', ordersData);
      } else if (response.status === 401) {
        handleLogout();
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('guest_id');
    window.location.href = '/login';
  };

  const handleAdminPanel = () => {
    // Navigate to admin panel - adjust the URL as needed
    window.location.href = '/admin';
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return `€${parseFloat(price).toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipping: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending: 'En attente',
      processing: 'En traitement',
      shipping: 'En livraison',
      delivered: 'Livré',
      cancelled: 'Annulé',
    };
    return statusTexts[status] || status;
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      cod: 'Paiement à la livraison',
      card: 'Carte bancaire',
      paypal: 'PayPal',
    };
    return methods[method] || method;
  };

  // Check if current user is admin
  const isAdmin = user?.username === 'pro_chaud_admin';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3 bg-white p-6 rounded-lg shadow-sm">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-700">Chargement de votre profil...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

return (
    <div>
        <Header />
  <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-8">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 ${isAdmin ? 'bg-gradient-to-br from-cyan-500 to-cyan-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'} rounded-full flex items-center justify-center shadow-lg flex-shrink-0`}>
                {isAdmin ? (
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                ) : (
                  <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {user?.first_name} {user?.last_name}
                  {isAdmin && <span className="ml-2 text-sm bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">Admin</span>}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base truncate">@{user?.username}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              {/* Admin Panel Button - Only show for pro_chaud_admin */}
              {isAdmin && (
                <button
                  onClick={handleAdminPanel}
                  className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors w-full sm:w-auto text-sm sm:text-base shadow-sm"
                >
                  <Settings className="w-4 h-4" />
                  <span>Panneau Admin</span>
                </button>
              )}
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* User Information Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 lg:sticky lg:top-28">
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-semibold">Informations personnelles</h2>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-gray-900 break-all leading-relaxed">{user?.email}</span>
                </div>
                
                <div className="flex items-center space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Membre depuis</p>
                    <p className="text-xs sm:text-sm text-gray-900">{formatDate(user?.date_joined)}</p>
                  </div>
                </div>

                <div className="pt-3 sm:pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                    {isAdmin ? "Statistiques admin" : "Statistiques du compte"}
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-blue-50 rounded-lg">
                      <span className="text-xs sm:text-sm text-gray-700">
                        {isAdmin ? "Accès admin" : "Commandes totales"}
                      </span>
                      <span className="font-semibold text-blue-700 text-sm sm:text-base">
                        {isAdmin ? "Activé" : orders.length}
                      </span>
                    </div>
                    {!isAdmin && (
                      <div className="flex justify-between items-center p-2 sm:p-3 bg-green-50 rounded-lg">
                        <span className="text-xs sm:text-sm text-gray-700">Total dépensé</span>
                        <span className="font-semibold text-green-700 text-sm sm:text-base">
                          {formatPrice(orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
              {isAdmin ? (
                // Admin Panel Section
                <>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4 sm:mb-6">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
                      <h2 className="text-base sm:text-lg font-semibold">Panneau d'administration</h2>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      Accès administrateur complet
                    </div>
                  </div>

                  <div className="text-center py-8 sm:py-12 mb-8">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Bienvenue, Administrateur</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-md mx-auto">
                      Accédez au panneau d'administration pour gérer le site, les utilisateurs, les commandes et plus encore.
                    </p>
                    <button
                      onClick={handleAdminPanel}
                      className="inline-flex items-center space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-xl hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 shadow-lg hover:shadow-xl text-base sm:text-lg font-medium"
                    >
                      <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>Accéder au panneau admin</span>
                    </button>
                  </div>

                  {/* Admin Quick Actions */}

                </>
              ) : (
                // Regular User Orders Section
                <>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4 sm:mb-6">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      <h2 className="text-base sm:text-lg font-semibold">Vos commandes</h2>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {orders.length > 0 
                        ? `${orders.length} commande${orders.length !== 1 ? 's' : ''}`
                        : 'Aucune commande'
                      }
                    </div>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Aucune commande trouvée</h3>
                      <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 px-4">
                        Votre historique de commandes apparaîtra ici une fois que vous aurez passé une commande
                      </p>
                      <button
                        onClick={() => window.location.href = '/products'}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm sm:text-base w-full sm:w-auto"
                      >
                        Commencer vos achats
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      {orders.map((order) => {
                        const isExpanded = expandedOrders.has(order.id);
                        const itemsToShow = isExpanded ? order.items : (order.items?.slice(0, 3) || []);
                        const hasMoreItems = (order.items?.length || 0) > 3;

                        return (
                          <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
                            {/* Order Header */}
                            <div className="bg-gray-50 p-3 sm:p-4 border-b">
                              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 gap-3">
                                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-3 sm:space-y-0">
                                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Commande #{order.id}</h3>
                                  <span className={`px-2 sm:px-3 py-1 text-xs rounded-full border self-start ${getStatusColor(order.status)}`}>
                                    {getStatusText(order.status)}
                                  </span>
                                </div>
                                <div className="flex flex-row items-center justify-between sm:flex-col sm:items-end gap-2">
                                  <p className="font-semibold text-base sm:text-lg">{formatPrice(order.total)}</p>
                                  <p className="text-xs sm:text-sm text-gray-600">
                                    {formatDate(order.order_date)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Order Content */}
                            <div className="p-3 sm:p-4">
                              {/* Order Items */}
                              {order.items && order.items.length > 0 && (
                                <div className="mb-4">
                                  <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-3">
                                    Articles commandés ({order.items.length})
                                  </h4>
                                  <div className="space-y-2 sm:space-y-3">
                                    {itemsToShow.map((item, index) => (
                                      <div key={index} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border">
                                          {item.image || item.product_image ? (
                                            <img 
                                              src={`${import.meta.env.VITE_API_BASE_URL}${item.image}`} 
                                              alt={item.product_title || item.product_name}
                                              className="w-full h-full object-cover"
                                              onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                              }}
                                            />
                                          ) : null}
                                          <div className="w-full h-full bg-gray-100 items-center justify-center hidden">
                                            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                                          </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium text-gray-900 truncate text-sm sm:text-base">
                                            {item.product_title || item.product_name}
                                          </p>
                                          <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:gap-4 sm:space-y-0 mt-1">
                                            <p className="text-xs sm:text-sm text-gray-600">
                                              Quantité: {item.quantity}
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-600">
                                              Prix unitaire: {formatPrice(item.price)}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                          <p className="font-semibold text-gray-900 text-sm sm:text-base">
                                            {formatPrice(item.quantity * parseFloat(item.price))}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Show All/Show Less Button */}
                                  {hasMoreItems && (
                                    <div className="mt-3 text-center">
                                      <button
                                        onClick={() => toggleOrderExpansion(order.id)}
                                        className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                                      >
                                        {isExpanded ? (
                                          <>
                                            <ChevronUp className="w-4 h-4" />
                                            <span>Afficher moins</span>
                                          </>
                                        ) : (
                                          <>
                                            <ChevronDown className="w-4 h-4" />
                                            <span className="hidden sm:inline">Afficher tous les articles ({order.items.length})</span>
                                            <span className="sm:hidden">Voir tous ({order.items.length})</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Shipping & Payment Info */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="font-medium text-xs sm:text-sm">Adresse de livraison</span>
                                  </div>
                                  <p className="text-xs sm:text-sm text-gray-900 leading-relaxed">
                                    {order.shipping_address}<br />
                                    {order.shipping_city}
                                    {order.shipping_region && `, ${order.shipping_region}`}
                                  </p>
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                                    <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="font-medium text-xs sm:text-sm">Mode de paiement</span>
                                  </div>
                                  <p className="text-xs sm:text-sm text-gray-900">
                                    {getPaymentMethodText(order.payment_method)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
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

export default ProfilePage;