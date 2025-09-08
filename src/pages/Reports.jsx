"use client"
// Version: 2025-01-27 - Refactored into modular components

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getRequest } from "@/services/apiService";
import { exportToCSV, formatDataForExport } from "@/utils/csvExport";

// Import components
import { ReportFiltersComponent } from "@/components/reports/ReportFilters";
import { SummaryCards } from "@/components/reports/SummaryCards";
import { ReportsTable } from "@/components/reports/ReportsTable";
import { useReportActions } from "@/components/reports/ReportActions";
import HvacTrialFormModal from "@/components/HvacTrialFormModal";

// Mock data for docking and survey reports (static as requested)
const mockDockingReports = [
  {
    id: 1,
    vessel_name: "INS Vikrant",
    vessel_id: 1,
    docking_purpose: "Major Overhaul",
    docking_version: "v2.1",
    status: "Approved",
    created_date: "2024-01-15",
    approved_date: "2024-01-20",
    refitting_authority: "Mazagon Dock Shipbuilders Limited",
    command_hq: "Western Naval Command",
    vessel_length: 262.5,
    vessel_beam: 60.0,
    vessel_draught: 8.4
  },
  {
    id: 2,
    vessel_name: "INS Vikramaditya",
    vessel_id: 2,
    docking_purpose: "Routine Maintenance",
    docking_version: "v1.8",
    status: "Command Review",
    created_date: "2024-01-20",
    refitting_authority: "Cochin Shipyard Limited",
    command_hq: "Eastern Naval Command",
    vessel_length: 284.0,
    vessel_beam: 60.0,
    vessel_draught: 9.2
  },
  {
    id: 3,
    vessel_name: "INS Delhi",
    vessel_id: 3,
    docking_purpose: "Emergency Repair",
    docking_version: "v3.0",
    status: "IHQ Review",
    created_date: "2024-01-25",
    refitting_authority: "Garden Reach Shipbuilders & Engineers",
    command_hq: "Southern Naval Command",
    vessel_length: 163.0,
    vessel_beam: 17.0,
    vessel_draught: 6.5
  }
];

const mockSurveyReports = [
  {
    id: 1,
    ship_name: "INS Vikrant",
    ship_id: 1,
    quarter: "Q1 2024",
    survey_date: "2024-01-15",
    reporting_officer: "Lt. Commander John Smith",
    total_defects: 12,
    critical_defects: 2,
    minor_defects: 10,
    resolved_defects: 8,
    status: "Completed",
    return_delayed: false,
    entire_ship_surveyed: true
  },
  {
    id: 2,
    ship_name: "INS Vikramaditya",
    ship_id: 2,
    quarter: "Q1 2024",
    survey_date: "2024-01-20",
    reporting_officer: "Commander Jane Doe",
    total_defects: 8,
    critical_defects: 1,
    minor_defects: 7,
    resolved_defects: 5,
    status: "In Progress",
    return_delayed: false,
    entire_ship_surveyed: true
  },
  {
    id: 3,
    ship_name: "INS Delhi",
    ship_id: 3,
    quarter: "Q1 2024",
    survey_date: "2024-01-25",
    reporting_officer: "Lt. Commander Mike Johnson",
    total_defects: 15,
    critical_defects: 3,
    minor_defects: 12,
    resolved_defects: 10,
    status: "Overdue",
    return_delayed: true,
    entire_ship_surveyed: false
  }
];

