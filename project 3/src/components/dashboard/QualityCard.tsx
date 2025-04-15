import React from 'react';
import { CheckSquare } from 'lucide-react';
import { useStore } from '@/lib/store';

export function QualityCard() {
  const { ordersChecked, issuesDetected } = useStore();

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Quality Metrics</h3>
        <CheckSquare className="h-5 w-5 text-gray-500" />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Orders Checked: {ordersChecked}
        </p>
        <p className="text-sm text-gray-600">
          Issues Detected: {issuesDetected}
        </p>
      </div>
    </div>
  );
}