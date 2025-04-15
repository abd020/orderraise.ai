import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useStore } from '@/lib/store';

export function InventoryChart() {
  const { inventory } = useStore();

  const data = inventory.map((item) => ({
    name: item.name,
    current: item.currentStock,
    minimum: item.minimumStock,
  }));

  return (
    <div className="h-[400px] w-full rounded-lg bg-white p-4 shadow-md">
      <h3 className="mb-4 text-lg font-semibold">Stock Levels Overview</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="current" name="Current Stock" fill="#4F46E5" />
          <Bar dataKey="minimum" name="Minimum Stock" fill="#EF4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}