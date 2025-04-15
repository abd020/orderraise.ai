import { z } from 'zod';

export const PlatformSchema = z.enum(['DoorDash', 'UberEats', 'Glovo', 'Skip', 'Shopify']);
export type Platform = z.infer<typeof PlatformSchema>;

export const MenuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  image: z.string().optional(),
  modifiers: z.array(z.object({
    id: z.string(),
    name: z.string(),
    options: z.array(z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
    })),
  })).optional(),
  available: z.boolean(),
});

export type MenuItem = z.infer<typeof MenuItemSchema>;

export const PlatformConfigSchema = z.object({
  platform: PlatformSchema,
  enabled: z.boolean(),
  credentials: z.object({
    apiKey: z.string(),
    apiSecret: z.string().optional(),
    merchantId: z.string(),
    locationId: z.string().optional(),
  }),
  settings: z.object({
    autoAcceptOrders: z.boolean(),
    preparationTime: z.number(),
    minimumOrderAmount: z.number().optional(),
    serviceFee: z.number().optional(),
    deliveryFee: z.number().optional(),
  }),
  menuSync: z.object({
    enabled: z.boolean(),
    syncInterval: z.number(),
    lastSync: z.string().optional(),
  }),
});

export type PlatformConfig = z.infer<typeof PlatformConfigSchema>;

export const OrderSchema = z.object({
  id: z.string(),
  platform: PlatformSchema,
  status: z.enum([
    'new',
    'accepted',
    'preparing',
    'ready',
    'picked_up',
    'delivered',
    'cancelled',
  ]),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number(),
    price: z.number(),
    modifiers: z.array(z.object({
      name: z.string(),
      options: z.array(z.object({
        name: z.string(),
        price: z.number(),
      })),
    })).optional(),
    specialInstructions: z.string().optional(),
  })),
  customer: z.object({
    name: z.string(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
  payment: z.object({
    subtotal: z.number(),
    tax: z.number(),
    deliveryFee: z.number(),
    serviceFee: z.number(),
    total: z.number(),
    method: z.string(),
  }),
  timing: z.object({
    created: z.string(),
    accepted: z.string().optional(),
    preparing: z.string().optional(),
    ready: z.string().optional(),
    pickedUp: z.string().optional(),
    delivered: z.string().optional(),
    cancelled: z.string().optional(),
    estimatedDelivery: z.string().optional(),
  }),
  driver: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    location: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
    eta: z.string().optional(),
  }).optional(),
});

export type Order = z.infer<typeof OrderSchema>;