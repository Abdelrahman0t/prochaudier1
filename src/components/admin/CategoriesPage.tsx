import React, { useState, useEffect } from "react";
import { Category } from "../../types/admin";
import { Plus, Edit, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import CategoryModal from "./CategoryModal";
import { apiClient } from "../../api/api"; // <-- Import your API client

// ...imports stay the same...

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  
const fetchCategories = async () => {
  try {
    setLoading(true);
    const data = await apiClient.getCategories(); // <-- CHANGED: Use getCategories2
    setCategories(data);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (categoryData: Omit<Category, "id">) => {
    try {
      await apiClient.createCategory(categoryData);
      fetchCategories();
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleUpdateCategory = async (category: Category) => {
    try {
      await apiClient.updateCategory(category.id, category);
      fetchCategories();
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await apiClient.deleteCategory(categoryId);
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const toggleExpanded = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };


const getBranchedProductCount = (category: Category): number => {
  let total = 0; // exclude parent’s own count
  if (category.children && category.children.length > 0) {
    for (const child of category.children) {
      total += (child.product_count || 0) + getBranchedProductCount(child);
    }
  }
  return total;
};



const getBranchedCategoryCount = (category: Category): number => {
  let total = 0;
  if (category.children && category.children.length > 0) {
    total += category.children.length; // direct children
    for (const child of category.children) {
      total += getBranchedCategoryCount(child); // deeper descendants
    }
  }
  return total;
};

const renderCategory = (category: Category, level: number = 0) => {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedCategories.has(category.id);
  const branchedCount = hasChildren ? getBranchedProductCount(category) : 0;

  return (
    <div key={category.id}>
      <div
        className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition-colors"
        style={{ paddingLeft: `${16 + level * 24}px` }}
      >
        <div className="flex items-center space-x-3">
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(category.id)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-6 h-6" />
          )}

          <div>
            <h3 className="font-medium text-gray-900">{category.name}</h3>
<p className="text-sm text-gray-500">
  {category.product_count || 0} products
  {getBranchedCategoryCount(category) > 0 && (
    <> • {getBranchedCategoryCount(category)} branched categories ({getBranchedProductCount(category)})</>
  )}
  {level > 0 && " • Subcategory"}
</p>

          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setEditingCategory(category);
              setIsModalOpen(true);
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteCategory(category.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div>{category.children!.map((child) => renderCategory(child, level + 1))}</div>
      )}
    </div>
  );
};


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600">Organize products into hierarchical categories</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm font-medium text-gray-600">Total Categories</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{categories.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm font-medium text-gray-600">Parent Categories</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{categories.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm font-medium text-gray-600">Subcategories</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {/* Count all nested children */}
            {categories.reduce(
              (count, c) => count + (c.children ? c.children.length : 0),
              0
            )}
          </p>
        </div>
      </div>

      {/* Categories Tree */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Category Hierarchy</h3>
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading...</div>
        ) : categories.length > 0 ? (
          categories.map((category) => renderCategory(category))
        ) : (
          <div className="p-12 text-center text-gray-500">
            No categories found. Create your first category to get started.
          </div>
        )}
      </div>

      {isModalOpen && (
        <CategoryModal
          category={editingCategory}
          categories={categories}
          onSave={(data) =>
            editingCategory
              ? handleUpdateCategory({ ...editingCategory, ...data })
              : handleCreateCategory(data)
          }
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CategoriesPage;