const Reports = () => {
  const { toast } = useToast();
  const { handlePreviewReport, handleDownloadReport, HvacModal, DockingModal, SurveyModal } = useReportActions();
  
  // State management
  const [reportData, setReportData] = useState({
    hvacReport: null,
    dockingReports: mockDockingReports,
    surveyReports: mockSurveyReports,
    vessels: [],
    totalHvacTrials: 0
  });
  
  const [filters, setFilters] = useState({
    selectedReportType: "all",
    selectedVessel: "",
    searchTerm: ""
  });
  
  const [loadingStates, setLoadingStates] = useState({
    hvac: false,
    vessels: false,
    totalTrials: false
  });

  // API functions
  const fetchVessels = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, vessels: true }));
    try {
      const response = await getRequest('/master/vessels/');
      const vesselsData = response?.data || response?.results || response || [];
      
      const transformedVessels = Array.isArray(vesselsData) 
        ? vesselsData.map((vessel) => ({
            id: vessel.id || 0,
            name: vessel.name || vessel.vessel_name || `Vessel ${vessel.id || 'Unknown'}`
          }))
        : [];
      
      setReportData(prev => ({ ...prev, vessels: transformedVessels }));
      toast({
        title: "Success",
        description: `Loaded ${transformedVessels.length} vessels`,
      });
    } catch (error) {
      console.error("Error fetching vessels:", error);
      toast({
        title: "Error",
        description: "Failed to fetch vessels list",
        variant: "destructive",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, vessels: false }));
    }
  }, [toast]);

  const fetchTotalHvacTrials = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, totalTrials: true }));
    try {
      const response = await getRequest('/shipmodule/trials/');
      const trialsData = response?.data || response?.results || response || [];
      const totalCount = Array.isArray(trialsData) ? trialsData.length : 0;
      setReportData(prev => ({ ...prev, totalHvacTrials: totalCount }));
      toast({
        title: "Success",
        description: `Loaded ${totalCount} total HVAC trials`,
      });
    } catch (error) {
      console.error("Error fetching total HVAC trials:", error);
      toast({
        title: "Error",
        description: "Failed to fetch total HVAC trials count",
        variant: "destructive",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, totalTrials: false }));
    }
  }, [toast]);

  const fetchHvacReports = useCallback(async (shipId) => {
    if (!shipId) {
      toast({
        title: "Error",
        description: "Please select a vessel to fetch HVAC reports",
        variant: "destructive",
      });
      return;
    }

    setLoadingStates(prev => ({ ...prev, hvac: true }));
    try {
      const endpoint = `/shipmodule/ship-report/${shipId}/`;
      const response = await getRequest(endpoint);
      
      const hvacReport = {
        ship_id: response.ship_id || shipId,
        trials: response.trials || []
      };
      
      setReportData(prev => ({ ...prev, hvacReport }));
      toast({
        title: "Success",
        description: `Fetched ${hvacReport.trials.length} HVAC trials for selected vessel`,
      });
    } catch (error) {
      console.error("Error fetching HVAC reports:", error);
      toast({
        title: "Error",
        description: "Failed to fetch HVAC reports for the selected vessel",
        variant: "destructive",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, hvac: false }));
    }
  }, [toast]);

  // Initialize data
  useEffect(() => {
    fetchVessels();
    fetchTotalHvacTrials();
  }, [fetchVessels, fetchTotalHvacTrials]);

  // Event handlers
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    
    // If vessel changes, fetch HVAC reports
    if (newFilters.selectedVessel !== undefined) {
      if (newFilters.selectedVessel) {
        fetchHvacReports(parseInt(newFilters.selectedVessel));
      } else {
        setReportData(prev => ({ ...prev, hvacReport: null }));
      }
    }
  }, [fetchHvacReports]);

  const handleRefreshHvacReports = useCallback(() => {
    if (filters.selectedVessel) {
      fetchHvacReports(parseInt(filters.selectedVessel));
    } else {
      toast({
        title: "No Vessel Selected",
        description: "Please select a vessel to refresh HVAC reports",
        variant: "destructive",
      });
    }
  }, [filters.selectedVessel, fetchHvacReports, toast]);

  const handlePreviewReportWrapper = useCallback((rowData) => {
    handlePreviewReport(
      rowData,
      reportData.hvacReport,
      reportData.dockingReports,
      reportData.surveyReports,
      filters.selectedVessel
    );
  }, [handlePreviewReport, reportData, filters.selectedVessel]);

  const handleDownloadReportWrapper = useCallback((rowData) => {
    handleDownloadReport(
      rowData,
      reportData.hvacReport,
      reportData.dockingReports,
      reportData.surveyReports,
      filters.selectedVessel
    );
  }, [handleDownloadReport, reportData, filters.selectedVessel]);

  const handleExportAllCSV = useCallback(() => {
    let allData = [];
    
    // Add HVAC reports
    if (reportData.hvacReport?.trials) {
      const hvacData = formatDataForExport(reportData.hvacReport.trials, 'hvac');
      allData = [...allData, ...hvacData];
    }
    
    // Add Docking reports
    const dockingData = formatDataForExport(reportData.dockingReports, 'docking');
    allData = [...allData, ...dockingData];
    
    // Add Survey reports
    const surveyData = formatDataForExport(reportData.surveyReports, 'survey');
    allData = [...allData, ...surveyData];
    
    if (allData.length === 0) {
      toast({
        title: "No Data",
        description: "No data available to export",
        variant: "destructive",
      });
      return;
    }
    
    exportToCSV(allData, 'all-reports');
    toast({
      title: "Export Successful",
      description: `Exported ${allData.length} records as CSV`,
    });
  }, [reportData, toast]);

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#00809D]">Reports</h1>
          <p className="text-muted-foreground mt-1">View and manage reports for all forms</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleExportAllCSV}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50 h-10 px-4"
          >
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Export All as CSV</span>
            <span className="sm:hidden">Export CSV</span>
          </Button>
          <Button
            onClick={handleRefreshHvacReports}
            disabled={loadingStates.hvac || !filters.selectedVessel}
            className="bg-[#00809D] hover:bg-[#00809D]/90 text-white h-10 px-4"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loadingStates.hvac ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh HVAC Reports</span>
            <span className="sm:hidden">Refresh HVAC</span>
          </Button>
          <Button
            onClick={fetchTotalHvacTrials}
            disabled={loadingStates.totalTrials}
            variant="outline"
            className="border-[#00809D] text-[#00809D] hover:bg-[#00809D]/10 h-10 px-4"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loadingStates.totalTrials ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Total Count</span>
            <span className="sm:hidden">Refresh Count</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ReportFiltersComponent
        filters={filters}
        loadingStates={loadingStates}
        vessels={reportData.vessels}
        onFilterChange={handleFilterChange}
        onRefreshVessels={fetchVessels}
      />

      {/* Summary Cards */}
      <SummaryCards
        data={reportData}
        loadingStates={loadingStates}
        onRefreshTotalTrials={fetchTotalHvacTrials}
      />

      {/* Reports Table */}
      <ReportsTable
        data={reportData}
        filters={filters}
        loadingStates={loadingStates}
        onPreviewReport={handlePreviewReportWrapper}
        onDownloadReport={handleDownloadReportWrapper}
      />

      {/* Modals */}
      <HvacTrialFormModal />
      <DockingModal />
      <SurveyModal />
    </div>
  );
};

export default Reports;