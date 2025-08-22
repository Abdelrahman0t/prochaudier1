// api/api.ts - Updated with correct Orders API integration
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

// Types matching your Django models
export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number | null;
  children?: Category[];
  count?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  image_url?: string | null;
  count?: number;
}

export interface Product {
  id: number;
  title: string;
  short_description: string;  // NEW FIELD
  description: string;
  date: string;
  price: number | string;
  stock_status: 'instock' | 'outofstock';
  
  // 4 image fields
  image_1?: string;
  image_1_url?: string;
  image_2?: string;
  image_2_url?: string;
  image_3?: string;
  image_3_url?: string;
  image_4?: string;
  image_4_url?: string;
  
  // Computed fields
  main_image?: string;
  all_images?: Array<{
    position: number;
    url: string;
    is_file: boolean;
    is_main: boolean;
  }>;
  
  categories: Category[];
  tags: Tag[];
}

// Order Types - FIXED to match Django backend
export interface OrderItem {
  id: number;
  product: number;
  product_title: string;
  quantity: number;
  price: number;
  total_price: number;
  image: string | null;
}

export interface Order {
  id: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_name: string;  // This comes from Django @property
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
  order_date: string;  // This is the field name from Django
  items: OrderItem[];
}

// Response types for filtering endpoints
export interface ProductsResponse {
  products: Product[];
  page: number;
  total_pages: number;
}

export interface CategoriesTagsResponse {
  categories: Category[];
  tags: Tag[];
}

export interface SearchSuggestion {
  id: number;
  title: string;
  image: string;
}

class ApiClient {
   private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  
private async request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: options.body instanceof FormData 
      ? {
          // For FormData, don't set Content-Type (let browser set it with boundary)
          ...this.getAuthHeaders(), // Add auth headers
          ...options.headers,
        }
      : {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(), // Add auth headers
          ...options.headers,
        }
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error Response:', errorData);
      throw new Error(`HTTP error! status: ${response.status}, details: ${errorData}`);
    }
    
    // Handle DELETE requests - they might return 204 No Content with no body
    if (options.method === 'DELETE' && (response.status === 204 || response.status === 200)) {
      return undefined as T; // DELETE returns void, so return undefined
    }
    
    // Check if there's any content to parse
    const contentLength = response.headers.get('content-length');
    if (contentLength === '0' || response.status === 204) {
      return undefined as T;
    }
    
    // Check if response has JSON content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    // For non-JSON responses, try to get text
    const text = await response.text();
    if (text) {
      // If it's not empty, try to parse as JSON, otherwise return as is
      try {
        return JSON.parse(text);
      } catch {
        return text as T;
      }
    }
    
    return undefined as T;
    
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}


    setAuthToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  clearAuthToken() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Public product endpoints
  async getAllProducts(params?: {
    page?: number;
    categories?: string;
    tags?: string;
    search?: string;
    min_price?: string;
    max_price?: string;
  }): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.categories) searchParams.set('categories', params.categories);
    if (params?.tags) searchParams.set('tags', params.tags);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.min_price) searchParams.set('min_price', params.min_price);
    if (params?.max_price) searchParams.set('max_price', params.max_price);
    
    const queryString = searchParams.toString();
    return this.request<ProductsResponse>(`/products/${queryString ? '?' + queryString : ''}`);
  }

  async getProductDetail(productId: number): Promise<Product> {
    return this.request<Product>(`/products/${productId}/`);
  }

  async getCategoriesAndTags(): Promise<CategoriesTagsResponse> {
    return this.request<CategoriesTagsResponse>('/categories-tags/');
  }

  async getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
    const searchParams = new URLSearchParams({ q: query });
    return this.request<SearchSuggestion[]>(`/search-suggestions/?${searchParams.toString()}`);
  }

  // Admin Products API
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/admin/products/');
  }

  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/admin/products/${id}/`);
  }

  async createProduct(formData: FormData): Promise<Product> {
    console.log('Creating product with FormData...');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    
    return this.request<Product>('/admin/products/', {
      method: 'POST',
      body: formData,
    });
  }

  async updateProduct(id: number, formData: FormData): Promise<Product> {
    console.log(`Updating product ${id} with FormData...`);
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    
    return this.request<Product>(`/admin/products/${id}/`, {
      method: 'PUT',
      body: formData,
    });
  }

  async deleteProduct(id: number): Promise<void> {
    return this.request<void>(`/admin/products/${id}/`, {
      method: 'DELETE',
    });
  }

  // Image management endpoints
  async swapProductImages(productId: number, position1: number, position2: number): Promise<Product> {
    return this.request<Product>(`/admin/products/${productId}/swap-images/`, {
      method: 'POST',
      body: JSON.stringify({
        position1,
        position2
      }),
    });
  }

  async deleteProductImage(productId: number, position: number): Promise<Product> {
    return this.request<Product>(`/admin/products/${productId}/delete-image/`, {
      method: 'POST',
      body: JSON.stringify({
        position
      }),
    });
  }

  async makeProductImageMain(productId: number, position: number): Promise<Product> {
    return this.request<Product>(`/admin/products/${productId}/make-main/`, {
      method: 'POST',
      body: JSON.stringify({
        position
      }),
    });
  }

  // Categories API
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/admin/categories/');
  }

  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    return this.request<Category>('/admin/categories/', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async getCategories2(): Promise<Category[]> {
    return this.request<Category[]>('/admin/categories2/');
  }

  async createCategory2(categoryData: Partial<Category>): Promise<Category> {
    return this.request<Category>('/admin/categories2/', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: number, categoryData: Partial<Category>): Promise<Category> {
    return this.request<Category>(`/admin/categories2/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: number): Promise<void> {
    return this.request<void>(`/admin/categories2/${id}/`, {
      method: 'DELETE',
    });
  }

  // Tags API
