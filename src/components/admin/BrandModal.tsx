import React, { useState, useEffect, useRef } from 'react';
import { Tag } from '../../types/admin'; // Changed from Brand to Tag
import { X, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';

interface BrandModalProps {
  brand: Tag | null; // Changed Brand to Tag
  onSave: (brand: { 
    name: string; 
    slug?: string; 
    image?: File | null; 
    removeImage?: boolean;
  }) => void;
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name,
        slug: brand.slug
      });
      setImagePreview(brand.image_url || null);
      setSelectedImage(null);
      setRemoveImage(false);
    } else {
      setFormData({
        name: '',
        slug: ''
      });
      setImagePreview(null);
      setSelectedImage(null);
      setRemoveImage(false);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ 
          ...prev, 
          image: 'Please select a valid image file (JPEG, PNG, or WebP)' 
        }));
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ 
          ...prev, 
          image: 'Image size must be less than 5MB' 
        }));
        return;
      }
      
      setSelectedImage(file);
      setRemoveImage(false);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear any image errors
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setRemoveImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        image: selectedImage,
        removeImage: removeImage
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
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
          <div className="space-y-6">
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

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Image (Optional)
              </label>
              
              {imagePreview && !removeImage ? (
                <div className="mb-4">
                  <div className="relative inline-block">
                    <img 
                      src={imagePreview} 
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Click the trash icon to remove the current image
                  </p>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Click to upload an image</p>
                  <p className="text-xs text-gray-400">JPEG, PNG, WebP up to 5MB</p>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
              
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
              )}
            </div>

            {/* Preview */}
            {formData.name && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {imagePreview && !removeImage ? (
                      <img 
                        src={imagePreview} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-medium">
                        {formData.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{formData.name}</p>
                    <p className="text-sm text-gray-500">/{formData.slug}</p>
                    {imagePreview && !removeImage && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        With image
                      </p>
                    )}
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