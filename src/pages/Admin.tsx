import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import DashboardPage from '../components/admin/DashboardPage';
import OrdersPage from '../components/admin/OrdersPage';
import ShippingPage from '@/components/admin/ShippingPage';

import ShippingModal from '@/components/admin/Shippingmodal';
import ProductsPage from '../components/admin/ProductsPage';
import CategoriesPage from '../components/admin/CategoriesPage';
import BrandsPage from '../components/admin/BrandsPage';
import UsersPage from '../components/admin/UsersPage';
import OrderDetailsModal from '../components/admin/OrderDetailsModal';
import { useAuth } from '../hooks/useAuth';
import tokenManager from '../utils/tokenManager';

import { Product, Category, Brand, Order, User, DashboardStats } from '../types/admin';

function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);

    console.group("🔍 JWT Decoding");
    console.log("Raw token:", token);
    console.log("Header:", JSON.parse(atob(token.split('.')[0])));
    console.log("Payload:", decoded);
    console.log("Signature (encoded):", token.split('.')[2]);
    console.groupEnd();

    return decoded;
  } catch (e) {
    console.error("Error decoding JWT:", e);
    return null;
  }
}

function Admin() {
  const [currentPage, setCurrentPage] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { isAuthenticated, loading, logout } = useAuth();

  const navigate = useNavigate();

  // Mock data - initialize with useState
  const [dashboardStats] = useState<DashboardStats>({
    totalOrders: 1247,
    totalRevenue: 89654,
    totalProducts: 342,
    totalUsers: 1678,
    pendingOrders: 23,
    lowStockProducts: 8
  });

  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Electronics', parentId: null, productCount: 45 },
    { id: '2', name: 'Smartphones', parentId: '1', productCount: 15 },
    { id: '3', name: 'Laptops', parentId: '1', productCount: 12 },
    { id: '4', name: 'Clothing', parentId: null, productCount: 78 },
    { id: '5', name: 'Men', parentId: '4', productCount: 35 },
    { id: '6', name: 'Women', parentId: '4', productCount: 43 },
    { id: '7', name: 'Home & Garden', parentId: null, productCount: 92 },
    { id: '8', name: 'Furniture', parentId: '7', productCount: 45 },
    { id: '9', name: 'Books', parentId: null, productCount: 156 }
  ]);

  const [brands, setBrands] = useState<Brand[]>([
    { id: '1', name: 'Apple', logo: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg', productCount: 25 },
    { id: '2', name: 'Samsung', logo: 'https://images.pexels.com/photos/936722/pexels-photo-936722.jpeg', productCount: 18 },
    { id: '3', name: 'Nike', logo: 'https://images.pexels.com/photos/3651597/pexels-photo-3651597.jpeg', productCount: 42 },
    { id: '4', name: 'Adidas', logo: 'https://images.pexels.com/photos/1591055/pexels-photo-1591055.jpeg', productCount: 38 }
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'iPhone 14 Pro',
      description: 'Latest Apple smartphone with advanced camera system',
      price: 999.99,
      stock: 45,
      categoryId: '2',
      brandId: '1',
      images: [
        'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg',
        'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg'
      ],
      status: 'active',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'MacBook Pro 16"',
      description: 'Professional laptop for creative professionals',
      price: 2499.99,
      stock: 12,
      categoryId: '3',
      brandId: '1',
      images: [
        'https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg',
        'https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg'
      ],
      status: 'active',
      createdAt: '2024-01-12T14:20:00Z'
    },
    {
      id: '3',
      name: 'Galaxy S24 Ultra',
      description: 'Samsung flagship with S Pen and advanced AI features',
      price: 1199.99,
      stock: 3,
      categoryId: '2',
      brandId: '2',
      images: [
        'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg'
      ],
      status: 'active',
      createdAt: '2024-01-10T09:15:00Z'
    }
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      customerName: 'John Smith',
      customerEmail: 'john@example.com',
      total: 1299.98,
      status: 'pending',
      items: [
        {
          productId: '1',
          productName: 'iPhone 14 Pro',
          quantity: 1,
          price: 999.99,
          image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg'
        },
        {
          productId: '3',
          productName: 'Galaxy S24 Ultra',
          quantity: 1,
          price: 299.99,
          image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg'
        }
      ],
      createdAt: '2024-01-20T15:30:00Z',
      shippingAddress: '123 Main St, New York, NY 10001'
    },
    {
      id: 'ORD002',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah@example.com',
      total: 2499.99,
      status: 'processing',
      items: [
        {
          productId: '2',
          productName: 'MacBook Pro 16"',
          quantity: 1,
          price: 2499.99,
          image: 'https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg'
        }
      ],
      createdAt: '2024-01-19T11:45:00Z',
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90210'
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      role: 'customer',
      totalOrders: 5,
      totalSpent: 2599.95,
      discount: 10,
      status: 'active',
      createdAt: '2023-06-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'customer',
      totalOrders: 12,
      totalSpent: 5849.60,
      discount: 15,
      status: 'active',
      createdAt: '2023-03-22T14:20:00Z'
    },
    {
      id: '3',
      name: 'Mike Admin',
      email: 'admin@example.com',
      role: 'admin',
      totalOrders: 0,
      totalSpent: 0,
      discount: 0,
      status: 'active',
      createdAt: '2023-01-10T09:15:00Z'
    }
  ]);

  // Authorization check effect
