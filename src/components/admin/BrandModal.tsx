import React, { useState, useEffect } from 'react';
import { Tag } from '../../types/admin'; // Changed from Brand to Tag
import { X } from 'lucide-react';

interface BrandModalProps {
  brand: Tag | null; // Changed Brand to Tag
  onSave: (brand: { name: string; slug?: string }) => void; // Updated interface
  onClose: () => void;
}

const BrandModal: React.FC<BrandModalProps> = ({
  brand,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name,
        slug: brand.slug
      });
    } else {
      setFormData({
        name: '',
        slug: ''
      });
    }
    setErrors({});
  }, [brand]);

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '')     // Remove non-alphanumeric characters except hyphens
      .replace(/-+/g, '-')            // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '');         // Remove leading/trailing hyphens
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Brand name is required';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        name: formData.name.trim(),
        slug: formData.slug.trim()
      });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      // Auto-generate slug only if creating new brand and slug hasn't been manually edited
      slug: !brand && !formData.slug ? generateSlug(name) : prev.slug
    }));
    
    // Clear name error when user starts typing
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData(prev => ({
      ...prev,
      slug
    }));
    
    // Clear slug error when user starts typing
    if (errors.slug) {
      setErrors(prev => ({ ...prev, slug: '' }));
    }
  };

  return (
    <div style={{ marginTop: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {brand ? 'Edit Brand' : 'Create New Brand'}
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
                Brand Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleNameChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter brand name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleSlugChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                  errors.slug ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="brand-slug"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                URL-friendly version of the name (lowercase, hyphens only)
              </p>
            </div>

            {/* Preview */}
            {formData.name && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {formData.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{formData.name}</p>
                    <p className="text-sm text-gray-500">/{formData.slug}</p>
                  </div>
                </div>
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
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              {brand ? 'Update Brand' : 'Create Brand'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandModal;