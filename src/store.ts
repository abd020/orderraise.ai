import { create } from 'zustand';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'interviewing' | 'pending';
}

interface Supplier {
  name: string;
  email: string;
  phone: string;
  leadTime: number;
}

interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  lastUpdated: string;
  supplier?: Supplier;
  autoReorder: boolean;
}

interface StoreState {
  staff: StaffMember[];
  inventory: InventoryItem[];
  activePositions: number;
  scheduledInterviews: number;
  lowStockItems: number;
  pendingOrders: number;
  ordersChecked: number;
  issuesDetected: number;
  systemStatus: 'operational' | 'degraded' | 'down';
  lastUpdate: string;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  removeInventoryItem: (id: string) => void;
  triggerAutoReorder: (item: InventoryItem) => void;
}

export const useStore = create<StoreState>((set) => ({
  staff: [],
  inventory: [
    {
      id: '1',
      name: 'Tomatoes',
      currentStock: 50,
      minimumStock: 100,
      unit: 'kg',
      lastUpdated: new Date().toISOString(),
      supplier: {
        name: 'Fresh Produce Co',
        email: 'orders@freshproduce.com',
        phone: '555-0123',
        leadTime: 2,
      },
      autoReorder: true,
    },
    {
      id: '2',
      name: 'Chicken Breast',
      currentStock: 75,
      minimumStock: 50,
      unit: 'kg',
      lastUpdated: new Date().toISOString(),
      supplier: {
        name: 'Premium Meats',
        email: 'sales@premiummeats.com',
        phone: '555-0124',
        leadTime: 3,
      },
      autoReorder: true,
    },
  ],
  activePositions: 3,
  scheduledInterviews: 5,
  lowStockItems: 8,
  pendingOrders: 2,
  ordersChecked: 150,
  issuesDetected: 3,
  systemStatus: 'operational',
  lastUpdate: new Date().toISOString(),

  addInventoryItem: (item) =>
    set((state) => ({
      inventory: [
        ...state.inventory,
        {
          ...item,
          id: Math.random().toString(36).substr(2, 9),
          lastUpdated: new Date().toISOString(),
        },
      ],
    })),

  updateInventoryItem: (id, updates) =>
    set((state) => ({
      inventory: state.inventory.map((item) =>
        item.id === id
          ? { ...item, ...updates, lastUpdated: new Date().toISOString() }
          : item
      ),
    })),

  removeInventoryItem: (id) =>
    set((state) => ({
      inventory: state.inventory.filter((item) => item.id !== id),
    })),

  triggerAutoReorder: (item) => {
    // In a real application, this would integrate with an email service or supplier API
    console.log(`Auto-reorder triggered for ${item.name}`);
    console.log(`Sending order to ${item.supplier?.email}`);
    
    // For demo purposes, we'll just update the current stock
    set((state) => ({
      inventory: state.inventory.map((i) =>
        i.id === item.id
          ? {
              ...i,
              currentStock: i.currentStock + (i.minimumStock * 2),
              lastUpdated: new Date().toISOString(),
            }
          : i
      ),
    }));
  },
}));