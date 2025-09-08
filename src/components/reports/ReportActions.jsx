import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import HvacReportHTML from './HvacReportHTML';
import DockingReportHTML from './DockingReportHTML';
import SurveyReportHTML from './SurveyReportHTML';

export const useReportActions = () => {
  const { toast } = useToast();
  const [showHvacModal, setShowHvacModal] = useState(false);
  const [showDockingModal, setShowDockingModal] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [selectedTrial, setSelectedTrial] = useState(null);
  const [selectedDockingReport, setSelectedDockingReport] = useState(null);
  const [selectedSurveyReport, setSelectedSurveyReport] = useState(null);

  const handlePreviewReport = async (
    rowData,
    hvacReport,
    dockingReports,
    surveyReports,
    selectedVessel
  ) => {
    try {
      if (rowData.report_type === "HVAC Trial") {
        // Check if vessel is selected and HVAC data is available
        if (!selectedVessel) {
          toast({
            title: "No Vessel Selected",
            description: "Please select a vessel to preview HVAC reports",
            variant: "destructive",
          });
          return;
        }
        
        if (!hvacReport || !hvacReport.trials || hvacReport.trials.length === 0) {
          toast({
            title: "No HVAC Data",
            description: "No HVAC trial data available. Please refresh the HVAC reports first.",
            variant: "destructive",
          });
          return;
        }
        
        const trial = hvacReport.trials.find((t) => t.id === rowData.id);
        if (!trial) {
          toast({
            title: "Trial Not Found",
            description: "The selected HVAC trial could not be found in the current data.",
            variant: "destructive",
          });
          return;
        }
        
        // Show HTML modal for HVAC reports
        setSelectedTrial(trial);
        setShowHvacModal(true);
      } else if (rowData.report_type === "Docking Plan") {
        const dockingReport = dockingReports.find(r => r.id === rowData.id);
        if (!dockingReport) {
          toast({
            title: "Report Not Found",
            description: "The selected docking plan report could not be found.",
            variant: "destructive",
          });
          return;
        }
        
        // Show HTML modal for Docking reports
        setSelectedDockingReport(dockingReport);
        setShowDockingModal(true);
      } else if (rowData.report_type === "Hull Survey") {
        const surveyReport = surveyReports.find(r => r.id === rowData.id);
        if (!surveyReport) {
          toast({
            title: "Report Not Found",
            description: "The selected hull survey report could not be found.",
            variant: "destructive",
          });
          return;
        }
        
        // Show HTML modal for Survey reports
        setSelectedSurveyReport(surveyReport);
        setShowSurveyModal(true);
      } else {
        toast({
          title: "Unknown Report Type",
          description: "The selected report type is not supported for preview.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Preview Opened",
        description: `${rowData.report_type} report preview opened`,
      });
    } catch (error) {
      console.error("Error previewing report:", error);
      toast({
        title: "Error",
        description: `Failed to preview ${rowData.report_type} report. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleDownloadReport = async (
    rowData,
    hvacReport,
    dockingReports,
    surveyReports,
    selectedVessel
  ) => {
    try {
      if (rowData.report_type === "HVAC Trial") {
        // Check if vessel is selected and HVAC data is available
        if (!selectedVessel) {
          toast({
            title: "No Vessel Selected",
            description: "Please select a vessel to download HVAC reports",
            variant: "destructive",
          });
          return;
        }
        
        if (!hvacReport || !hvacReport.trials || hvacReport.trials.length === 0) {
          toast({
            title: "No HVAC Data",
            description: "No HVAC trial data available. Please refresh the HVAC reports first.",
            variant: "destructive",
          });
          return;
        }
        
        const trial = hvacReport.trials.find((t) => t.id === rowData.id);
        if (!trial) {
          toast({
            title: "Trial Not Found",
            description: "The selected HVAC trial could not be found in the current data.",
            variant: "destructive",
          });
          return;
        }
        
        // Show HTML modal for HVAC reports download
        setSelectedTrial(trial);
        setShowHvacModal(true);
      } else if (rowData.report_type === "Docking Plan") {
        const dockingReport = dockingReports.find(r => r.id === rowData.id);
        if (!dockingReport) {
          toast({
            title: "Report Not Found",
            description: "The selected docking plan report could not be found.",
            variant: "destructive",
          });
          return;
        }
        
        // Show HTML modal for Docking reports download
        setSelectedDockingReport(dockingReport);
        setShowDockingModal(true);
      } else if (rowData.report_type === "Hull Survey") {
        const surveyReport = surveyReports.find(r => r.id === rowData.id);
        if (!surveyReport) {
          toast({
            title: "Report Not Found",
            description: "The selected hull survey report could not be found.",
            variant: "destructive",
          });
          return;
        }
        
        // Show HTML modal for Survey reports download
        setSelectedSurveyReport(surveyReport);
        setShowSurveyModal(true);
      } else {
        toast({
          title: "Unknown Report Type",
          description: "The selected report type is not supported for download.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error downloading report:", error);
      toast({
        title: "Error",
        description: `Failed to download ${rowData.report_type} report. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const HvacModal = () => {
    if (!showHvacModal || !selectedTrial) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-auto">
          <HvacReportHTML 
            trial={selectedTrial} 
            onClose={() => {
              setShowHvacModal(false);
              setSelectedTrial(null);
            }} 
          />
        </div>
      </div>
    );
  };

  const DockingModal = () => {
    if (!showDockingModal || !selectedDockingReport) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-auto">
          <DockingReportHTML 
            report={selectedDockingReport} 
            onClose={() => {
              setShowDockingModal(false);
              setSelectedDockingReport(null);
            }} 
          />
        </div>
      </div>
    );
  };

  const SurveyModal = () => {
    if (!showSurveyModal || !selectedSurveyReport) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-auto">
          <SurveyReportHTML 
            report={selectedSurveyReport} 
            onClose={() => {
              setShowSurveyModal(false);
              setSelectedSurveyReport(null);
            }} 
          />
        </div>
      </div>
    );
  };

  return {
    handlePreviewReport,
    handleDownloadReport,
    HvacModal,
    DockingModal,
    SurveyModal
  };
};
