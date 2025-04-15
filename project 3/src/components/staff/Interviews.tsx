import React from 'react';
import { useStore } from '@/lib/store';
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  FileText,
  ChevronDown,
  Search,
} from 'lucide-react';

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

export function Interviews() {
  const { interviews } = useStore((state) => ({
    interviews: state.interviews || [],
  }));
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string>('all');

  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch = interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || interview.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationColor = (recommendation?: string) => {
    switch (recommendation) {
      case 'hire':
        return 'text-green-600';
      case 'reject':
        return 'text-red-600';
      case 'consider':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Interviews</h2>
          <p className="mt-1 text-gray-600">
            Track and manage candidate interviews
          </p>
        </div>
        <button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Schedule Interview
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search interviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>
          <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {filteredInterviews.map((interview) => (
          <div
            key={interview.id}
            className="rounded-lg border bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{interview.candidateName}</h3>
                <p className="text-gray-600">{interview.position}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                  interview.status
                )}`}
              >
                {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  {new Date(interview.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="mr-2 h-4 w-4" />
                  {new Date(interview.date).toLocaleTimeString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="mr-2 h-4 w-4" />
                  {interview.location}
                </div>
              </div>

              {interview.feedback && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="mr-2 h-4 w-4" />
                    Rating: {interview.feedback.rating}/5
                  </div>
                  <div className="flex items-center text-sm">
                    <FileText className="mr-2 h-4 w-4" />
                    <span className={getRecommendationColor(interview.feedback.recommendation)}>
                      {interview.feedback.recommendation?.charAt(0).toUpperCase() +
                        interview.feedback.recommendation?.slice(1)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {interview.feedback?.notes && (
              <div className="mt-4">
                <h4 className="mb-2 font-medium">Feedback Notes</h4>
                <p className="text-sm text-gray-600">{interview.feedback.notes}</p>
              </div>
            )}

            <div className="mt-4 flex justify-end space-x-3">
              {interview.status === 'scheduled' && (
                <>
                  <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Reschedule
                  </button>
                  <button className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
                    Add Feedback
                  </button>
                </>
              )}
              {interview.status === 'completed' && (
                <button className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
                  View Full Report
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}