import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2, Image } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  parent?: number | null;
  count?: number;
  product_count?: number;
  children?: Category[];
  image?: string | null;
  image_url?: string | null;
}

interface CategoryModalProps {
  category: Category | null;
  categories: Category[];
  onSave: (categoryData: FormData | Omit<Category, 'id'>) => void;
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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isNewImage, setIsNewImage] = useState(false); // Track if this is a newly uploaded image
  const [removeImage, setRemoveImage] = useState(false);
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        parent: category.parent || null
      });
      setImagePreview(category.image_url || null);
      setIsNewImage(false);
      setRemoveImage(false);
    } else {
      setFormData({
        name: '',
        slug: '',
        parent: null
      });
      setImagePreview(null);
      setIsNewImage(false);
      setRemoveImage(false);
    }
    setImageFile(null);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      setRemoveImage(false);
      setIsNewImage(true); // Mark as newly uploaded image

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setIsNewImage(false);
    setRemoveImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

    console.log('=== FORM SUBMIT DEBUG ===');
    console.log('Image file:', imageFile);
    console.log('Remove image:', removeImage);
    console.log('Is editing:', !!category);

    // Create FormData if we have an image change or removal
    if (imageFile || removeImage) {
      console.log('Creating FormData...');
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('slug', formData.slug.trim());
      
      if (formData.parent) {
        formDataToSend.append('parent', formData.parent.toString());
      }

      if (imageFile) {
        console.log('Adding image file to FormData:', imageFile.name);
        formDataToSend.append('image', imageFile);
      }

      if (removeImage) {
        console.log('Adding remove_image flag');
        formDataToSend.append('remove_image', 'true');
      }

      // Debug FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      onSave(formDataToSend);
    } else {
      console.log('No image changes, sending regular object');
      // No image changes, send regular object
      onSave({
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        parent: formData.parent
      });
    }
    
    // Close modal after saving
    onClose();
  };

  // Get available parent categories (exclude self and children when editing)
  const getAvailableParents = (): Category[] => {
    if (!category) {
      // Creating new category - show only top-level categories
      return categories.filter(cat => !cat.name.startsWith('  '));
    }
    
    // Editing existing category - exclude self and any descendants
    const excludeIds = new Set([category.id]);
    
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
      !cat.name.startsWith('  ')
    );
  };

  const availableParents = getAvailableParents();

  // Helper function to get the correct image URL
  const getImageUrl = (preview: string | null) => {
    if (!preview) return null;
    
    // If it's a newly uploaded image, it will be a data URL (blob)
    if (isNewImage) {
      return preview;
    }
    
    // If it's an existing image from the server, prepend the API base URL
    return import.meta.env.VITE_API_BASE_URL + preview;
  };

  return (
    <div style={{ marginTop: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
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

        <div onSubmit={handleSubmit} className="p-6">
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
                    {parentCat.name.replace(/^\s+/, '')}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select a parent category to create a subcategory.
              </p>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Image (Optional)
              </label>
              
              {imagePreview ? (
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <img
                      src={getImageUrl(imagePreview)}
                      alt="Category preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Change Image</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <div className="text-center">
                    <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload image</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 5MB</p>
                  </div>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
              
              <p className="text-xs text-gray-500 mt-1">
                Optional image for the category. Recommended size: 300x300px.
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
              onClick={handleSubmit}
              disabled={!formData.name.trim() || !formData.slug.trim()}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {category ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;