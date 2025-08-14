//types/admin.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  brandId: string;
  images: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent?: number | null;
  parent_id?: number | null; // Django uses parent_id
  children?: Category[];
  productCount?: number;
  count?: number; // For API responses
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  productCount?: number;
  count?: number; // For API responses
}

export interface Brand {
  id: number;
  name: string;
  logo?: string;
  productCount: number;
}

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  price: number;
  total_price: number;
  image: string | null;
}

export interface Order {
  id: string;  // Order ID is string
  customer_first_name: string;
  customer_last_name: string;
  customer_name: string;  // Computed property from Django
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string | null;
  shipping_region: string;
  shipping_additional_info: string | null;
  payment_method: string;
  delivery_method: string;
  subtotal: number;
  delivery_price: number;
  total: number;
  status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  order_date: string;  // Django field name
  items: OrderItem[];
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  totalOrders: number;
  totalSpent: number;
  discount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
  lowStockProducts: number;
}