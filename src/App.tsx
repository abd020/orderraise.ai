import React from 'react';
import {
  Users,
  Package,
  CheckSquare,
  AlertTriangle,
  BarChart3,
  Settings,
  Menu as MenuIcon,
} from 'lucide-react';
import { Dashboard } from './components/dashboard/Dashboard';
import { StaffList } from './components/staff/StaffList';
import { JobPostings } from './components/staff/JobPostings';
import { Interviews } from './components/staff/Interviews';
import { InventoryTable } from './components/inventory/InventoryTable';
import { OrderVerification } from './components/quality/OrderVerification';
import { DisputeTable } from './components/disputes/DisputeTable';
import { PlatformStatus } from './components/dashboard/PlatformStatus';

function App() {
  const [currentView, setCurrentView] = React.useState<
    | 'dashboard'
    | 'inventory'
    | 'staff'
    | 'jobs'
    | 'interviews'
    | 'quality'
    | 'disputes'
    | 'platforms'
  >('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile/Tablet Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-lg lg:hidden"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-center border-b">
          <h1 className="text-xl font-bold text-gray-800">Restaurant AI</h1>
        </div>
        <nav className="space-y-1 p-4">
          <button
            onClick={() => {
              setCurrentView('dashboard');
              setIsSidebarOpen(false);
            }}
            className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left text-gray-700 hover:bg-gray-100 ${
              currentView === 'dashboard' ? 'bg-gray-100' : ''
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('inventory');
              setIsSidebarOpen(false);
            }}
            className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left text-gray-700 hover:bg-gray-100 ${
              currentView === 'inventory' ? 'bg-gray-100' : ''
            }`}
          >
            <Package className="h-5 w-5" />
            <span>Inventory</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('staff');
              setIsSidebarOpen(false);
            }}
            className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left text-gray-700 hover:bg-gray-100 ${
              currentView === 'staff' ? 'bg-gray-100' : ''
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Staff</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('jobs');
              setIsSidebarOpen(false);
            }}
            className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left text-gray-700 hover:bg-gray-100 ${
              currentView === 'jobs' ? 'bg-gray-100' : ''
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Job Postings</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('interviews');
              setIsSidebarOpen(false);
            }}
            className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left text-gray-700 hover:bg-gray-100 ${
              currentView === 'interviews' ? 'bg-gray-100' : ''
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Interviews</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('quality');
              setIsSidebarOpen(false);
            }}
            className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left text-gray-700 hover:bg-gray-100 ${
              currentView === 'quality' ? 'bg-gray-100' : ''
            }`}
          >
            <CheckSquare className="h-5 w-5" />
            <span>Quality Control</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('disputes');
              setIsSidebarOpen(false);
            }}
            className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left text-gray-700 hover:bg-gray-100 ${
              currentView === 'disputes' ? 'bg-gray-100' : ''
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
            <span>Disputes</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('platforms');
              setIsSidebarOpen(false);
            }}
            className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left text-gray-700 hover:bg-gray-100 ${
              currentView === 'platforms' ? 'bg-gray-100' : ''
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
            <span>Platform Status</span>
          </button>

          <button
            className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left text-gray-700 hover:bg-gray-100"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'inventory' && <InventoryTable />}
          {currentView === 'staff' && <StaffList />}
          {currentView === 'jobs' && <JobPostings />}
          {currentView === 'interviews' && <Interviews />}
          {currentView === 'quality' && <OrderVerification />}
          {currentView === 'disputes' && <DisputeTable />}
          {currentView === 'platforms' && <PlatformStatus />}
        </div>
      </div>
    </div>
  );
}

export default App;