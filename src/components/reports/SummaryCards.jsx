import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BarChart3, Ship, Calendar, RefreshCw } from "lucide-react";

const SummaryCards = ({ data, loadingStates, onRefreshTotalTrials }) => {
  const { hvacReport, dockingReports, surveyReports, totalHvacTrials } = data;
  
  const totalReportsCount = (hvacReport?.trials.length || 0) + dockingReports.length + surveyReports.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
              <p className="text-2xl font-bold text-[#00809D]">{totalReportsCount}</p>
            </div>
            <FileText className="h-8 w-8 text-[#00809D] flex-shrink-0" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium text-muted-foreground">HVAC Trials</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRefreshTotalTrials}
                  disabled={loadingStates.totalTrials}
                  className="h-6 px-2 text-xs hover:bg-[#00809D]/10"
                >
                  <RefreshCw className={`h-3 w-3 ${loadingStates.totalTrials ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <p className="text-2xl font-bold text-[#00809D]">
                {loadingStates.totalTrials ? "..." : totalHvacTrials}
              </p>
              {hvacReport && hvacReport.trials.length > 0 && (
                <p className="text-xs text-muted-foreground truncate">
                  {hvacReport.trials.length} for selected vessel
                </p>
              )}
              {hvacReport && hvacReport.trials.length > 0 && (
                <p className="text-xs text-muted-foreground truncate">
                  {hvacReport.trials.reduce((acc, trial) => acc + trial.airflow_measurements.length, 0)} air flow measurements
                </p>
              )}
            </div>
            <BarChart3 className="h-8 w-8 text-[#00809D] flex-shrink-0" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-muted-foreground">Docking Reports</p>
              <p className="text-2xl font-bold text-[#00809D]">{dockingReports.length}</p>
            </div>
            <Ship className="h-8 w-8 text-[#00809D] flex-shrink-0" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-muted-foreground">Survey Reports</p>
              <p className="text-2xl font-bold text-[#00809D]">{surveyReports.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-[#00809D] flex-shrink-0" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { SummaryCards };
