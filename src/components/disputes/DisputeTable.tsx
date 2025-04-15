import React from 'react';
import { useStore } from '@/lib/store';
import { Search } from 'lucide-react';

export function DisputeTable() {
  const { disputes } = useStore();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredDisputes = disputes.filter((dispute) =>
    dispute.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispute.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      case 'disputing':
        return 'bg-purple-100 text-purple-800';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dispute Automation</h2>
          <p className="mt-1 text-gray-600">
            Our AI agents dispute refunds automatically, saving hours of work for your staff
          </p>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search disputes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Order Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDisputes.map((dispute) => (
              <tr key={dispute.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="font-medium text-gray-900">
                    {dispute.orderCode}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                  {dispute.location}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                  ${dispute.price.toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span>{getPlatformLogo(dispute.platform)}</span>
                    <span className="text-gray-900">{dispute.platform}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                      dispute.status
                    )}`}
                  >
                    {dispute.status === 'disputing'
                      ? 'AI is disputing...'
                      : dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}