import React, { useState } from 'react';
import { Order } from '../../types/admin';
import { X, Package, User, MapPin, Calendar, RefreshCw, Check, AlertTriangle } from 'lucide-react';
import { apiClient } from '../../api/api';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  
}) => {
  const [currentOrder, setCurrentOrder] = useState<Order>(order);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);

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

  const handleStatusChange = async (newStatus: Order['status']) => {
    if (newStatus === currentOrder.status) return;
    
    setIsUpdatingStatus(true);
    setStatusUpdateError(null);
    setStatusUpdateSuccess(false);
    
    try {
      console.log(`Updating order ${currentOrder.id} status to ${newStatus}`);
      const updatedOrder = await apiClient.updateOrderStatus(currentOrder.id, newStatus);
      
      // Update local state
      setCurrentOrder(updatedOrder);
      
      // Notify parent component
      
      
      setStatusUpdateSuccess(true);
      console.log(`Order ${currentOrder.id} status successfully updated to ${newStatus}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatusUpdateSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Failed to update order status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update status';
      setStatusUpdateError(errorMessage);
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setStatusUpdateError(null);
      }, 5000);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipping': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
          Order Details - #{currentOrder.id}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Order Info */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Customer Information</h3>
              </div>
              <div className="space-y-2 text-sm sm:text-base">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="font-medium mb-1 sm:mb-0 sm:mr-2">Name:</span> 
                  <span className="break-words">{currentOrder.customer_first_name} {currentOrder.customer_last_name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="font-medium mb-1 sm:mb-0 sm:mr-2">Email:</span> 
                  <span className="break-all">{currentOrder.customer_email || 'N/A'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="font-medium mb-1 sm:mb-0 sm:mr-2">Phone:</span> 
                  <span className="break-words">{currentOrder.customer_phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Shipping Address</h3>
              </div>
              <div className="text-gray-700 space-y-1 text-sm sm:text-base">
                <p className="break-words">{currentOrder.shipping_address}</p>
                <p className="break-words">{currentOrder.shipping_city}, {currentOrder.shipping_region}</p>
                {currentOrder.shipping_postal_code && <p>Postal Code: {currentOrder.shipping_postal_code}</p>}
                {currentOrder.shipping_additional_info && (
                  <p className="text-xs sm:text-sm text-gray-600 break-words">Additional Info: {currentOrder.shipping_additional_info}</p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Order Items</h3>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {currentOrder.items?.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 sm:p-4">
                    {/* Mobile Layout - Vertical Stack */}
                    <div className="block sm:hidden space-y-3">
                      <div className="flex items-start space-x-3">
                        {item.image ? (
                          <img
                            src={import.meta.env.VITE_API_BASE_URL + item.image}
                            alt={item.product_name}
                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm break-words leading-tight">{item.product_title}</h4>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-lg font-bold text-gray-900">${safeToFixed(item.price)}</span>
                            <span className="text-sm text-gray-600">each</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm border-t pt-2">
                        <span className="text-gray-600">Quantity: {item.quantity}</span>
                        <span className="font-medium">
                          Total: ${safeToFixed(item.total_price || (safeNumber(item.price) * item.quantity))}
                        </span>
                      </div>
                    </div>

                    {/* Desktop Layout - Horizontal */}
                    <div className="hidden sm:flex items-center space-x-4">
                      {item.image ? (
                        <img
                          src={import.meta.env.VITE_API_BASE_URL + item.image}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 break-words">{item.product_title}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">
                          Total: ${safeToFixed(item.total_price || (safeNumber(item.price) * item.quantity))}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-medium text-gray-900">${safeToFixed(item.price)}</p>
                        <p className="text-sm text-gray-600">each</p>
                      </div>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 text-sm sm:text-base">No items found</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-4 sm:space-y-6">
            {/* Order Status */}
            <div className="bg-white border rounded-lg p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Order Status</h3>
              
              {/* Status Update Messages */}
              {statusUpdateError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-red-800 text-xs sm:text-sm break-words">{statusUpdateError}</p>
                  </div>
                </div>
              )}
              
              {statusUpdateSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                    <p className="text-green-800 text-xs sm:text-sm">Status updated successfully!</p>
                  </div>
                </div>
              )}

              <div className="relative">
                <select
                  value={currentOrder.status}
                  onChange={(e) => handleStatusChange(e.target.value as Order['status'])}
                  disabled={isUpdatingStatus}
                  className={`w-full px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border ${getStatusColor(currentOrder.status)} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipping">Shipping</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                
                {isUpdatingStatus && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <RefreshCw className="w-4 h-4 animate-spin text-gray-500" />
                  </div>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Click to change the order status. Changes are saved automatically.
              </p>
            </div>

            {/* Order Date */}
            <div className="bg-white border rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Order Date</h3>
              </div>
              <p className="text-gray-700 text-sm sm:text-base break-words">{formatDate(currentOrder.order_date)}</p>
            </div>

            {/* Payment & Delivery Method */}
            <div className="bg-white border rounded-lg p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Order Details</h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-gray-600 mb-1 sm:mb-0">Payment Method:</span>
                  <span className="font-medium break-words">{currentOrder.payment_method}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-gray-600 mb-1 sm:mb-0">Delivery Method:</span>
                  <span className="font-medium break-words">{currentOrder.delivery_method}</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white border rounded-lg p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({currentOrder.items?.length || 0})</span>
                  <span className="font-medium">
                    ${safeToFixed(currentOrder.subtotal || currentOrder.items?.reduce((sum, item) => sum + (safeNumber(item.price) * item.quantity), 0) || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {safeNumber(currentOrder.delivery_price) > 0 ? `$${safeToFixed(currentOrder.delivery_price)}` : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <hr />
                <div className="flex justify-between text-base sm:text-lg font-bold">
                  <span>Total</span>
                  <span>${safeToFixed(currentOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button className="w-full px-4 py-2 sm:py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm sm:text-base font-medium">
                Print Invoice
              </button>
              <button className="w-full px-4 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium">
                Send Email Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default OrderDetailsModal;