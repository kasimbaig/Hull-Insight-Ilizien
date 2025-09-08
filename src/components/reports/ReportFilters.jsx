import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Filter, RefreshCw, Search } from "lucide-react";

const ReportFiltersComponent = ({
  filters,
  loadingStates,
  vessels,
  onFilterChange,
  onRefreshVessels
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-[#00809D]" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="report-type" className="text-sm font-medium">Report Type</Label>
            <Select 
              value={filters.selectedReportType} 
              onValueChange={(value) => onFilterChange({ selectedReportType: value })}
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Select Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="hvac">HVAC Trial Reports</SelectItem>
                <SelectItem value="docking">Docking Plan Reports</SelectItem>
                <SelectItem value="survey">Hull Survey Reports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="vessel" className="text-sm font-medium">
                Vessel (Required for HVAC Reports) *
              </Label>
              <Button
                size="sm"
                variant="outline"
                onClick={onRefreshVessels}
                disabled={loadingStates.vessels}
                className="h-7 px-2 text-xs hover:bg-[#00809D]/10"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${loadingStates.vessels ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <Select 
              value={filters.selectedVessel} 
              onValueChange={(value) => onFilterChange({ selectedVessel: value })}
              disabled={loadingStates.vessels}
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue 
                  placeholder={
                    loadingStates.vessels 
                      ? "Loading vessels..." 
                      : "Select Vessel to fetch HVAC reports"
                  } 
                />
              </SelectTrigger>
              <SelectContent>
                {vessels.map(vessel => (
                  <SelectItem key={vessel.id} value={vessel.id.toString()}>
                    {vessel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!filters.selectedVessel && !loadingStates.vessels && (
              <p className="text-xs text-muted-foreground">
                Select a vessel to view HVAC trial reports
              </p>
            )}
            {loadingStates.vessels && (
              <p className="text-xs text-muted-foreground">
                Loading vessels from API...
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-medium">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search reports..."
                value={filters.searchTerm}
                onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
                className="pl-10 h-10 w-full"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { ReportFiltersComponent };
