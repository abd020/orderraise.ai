import React from 'react';
import { Package } from 'lucide-react';
import { useStore } from '@/lib/store';

export function InventoryCard() {
  const { lowStockItems, pendingOrders } = useStore();

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Inventory Status</h3>
        <Package className="h-5 w-5 text-gray-500" />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Low Stock Items: {lowStockItems}
        </p>
        <p className="text-sm text-gray-600">
          Pending Orders: {pendingOrders}
        </p>
      </div>
    </div>
  );
}