useEffect(() => {
    if (loading) {
      return; // Wait for auth hook to finish loading
    }

    if (!isAuthenticated) {
      console.log("❌ Not authenticated, redirecting to login");
      navigate("/login", { replace: true });
      setCheckingAuth(false);
      return;
    }

    // Get token and verify admin access
    const token = tokenManager.getValidToken();
    if (!token) {
      console.log("❌ No valid token, redirecting to login");
      navigate("/login", { replace: true });
      setCheckingAuth(false);
      return;
    }

    try {
      const decoded = decodeJWT(token);
      if (decoded && decoded.username === "pro_chaud_admin") {
        console.log("✅ Admin access granted");
        setIsAuthorized(true);
      } else {
        console.log("❌ Not admin user, redirecting to login");
        logout(); // This will clear tokens and redirect
      }
    } catch (error) {
      console.error("Error validating admin access:", error);
      logout(); // This will clear tokens and redirect
    } finally {
      setCheckingAuth(false);
    }
  }, [isAuthenticated, loading, navigate, logout]);

  // Listen for token expiration events
  useEffect(() => {
    const handleTokenExpired = () => {
      console.log("🔄 Token expired, redirecting to login");
      setIsAuthorized(false);
      setCheckingAuth(false);
    };

    window.addEventListener('tokenExpired', handleTokenExpired);
    return () => window.removeEventListener('tokenExpired', handleTokenExpired);
  }, []);

  // Early returns for auth states
  if (loading || checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Checking authorization...</div>
      </div>
    );
  }

  if (!isAuthenticated || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Unauthorized access. Redirecting...</div>
      </div>
    );
  }

  // Early returns for auth states
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Checking authorization...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Unauthorized access</div>
      </div>
    );
  }

  // Handlers
  const handleCreateProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct = {
      ...productData,
      id: Math.random().toString(36).substr(2, 9)
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleCreateCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory = {
      ...categoryData,
      id: Math.random().toString(36).substr(2, 9)
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const handleUpdateCategory = (updatedCategory: Category) => {
    setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  const handleCreateBrand = (brandData: Omit<Brand, 'id'>) => {
    const newBrand = {
      ...brandData,
      id: Math.random().toString(36).substr(2, 9)
    };
    setBrands(prev => [...prev, newBrand]);
  };

  const handleUpdateBrand = (updatedBrand: Brand) => {
    setBrands(prev => prev.map(b => b.id === updatedBrand.id ? updatedBrand : b));
  };

  const handleDeleteBrand = (brandId: string) => {
    setBrands(prev => prev.filter(b => b.id !== brandId));
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

const renderCurrentPage = () => {
  switch (currentPage) {
    case 'orders':
      return (
        <OrdersPage
          orders={orders}
          onViewOrder={handleViewOrder}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      );
    case 'products':
      return (
        <ProductsPage
          products={products}
          categories={categories}
          brands={brands}
          onCreateProduct={handleCreateProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      );
    case 'categories':
      return (
        <CategoriesPage
          categories={categories}
          onCreateCategory={handleCreateCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      );
    case 'brands':
      return (
        <BrandsPage
          brands={brands}
          onCreateBrand={handleCreateBrand}
          onUpdateBrand={handleUpdateBrand}
          onDeleteBrand={handleDeleteBrand}
        />
      );
    case 'shipping':
      return <ShippingPage />;
    case 'users':
      {/*
       return (
         <UsersPage
           users={users}
           onUpdateUser={handleUpdateUser}
         />
       );
       */}
      return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Users</h2>
          <p className="text-gray-600">Users page coming soon...</p>
        </div>
      );
    case 'settings':
      return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
          <p className="text-gray-600">Settings page coming soon...</p>
        </div>
      );
    default:
      return <DashboardPage stats={dashboardStats} />;
  }
};

  return (
    <div className="App">
      <AdminLayout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderCurrentPage()}
      </AdminLayout>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateOrderStatus}
        />
      )}
    </div>
  );
}

export default Admin;