import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Loader, Search, ChevronDown, ChevronRight, Upload, ExternalLink, RefreshCw, ArrowUp } from 'lucide-react';
import { Product, Category, Tag, organizeCategoriesHierarchical, apiClient } from '@/api/api';

interface ProductModalProps {
  product: Product | null;
  categories: Category[];
  tags: Tag[];
  onSave: (product: any) => void;
  onClose: () => void;
  isLoading?: boolean;
  onProductUpdate?: (product: Product) => void; // Add callback for product updates
}

interface ImageSlot {
  position: number;
  file: File | null;
  url: string;
  preview: string;
  isFile: boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  categories,
  tags,
  onSave,
  onClose,
  isLoading = false,
  onProductUpdate
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock_status: 'instock' as 'instock' | 'outofstock',
    category_ids: [] as number[],
    tag_ids: [] as number[],
    date: new Date().toISOString(),
  });
  
  const [images, setImages] = useState<ImageSlot[]>([
    { position: 1, file: null, url: '', preview: '', isFile: false },
    { position: 2, file: null, url: '', preview: '', isFile: false },
    { position: 3, file: null, url: '', preview: '', isFile: false },
    { position: 4, file: null, url: '', preview: '', isFile: false }
  ]);
  
  const [categorySearch, setCategorySearch] = useState('');
  const [tagSearch, setTagSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [imageOperationLoading, setImageOperationLoading] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description || '',
        price: product.price.toString(),
        stock_status: product.stock_status,
        category_ids: product.categories.map(c => c.id),
        tag_ids: product.tags.map(t => t.id),
        date: product.date,
      });
      
      loadProductImages(product);
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        stock_status: 'instock',
        category_ids: [],
        tag_ids: [],
        date: new Date().toISOString(),
      });
      setImages([
        { position: 1, file: null, url: '', preview: '', isFile: false },
        { position: 2, file: null, url: '', preview: '', isFile: false },
        { position: 3, file: null, url: '', preview: '', isFile: false },
        { position: 4, file: null, url: '', preview: '', isFile: false }
      ]);
    }
    setValidationErrors({});
  }, [product]);

  const loadProductImages = (productData: Product) => {
    const newImages = [...images];
    for (let i = 1; i <= 4; i++) {
      const imageUrl = productData[`image_${i}`] || productData[`image_${i}_url`];
      if (imageUrl) {
        newImages[i - 1] = {
          position: i,
          file: null,
          url: imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`,
          preview: imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`,
          isFile: false
        };
      } else {
        newImages[i - 1] = { position: i, file: null, url: '', preview: '', isFile: false };
      }
    }
    setImages(newImages);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Product title is required';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    if (formData.category_ids.length === 0) {
      errors.categories = 'Please select at least one category';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Add basic fields
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock_status', formData.stock_status);
      formDataToSend.append('date', formData.date);
      
      // Add categories and tags
      formData.category_ids.forEach(id => {
        formDataToSend.append('category_ids', id.toString());
      });
      formData.tag_ids.forEach(id => {
        formDataToSend.append('tag_ids', id.toString());
      });
      
      // Add images
      images.forEach((imageSlot) => {
        if (imageSlot.file) {
          // File upload
          formDataToSend.append(`image_${imageSlot.position}`, imageSlot.file);
        } else if (imageSlot.url && imageSlot.url.trim()) {
          // URL
          formDataToSend.append(`image_${imageSlot.position}_url`, imageSlot.url.trim());
        } else {
          // Empty - for updates, this will clear the field
          formDataToSend.append(`image_${imageSlot.position}_url`, '');
        }
      });

      await onSave(formDataToSend);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Image handling functions
  const handleFileChange = (position: number, file: File | null) => {
    if (file) {
      const preview = URL.createObjectURL(file);
      setImages(prev => prev.map(img => 
        img.position === position 
          ? { ...img, file, url: '', preview, isFile: true }
          : img
      ));
    }
  };

  const handleUrlChange = (position: number, url: string) => {
    setImages(prev => prev.map(img => 
      img.position === position 
        ? { ...img, file: null, url, preview: url, isFile: false }
        : img
    ));
  };

  const clearImage = async (position: number) => {
  const imageToDelete = images.find(img => img.position === position);
  
  if (!product || imageToDelete?.file !== null) {
    // For new products OR if it's a newly uploaded file, just clear locally
    setImages(prev => prev.map(img => 
      img.position === position 
        ? { position, file: null, url: '', preview: '', isFile: false }
        : img
    ));
    return;
  }

  // For existing products with saved images, call API
  try {
    setImageOperationLoading(`delete-${position}`);
    const updatedProduct = await apiClient.deleteProductImage(product.id, position);
    loadProductImages(updatedProduct);
    onProductUpdate?.(updatedProduct);
  } catch (error) {
    console.error('Failed to delete image:', error);
    alert('Failed to delete image. Please try again.');
  } finally {
    setImageOperationLoading(null);
  }
};

  const swapImages = async (pos1: number, pos2: number) => {
  // Check if either position has unsaved changes (local files)
  const img1 = images.find(img => img.position === pos1);
  const img2 = images.find(img => img.position === pos2);
  
  const hasUnsavedChanges = (img1?.file !== null) || (img2?.file !== null);
  
  if (!product || hasUnsavedChanges) {
    // For new products OR existing products with unsaved file uploads, swap locally
    setImages(prev => {
      const newImages = [...prev];
      const img1Index = newImages.findIndex(img => img.position === pos1);
      const img2Index = newImages.findIndex(img => img.position === pos2);
      
      if (img1Index !== -1 && img2Index !== -1) {
        // Store the data we want to swap
        const img1Data = {
          file: newImages[img1Index].file,
          url: newImages[img1Index].url,
          preview: newImages[img1Index].preview,
          isFile: newImages[img1Index].isFile
        };
        
        const img2Data = {
          file: newImages[img2Index].file,
          url: newImages[img2Index].url,
          preview: newImages[img2Index].preview,
          isFile: newImages[img2Index].isFile
        };
        
        // Perform the swap
        newImages[img1Index] = { position: pos1, ...img2Data };
        newImages[img2Index] = { position: pos2, ...img1Data };
      }
      
      return newImages;
    });
    return;
  }

  // For existing products with only saved images, call API
  try {
    setImageOperationLoading(`swap-${pos1}-${pos2}`);
    const updatedProduct = await apiClient.swapProductImages(product.id, pos1, pos2);
    loadProductImages(updatedProduct);
    onProductUpdate?.(updatedProduct);
  } catch (error) {
    console.error('Failed to swap images:', error);
    alert('Failed to swap images. Please try again.');
  } finally {
    setImageOperationLoading(null);
  }
};

  const moveToMain = async (position: number) => {
  if (position === 1) return;

  // Check if there's actually an image at the source position
  const sourceImage = images.find(img => img.position === position);
  if (!sourceImage || (!sourceImage.file && !sourceImage.url)) {
    console.warn(`No image found at position ${position} to move`);
    return;
  }

  // Check if we have unsaved changes
  const hasUnsavedChanges = images.some(img => img.file !== null);

  if (!product || hasUnsavedChanges) {
    // For new products OR existing products with unsaved changes, swap locally
    swapImages(1, position);
    return;
  }

  // For existing products with only saved images, call API
  try {
    setImageOperationLoading(`main-${position}`);
    const updatedProduct = await apiClient.makeProductImageMain(product.id, position);
    loadProductImages(updatedProduct);
    onProductUpdate?.(updatedProduct);
  } catch (error) {
    console.error('Failed to make image main:', error);
    alert('Failed to make image main. Please try again.');
  } finally {
    setImageOperationLoading(null);
  }
};

  // Category and tag management functions (unchanged)
  const handleCategoryChange = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter(id => id !== categoryId)
        : [...prev.category_ids, categoryId]
    }));
    
    if (validationErrors.categories) {
      setValidationErrors(prev => ({ ...prev, categories: '' }));
    }
  };

  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleTagChange = (tagId: number) => {
    setFormData(prev => ({
      ...prev,
      tag_ids: prev.tag_ids.includes(tagId)
        ? prev.tag_ids.filter(id => id !== tagId)
        : [...prev.tag_ids, tagId]
    }));
  };

  // Filter functions (unchanged)
  const getCategoryPath = (category: Category, categoriesMap: Map<number, Category>): string => {
    if (category.parent === null) {
      return category.name;
    }
    const parent = categoriesMap.get(category.parent);
    if (parent) {
      return `${getCategoryPath(parent, categoriesMap)} > ${category.name}`;
    }
    return category.name;
  };

  const getFilteredCategories = () => {
    if (!categorySearch.trim()) return categories;
    
    const categoriesMap = new Map<number, Category>();
    categories.forEach(cat => categoriesMap.set(cat.id, cat));
    
    return categories.filter(cat => {
      const fullPath = getCategoryPath(cat, categoriesMap);
      return fullPath.toLowerCase().includes(categorySearch.toLowerCase());
    });
  };

  const getFilteredTags = () => {
    if (!tagSearch.trim()) return tags;
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(tagSearch.toLowerCase())
    );
  };

  // Render category tree (unchanged)
  const renderCategoryTree = () => {
    const filteredCategories = getFilteredCategories();
    
    if (categorySearch.trim()) {
      const categoriesMap = new Map<number, Category>();
      categories.forEach(cat => categoriesMap.set(cat.id, cat));
      
      return filteredCategories.map(category => {
        const isSelected = formData.category_ids.includes(category.id);
        const fullPath = getCategoryPath(category, categoriesMap);
        
        return (
          <div key={category.id} className="flex items-center py-2">
            <input
              type="checkbox"
              id={`category-${category.id}`}
              checked={isSelected}
              onChange={() => handleCategoryChange(category.id)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label 
              htmlFor={`category-${category.id}`} 
              className={`ml-2 text-sm cursor-pointer ${isSelected ? 'font-medium text-blue-700' : 'text-gray-700'}`}
            >
              {fullPath}
            </label>
          </div>
        );
      });
    }
    
    const hierarchicalCategories = organizeCategoriesHierarchical(filteredCategories);
    
    const renderCategories = (cats: Category[], level = 0): JSX.Element[] => {
      return cats.flatMap(category => {
        const indent = level * 20;
        const hasChildren = category.children && category.children.length > 0;
        const isExpanded = expandedCategories.has(category.id);
        const isSelected = formData.category_ids.includes(category.id);
        
        const elements = [
          <div key={category.id} className="flex items-center py-1" style={{ marginLeft: `${indent}px` }}>
            {hasChildren && (
              <button
                type="button"
                onClick={() => toggleCategoryExpansion(category.id)}
                className="p-1 hover:bg-gray-100 rounded mr-1"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-5" />}
            <input
              type="checkbox"
              id={`category-${category.id}`}
              checked={isSelected}
              onChange={() => handleCategoryChange(category.id)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label 
              htmlFor={`category-${category.id}`} 
              className={`ml-2 text-sm cursor-pointer ${isSelected ? 'font-medium text-blue-700' : 'text-gray-700'}`}
            >
              {category.name}
            </label>
          </div>
        ];
        
        if (hasChildren && isExpanded) {
          elements.push(...renderCategories(category.children!, level + 1));
        }
        
        return elements;
      });
    };
    
    return renderCategories(hierarchicalCategories);
  };

  const sampleImages = [
    'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg',
    'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg',
    'https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg',
    'https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg'
  ];

return (
  <div style={{ marginTop: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Create New Product'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {product ? 'Update product information and settings' : 'Add a new product to your inventory'}
          </p>
        </div>
        <button
          onClick={onClose}
          disabled={isLoading || imageOperationLoading !== null}
          className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50 group"
        >
          <X className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
        </button>
      </div>

      {/* Form wrapper - now includes footer */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Left Column - Basic Info */}
              <div className="xl:col-span-4 space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Basic Information
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          validationErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Enter product title"
                      />
                      {validationErrors.title && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                          {validationErrors.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical hover:border-gray-300 transition-colors"
                        placeholder="Enter detailed product description..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price *
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.01"
                            className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              validationErrors.price ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                            placeholder="0.00"
                          />
                        </div>
                        {validationErrors.price && (
                          <p className="text-red-500 text-sm mt-2 flex items-center">
                            <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                            {validationErrors.price}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock Status
                        </label>
                        <select
                          name="stock_status"
                          value={formData.stock_status}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300 transition-colors"
                        >
                          <option value="instock">✅ In Stock</option>
                          <option value="outofstock">❌ Out of Stock</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Column - Images */}
              <div className="xl:col-span-4 space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
<h3 className="text-md sm:text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
  <div className="flex items-center">
    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
    Product Images
  </div>
  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full ml-3">
    First = Main
  </span>
</h3>

                  
                  {/* Main Image Preview */}
                  {images[0]?.preview && (
                    <div className="mb-6 relative group">
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-blue-200">
                        <img
                          src={images[0].preview}
                          alt="Main product image"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Main Image
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Image Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {images.map((imageSlot) => (
                      <div key={imageSlot.position} className={`
                        border rounded-xl p-4 transition-colors
                        ${imageSlot.position === 1 
                          ? 'border-blue-200 bg-blue-50/50' 
                          : 'border-gray-200 bg-gray-50/50'
                        }
                      `}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className={`
                              w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white flex-shrink-0
                              ${imageSlot.position === 1 ? 'bg-blue-500' : 'bg-gray-400'}
                            `}>
                              {imageSlot.position}
                            </div>
                            <span className="text-sm font-medium text-gray-700 truncate">
                              Image {imageSlot.position} {imageSlot.position === 1 ? '(Main)' : ''}
                            </span>
                          </div>
                          
                          {/* Always visible action buttons */}
                          {(imageSlot.file || imageSlot.url) && (
                            <div className="flex items-center space-x-1.5 flex-shrink-0 ml-3">
                              {imageSlot.position !== 1 && (
                                <button
                                  type="button"
                                  onClick={() => moveToMain(imageSlot.position)}
                                  disabled={imageOperationLoading !== null}
                                  className="p-1.5 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Make main image"
                                >
                                  {imageOperationLoading === `main-${imageSlot.position}` ? (
                                    <Loader className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => clearImage(imageSlot.position)}
                                disabled={imageOperationLoading !== null}
                                className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Remove image"
                              >
                                {imageOperationLoading === `delete-${imageSlot.position}` ? (
                                  <Loader className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Image Preview */}
                        {imageSlot.preview ? (
                          <div className="mb-3">
                            <img
                              src={imageSlot.preview}
                              alt={`Product image ${imageSlot.position}`}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                              {imageSlot.isFile ? '📁 File upload' : '🔗 URL'}
                            </p>
                          </div>
                        ) : (
                          <div className="mb-3 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
                            <div className="text-center text-gray-400">
                              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-1">
                                <span className="text-sm font-medium">{imageSlot.position}</span>
                              </div>
                              <span className="text-xs">No image</span>
                            </div>
                          </div>
                        )}

                        {/* Upload Controls */}
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              handleFileChange(imageSlot.position, file);
                            }}
                            disabled={imageOperationLoading !== null}
                            className="hidden"
                            id={`file-${imageSlot.position}`}
                          />
                          <label
                            htmlFor={`file-${imageSlot.position}`}
                            className={`
                              block w-full py-2.5 px-4 text-sm font-medium text-center rounded-lg border cursor-pointer transition-colors
                              ${imageOperationLoading !== null 
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                              }
                            `}
                          >
                            📁 Choose File
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Loading indicator */}
                  {imageOperationLoading && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>
                        {imageOperationLoading.startsWith('delete') && 'Removing image...'}
                        {imageOperationLoading.startsWith('swap') && 'Rearranging images...'}
                        {imageOperationLoading.startsWith('main') && 'Setting as main image...'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Categories and Tags */}
              <div className="xl:col-span-4 space-y-6">
                {/* Categories */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      Categories
                    </span>
                    <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      {formData.category_ids.length} selected
                    </span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        placeholder="Search categories..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm hover:border-gray-300 transition-colors"
                      />
                    </div>
                    
                    <div className="border border-gray-200 rounded-xl p-4 max-h-64 overflow-y-auto bg-gray-50/30">
                      {renderCategoryTree()}
                    </div>
                    
                    {validationErrors.categories && (
                      <p className="text-red-500 text-sm flex items-center">
                        <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                        {validationErrors.categories}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      Tags
                    </span>
                    <span className="text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      {formData.tag_ids.length} selected
                    </span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={tagSearch}
                        onChange={(e) => setTagSearch(e.target.value)}
                        placeholder="Search tags..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm hover:border-gray-300 transition-colors"
                      />
                    </div>
                    
                    <div className="border border-gray-200 rounded-xl p-4 max-h-64 overflow-y-auto bg-gray-50/30">
                      <div className="grid grid-cols-1 gap-2">
                        {getFilteredTags().map(tag => (
                          <label key={tag.id} className="flex items-center py-2 px-3 rounded-lg hover:bg-white transition-colors cursor-pointer group">
                            <input
                              type="checkbox"
                              id={`tag-${tag.id}`}
                              checked={formData.tag_ids.includes(tag.id)}
                              onChange={() => handleTagChange(tag.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className={`ml-3 text-sm transition-colors ${
                              formData.tag_ids.includes(tag.id) 
                                ? 'font-medium text-blue-700' 
                                : 'text-gray-700 group-hover:text-gray-900'
                            }`}>
                              {tag.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - now inside the form */}
        <div className="border-t border-gray-100 bg-gray-50/50 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading || imageOperationLoading !== null}
              className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || imageOperationLoading !== null}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 min-w-[160px] font-medium shadow-lg shadow-blue-500/25"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>{product ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <span>{product ? 'Update Product' : 'Create Product'}</span>
                  
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
);
};

export default ProductModal;