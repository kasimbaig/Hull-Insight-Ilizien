import React, { useState } from 'react';
import GenericMaster from './masters/GenericMaster';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon, MagnifyingGlassIcon, DocumentArrowUpIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

const Hvac = () => {
  // Group master categories into sections for dropdowns, matching Django models

  return (
  <div className="space-y-6 w-full">
      {/* Top Navbar with Dropdowns */}
  <nav className="w-full bg-gradient-to-r from-blue-200 via-blue-100 to-blue-300 border-b border-blue-300 sticky top-0 z-10 shadow">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-hull-primary">HVAC</h1>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-hull-primary hover:bg-hull-primary-dark" size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="w-full">
        <Card className="bg-white/95 shadow-lg rounded-2xl w-full">
          <CardHeader>
            <div className="flex justify-end items-center">
             
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={`Search HVAC...`}
                    className="pl-9 pr-4 py-2 w-64 border border-input rounded-lg bg-background focus:ring-2 focus:ring-hull-primary focus:border-hull-primary transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="">
            {/* Enter your HVAC management UI here */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Hvac;