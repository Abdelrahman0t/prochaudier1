import React, { useState, useEffect } from 'react';
import { User } from '../../types/admin';
import { X, Percent } from 'lucide-react';

interface UserModalProps {
  user: User;
  onSave: (user: User) => void;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({
  user,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    role: 'customer' as User['role'],
    totalOrders: 0,
    totalSpent: 0,
    discount: 0,
    status: 'active' as User['status'],
    createdAt: ''
  });

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discount' ? Math.max(0, Math.min(100, parseFloat(value) || 0)) : value
    }));
  };

  const quickDiscounts = [0, 5, 10, 15, 20, 25, 30];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit User: {user.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Right Column - Stats & Discount */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">User Statistics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Orders:</span>
                    <span className="text-sm font-medium">{formData.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Spent:</span>
                    <span className="text-sm font-medium">${formData.totalSpent.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Member Since:</span>
                    <span className="text-sm font-medium">
                      {new Date(formData.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Percent className="w-4 h-4 text-sky-600" />
                    <span>Discount Percentage</span>
                  </div>
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a value between 0 and 100
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Quick Discount Options:</p>
                <div className="grid grid-cols-4 gap-2">
                  {quickDiscounts.map((discount) => (
                    <button
                      key={discount}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, discount }))}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        formData.discount === discount
                          ? 'bg-sky-100 text-sky-700 border-sky-300'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {discount}%
                    </button>
                  ))}
                </div>
              </div>

              {formData.discount > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Percent className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      Active Discount: {formData.discount}%
                    </span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    This user will receive {formData.discount}% off their orders
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;