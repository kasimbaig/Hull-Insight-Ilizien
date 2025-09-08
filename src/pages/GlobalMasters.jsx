import React, { useEffect, useState } from 'react';
import GenericMaster from './masters/GenericMaster';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon, MagnifyingGlassIcon, DocumentArrowUpIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { exportToCSV } from '@/utils/csvExport';
import { toast } from '@/components/ui/use-toast';

const GlobalMasters = () => {
  const [selectedMaster, setSelectedMaster] = useState('unit');
  const [searchValue, setSearchValue] = useState('');
  const [masterData, setMasterData] = useState({ items: [], fields: null, loading: false });

  const handleDataChange = (data) => {
    setMasterData(data);
  };

  const handleExportCSV = () => {
    const { items, fields } = masterData;
    
    if (!fields || items.length === 0) {
      toast({
        title: "No Data",
        description: "No data available to export",
        variant: "destructive",
      });
      return;
    }

    // Create headers from the field definitions
    const csvData = items.map(item => {
      const row = {};
      fields.list.forEach(field => {
        let value = item[field.key];
        
        // Handle foreign key references
        if (field.ref && value && typeof value === 'object') {
          value = value.name || value.toString();
        }
        
        // Handle boolean values
        if (typeof value === 'boolean') {
          value = value ? 'Yes' : 'No';
        }
        
        // Handle null/undefined values
        if (value === null || value === undefined) {
          value = '';
        }
        
        row[field.label] = value;
      });
      return row;
    });

    exportToCSV(csvData, `${fields.title.toLowerCase()}-master`);
    
    toast({
      title: "Export Successful",
      description: `Exported ${items.length} ${fields.title.toLowerCase()} records as CSV`,
    });
  };

  useEffect(() => {
    // Reset search value when selected master changes
    setSearchValue('');
  }, [selectedMaster]);
  
  // Group master categories into sections for dropdowns, matching Django models
  const masterCategorySections = [
    {
      section: 'Vessel Registry',
      categories: [
        { id: 'vessel', name: 'Vessel', description: 'Naval vessel registry' },
        { id: 'classofvessel', name: 'Class of Vessel', description: 'Vessel class definitions' },
        { id: 'vesseltype', name: 'Vessel Type', description: 'Classification of vessels' },
        { id: 'dockyard', name: 'Dockyard', description: 'Shipyard facilities' },
        { id: 'command', name: 'Command', description: 'Naval commands' },
      ]
    },
    {
      section: 'Organization',
      categories: [
        { id: 'unit', name: 'Unit', description: 'Naval units' },
        { id: 'module', name: 'Module', description: 'System modules' },
        { id: 'submodule', name: 'SubModule', description: 'Sub modules' },
        { id: 'operationalstatus', name: 'Operational Status', description: 'Operational status' },
      ]
    },
    {
      section: 'Hull & Survey',
      categories: [
        { id: 'hullcompartment', name: 'Hull Compartment', description: 'Hull compartments' },
        { id: 'hullsystem', name: 'Hull System', description: 'Hull systems' },
        { id: 'hullequipment', name: 'Hull Equipment', description: 'Hull equipment' },
        { id: 'damagetype', name: 'Damage Type', description: 'Hull damage classifications' },
        { id: 'severity', name: 'Severity', description: 'Damage severity ratings' },
        // { id: 'surveycycle', name: 'Survey Cycle', description: 'Inspection schedules' },
        // { id: 'dynamicfield', name: 'Dynamic Field', description: 'Dynamic survey fields' },
      ]
    }
  ];



  return (
  <div className="space-y-6 w-full">
      {/* Top Navbar with Dropdowns */}
  <nav className="w-full bg-gradient-to-r from-blue-200 via-blue-100 to-blue-300 border-b border-blue-300 sticky top-0 z-10 shadow">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-hull-primary">Global Masters</h1>
            {/* Dropdowns for each section */}
            {masterCategorySections.map((section) => (
              <div className="relative group" key={section.section}>
                <button className="font-medium text-foreground hover:text-hull-primary focus:outline-none flex items-center group-focus-within:text-hull-primary">
                  {section.section}
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white border border-blue-200 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-all z-20">
                  {section.categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedMaster(category.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-hull-secondary/30 transition-colors border-l-4 ${
                        selectedMaster === category.id
                          ? 'border-hull-primary bg-hull-primary/10 text-hull-primary font-medium'
                          : 'border-transparent text-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{category.name}</span>
                        {/* <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge> */}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {category.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportCSV}
              disabled={masterData.loading || masterData.items.length === 0}
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
            {/* <Button className="bg-hull-primary hover:bg-hull-primary-dark" size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add New
            </Button> */}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="w-full">
        <Card className="bg-white/95 shadow-lg rounded-2xl w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">
                  {masterCategorySections.flatMap(s => s.categories).find(c => c.id === selectedMaster)?.name || 'Vessels'}
                </CardTitle>
                <CardDescription>
                  {masterCategorySections.flatMap(s => s.categories).find(c => c.id === selectedMaster)?.description || 'Manage vessel information'}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    placeholder={`Search ${masterCategorySections.flatMap(s => s.categories).find(c => c.id === selectedMaster)?.name?.toLowerCase() || 'vessels'}...`}
                    className="pl-9 pr-4 py-2 w-64 border border-input rounded-lg bg-background focus:ring-2 focus:ring-hull-primary focus:border-hull-primary transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="">
            <GenericMaster 
              masterKey={selectedMaster} 
              searchValue={searchValue} 
              onDataChange={handleDataChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GlobalMasters;