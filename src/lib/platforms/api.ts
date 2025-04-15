import axios from 'axios';
import { Platform, PlatformConfig, MenuItem, Order } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class PlatformAPI {
  private config: PlatformConfig;
  private axiosInstance;

  constructor(config: PlatformConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: `${API_BASE_URL}/platforms/${config.platform.toLowerCase()}`,
      headers: {
        'Authorization': `Bearer ${config.credentials.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // Menu Management
  async getMenu(): Promise<MenuItem[]> {
    const response = await this.axiosInstance.get('/menu');
    return response.data;
  }

  async updateMenuItem(item: MenuItem): Promise<MenuItem> {
    const response = await this.axiosInstance.put(`/menu/${item.id}`, item);
    return response.data;
  }

  async bulkUpdateMenu(items: MenuItem[]): Promise<MenuItem[]> {
    const response = await this.axiosInstance.post('/menu/bulk', { items });
    return response.data;
  }

  // Order Management
  async getOrders(status?: string): Promise<Order[]> {
    const response = await this.axiosInstance.get('/orders', {
      params: { status },
    });
    return response.data;
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    const response = await this.axiosInstance.put(`/orders/${orderId}/status`, {
      status,
    });
    return response.data;
  }

  async acceptOrder(orderId: string, preparationTime: number): Promise<Order> {
    const response = await this.axiosInstance.post(`/orders/${orderId}/accept`, {
      preparationTime,
    });
    return response.data;
  }

  async rejectOrder(orderId: string, reason: string): Promise<void> {
    await this.axiosInstance.post(`/orders/${orderId}/reject`, { reason });
  }

  // Platform Status
  async getPlatformStatus(): Promise<{
    status: 'online' | 'offline' | 'busy' | 'error';
    issues: Array<{
      type: string;
      message: string;
      severity: 'low' | 'medium' | 'high';
    }>;
  }> {
    const response = await this.axiosInstance.get('/status');
    return response.data;
  }

  async updatePlatformStatus(status: 'online' | 'offline' | 'busy'): Promise<void> {
    await this.axiosInstance.put('/status', { status });
  }

  // Settings Management
  async updateSettings(settings: PlatformConfig['settings']): Promise<void> {
    await this.axiosInstance.put('/settings', settings);
  }

  // Menu Synchronization
  async syncMenu(): Promise<{
    success: boolean;
    itemsUpdated: number;
    errors?: Array<{
      item: string;
      error: string;
    }>;
  }> {
    const response = await this.axiosInstance.post('/menu/sync');
    return response.data;
  }

  // Analytics
  async getAnalytics(startDate: string, endDate: string): Promise<{
    orders: number;
    revenue: number;
    averageOrderValue: number;
    cancelRate: number;
    preparationTime: number;
    customerRating: number;
  }> {
    const response = await this.axiosInstance.get('/analytics', {
      params: { startDate, endDate },
    });
    return response.data;
  }
}

export const createPlatformAPI = (config: PlatformConfig): PlatformAPI => {
  return new PlatformAPI(config);
};