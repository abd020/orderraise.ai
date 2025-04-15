import React from 'react';
import {
  Users,
  Package,
  CheckSquare,
  AlertTriangle,
  BarChart3,
  Settings,
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from './components/ui/navigation-menu';
import { StaffCard } from './components/dashboard/StaffCard';
import { InventoryCard } from './components/dashboard/InventoryCard';
import { QualityCard } from './components/dashboard/QualityCard';
import { SystemStatusCard } from './components/dashboard/SystemStatusCard';
import { InventoryTable } from './components/inventory/InventoryTable';

function App() {
  const [currentView, setCurrentView] = React.useState<'dashboard' | 'inventory'>(
    'dashboard'
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-center border-b">
          <h1 className="text-xl font-bold text-gray-800">Restaurant AI</h1>
        </div>
        <NavigationMenu orientation="vertical" className="w-full">
          <NavigationMenuList className="flex-col items-stretch space-y-1 p-2">
            <NavigationMenuItem>
              <NavigationMenuLink
                className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 ${
                  currentView === 'dashboard' ? 'bg-gray-100' : ''
                }`}
                onClick={() => setCurrentView('dashboard')}
              >
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 ${
                  currentView === 'inventory' ? 'bg-gray-100' : ''
                }`}
                onClick={() => setCurrentView('inventory')}
              >
                <Package className="h-5 w-5" />
                <span>Inventory</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                href="#staff"
              >
                <Users className="h-5 w-5" />
                <span>Staff Management</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                href="#quality"
              >
                <CheckSquare className="h-5 w-5" />
                <span>Quality Control</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                href="#disputes"
              >
                <AlertTriangle className="h-5 w-5" />
                <span>Disputes</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                href="#settings"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {currentView === 'dashboard' ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StaffCard />
            <InventoryCard />
            <QualityCard />
            <SystemStatusCard />
          </div>
        ) : currentView === 'inventory' ? (
          <InventoryTable />
        ) : null}
      </div>
    </div>
  );
}

export default App;