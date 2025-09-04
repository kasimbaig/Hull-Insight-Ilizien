import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const MainLayout = ({ children }) => {
  return (
    <div className="w-[100vw] h-[100vh] min-h-0 min-w-0 bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300 overflow-hidden">
      <div className="flex h-full w-full">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-full w-[240px] z-30 shadow-xl">
          <Sidebar />
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col ml-[240px] min-w-0 h-full">
          {/* Topbar */}
          <Topbar />
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-8 bg-white rounded-tl-3xl shadow-xl min-h-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;