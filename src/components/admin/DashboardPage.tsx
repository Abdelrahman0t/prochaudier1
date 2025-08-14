import React from 'react';
import { DashboardStats } from '../../types/admin';
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  Package, 
  Users, 
  DollarSign,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface DashboardPageProps {
  stats: DashboardStats;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'bg-sky-500'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      change: '+3.1%',
      trend: 'up',
      icon: Package,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'bg-orange-500'
    }
  ];

  const alerts = [
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Low Stock Products',
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                <div className="flex items-center mt-2">
                  {card.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alerts.map((alert, index) => (
          <div key={index} className={`${alert.bgColor} rounded-lg p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                <p className="text-3xl font-bold mt-2 text-gray-900">{alert.value}</p>
                <p className="text-sm text-gray-600 mt-1">Requires attention</p>
              </div>
              <alert.icon className={`w-8 h-8 ${alert.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { action: 'New order #1234 received', time: '2 minutes ago', type: 'order' },
              { action: 'Product "Widget A" updated', time: '15 minutes ago', type: 'product' },
              { action: 'User John Doe registered', time: '1 hour ago', type: 'user' },
              { action: 'Category "Electronics" created', time: '2 hours ago', type: 'category' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'order' ? 'bg-green-500' :
                    activity.type === 'product' ? 'bg-blue-500' :
                    activity.type === 'user' ? 'bg-purple-500' : 'bg-orange-500'
                  }`} />
                  <span className="text-gray-900">{activity.action}</span>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;