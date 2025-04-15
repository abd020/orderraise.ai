import React from 'react';
import { useStore } from '@/lib/store';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface InventoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  editItem?: {
    id: string;
    name: string;
    currentStock: number;
    minimumStock: number;
    unit: string;
    supplier?: {
      name: string;
      email: string;
      phone: string;
      leadTime: number;
    };
    autoReorder: boolean;
  };
}

export function InventoryForm({ isOpen, onClose, editItem }: InventoryFormProps) {
  const { addInventoryItem, updateInventoryItem } = useStore();
  const [formData, setFormData] = React.useState({
    name: '',
    currentStock: 0,
    minimumStock: 0,
    unit: 'kg',
    supplier: {
      name: '',
      email: '',
      phone: '',
      leadTime: 1,
    },
    autoReorder: false,
  });

  React.useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        currentStock: editItem.currentStock,
        minimumStock: editItem.minimumStock,
        unit: editItem.unit,
        supplier: editItem.supplier || {
          name: '',
          email: '',
          phone: '',
          leadTime: 1,
        },
        autoReorder: editItem.autoReorder,
      });
    } else {
      setFormData({
        name: '',
        currentStock: 0,
        minimumStock: 0,
        unit: 'kg',
        supplier: {
          name: '',
          email: '',
          phone: '',
          leadTime: 1,
        },
        autoReorder: false,
      });
    }
  }, [editItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      updateInventoryItem(editItem.id, formData);
    } else {
      addInventoryItem(formData);
    }
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <Dialog.Title className="text-xl font-semibold">
            {editItem ? 'Edit Item' : 'Add New Item'}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-500">
            Fill in the details for the inventory item. Click save when you're done.
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Item Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Stock
              </label>
              <input
                type="number"
                value={formData.currentStock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentStock: Number(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Stock
              </label>
              <input
                type="number"
                value={formData.minimumStock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minimumStock: Number(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Unit
              </label>
              <select
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="l">Liters (l)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="units">Units</option>
              </select>
            </div>

            <div className="border-t pt-4">
              <h3 className="mb-2 text-lg font-medium">Supplier Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    value={formData.supplier.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        supplier: { ...formData.supplier, name: e.target.value },
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Supplier Email
                  </label>
                  <input
                    type="email"
                    value={formData.supplier.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        supplier: { ...formData.supplier, email: e.target.value },
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Supplier Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.supplier.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        supplier: { ...formData.supplier, phone: e.target.value },
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Lead Time (days)
                  </label>
                  <input
                    type="number"
                    value={formData.supplier.leadTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        supplier: {
                          ...formData.supplier,
                          leadTime: Number(e.target.value),
                        },
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoReorder"
                checked={formData.autoReorder}
                onChange={(e) =>
                  setFormData({ ...formData, autoReorder: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="autoReorder"
                className="text-sm font-medium text-gray-700"
              >
                Enable Auto-Reorder
              </label>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                {editItem ? 'Update' : 'Add'} Item
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}