import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Grid, List, Package, AlertCircle, Loader, RefreshCw, ArrowUp } from 'lucide-react';
import ProductModal from './ProductModal';
import { apiClient, organizeCategoriesHierarchical, Product, Category, Tag } from "@/api/api";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
const [productsData, categoriesData, tagsResponse] = await Promise.all([
  apiClient.getProducts(),
  apiClient.getCategories2(),
  apiClient.getTags()
]);

setProducts(productsData);
console.log(productsData)
setCategories(categoriesData);
// Extract tags array from the response object
setTags(Array.isArray(tagsResponse) ? tagsResponse : tagsResponse.tags || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || 
      product.categories.some(cat => cat.id.toString() === categoryFilter);
    const matchesTag = tagFilter === 'all' || 
      product.tags.some(tag => tag.id.toString() === tagFilter);
    const matchesStock = stockFilter === 'all' || product.stock_status === stockFilter;
    
    return matchesSearch && matchesCategory && matchesTag && matchesStock;
  });

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (formData: FormData) => {
    try {
      setActionLoading(editingProduct ? 'updating' : 'creating');
      
      if (editingProduct) {
        await apiClient.updateProduct(editingProduct.id, formData);
      } else {
        await apiClient.createProduct(formData);
      }
      
      await fetchData(); // Refresh data
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save product:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      setActionLoading(`deleting-${productId}`);
      await apiClient.deleteProduct(productId);
      await fetchData(); // Refresh data
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setActionLoading(null);
    }
  };

const getMainImage = (product: Product) => {
  // Check all possible image sources in preferred order
  const possibleImages = [
    product.image_1 ? `${import.meta.env.VITE_API_BASE_URL}${product.image_1}` : null,
    product.image_1_url || null,
    product.image_2 ? `${import.meta.env.VITE_API_BASE_URL}${product.image_2}` : null,
    product.image_2_url || null,
    product.image_3 ? `${import.meta.env.VITE_API_BASE_URL}${product.image_3}` : null,
    product.image_3_url || null,
    product.image_4 ? `${import.meta.env.VITE_API_BASE_URL}${product.image_4}` : null,
    product.image_4_url || null,
  ];

  // Return the first non-null image, or fallback placeholder
  return possibleImages.find(img => img) || '/product_placeholder.jpg';
};

  // Render category options including children
  const renderCategoryOptions = (categories: Category[]) => {
    const hierarchicalCategories = organizeCategoriesHierarchical(categories);
    
    const renderOptions = (cats: Category[], level = 0): JSX.Element[] => {
      return cats.flatMap(category => {
        const indent = '  '.repeat(level);
        const options = [
          <option key={category.id} value={category.id}>
            {indent}{category.name}
          </option>
        ];
        
        if (category.children && category.children.length > 0) {
          options.push(...renderOptions(category.children, level + 1));
        }
        
        return options;
      });
    };
    
    return renderOptions(hierarchicalCategories);
  };

const ProductCard = ({ product }: { product: Product }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-gray-200 flex flex-col">
    <div className="relative overflow-hidden">
      <img
        src={getMainImage(product)}
        alt={product.title}
        className="w-full h-64 sm:h-80 md:h-96 object-cover transition-transform duration-300 hover:scale-105"
      />
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
        <span
          className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
            product.stock_status === 'instock'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      {/* Image count indicator */}
      {product.all_images && product.all_images.length > 1 && (
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
          {product.all_images.length}
        </div>
      )}

      <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 flex flex-col gap-1 sm:gap-2">
        <button
          onClick={() => handleEditProduct(product)}
          disabled={actionLoading !== null}
          className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
        </button>
        <button
          onClick={() => handleDeleteProduct(product.id)}
          disabled={actionLoading !== null}
          className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {actionLoading === `deleting-${product.id}` ? (
            <Loader className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 animate-spin" />
          ) : (
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
          )}
        </button>
      </div>
    </div>

    <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 leading-tight line-clamp-2">
          {product.title}
        </h3>
        {product.description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}
      </div>

      {/* Categories and Tags Section */}
      <div className="space-y-2 mb-4">
        {/* Categories - Breadcrumb Style */}
        {product.categories.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            
            {product.categories.map((category, index) => (
              <span key={category.id} className="flex items-center">
                <span className="font-medium text-gray-800">{category.name}</span>
                {index < product.categories.length - 1 && (
                  <span className="mx-1 text-gray-400">/</span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Tags - Keep as requested */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-gray-900">
          
          {typeof product.price === 'number'
            ? product.price.toFixed(2)
            : parseFloat(product.price || '0').toFixed(2)} DZD
        </span>
      </div>
    </div>
  </div>
);


  const ProductListItem = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <img
          src={getMainImage(product)}
          alt={product.title}
          className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h3>
              {product.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
              )}
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
                {product.categories.map(category => (
                  <span key={category.id} className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                    {category.name}
                  </span>
                ))}
                {product.tags.map(tag => (
                  <span key={tag.id} className="px-2 sm:px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-lg">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 sm:ml-4">

              <button
                onClick={() => handleEditProduct(product)}
                disabled={actionLoading !== null}
                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                disabled={actionLoading !== null}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === `deleting-${product.id}` ? (
                  <Loader className="w-4 h-4 text-red-600 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-6 mt-4 sm:mt-0">
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              <span className="text-xl sm:text-2xl font-bold text-gray-900">
                ${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price || '0').toFixed(2)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                product.stock_status === 'instock' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
              </span>
              {product.all_images && product.all_images.length > 1 && (
                <span className="text-xs text-gray-500">
                  {product.all_images.length} images
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Products</h2>
          <p className="text-gray-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage your product inventory with 4 simple image slots</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={fetchData}
                disabled={actionLoading !== null}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="sm:inline hidden">Refresh</span>
              </button>
              <button
                onClick={handleCreateProduct}
                disabled={actionLoading !== null}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'creating' ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Add Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            {/* Search and View Toggle Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-full sm:max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 self-end sm:self-auto">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              >
                <option value="all">All Categories</option>
                {renderCategoryOptions(categories)}
              </select>
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              >
                <option value="all">All Tags</option>
                {tags.map(tag => (
                  <option key={tag.id} value={tag.id}>{tag.name}</option>
                ))}
              </select>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              >
                <option value="all">All Stock Status</option>
                <option value="instock">In Stock</option>
                <option value="outofstock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-gray-600 text-sm sm:text-base">
            Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{products.length}</span> products
          </p>
          {actionLoading === 'updating' && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">Updating product...</span>
            </div>
          )}
        </div>

        {/* Products Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6 text-sm sm:text-base max-w-md mx-auto">
              {products.length === 0 
                ? "Get started by adding your first product with up to 4 images" 
                : "Try adjusting your search or filter criteria"
              }
            </p>
            <button
              onClick={handleCreateProduct}
              disabled={actionLoading !== null}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Your First Product
            </button>
          </div>
        )}

        {/* Product Modal */}
        {isModalOpen && (
          <ProductModal
            product={editingProduct}
            categories={categories}
            tags={tags}
            onSave={handleSaveProduct}
            onClose={() => setIsModalOpen(false)}
            isLoading={actionLoading === 'creating' || actionLoading === 'updating'}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;