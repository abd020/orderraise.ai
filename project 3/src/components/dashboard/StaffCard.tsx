import React from 'react';
import { Users } from 'lucide-react';
import { useStore } from '@/lib/store';

export function StaffCard() {
  const { activePositions, scheduledInterviews } = useStore();

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Staff Overview</h3>
        <Users className="h-5 w-5 text-gray-500" />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Active Hiring: {activePositions} positions
        </p>
        <p className="text-sm text-gray-600">
          Scheduled Interviews: {scheduledInterviews}
        </p>
      </div>
    </div>
  );
}