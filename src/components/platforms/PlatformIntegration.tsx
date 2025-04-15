import React from 'react';
import { useStore } from '@/lib/store';
import {
  Settings,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Menu as MenuIcon,
  DollarSign,
  Percent,
  Timer,
} from 'lucide-react';
import { PlatformConfig } from '@/lib/platforms/types';

export function PlatformIntegration() {
  const { platformConfigs, updatePlatformConfig } = useStore();
  const [activeTab, setActiveTab] = React.useState<'settings' | 'menu' | 'analytics'>('settings');

  const handleConfigUpdate = (platform: string, updates: Partial<PlatformConfig>) => {
    updatePlatformConfig(platform, updates);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Platform Integration</h2>
          <p className="mt-1 text-gray-600">
            Manage your delivery platform integrations and settings
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('settings')}
            className={`rounded-lg px-4 py-2 ${
              activeTab === 'settings'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Settings className="mr-2 inline-block h-5 w-5" />
            Settings
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`rounded-lg px-4 py-2 ${
              activeTab === 'menu'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MenuIcon className="mr-2 inline-block h-5 w-5" />
            Menu Sync
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`rounded-lg px-4 py-2 ${
              activeTab === 'analytics'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <DollarSign className="mr-2 inline-block h-5 w-5" />
            Analytics
          </button>
        </div>
      </div>

      {activeTab === 'settings' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {platformConfigs.map((config) => (
            <div
              key={config.platform}
              className="rounded-lg border bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {config.platform === 'DoorDash'
                      ? '🚪'
                      : config.platform === 'UberEats'
                      ? '🚗'
                      : config.platform === 'Glovo'
                      ? '🛵'
                      : '⏭️'}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{config.platform}</h3>
                    <p className="text-sm text-gray-600">
                      {config.enabled ? 'Connected' : 'Disconnected'}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) =>
                      handleConfigUpdate(config.platform, {
                        enabled: e.target.checked,
                      })
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                </label>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="mb-2 font-medium">Order Settings</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.settings.autoAcceptOrders}
                        onChange={(e) =>
                          handleConfigUpdate(config.platform, {
                            settings: {
                              ...config.settings,
                              autoAcceptOrders: e.target.checked,
                            },
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm">Auto-accept orders</span>
                    </label>

                    <div>
                      <label className="mb-1 block text-sm text-gray-600">
                        Preparation Time (minutes)
                      </label>
                      <input
                        type="number"
                        value={config.settings.preparationTime}
                        onChange={(e) =>
                          handleConfigUpdate(config.platform, {
                            settings: {
                              ...config.settings,
                              preparationTime: parseInt(e.target.value),
                            },
                          })
                        }
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm text-gray-600">
                        Minimum Order Amount ($)
                      </label>
                      <input
                        type="number"
                        value={config.settings.minimumOrderAmount}
                        onChange={(e) =>
                          handleConfigUpdate(config.platform, {
                            settings: {
                              ...config.settings,
                              minimumOrderAmount: parseFloat(e.target.value),
                            },
                          })
                        }
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">Menu Sync</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.menuSync.enabled}
                        onChange={(e) =>
                          handleConfigUpdate(config.platform, {
                            menuSync: {
                              ...config.menuSync,
                              enabled: e.target.checked,
                            },
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm">Enable automatic menu sync</span>
                    </label>

                    <div>
                      <label className="mb-1 block text-sm text-gray-600">
                        Sync Interval (minutes)
                      </label>
                      <input
                        type="number"
                        value={config.menuSync.syncInterval}
                        onChange={(e) =>
                          handleConfigUpdate(config.platform, {
                            menuSync: {
                              ...config.menuSync,
                              syncInterval: parseInt(e.target.value),
                            },
                          })
                        }
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {config.menuSync.lastSync && (
                      <p className="text-sm text-gray-600">
                        Last sync: {new Date(config.menuSync.lastSync).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <button className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Menu Synchronization</h3>
            <button className="flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
              <RefreshCw className="h-5 w-5" />
              <span>Sync All Platforms</span>
            </button>
          </div>

          <div className="space-y-4">
            {platformConfigs.map((config) => (
              <div
                key={config.platform}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {config.platform === 'DoorDash'
                      ? '🚪'
                      : config.platform === 'UberEats'
                      ? '🚗'
                      : config.platform === 'Glovo'
                      ? '🛵'
                      : '⏭️'}
                  </span>
                  <div>
                    <h4 className="font-medium">{config.platform}</h4>
                    <p className="text-sm text-gray-600">
                      Last sync: {config.menuSync.lastSync
                        ? new Date(config.menuSync.lastSync).toLocaleString()
                        : 'Never'}
                    </p>
                  </div>
                </div>
                <button className="rounded-lg border px-4 py-2 hover:bg-gray-50">
                  Sync Menu
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Average Order Value</h3>
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <p className="mt-2 text-2xl font-bold">$27.50</p>
              <p className="text-sm text-gray-600">+5.2% from last month</p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Cancellation Rate</h3>
                <Percent className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="mt-2 text-2xl font-bold">2.4%</p>
              <p className="text-sm text-gray-600">-0.8% from last month</p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Avg. Preparation Time</h3>
                <Timer className="h-5 w-5 text-blue-500" />
              </div>
              <p className="mt-2 text-2xl font-bold">18.5 min</p>
              <p className="text-sm text-gray-600">-2.3 min from last month</p>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Platform Performance</h3>
            <div className="space-y-4">
              {platformConfigs.map((config) => (
                <div
                  key={config.platform}
                  className="rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {config.platform === 'DoorDash'
                          ? '🚪'
                          : config.platform === 'UberEats'
                          ? '🚗'
                          : config.platform === 'Glovo'
                          ? '🛵'
                          : '⏭️'}
                      </span>
                      <h4 className="font-medium">{config.platform}</h4>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Orders</p>
                        <p className="text-2xl font-bold">247</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Revenue</p>
                        <p className="text-2xl font-bold">$6,820</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Rating</p>
                        <p className="text-2xl font-bold">4.8</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}