import React from 'react';
import { 
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ChevronDownIcon,
  Squares2X2Icon,
  DocumentTextIcon,
  BuildingOffice2Icon,
  WrenchScrewdriverIcon,
  CogIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Topbar = () => {
  const user = {
    name: localStorage.getItem('user') || 'Guest User',
  };  
  const globalMasters = [
    { name: 'Unit', key: 'unit', icon: Squares2X2Icon, href: '/masters?category=unit' },
    { name: 'Class of Vessel', key: 'classofvessel', icon: DocumentTextIcon, href: '/masters?category=classofvessel' },
    { name: 'Vessel Type', key: 'vesseltype', icon: DocumentTextIcon, href: '/masters?category=vesseltype' },
    { name: 'Dockyard', key: 'dockyard', icon: WrenchScrewdriverIcon, href: '/masters?category=dockyard' },
    { name: 'Command', key: 'command', icon: BuildingOffice2Icon, href: '/masters?category=command' },
    { name: 'Vessel', key: 'vessel', icon: BuildingOffice2Icon, href: '/masters?category=vessel' },
    { name: 'Hull Compartment', key: 'hullcompartment', icon: DocumentTextIcon, href: '/masters?category=hullcompartment' },
    { name: 'Hull System', key: 'hullsystem', icon: DocumentTextIcon, href: '/masters?category=hullsystem' },
    { name: 'Hull Equipment', key: 'hullequipment', icon: DocumentTextIcon, href: '/masters?category=hullequipment' },
    { name: 'Damage Type', key: 'damagetype', icon: DocumentTextIcon, href: '/masters?category=damagetype' },
    { name: 'Severity', key: 'severity', icon: DocumentTextIcon, href: '/masters?category=severity' },
    { name: 'Operational Status', key: 'operationalstatus', icon: DocumentTextIcon, href: '/masters?category=operationalstatus' },
    { name: 'Module', key: 'module', icon: CogIcon, href: '/masters?category=module' },
    { name: 'SubModule', key: 'submodule', icon: CogIcon, href: '/masters?category=submodule' },
    { name: 'Survey Cycle', key: 'surveycycle', icon: CogIcon, href: '/masters?category=surveycycle' },
    { name: 'Dynamic Field', key: 'dynamicfield', icon: CogIcon, href: '/masters?category=dynamicfield' },
  ];

  return (
    <header className="bg-white border-b border-hull-secondary px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span className="text-hull-primary font-semibold">Naval Command</span>
          {/* <span>→</span>
          <span>INS Vikrant</span> */}
          <span>→</span>
              <span className="text-foreground font-medium">
                {(() => {
                  const path = window.location.pathname;
                  if (path === '/' || path === '/dashboard') return 'Dashboard';
                  // Extract last part of path, capitalize
                  const parts = path.split('/').filter(Boolean);
                  let page = parts[parts.length - 1] || 'Dashboard';
                  // Optionally, handle known routes
                  if (page === 'masters') return 'Masters';
                  if (page === 'login') return 'Login';
                  // Capitalize first letter
                  return page.charAt(0).toUpperCase() + page.slice(1);
                })()}
              </span>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Global Masters Dropdown */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-hull-primary/20 text-hull-primary hover:bg-hull-primary/5">
                <Squares2X2Icon className="h-4 w-4 mr-2" />
                Global Masters
                <ChevronDownIcon className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border-hull-secondary shadow-lg z-[1100]">
              <DropdownMenuLabel className="text-hull-primary font-semibold">
                Quick Access Masters
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-hull-secondary" />
              {globalMasters.map((master) => {
                const Icon = master.icon;
                return (
                  <DropdownMenuItem key={master.name} asChild>
                    <a 
                      href={master.href}
                      className="flex items-center cursor-pointer hover:bg-hull-primary/5 transition-colors"
                    >
                      <Icon className="h-4 w-4 mr-3 text-hull-primary" />
                      <span className="text-foreground">{master.name}</span>
                    </a>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator className="bg-hull-secondary" />
              <DropdownMenuItem asChild>
                <a 
                  href="/masters"
                  className="flex items-center cursor-pointer text-hull-primary font-medium hover:bg-hull-primary/5"
                >
                  <UserGroupIcon className="h-4 w-4 mr-3" />
                  View All Masters
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}

          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search vessels, plans..."
              className="pl-9 pr-4 py-2 w-64 border border-hull-secondary rounded-xl bg-background focus:ring-2 focus:ring-hull-primary focus:border-hull-primary transition-colors text-sm"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-xl hover:bg-hull-primary/5 transition-colors">
              <BellIcon className="h-5 w-5 text-muted-foreground" />
            </button>
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-hull-accent text-white text-xs">
              3
            </Badge>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3 pl-4 border-l border-hull-secondary">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">Fleet Operations</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 p-2 rounded-xl hover:bg-hull-primary/5 transition-colors">
                  <UserCircleIcon className="h-8 w-8 text-hull-primary" />
                  <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white border-hull-secondary shadow-lg z-[1100]">
                <DropdownMenuLabel className="text-hull-primary">
                  {user.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-hull-secondary" />
                <DropdownMenuItem className="hover:bg-hull-primary/5">
                  <UserCircleIcon className="h-4 w-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-hull-primary/5">
                  <CogIcon className="h-4 w-4 mr-2" />
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-hull-secondary" />
                <DropdownMenuItem>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('isLoggedIn');
                      window.location.href = '/login';
                    }}
                    className="flex items-center w-full cursor-pointer text-hull-accent hover:bg-hull-accent/5 text-left"
                  >
                    Sign Out
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;