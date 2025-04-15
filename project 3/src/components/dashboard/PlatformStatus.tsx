import React from 'react';
import { useStore } from '@/lib/store';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Tablet,
  WifiOff,
  Menu,
  AlertCircle,
  ArrowUpCircle,
} from 'lucide-react';

export function PlatformStatus() {
  const { platformStatus } = useStore((state) => ({
    platformStatus: state.platformStatus || [],
  }));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'offline':
        return <WifiOff className="h-5 w-5 text-red-500" />;
      case 'busy':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'menu':
        return <Menu className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      case 'network':
        return <WifiOff className="h-4 w-4" />;
      case 'system':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformLogo = (platform: string) => {
    switch (platform) {
      case 'DoorDash':
        return '🚪';
      case 'UberEats':
        return '🚗';
      case 'Glovo':
        return '🛵';
      case 'Skip':
        return '⏭️';
      case 'Shopify':
        return '🛍️';
      default:
        return '🏪';
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Platform Status</h3>
          <p className="text-sm text-gray-600">
            Monitor delivery platform availability and issues
          </p>
        </div>
        <button className="rounded-full p-2 hover:bg-gray-100">
          <RefreshCw className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="space-y-4">
        {platformStatus.map((platform) => (
          <div
            key={platform.id}
            className="rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getPlatformLogo(platform.platform)}</span>
                <div>
                  <h4 className="font-medium">{platform.platform}</h4>
                  <p className="text-sm text-gray-600">{platform.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(platform.status)}
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    platform.status === 'online'
                      ? 'bg-green-100 text-green-800'
                      : platform.status === 'busy'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {platform.status.charAt(0).toUpperCase() + platform.status.slice(1)}
                </span>
              </div>
            </div>

            {platform.issues.length > 0 && (
              <div className="mt-3 space-y-2">
                {platform.issues.map((issue, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                  >
                    <div className="flex items-center space-x-2">
                      {getIssueIcon(issue.type)}
                      <span className="text-sm">{issue.message}</span>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${getSeverityColor(
                        issue.severity
                      )}`}
                    >
                      {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 grid grid-cols-2 gap-4 border-t pt-3 text-sm">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Uptime</span>
                  <span className="font-medium">{platform.metrics.uptime}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-medium">{platform.metrics.responseTime}s</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Accept Rate</span>
                  <span className="font-medium">
                    {platform.metrics.orderAcceptRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Cancellation</span>
                  <span className="font-medium">
                    {platform.metrics.cancellationRate}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t pt-3 text-sm text-gray-600">
              <span>Last checked {new Date(platform.lastChecked).toLocaleTimeString()}</span>
              <div className="flex items-center space-x-1">
                <ArrowUpCircle className="h-4 w-4 text-green-500" />
                <span>API Connected</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}