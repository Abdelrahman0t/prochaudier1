// hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { 
  apiClient, 
  Product as ApiProduct, 
  Category as ApiCategory, 
  Tag as ApiTag,
  transformProductFromApi,
  transformProductForApi 
} from '../api/api';

// Frontend types (keeping your existing interface)
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
  id: string;
  name: string;
  slug?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug?: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [apiProducts, apiCategories, apiTags] = await Promise.all([
        apiClient.getProducts(),
        apiClient.getCategories(),
        apiClient.getTags()
      ]);

      // Transform API data to frontend format
      const transformedProducts = apiProducts.map(transformProductFromApi);
      const transformedCategories = apiCategories.map(cat => ({
        id: cat.id.toString(),
        name: cat.name,
        slug: cat.slug
      }));
      const transformedBrands = apiTags.map(tag => ({
        id: tag.id.toString(),
        name: tag.name,
        slug: tag.slug
      }));

      setProducts(transformedProducts);
      setCategories(transformedCategories);
      setBrands(transformedBrands);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      setError(null);
      console.log('Creating product with data:', productData);
      
      // Validate required fields before sending
      if (!productData.name?.trim()) {
        throw new Error('Product name is required');
      }
      if (!productData.categoryId) {
        throw new Error('Category is required');
      }
      if (!productData.brandId) {
        throw new Error('Brand is required');
      }
      if (productData.price <= 0) {
        throw new Error('Price must be greater than 0');
      }

      const apiData = transformProductForApi(productData);
      console.log('Sending to API:', apiData);
      
      const createdProduct = await apiClient.createProduct(apiData);
      const transformedProduct = transformProductFromApi(createdProduct);
      
      setProducts(prev => [...prev, transformedProduct]);
      return transformedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      console.error('Create product error:', err);
      throw err;
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      setError(null);
      console.log('Updating product with data:', updatedProduct);

      // Validate required fields before sending
      if (!updatedProduct.name?.trim()) {
        throw new Error('Product name is required');
      }
      if (!updatedProduct.categoryId) {
        throw new Error('Category is required');
      }
      if (!updatedProduct.brandId) {
        throw new Error('Brand is required');
      }
      if (updatedProduct.price <= 0) {
        throw new Error('Price must be greater than 0');
      }

      const apiData = transformProductForApi(updatedProduct);
      console.log('Sending to API for update:', apiData);
      
      const updated = await apiClient.updateProduct(parseInt(updatedProduct.id), apiData);
      const transformedProduct = transformProductFromApi(updated);
      
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? transformedProduct : p));
      return transformedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      console.error('Update product error:', err);
      throw err;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      setError(null);
      await apiClient.deleteProduct(parseInt(productId));
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      console.error('Delete product error:', err);
      throw err;
    }
  };

  const createCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      setError(null);
      const created = await apiClient.createCategory({
        name: categoryData.name,
        slug: categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-'),
        parent: null // Default no parent
      });
      const newCategory = {
        id: created.id.toString(),
        name: created.name,
        slug: created.slug
      };
      
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create category';
      setError(errorMessage);
      throw err;
    }
  };

  const createBrand = async (brandData: Omit<Brand, 'id'>) => {
    try {
      setError(null);
      const created = await apiClient.createTag({
        name: brandData.name,
        slug: brandData.slug || brandData.name.toLowerCase().replace(/\s+/g, '-')
      });
      const newBrand = {
        id: created.id.toString(),
        name: created.name,
        slug: created.slug
      };
      
      setBrands(prev => [...prev, newBrand]);
      return newBrand;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create brand';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    products,
    categories,
    brands,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    createBrand,
    refreshData: loadData
  };
};