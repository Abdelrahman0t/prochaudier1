import React, { useState, useEffect } from "react";
import { Category } from "../../types/admin";
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, Image, Search, X } from "lucide-react";
import CategoryModal from "./CategoryModal";
import { apiClient } from "../../api/api"; // <-- Import your API client

// ...imports stay the same...

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  
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

const handleCreateCategory = async (categoryData: FormData | Omit<Category, "id">) => {
    try {
      await apiClient.createCategory2(categoryData);
      fetchCategories();
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleUpdateCategory = async (categoryData: FormData | Partial<Category>) => {
    try {
      if (!editingCategory) {
        console.error('No editing category selected');
        return;
      }
      
      await apiClient.updateCategory(editingCategory.id, categoryData);
      fetchCategories();
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!window.confirm("Deleting a category will delete all of its subcategories, Are you sure you want to delete this category?")) return;
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

  // Helper function to get full image URL
  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return null;
    
    // If it's already a full URL, return as-is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Otherwise, prepend the API base URL
    return import.meta.env.VITE_API_BASE_URL + imageUrl;
  };

const getBranchedProductCount = (category: Category): number => {
  let total = 0; // exclude parent's own count
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

// Search functionality
const searchInCategory = (category: Category, query: string): Category | null => {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return category;

  // Check if current category matches
  const categoryMatches = category.name.toLowerCase().includes(normalizedQuery);
  
  // Check children recursively
  const matchingChildren: Category[] = [];
  if (category.children) {
    for (const child of category.children) {
      const matchingChild = searchInCategory(child, query);
      if (matchingChild) {
        matchingChildren.push(matchingChild);
      }
    }
  }

  // Return category if it matches or has matching children
  if (categoryMatches || matchingChildren.length > 0) {
    return {
      ...category,
      children: matchingChildren.length > 0 ? matchingChildren : category.children
    };
  }

  return null;
};

const filterCategories = (categories: Category[], query: string): Category[] => {
  if (!query.trim()) return categories;
  
  const filtered: Category[] = [];
  for (const category of categories) {
    const matchingCategory = searchInCategory(category, query);
    if (matchingCategory) {
      filtered.push(matchingCategory);
    }
  }
  return filtered;
};

// Auto-expand categories when searching
useEffect(() => {
  if (searchQuery.trim()) {
    const expandAll = (cats: Category[]): Set<number> => {
      const expanded = new Set<number>();
      const addToExpanded = (category: Category) => {
        expanded.add(category.id);
        if (category.children) {
          category.children.forEach(addToExpanded);
        }
      };
      cats.forEach(addToExpanded);
      return expanded;
    };
    
    const filteredCats = filterCategories(categories, searchQuery);
    setExpandedCategories(expandAll(filteredCats));
  }
}, [searchQuery, categories]);

const clearSearch = () => {
  setSearchQuery("");
  setExpandedCategories(new Set());
};

const renderCategory = (category: Category, level: number = 0) => {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedCategories.has(category.id);
  const branchedCount = hasChildren ? getBranchedProductCount(category) : 0;
  const imageUrl = getImageUrl(category.image_url || null);



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

          {/* Category Image - only show if image exists */}
          {imageUrl && (
            <div className="flex-shrink-0">
              <img
                src={imageUrl}
                alt={category.name}
                className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  // Hide the image if it fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div>
            <h3 className="font-medium text-gray-900">
              {category.name}
            </h3>
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

  const filteredCategories = filterCategories(categories, searchQuery);

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

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-sm text-gray-500 mt-2">
            {filteredCategories.length} categories found for "{searchQuery}"
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm font-medium text-gray-600">Total Categories</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {/* Total = Parent categories + All subcategories */}
            {categories.length + categories.reduce(
              (count, c) => count + (c.children ? c.children.length : 0),
              0
            )}
          </p>
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
          <p className="text-sm text-gray-500 mt-1">Categories with images will display their thumbnails</p>
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading...</div>
        ) : filteredCategories.length > 0 ? (
          filteredCategories.map((category) => renderCategory(category))
        ) : searchQuery ? (
          <div className="p-12 text-center text-gray-500">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600 mb-2">No categories found</p>
            <p>Try adjusting your search terms or <button onClick={clearSearch} className="text-sky-600 hover:text-sky-700 underline">clear the search</button></p>
          </div>
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
              ? handleUpdateCategory(data)
              : handleCreateCategory(data)
          }
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CategoriesPage;