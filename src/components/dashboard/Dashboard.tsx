import React from 'react';
import { useStore } from '@/lib/store';
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  CheckSquare,
  AlertTriangle,
  DollarSign,
  Clock,
  RefreshCw,
  Camera,
  Award,
  Building2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const mockSalesData = [
  { name: 'Mon', sales: 4000, orders: 240 },
  { name: 'Tue', sales: 3000, orders: 198 },
  { name: 'Wed', sales: 5000, orders: 305 },
  { name: 'Thu', sales: 2780, orders: 189 },
  { name: 'Fri', sales: 6890, orders: 405 },
  { name: 'Sat', sales: 8390, orders: 498 },
  { name: 'Sun', sales: 4490, orders: 301 },
];

export function Dashboard() {
  const {
    staff,
    inventory,
    orders,
    activePositions,
    scheduledInterviews,
    lowStockItems,
    pendingOrders,
    ordersChecked,
    issuesDetected,
    systemStatus,
    lastUpdate,
  } = useStore((state) => ({
    staff: state.staff || [],
    inventory: state.inventory || [],
    orders: state.orders || [],
    activePositions: state.activePositions || 0,
    scheduledInterviews: state.scheduledInterviews || 0,
    lowStockItems: state.lowStockItems || 0,
    pendingOrders: state.pendingOrders || 0,
    ordersChecked: state.ordersChecked || 0,
    issuesDetected: state.issuesDetected || 0,
    systemStatus: state.systemStatus || 'operational',
    lastUpdate: state.lastUpdate || new Date().toISOString(),
  }));

  const [timeRange, setTimeRange] = React.useState('week');

  // Calculate metrics
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, order) => sum + order.price, 0);
  const verifiedOrders = orders.filter(order => order.status === 'verified').length;
  const verificationRate = totalOrders > 0 ? (verifiedOrders / totalOrders) * 100 : 0;
  const totalClaims = orders.filter(order => order.status === 'incorrect').length;
  const claimRate = totalOrders > 0 ? (totalClaims / totalOrders) * 100 : 0;
  const totalWinBack = 2450.75; // This would come from your actual data
  const realEstateErrorRate = 1.2; // This would come from your actual data

  const statsCards = [
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      change: `+${(totalOrders * 0.15).toFixed(0)} from last week`,
      trend: 'up',
      icon: <Package className="h-6 w-6 text-blue-500" />,
    },
    {
      title: 'Total Sales',
      value: `$${totalSales.toFixed(2)}`,
      change: `+12.5% from last month`,
      trend: 'up',
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
    },
    {
      title: 'Picture Verification',
      value: `${verificationRate.toFixed(1)}%`,
      change: `${verifiedOrders} orders verified`,
      icon: <Camera className="h-6 w-6 text-purple-500" />,
    },
    {
      title: 'Claims',
      value: totalClaims.toString(),
      change: `${claimRate.toFixed(1)}% claim rate`,
      icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
    },
    {
      title: 'Win-back Money',
      value: `$${totalWinBack.toFixed(2)}`,
      change: 'From resolved claims',
      icon: <Award className="h-6 w-6 text-indigo-500" />,
    },
    {
      title: 'Real Estate Error',
      value: `${realEstateErrorRate}%`,
      change: 'Location accuracy',
      icon: <Building2 className="h-6 w-6 text-red-500" />,
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-600">
            Last updated: {new Date(lastUpdate).toLocaleString()}
          </p>
        </div>
        <button className="flex items-center space-x-2 rounded-lg bg-white px-4 py-2 shadow-sm hover:bg-gray-50">
          <RefreshCw className="h-5 w-5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="rounded-lg bg-white p-6 shadow-sm transition-transform hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <h3 className="mt-2 text-2xl font-bold">{card.value}</h3>
                <p className="mt-1 text-sm text-gray-600">{card.change}</p>
              </div>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Chart */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Sales Overview</h3>
              <p className="text-sm text-gray-600">Daily revenue and orders</p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="year">Last 12 months</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  stroke="#4F46E5"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Claims and Verification Chart */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Claims & Verification</h3>
            <p className="text-sm text-gray-600">Performance metrics</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                {
                  name: 'Verification Rate',
                  value: verificationRate,
                  color: '#8B5CF6'
                },
                {
                  name: 'Claim Rate',
                  value: claimRate,
                  color: '#F59E0B'
                },
                {
                  name: 'Error Rate',
                  value: realEstateErrorRate,
                  color: '#EF4444'
                }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">System Health</h3>
            <p className="text-sm text-gray-600">Overall platform status</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              systemStatus === 'operational'
                ? 'bg-green-100 text-green-800'
                : systemStatus === 'degraded'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1)}
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Response</span>
              <span className="text-sm font-medium text-green-600">98.5%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-gray-200">
              <div className="h-2 rounded-full bg-green-500" style={{ width: '98.5%' }} />
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Order Processing</span>
              <span className="text-sm font-medium text-green-600">99.1%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-gray-200">
              <div className="h-2 rounded-full bg-green-500" style={{ width: '99.1%' }} />
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Payment Gateway</span>
              <span className="text-sm font-medium text-green-600">100%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-gray-200">
              <div className="h-2 rounded-full bg-green-500" style={{ width: '100%' }} />
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="text-sm font-medium text-green-600">99.9%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-gray-200">
              <div className="h-2 rounded-full bg-green-500" style={{ width: '99.9%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}