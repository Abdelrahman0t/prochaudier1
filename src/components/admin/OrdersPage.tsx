import React, { useState, useEffect } from 'react';
import { Order } from '../../types/admin';
import { Eye, Search, Filter, Download, MoreHorizontal, RefreshCw, AlertTriangle } from 'lucide-react';
import { apiClient } from '../../api/api';

interface OrdersPageProps {
  onViewOrder: (order: Order) => void;
}

const OrdersPage: React.FC<OrdersPageProps> = ({ onViewOrder }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Helper function to safely convert to number and format
  const safeToFixed = (value: string | number | null | undefined, decimals: number = 2): string => {
    const num = typeof value === 'string' ? parseFloat(value) : (value || 0);
    return isNaN(num) ? '0.00' : num.toFixed(decimals);
  };

  // Helper function to safely get numeric value
  const safeNumber = (value: string | number | null | undefined): number => {
    const num = typeof value === 'string' ? parseFloat(value) : (value || 0);
    return isNaN(num) ? 0 : num;
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading orders...');
      
      const ordersData = await apiClient.getOrders();
      console.log('Orders data received:', ordersData);
      
      if (Array.isArray(ordersData)) {
        setOrders(ordersData);
        console.log(`Successfully loaded ${ordersData.length} orders`);
      } else {
        console.error('Orders data is not an array:', ordersData);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to load orders: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      setUpdatingStatus(orderId);
      const updatedOrder = await apiClient.updateOrderStatus(orderId, status);
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );
      
      console.log(`Order ${orderId} status updated to ${status}`);
      
    } catch (err) {
      console.error('Failed to update order status:', err);
      setError(`Failed to update order status: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      order.customer_name?.toLowerCase().includes(searchString) ||
      order.id?.toString().toLowerCase().includes(searchString) ||
      order.customer_email?.toLowerCase().includes(searchString) ||
      order.customer_phone?.toLowerCase().includes(searchString);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleAllOrders = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const exportOrders = () => {
    const ordersToExport = selectedOrders.length > 0 
      ? orders.filter(order => selectedOrders.includes(order.id))
      : filteredOrders;

    const csv = [
      'Order ID,Customer Name,Customer Email,Customer Phone,Total,Status,Order Date,Items Count',
      ...ordersToExport.map(order => 
        `${order.id},"${order.customer_name || ''}","${order.customer_email || ''}","${order.customer_phone || ''}",${safeNumber(order.total)},${order.status},${order.order_date || ''},${order.items?.length || 0}`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadgeColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipping':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-600" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

return (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          onClick={loadOrders}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
        <button 
          onClick={exportOrders}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export {selectedOrders.length > 0 ? `(${selectedOrders.length})` : ''}</span>
        </button>
      </div>
    </div>

    {/* Error Alert */}
    {error && (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          <div className="flex-1">
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 text-xl leading-none"
          >
            ×
          </button>
        </div>
      </div>
    )}

    {/* Debug Info */}


    {/* Filters */}
<div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
  <div className="flex flex-col sm:flex-row gap-4">
    {/* Search input */}
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Search by customer name, email, phone, or order ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
      />
    </div>

    {/* Status filter */}
    <select
      value={statusFilter}
      onChange={(e) =>
        setStatusFilter(e.target.value as Order['status'] | 'all')
      }
      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
    >
      <option value="all">All Status</option>
      <option value="pending">Pending</option>
      <option value="processing">Processing</option>
      <option value="shipping">Shipping</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </select>
  </div>
</div>


    {/* Bulk Actions (Mobile) */}
    {selectedOrders.length > 0 && (
      <div className="lg:hidden bg-sky-50 border border-sky-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sky-800 font-medium">
            {selectedOrders.length} selected
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedOrders([])}
              className="text-sky-600 hover:text-sky-800 text-sm"
            >
              Clear
            </button>
            <button
              onClick={() => toggleAllOrders(true)}
              className="text-sky-600 hover:text-sky-800 text-sm"
            >
              Select All
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Orders - Mobile Card View */}
    <div className="lg:hidden space-y-4">
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <p className="text-gray-500">
            {orders.length === 0 ? 'No orders found' : 'No orders match your filters'}
          </p>
        </div>
      ) : (
        filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.id)}
                  onChange={() => toggleOrderSelection(order.id)}
                  className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                  <div className="text-xs text-gray-500">{formatDate(order.order_date)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onViewOrder(order)}
                  className="text-sky-600 hover:text-sky-900 p-1 rounded hover:bg-sky-50 transition-colors"
                  title="View order details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                onClick={() => onViewOrder(order)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-50 transition-colors"
                  title="More actions"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-900">{order.customer_name || 'N/A'}</div>
                <div className="text-sm text-gray-500">{order.customer_email || 'N/A'}</div>
                {order.customer_phone && (
                  <div className="text-xs text-gray-400">{order.customer_phone}</div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-gray-900">${safeToFixed(order.total)}</div>
                  <div className="text-sm text-gray-500">{order.items?.length || 0} items</div>
                  {safeNumber(order.delivery_price) > 0 && (
                    <div className="text-xs text-gray-500">+${safeToFixed(order.delivery_price)} delivery</div>
                  )}
                </div>
                <div className="text-right">
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                    disabled={updatingStatus === order.id}
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(order.status)} disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipping">Shipping</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {updatingStatus === order.id && (
                    <RefreshCw className="w-3 h-3 animate-spin mt-1 mx-auto" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>

    {/* Orders - Desktop Table View */}
    <div className="hidden lg:block bg-white rounded-lg shadow-sm border overflow-hidden">
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {orders.length === 0 ? 'No orders found' : 'No orders match your filters'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={(e) => toggleAllOrders(e.target.checked)}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleOrderSelection(order.id)}
                      className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customer_name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{order.customer_email || 'N/A'}</div>
                      <div className="text-xs text-gray-400">{order.customer_phone || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${safeToFixed(order.total)}</div>
                    {safeNumber(order.delivery_price) > 0 && (
                      <div className="text-xs text-gray-500">+${safeToFixed(order.delivery_price)} delivery</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.items?.length || 0} items</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                      disabled={updatingStatus === order.id}
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(order.status)} disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipping">Shipping</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {updatingStatus === order.id && (
                      <RefreshCw className="w-3 h-3 animate-spin mt-1" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(order.order_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewOrder(order)}
                        className="text-sky-600 hover:text-sky-900 p-1 rounded hover:bg-sky-50 transition-colors"
                        title="View order details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                      onClick={() => onViewOrder(order)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-50 transition-colors"
                        title="More actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {/* Results info */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-500">
      <div>
        Showing {filteredOrders.length} of {orders.length} orders
        {selectedOrders.length > 0 && (
          <span className="ml-4 font-medium text-sky-600">
            {selectedOrders.length} selected
          </span>
        )}
      </div>
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="text-sky-600 hover:text-sky-800 self-start sm:self-auto"
        >
          Clear search
        </button>
      )}
    </div>
  </div>
);
};

export default OrdersPage;