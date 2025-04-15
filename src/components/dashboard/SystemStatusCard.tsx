import React from 'react';
import { Activity } from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatDistanceToNow } from 'date-fns';

export function SystemStatusCard() {
  const { systemStatus, lastUpdate } = useStore();

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">System Health</h3>
        <Activity className="h-5 w-5 text-gray-500" />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Status: {systemStatus === 'operational' ? (
            <span className="text-green-600">All Systems Operational</span>
          ) : (
            <span className="text-red-600">System Issues Detected</span>
          )}
        </p>
        <p className="text-sm text-gray-600">
          Last Update: {formatDistanceToNow(new Date(lastUpdate), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}