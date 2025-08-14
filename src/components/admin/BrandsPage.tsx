import React, { useState, useEffect } from 'react';
import { Tag } from '../../types/admin'; // Changed from Brand to Tag
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import BrandModal from './BrandModal';
import { apiClient } from '../../api/api';

const BrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<Tag[]>([]); // Changed Brand[] to Tag[]
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Tag | null>(null); // Changed Brand to Tag
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch brands from API
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getTags();
      setBrands(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load brands.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBrand = () => {
    setEditingBrand(null);
    setIsModalOpen(true);
  };

  const handleEditBrand = (brand: Tag) => { // Changed Brand to Tag
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  // Fixed: Now properly creates Tag data structure
  const handleSaveBrand = async (brandData: { name: string; slug?: string }) => {
    try {
      // Generate slug from name if not provided
      const tagData = {
        name: brandData.name,
        slug: brandData.slug || brandData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      };

      if (editingBrand) {
        await apiClient.updateTag(editingBrand.id, tagData);
      } else {
        await apiClient.createTag(tagData);
      }
      fetchBrands();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setError('Failed to save brand.');
    }
  };

  const handleDeleteBrand = async (brandId: number) => { // Changed string to number
    if (!window.confirm('Are you sure you want to delete this brand?')) return;
    try {
      await apiClient.deleteTag(brandId);
      fetchBrands();
    } catch (err) {
      console.error(err);
      setError('Failed to delete brand.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brands Management</h1>
          <p className="text-gray-600">Manage product brands and manufacturers</p>
        </div>
        <button
          onClick={handleCreateBrand}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Brand</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm font-medium text-gray-600">Total Brands</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{brands.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm font-medium text-gray-600">Active Brands</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {brands.filter(b => (b.count || 0) > 0).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm font-medium text-gray-600">Total Products</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {brands.reduce((sum, brand) => sum + (brand.count || 0), 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm font-medium text-gray-600">Avg Products/Brand</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {brands.length > 0 
              ? Math.round(brands.reduce((sum, brand) => sum + (brand.count || 0), 0) / brands.length)
              : 0
            }
          </p>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">All Brands</h3>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">{error}</div>
        ) : filteredBrands.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredBrands.map((brand) => (
              <div key={brand.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <span className="text-gray-400 font-medium text-lg">
                        {brand.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{brand.name}</h3>
                      <p className="text-gray-600">{brand.count || 0} products</p>
                      <p className="text-sm text-gray-500">Slug: {brand.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditBrand(brand)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBrand(brand.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            {searchTerm 
              ? `No brands found matching "${searchTerm}"`
              : 'No brands found. Create your first brand to get started.'}
          </div>
        )}
      </div>

      {/* Brand Modal */}
      {isModalOpen && (
        <BrandModal
          brand={editingBrand}
          onSave={handleSaveBrand}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Results info */}
      <div className="text-sm text-gray-500">
        Showing {filteredBrands.length} of {brands.length} brands
      </div>
    </div>
  );
};

export default BrandsPage;