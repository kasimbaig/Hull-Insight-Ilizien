import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FileText, Eye, Download, Ship } from "lucide-react";

const ReportsTable = ({ 
  data, 
  filters, 
  loadingStates, 
  onPreviewReport, 
  onDownloadReport 
}) => {
  const { hvacReport, dockingReports, surveyReports } = data;

  // Memoized filtered reports calculation
  const filteredReports = useCallback(() => {
    let allReports = [];
    
    if (filters.selectedReportType === "all" || filters.selectedReportType === "hvac") {
      if (hvacReport?.trials) {
        allReports = [...allReports, ...hvacReport.trials.map(trial => ({ 
          ...trial, 
          report_type: "HVAC Trial",
          ship_name: trial.ship_name,
          status: "Active",
          trial_date: trial.date_of_trials,
          place_of_trials: trial.place_of_trials,
          air_flow_measurements: trial.total_airflow_measurements || 0,
          machinery_measurements: trial.total_machinery_measurements || 0,
          last_updated: trial.modified_on
        }))];
      }
    }
    if (filters.selectedReportType === "all" || filters.selectedReportType === "docking") {
      allReports = [...allReports, ...dockingReports.map(r => ({ ...r, report_type: "Docking Plan" }))];
    }
    if (filters.selectedReportType === "all" || filters.selectedReportType === "survey") {
      allReports = [...allReports, ...surveyReports.map(r => ({ ...r, report_type: "Hull Survey" }))];
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      allReports = allReports.filter(report => 
        report.ship_name?.toLowerCase().includes(searchLower) ||
        report.vessel_name?.toLowerCase().includes(searchLower) ||
        report.report_type?.toLowerCase().includes(searchLower) ||
        report.status?.toLowerCase().includes(searchLower) ||
        report.place_of_trials?.toLowerCase().includes(searchLower) ||
        report.occasion_of_trials?.toLowerCase().includes(searchLower)
      );
    }

    return allReports;
  }, [filters, hvacReport, dockingReports, surveyReports]);

  // Memoized table body templates
  const reportTypeBodyTemplate = useCallback((rowData) => (
    <Badge variant="outline" className="bg-[#00809D]/10 text-[#00809D] border-[#00809D]">
      {rowData.report_type}
    </Badge>
  ), []);

  const vesselBodyTemplate = useCallback((rowData) => (
    <div className="flex items-center gap-2">
      <Ship className="h-4 w-4 text-[#00809D]" />
      <span className="font-medium">{rowData.ship_name || rowData.vessel_name}</span>
    </div>
  ), []);

  const statusBodyTemplate = useCallback((rowData) => {
    const statusConfig = {
      "Active": { variant: "default", color: "text-green-600" },
      "Completed": { variant: "default", color: "text-green-600" },
      "Pending": { variant: "secondary", color: "text-yellow-600" },
      "In Progress": { variant: "secondary", color: "text-blue-600" },
      "Overdue": { variant: "destructive", color: "text-red-600" },
      "Draft": { variant: "outline", color: "text-gray-600" },
      "Command Review": { variant: "secondary", color: "text-blue-600" },
      "IHQ Review": { variant: "secondary", color: "text-orange-600" },
      "Approved": { variant: "default", color: "text-green-600" },
      "Archived": { variant: "outline", color: "text-gray-500" }
    };
    
    const config = statusConfig[rowData.status] || { variant: "outline", color: "text-gray-600" };
    
    return (
      <Badge variant={config.variant} className={`${config.color} flex items-center gap-1`}>
        {rowData.status}
      </Badge>
    );
  }, []);

  const dateBodyTemplate = useCallback((rowData) => {
    const date = rowData.trial_date || rowData.created_date || rowData.survey_date || rowData.last_updated;
    return date ? new Date(date).toLocaleDateString() : "N/A";
  }, []);

  const occasionBodyTemplate = useCallback((rowData) => {
    if (rowData.report_type === "HVAC Trial") {
      return (
        <div className="space-y-1">
          <div className="text-sm font-medium">{rowData.occasion_of_trials || "N/A"}</div>
          <div className="text-xs text-muted-foreground">Doc: {rowData.document_no || "N/A"}</div>
        </div>
      );
    }
    return "N/A";
  }, []);

  const measurementsBodyTemplate = useCallback((rowData) => {
    if (rowData.report_type === "HVAC Trial") {
      return (
        <div className="space-y-1">
          <div className="text-sm">
            <span className="font-medium text-[#00809D]">{rowData.air_flow_measurements || 0}</span> Air Flow
          </div>
          <div className="text-sm">
            <span className="font-medium text-[#00809D]">{rowData.machinery_measurements || 0}</span> Machinery
          </div>
        </div>
      );
    }
    return "N/A";
  }, []);

  const actionsBodyTemplate = useCallback((rowData) => {
    // Check if HVAC report actions should be disabled
    const isHvacDisabled = rowData.report_type === "HVAC Trial" && (!filters.selectedVessel || !hvacReport || !hvacReport.trials || hvacReport.trials.length === 0);
    
    return (
      <div className="flex gap-1 justify-center">
        <Button
          size="sm"
          variant="outline"
          title={isHvacDisabled ? "Select a vessel and load HVAC data first" : "Preview Report"}
          disabled={isHvacDisabled}
          onClick={() => onPreviewReport(rowData)}
          className="h-8 w-8 p-0 hover:bg-[#00809D]/10"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          title={isHvacDisabled ? "Select a vessel and load HVAC data first" : "Download PDF Report"}
          disabled={isHvacDisabled}
          onClick={() => onDownloadReport(rowData)}
          className="h-8 w-8 p-0 hover:bg-[#00809D]/10"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    );
  }, [filters.selectedVessel, hvacReport, onPreviewReport, onDownloadReport]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#00809D]" />
          All Reports
        </CardTitle>
        {!filters.selectedVessel && (filters.selectedReportType === "all" || filters.selectedReportType === "hvac") && (
          <p className="text-sm text-muted-foreground mt-2">
            💡 Select a vessel above to view HVAC trial reports
          </p>
        )}
      </CardHeader>
      <CardContent>
        <DataTable
          value={Array.isArray(filteredReports()) ? filteredReports() : []}
          paginator
          rows={10}
          emptyMessage={
            !filters.selectedVessel && (filters.selectedReportType === "all" || filters.selectedReportType === "hvac")
              ? "Select a vessel to view HVAC reports, or change report type filter"
              : "No reports found"
          }
          className="vessel-datatable"
          loading={loadingStates.hvac}
          scrollable
          scrollHeight="400px"
          responsiveLayout="scroll"
        >
          <Column 
            field="report_type" 
            header="Report Type" 
            body={reportTypeBodyTemplate}
            style={{ minWidth: '140px', width: '140px' }}
            headerClassName="master-table-header"
          />
          <Column 
            field="ship_name" 
            header="Vessel" 
            body={vesselBodyTemplate}
            style={{ minWidth: '180px', width: '180px' }}
            headerClassName="master-table-header"
          />
          <Column 
            field="occasion_of_trials" 
            header="Occasion/Document" 
            body={occasionBodyTemplate}
            style={{ minWidth: '160px', width: '160px' }}
            headerClassName="master-table-header"
          />
          <Column 
            field="place_of_trials" 
            header="Location" 
            style={{ minWidth: '120px', width: '120px' }}
            headerClassName="master-table-header"
          />
          <Column 
            field="air_flow_measurements" 
            header="Measurements" 
            body={measurementsBodyTemplate}
            style={{ minWidth: '140px', width: '140px' }}
            headerClassName="master-table-header"
          />
          <Column 
            field="status" 
            header="Status" 
            body={statusBodyTemplate}
            style={{ minWidth: '120px', width: '120px' }}
            headerClassName="master-table-header"
          />
          <Column 
            field="trial_date" 
            header="Date" 
            body={dateBodyTemplate}
            style={{ minWidth: '100px', width: '100px' }}
            headerClassName="master-table-header"
          />
          <Column 
            field="actions" 
            header="Actions" 
            body={actionsBodyTemplate}
            style={{ minWidth: '120px', width: '120px' }}
            headerClassName="master-table-header-no-border"
          />
        </DataTable>
      </CardContent>
    </Card>
  );
};

export { ReportsTable };
