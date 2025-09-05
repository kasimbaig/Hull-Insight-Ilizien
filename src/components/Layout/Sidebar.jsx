import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Squares2X2Icon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  UserGroupIcon,
  BellIcon,
  CogIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    { name: 'Dashboard', icon: Squares2X2Icon, href: '/' },
    { name: 'Global Masters', icon: DocumentTextIcon, href: '/masters' },
    { name: 'Dockyard Plan Approval', icon: DocumentChartBarIcon, href: '/dockyard-plans' },
    { name: 'Quarterly Hull Survey', icon: MagnifyingGlassIcon, href: '/hull-surveys' },//GIVE REPORTS make design same as global masters and all
    // Changed HVAC Trials icon to CogIcon for a better representation
    { name: 'HVAC Trials', icon: CogIcon, href: '/hvac' },
    { name: 'Interactive Drawing', icon: PencilSquareIcon, href: '/drawing' },
    // { name: 'Reports', icon: ChartBarIcon, href: '/reports' },
    { name: 'Users & Roles', icon: UserGroupIcon, href: '/users' },
    // { name: 'Audit & Notifications', icon: BellIcon, href: '/audit' },
    // { name: 'Settings', icon: CogIcon, href: '/settings' },
  ];

  const location = useLocation();

  return (
  <div className={`bg-blue-600 h-[100vh] w-${isCollapsed ? '16' : '64'} fixed left-0 top-0 z-40 flex flex-col border-r border-blue-700 shadow-xl transition-all duration-300`}>
    {/* Header */}
  <div className="p-8 border-b border-blue-700 bg-blue-600">
  <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="text-white">
              <h1 className="text-2xl font-extrabold tracking-wide">Hull Insight</h1>
              <p className="text-base text-blue-200 font-medium">Naval Management</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl bg-blue-500 hover:bg-blue-700 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5 text-white" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </div>

    {/* Navigation */}
  <nav className="flex-1 p-6 space-y-4 bg-blue-600">
        {navigation.map((item) => {
          const Icon = item.icon;
          // Highlight if current path matches (exact or startsWith for subroutes)
          const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
          return (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 group shadow-sm hover:bg-blue-500/80 active:bg-blue-700 ${
                isActive
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-white/80 hover:bg-blue-500 hover:text-white'
              }`}
            >
              <Icon className={`flex-shrink-0 h-5 w-5 text-white ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && (
                <span className="text-white tracking-wide">{item.name}</span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
  <div className="p-6 border-t border-blue-700 bg-blue-600">
          <div className="text-center text-blue-200 text-sm">
            <p>Hull Insight v1.0</p>
            <p>Naval Systems Division</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;