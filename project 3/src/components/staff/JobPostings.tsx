import React from 'react';
import { useStore } from '@/lib/store';
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Plus,
  Search,
  ChevronDown,
} from 'lucide-react';

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

export function JobPostings() {
  const { jobPostings } = useStore((state) => ({
    jobPostings: state.jobPostings || [],
  }));
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterLocation, setFilterLocation] = React.useState<string>('all');
  const [filterType, setFilterType] = React.useState<string>('all');

  const filteredPostings = jobPostings.filter((posting) => {
    const matchesSearch = posting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      posting.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = filterLocation === 'all' || posting.location === filterLocation;
    const matchesType = filterType === 'all' || posting.type === filterType;
    return matchesSearch && matchesLocation && matchesType;
  });

  const locations = Array.from(new Set(jobPostings.map((posting) => posting.location)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Job Postings</h2>
          <p className="mt-1 text-gray-600">
            Manage open positions and track applications
          </p>
        </div>
        <button className="flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          <Plus className="h-5 w-5" />
          <span>Create Job Posting</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="relative">
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10"
          >
            <option value="all">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="relative">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10"
          >
            <option value="all">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="temporary">Temporary</option>
          </select>
          <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {filteredPostings.map((posting) => (
          <div
            key={posting.id}
            className="rounded-lg border bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{posting.title}</h3>
                <p className="text-gray-600">{posting.department}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                  posting.status
                )}`}
              >
                {posting.status.charAt(0).toUpperCase() + posting.status.slice(1)}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="mr-2 h-4 w-4" />
                  {posting.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="mr-2 h-4 w-4" />
                  {posting.type.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="mr-2 h-4 w-4" />
                  {posting.applications} Applications
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="mr-2 h-4 w-4" />
                  ${posting.salary.min}-${posting.salary.max}/{posting.salary.period}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="mr-2 h-4 w-4" />
                  Posted {new Date(posting.createdAt).toLocaleDateString()}
                </div>
                {posting.closingDate && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="mr-2 h-4 w-4" />
                    Closes {new Date(posting.closingDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 font-medium">Requirements</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                {posting.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Edit
              </button>
              <button className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
                View Applications
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}