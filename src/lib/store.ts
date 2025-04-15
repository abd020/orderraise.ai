import { create } from 'zustand';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  location: string;
  status: 'active' | 'interviewing' | 'pending' | 'terminated';
  startDate: string;
  performance?: {
    rating: number;
    reviews: number;
    speedScore: number;
    qualityScore: number;
    attendance: number;
  };
  contact: {
    email: string;
    phone: string;
  };
  documents: {
    type: string;
    status: 'verified' | 'pending' | 'expired';
    expiryDate?: string;
  }[];
}

interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  position: string;
  location: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  feedback?: {
    rating: number;
    notes: string;
    recommendation: 'hire' | 'reject' | 'consider';
  };
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

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderCode: string;
  location: string;
  price: number;
  platform: 'DoorDash' | 'UberEats' | 'Glovo' | 'Skip' | 'Shopify';
  status: 'pending' | 'verified' | 'incorrect';
  items: OrderItem[];
  imageUrl?: string;
  verifiedAt?: string;
  createdAt: string;
}

interface JobPosting {
  id: string;
  title: string;
  location: string;
  department: string;
  type: 'full-time' | 'part-time' | 'temporary';
  status: 'open' | 'closed' | 'draft';
  requirements: string[];
  salary: {
    min: number;
    max: number;
    period: 'hour' | 'month' | 'year';
  };
  applications: number;
  createdAt: string;
  closingDate?: string;
}

interface PlatformStatus {
  id: string;
  platform: 'DoorDash' | 'UberEats' | 'Glovo' | 'Skip' | 'Shopify';
  location: string;
  status: 'online' | 'offline' | 'busy' | 'error';
  lastChecked: string;
  issues: {
    type: 'menu' | 'tablet' | 'network' | 'system';
    message: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: string;
  }[];
  metrics: {
    uptime: number;
    responseTime: number;
    orderAcceptRate: number;
    cancellationRate: number;
  };
}

interface StoreState {
  staff: StaffMember[];
  inventory: InventoryItem[];
  orders: Order[];
  jobPostings: JobPosting[];
  interviews: Interview[];
  activePositions: number;
  scheduledInterviews: number;
  lowStockItems: number;
  pendingOrders: number;
  ordersChecked: number;
  issuesDetected: number;
  systemStatus: 'operational' | 'degraded' | 'down';
  lastUpdate: string;
  platformStatus: PlatformStatus[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  removeInventoryItem: (id: string) => void;
  triggerAutoReorder: (item: InventoryItem) => void;
  verifyOrder: (id: string, status: 'verified' | 'incorrect', imageUrl?: string) => void;
  updatePlatformStatus: (platform: PlatformStatus['platform'], location: string, status: PlatformStatus['status'], issues?: PlatformStatus['issues']) => void;
  addPlatformIssue: (platformId: string, issue: PlatformStatus['issues'][0]) => void;
  resolvePlatformIssue: (platformId: string, issueType: PlatformStatus['issues'][0]['type']) => void;
}

export const useStore = create<StoreState>((set) => ({
  staff: [
    {
      id: '1',
      name: 'John Smith',
      role: 'Head Chef',
      location: 'Main Street',
      status: 'active',
      startDate: '2023-01-15',
      contact: {
        email: 'john.smith@restaurant.com',
        phone: '555-0123',
      },
      documents: [
        {
          type: 'Food Handler Certificate',
          status: 'verified',
          expiryDate: '2024-12-31',
        },
      ],
    },
  ],
  interviews: [
    {
      id: '1',
      candidateId: 'c1',
      candidateName: 'Sarah Chen',
      position: 'Line Cook',
      location: 'Main Street',
      date: '2024-02-15T14:00:00Z',
      status: 'scheduled',
    },
    {
      id: '2',
      candidateId: 'c2',
      candidateName: 'Michael Johnson',
      position: 'Server',
      location: 'Downtown',
      date: '2024-02-16T15:30:00Z',
      status: 'completed',
      feedback: {
        rating: 4,
        notes: 'Great customer service experience and positive attitude.',
        recommendation: 'hire',
      },
    },
  ],
  jobPostings: [
    {
      id: '1',
      title: 'Line Cook',
      location: 'Main Street',
      department: 'Kitchen',
      type: 'full-time',
      status: 'open',
      requirements: [
        'Minimum 2 years experience in high-volume restaurant',
        'Food Handler Certificate',
        'Available for morning and evening shifts',
        'Strong teamwork skills',
      ],
      salary: {
        min: 18,
        max: 25,
        period: 'hour',
      },
      applications: 12,
      createdAt: new Date().toISOString(),
      closingDate: '2024-03-31',
    },
  ],
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
  ],
  orders: [
    {
      id: '1',
      orderCode: 'DD-12345',
      location: 'Main Street',
      price: 45.99,
      platform: 'DoorDash',
      status: 'pending',
      items: [
        { name: 'Burger', quantity: 2, price: 15.99 },
        { name: 'Fries', quantity: 2, price: 4.99 },
      ],
      createdAt: new Date().toISOString(),
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
  platformStatus: [
    {
      id: '1',
      platform: 'DoorDash',
      location: 'Main Street',
      status: 'online',
      lastChecked: new Date().toISOString(),
      issues: [],
      metrics: {
        uptime: 99.8,
        responseTime: 1.2,
        orderAcceptRate: 98.5,
        cancellationRate: 0.5,
      },
    },
  ],

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
    console.log(`Auto-reorder triggered for ${item.name}`);
    console.log(`Sending order to ${item.supplier?.email}`);
    
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

  verifyOrder: (id, status, imageUrl) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id
          ? {
              ...order,
              status,
              imageUrl,
              verifiedAt: new Date().toISOString(),
            }
          : order
      ),
      ordersChecked: state.ordersChecked + 1,
      issuesDetected: status === 'incorrect' ? state.issuesDetected + 1 : state.issuesDetected,
    })),

  updatePlatformStatus: (platform, location, status, issues = []) =>
    set((state) => ({
      platformStatus: state.platformStatus.map((p) =>
        p.platform === platform && p.location === location
          ? {
              ...p,
              status,
              issues: issues.length > 0 ? issues : p.issues,
              lastChecked: new Date().toISOString(),
            }
          : p
      ),
    })),

  addPlatformIssue: (platformId, issue) =>
    set((state) => ({
      platformStatus: state.platformStatus.map((p) =>
        p.id === platformId
          ? {
              ...p,
              status: 'error',
              issues: [...p.issues, { ...issue, timestamp: new Date().toISOString() }],
              lastChecked: new Date().toISOString(),
            }
          : p
      ),
    })),

  resolvePlatformIssue: (platformId, issueType) =>
    set((state) => ({
      platformStatus: state.platformStatus.map((p) =>
        p.id === platformId
          ? {
              ...p,
              status: p.issues.length === 1 ? 'online' : p.status,
              issues: p.issues.filter((i) => i.type !== issueType),
              lastChecked: new Date().toISOString(),
            }
          : p
      ),
    })),
}));