async getTags(): Promise<{ tags: Tag[]; total_products: number }> {
  return this.request<{ tags: Tag[]; total_products: number }>('/admin/tags/');
}

async createTag(tagData: FormData | { name: string; slug: string; image?: File }): Promise<Tag> {
  const body = tagData instanceof FormData ? tagData : JSON.stringify(tagData);
  
  return this.request<Tag>('/admin/tags/', {
    method: 'POST',
    body,
  });
}

async updateTag(id: number, tagData: FormData | { name: string; slug: string; image?: File; remove_image?: string }): Promise<Tag> {
  const body = tagData instanceof FormData ? tagData : JSON.stringify(tagData);
  
  return this.request<Tag>(`/admin/tags/${id}/`, {
    method: 'PUT',
    body,
  });
}

  async deleteTag(id: number): Promise<void> {
    return this.request<void>(`/admin/tags/${id}/`, {
      method: 'DELETE',
    });
  }

  // Orders API - CORRECTED to match Django backend
  async getOrders(): Promise<Order[]> {
    return this.request<Order[]>('/admin/orders/');
  }

  async getOrderDetail(orderId: string): Promise<Order> {  // Changed to string
    return this.request<Order>(`/admin/orders/${orderId}/`);
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {  // Changed to string
    return this.request<Order>(`/admin/orders/${orderId}/status/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Helper functions for data transformation
export const organizeCategoriesHierarchical = (categories: Category[]): Category[] => {
  const categoryMap = new Map<number, Category>();
  const rootCategories: Category[] = [];

  // First pass: create map and initialize children arrays
  categories.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  // Second pass: build hierarchy
  categories.forEach(category => {
    const categoryWithChildren = categoryMap.get(category.id)!;
    
    if (category.parent === null) {
      rootCategories.push(categoryWithChildren);
    } else {
      const parent = categoryMap.get(category.parent);
      if (parent) {
        parent.children!.push(categoryWithChildren);
      }
    }
  });

  return rootCategories;
};

// Helper to build category filter string from slugs
export const buildCategoryFilterString = (categorySlugs: string[]): string => {
  return categorySlugs.join(',');
};

// Helper to build tag filter string from slugs
export const buildTagFilterString = (tagSlugs: string[]): string => {
  return tagSlugs.join(',');
};

// Helper to format price
export const formatPriceForFilter = (price: number | string): string => {
  if (typeof price === 'number') {
    return price.toString();
  }
  return price;
};