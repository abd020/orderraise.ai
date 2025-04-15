import React from 'react';
import { useStore } from '@/lib/store';
import { 
  Package, 
  AlertTriangle, 
  RefreshCcw,
  Plus,
  Search,
  Edit,
  Trash2,
  Phone,
  Mail,
  Clock,
  MessageSquare
} from 'lucide-react';
import { InventoryForm } from './InventoryForm';
import { InventoryChart } from './InventoryChart';
import { SupplierChat } from '../supplier/SupplierChat';

export function InventoryTable() {
  const { inventory, removeInventoryItem, triggerAutoReorder } = useStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [editItem, setEditItem] = React.useState<any>(null);

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (item: any) => {
    setEditItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      removeInventoryItem(id);
    }
  };

  React.useEffect(() => {
    // Check for low stock items and trigger auto-reorder
    inventory.forEach((item) => {
      if (
        item.autoReorder &&
        item.currentStock <= item.minimumStock &&
        item.supplier?.email
      ) {
        triggerAutoReorder(item);
      }
    });
  }, [inventory, triggerAutoReorder]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <Package className="h-6 w-6 text-gray-500" />
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Chat with Suppliers</span>
          </button>
          <button
            onClick={() => {
              setEditItem(null);
              setIsFormOpen(true);
            }}
            className="flex items-center space-x-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </button>
          <button className="flex items-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
            <RefreshCcw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {isChatOpen ? (
          <SupplierChat />
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Item Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Minimum Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Supplier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        No inventory items found.
                      </td>
                    </tr>
                  ) : (
                    filteredInventory.map((item) => (
                      <tr key={item.id}>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900">{item.name}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {item.currentStock}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {item.minimumStock}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">{item.unit}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {item.supplier ? (
                            <div className="space-y-1">
                              <div className="font-medium">{item.supplier.name}</div>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Mail className="h-4 w-4" />
                                <span>{item.supplier.email}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Phone className="h-4 w-4" />
                                <span>{item.supplier.phone}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span>{item.supplier.leadTime} days lead time</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">No supplier</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="space-y-1">
                            {item.currentStock <= item.minimumStock ? (
                              <span className="flex items-center text-red-600">
                                <AlertTriangle className="mr-1 h-4 w-4" />
                                Low Stock
                              </span>
                            ) : (
                              <span className="text-green-600">In Stock</span>
                            )}
                            {item.autoReorder && (
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                Auto-Reorder
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <InventoryChart />
      </div>

      <InventoryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditItem(null);
        }}
        editItem={editItem}
      />
    </div>
  );
}