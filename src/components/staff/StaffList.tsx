import React from 'react';
import { useStore } from '@/lib/store';
import {
  Search,
  Star,
  Clock,
  MapPin,
  Mail,
  Phone,
  FileText,
  AlertTriangle,
  MoreVertical,
  ChevronDown,
} from 'lucide-react';

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

export function StaffList() {
  const { staff } = useStore((state) => ({
    staff: state.staff || [],
  }));
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterRole, setFilterRole] = React.useState<string>('all');
  const [filterLocation, setFilterLocation] = React.useState<string>('all');

  const filteredStaff = staff.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesLocation = filterLocation === 'all' || member.location === filterLocation;
    return matchesSearch && matchesRole && matchesLocation;
  });

  const roles = Array.from(new Set(staff.map((member) => member.role)));
  const locations = Array.from(new Set(staff.map((member) => member.location)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'interviewing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Staff Management</h2>
          <p className="mt-1 text-gray-600">
            Manage your restaurant chain staff across all locations
          </p>
        </div>
        <button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Add New Staff
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="relative">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10"
          >
            <option value="all">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
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
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {filteredStaff.map((member) => (
          <div
            key={member.id}
            className="rounded-lg border bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                    member.status
                  )}`}
                >
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </span>
                <button className="rounded-full p-1 hover:bg-gray-100">
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="mr-2 h-4 w-4" />
                  {member.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="mr-2 h-4 w-4" />
                  Since {new Date(member.startDate).toLocaleDateString()}
                </div>
                {member.performance && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="mr-2 h-4 w-4 text-yellow-400" />
                    {member.performance.rating} ({member.performance.reviews} reviews)
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="mr-2 h-4 w-4" />
                  {member.contact.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="mr-2 h-4 w-4" />
                  {member.contact.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="mr-2 h-4 w-4" />
                  {member.documents.length} Documents
                </div>
              </div>
            </div>

            {member.performance && (
              <div className="mt-4">
                <h4 className="mb-2 font-medium">Performance Metrics</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-gray-50 p-2 text-center">
                    <div className="text-sm text-gray-600">Speed</div>
                    <div className="font-semibold">{member.performance.speedScore}%</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-2 text-center">
                    <div className="text-sm text-gray-600">Quality</div>
                    <div className="font-semibold">{member.performance.qualityScore}%</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-2 text-center">
                    <div className="text-sm text-gray-600">Attendance</div>
                    <div className="font-semibold">{member.performance.attendance}%</div>
                  </div>
                </div>
              </div>
            )}

            {member.documents.some((doc) => doc.status === 'expired') && (
              <div className="mt-4 flex items-center rounded-lg bg-red-50 p-3 text-red-800">
                <AlertTriangle className="mr-2 h-5 w-5" />
                <span>Some documents need attention</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}