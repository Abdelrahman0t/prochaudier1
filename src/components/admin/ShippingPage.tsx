import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, MapPin, Truck } from 'lucide-react';
import ShippingModal from './ShippingModal';
import { apiClient } from '../../api/api';

interface Wilaya {
  id: number;
  name: string;
  price: number;
}

const ShippingSettingsPage: React.FC = () => {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWilaya, setEditingWilaya] = useState<Wilaya | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch wilayas from API
  const fetchWilayas = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getWilayasAdmin();
      console.log("Wilayas API data:", data);
      setWilayas(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load shipping settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWilayas();
  }, []);

  const filteredWilayas = wilayas.filter(wilaya =>
    wilaya.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateWilaya = () => {
    setEditingWilaya(null);
    setIsModalOpen(true);
  };

  const handleEditWilaya = (wilaya: Wilaya) => {
    setEditingWilaya(wilaya);
    setIsModalOpen(true);
  };

  const handleSaveWilaya = async (wilayaData: { name: string; price: number }) => {
    try {
      if (editingWilaya) {
        await apiClient.updateWilaya(editingWilaya.id, wilayaData);
      } else {
        await apiClient.createWilaya(wilayaData);
      }
      fetchWilayas();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setError('Failed to save wilaya.');
      throw err;
    }
  };

  const handleDeleteWilaya = async (wilayaId: number) => {
    if (!window.confirm('Are you sure you want to delete this wilaya?')) return;
    try {
      await apiClient.deleteWilaya(wilayaId);
      fetchWilayas();
    } catch (err) {
      console.error(err);
      setError('Failed to delete wilaya.');
    }
  };

  // Calculate statistics
  const totalWilayas = wilayas.length;
  const averagePrice = wilayas.length > 0 
    ? Math.round(wilayas.reduce((sum, w) => sum + w.price, 0) / wilayas.length)
    : 0;
  const minPrice = wilayas.length > 0 ? Math.min(...wilayas.map(w => w.price)) : 0;
  const maxPrice = wilayas.length > 0 ? Math.max(...wilayas.map(w => w.price)) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipping Settings</h1>
          <p className="text-gray-600">Manage delivery zones and shipping prices</p>
        </div>
        <button
          onClick={handleCreateWilaya}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Wilaya</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search wilayas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Wilayas</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{totalWilayas}</p>
            </div>
            <MapPin className="w-8 h-8 text-sky-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Price</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{averagePrice} DA</p>
            </div>
            <Truck className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Min Price</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{minPrice} DA</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">↓</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Max Price</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{maxPrice} DA</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold text-sm">↑</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Wilayas List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Shipping Zones</h3>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading...</div>
        ) : filteredWilayas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wilaya
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipping Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWilayas
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((wilaya) => (
                    <tr key={wilaya.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center mr-3">
                            <MapPin className="w-5 h-5 text-sky-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {wilaya.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {wilaya.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg font-semibold text-gray-900">
                            {wilaya.price} DA
                          </span>
                          {wilaya.price === minPrice && wilayas.length > 1 && (
                            <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              Lowest
                            </span>
                          )}
                          {wilaya.price === maxPrice && wilayas.length > 1 && (
                            <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                              Highest
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditWilaya(wilaya)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteWilaya(wilaya.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            {searchTerm 
              ? `No wilayas found matching "${searchTerm}"`
              : 'No shipping zones configured. Add your first wilaya to get started.'}
          </div>
        )}
      </div>

      {/* Shipping Modal */}
      {isModalOpen && (
        <ShippingModal
          wilaya={editingWilaya}
          onSave={handleSaveWilaya}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Results info */}
      <div className="text-sm text-gray-500">
        Showing {filteredWilayas.length} of {wilayas.length} shipping zones
      </div>
    </div>
  );
};


export default ShippingSettingsPage;
