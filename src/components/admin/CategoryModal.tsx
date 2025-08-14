import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  parent?: number | null;
  count?: number;
  children?: Category[];
}

interface CategoryModalProps {
  category: Category | null;
  categories: Category[];
  onSave: (category: Omit<Category, 'id'>) => void;
  onClose: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  category,
  categories,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parent: null as number | null
  });

  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        parent: category.parent || null
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        parent: null
      });
    }
  }, [category]);

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      // Auto-generate slug only if we're creating a new category and slug is empty
      slug: !category && !prev.slug ? generateSlug(name) : prev.slug
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = generateSlug(e.target.value);
    setFormData(prev => ({
      ...prev,
      slug
    }));
  };

  const handleAutoGenerateSlug = () => {
    if (formData.name) {
      setIsGeneratingSlug(true);
      const newSlug = generateSlug(formData.name);
      setFormData(prev => ({
        ...prev,
        slug: newSlug
      }));
      setTimeout(() => setIsGeneratingSlug(false), 300);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }
    
    if (!formData.slug.trim()) {
      return;
    }

    onSave({
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      parent: formData.parent
    });
    
    // Close modal after saving
    onClose();
  };

  // Get available parent categories (exclude self and children when editing)
  const getAvailableParents = (): Category[] => {
    if (!category) {
      // Creating new category - show only top-level categories
      // Filter out indented names (these are children in the flattened list)
      return categories.filter(cat => !cat.name.startsWith('  '));
    }
    
    // Editing existing category - exclude self and any descendants
    const excludeIds = new Set([category.id]);
    
    // Since we're getting a flattened list, we need to find descendants differently
    const categoryIds = categories.map(c => c.id);
    const findDescendants = (parentId: number) => {
      categories.forEach(cat => {
        if (cat.parent === parentId && !excludeIds.has(cat.id)) {
          excludeIds.add(cat.id);
          findDescendants(cat.id);
        }
      });
    };
    
    findDescendants(category.id);
    
    return categories.filter(cat => 
      !excludeIds.has(cat.id) && 
      !cat.name.startsWith('  ') // Only show top-level categories
    );
  };

  const availableParents = getAvailableParents();

  return (
    <div style={{ marginTop: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {category ? 'Edit Category' : 'Create New Category'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleNameChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter category name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="category-slug"
                />
                <button
                  type="button"
                  onClick={handleAutoGenerateSlug}
                  disabled={!formData.name || isGeneratingSlug}
                  className="px-3 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingSlug ? '...' : 'Auto'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                URL-friendly version of the name. Used in web addresses.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent Category
              </label>
              <select
                name="parent"
                value={formData.parent || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  parent: e.target.value ? parseInt(e.target.value) : null
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="">No Parent (Top Level)</option>
                {availableParents.map((parentCat) => (
                  <option key={parentCat.id} value={parentCat.id}>
                    {parentCat.name.replace(/^\s+/, '')} {/* Remove any leading spaces */}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select a parent category to create a subcategory.
              </p>
            </div>

            {/* Show current hierarchy preview */}
            {formData.parent && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600 mb-1">Category hierarchy:</p>
                <p className="text-sm font-medium text-gray-900">
                  {categories.find(c => c.id === formData.parent)?.name.replace(/^\s+/, '')} → {formData.name || 'New Category'}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-4 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim() || !formData.slug.trim()}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {category ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;