import { useState, useEffect } from 'react';
import { Product, Category, Brand } from '../types/admin';
import adminApiService from '../services/adminApi';


interface UseAdminCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  createCategory: (category: Omit<Category, 'id'>) => Promise<boolean>;
  updateCategory: (category: Category) => Promise<boolean>;
  deleteCategory: (categoryId: string) => Promise<boolean>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export const useAdminCategories = (): UseAdminCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await adminApiService.getCategories();
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: Omit<Category, 'id'>): Promise<boolean> => {
    try {
      const response = await adminApiService.createCategory(categoryData);
      
      if (response.error) {
        setError(response.error);
        return false;
      } else if (response.data) {
        setCategories(prev => [response.data!, ...prev]);
        return true;
      }
      return false;
    } catch (error) {
      setError('Failed to create category');
      return false;
    }
  };

  const updateCategory = async (category: Category): Promise<boolean> => {
    try {
      const response = await adminApiService.updateCategory(category.id, category);
      
      if (response.error) {
        setError(response.error);
        return false;
      } else if (response.data) {
        setCategories(prev => 
          prev.map(c => c.id === category.id ? response.data! : c)
        );
        return true;
      }
      return false;
    } catch (error) {
      setError('Failed to update category');
      return false;
    }
  };

  const deleteCategory = async (categoryId: string): Promise<boolean> => {
    try {
      const response = await adminApiService.deleteCategory(categoryId);
      
      if (response.error) {
        setError(response.error);
        return false;
      } else {
        setCategories(prev => prev.filter(c => c.id !== categoryId));
        return true;
      }
    } catch (error) {
      setError('Failed to delete category');
      return false;
    }
  };

  const refresh = async () => {
    await loadCategories();
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refresh,
    clearError,
  };
};