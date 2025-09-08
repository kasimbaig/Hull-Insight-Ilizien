import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PlusIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { exportToCSV, formatDataForExport } from '@/utils/csvExport';
import DockingPlanForm from '@/components/DockingPlanForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const DockyardPlans = () => {
  const [activeTab, setActiveTab] = useState('plans');
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleExportCSV = () => {
    const formattedData = formatDataForExport(dockyardPlans, 'docking');
    exportToCSV(formattedData, 'dockyard-plans');
  };

  const handleAddPlan = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleEditPlan = (plan) => {
    setEditData(plan);
    setShowForm(true);
  };

  const handleFormSubmit = (formData) => {
    if (editData) {
      // Update existing plan
      setDockyardPlans(prev => prev.map(plan => 
        plan.id === editData.id 
          ? { 
              ...plan, 
              ...formData,
              vesselName: formData.vessel,
              dockingPurposeName: formData.dockingPurpose,
              entryDirectionName: formData.entryDirection,
              refittingAuthorityName: formData.refittingAuthority,
              commandHqName: formData.commandHq
            }
          : plan
      ));
    } else {
      // Add new plan
      const newPlan = {
        id: `DP-${new Date().getFullYear()}-${String(dockyardPlans.length + 1).padStart(3, '0')}`,
        ...formData,
        vesselName: formData.vessel,
        dockingPurposeName: formData.dockingPurpose,
        entryDirectionName: formData.entryDirection,
        refittingAuthorityName: formData.refittingAuthority,
        commandHqName: formData.commandHq,
        status: 'Draft',
        stage: 'Draft',
        priority: 'Medium',
        submittedDate: new Date().toISOString().split('T')[0],
        scheduledDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      setDockyardPlans(prev => [...prev, newPlan]);
    }
    setShowForm(false);
    setEditData(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditData(null);
  };

  const [dockyardPlans, setDockyardPlans] = useState([
    {
      id: 'DP-2024-001',
      vessel: 'INS_Vikrant',
      vesselName: 'INS Vikrant',
      dockingPurpose: 'Routine_Maintenance',
      dockingPurposeName: 'Routine Maintenance',
      dockingVersion: 'v2.1',
      entryDirection: 'Bow_First',
      entryDirectionName: 'Bow First',
      length: 262.5,
      beam: 60.0,
      draught: 8.4,
      list: 0.5,
      trim: 1.2,
      metacentricHeight: 2.5,
      weightChanges: 150.0,
      refittingAuthority: 'Cochin_Shipyard',
      refittingAuthorityName: 'Cochin Shipyard Limited',
      commandHq: 'Western_Naval_Command',
      commandHqName: 'Western Naval Command',
      status: 'Approved',
      stage: 'Approved',
      priority: 'Medium',
      submittedDate: '2024-01-10',
      approvedDate: '2024-01-15',
      scheduledDate: '2024-02-01'
    },
    {
      id: 'DP-2024-002',
      vessel: 'INS_Vikramaditya',
      vesselName: 'INS Vikramaditya',
      dockingPurpose: 'Emergency_Repair',
      dockingPurposeName: 'Emergency Repair',
      dockingVersion: 'v1.8',
      entryDirection: 'Stern_First',
      entryDirectionName: 'Stern First',
      length: 284.0,
      beam: 60.0,
      draught: 10.2,
      list: 0.3,
      trim: 0.8,
      metacentricHeight: 3.2,
      weightChanges: 200.0,
      refittingAuthority: 'Mazagon_Dock',
      refittingAuthorityName: 'Mazagon Dock Shipbuilders Limited',
      commandHq: 'Western_Naval_Command',
      commandHqName: 'Western Naval Command',
      status: 'Under Review',
      stage: 'Review',
      priority: 'High',
      submittedDate: '2024-01-12',
      reviewerComments: 'Awaiting technical assessment',
      scheduledDate: '2024-01-25'
    },
    {
      id: 'DP-2024-003',
      vessel: 'INS_Kolkata',
      vesselName: 'INS Kolkata',
      dockingPurpose: 'Scheduled_Overhaul',
      dockingPurposeName: 'Scheduled Overhaul',
      dockingVersion: 'v2.0',
      entryDirection: 'Port_Side',
      entryDirectionName: 'Port Side',
      length: 163.0,
      beam: 17.0,
      draught: 6.5,
      list: 0.2,
      trim: 0.5,
      metacentricHeight: 1.8,
      weightChanges: 100.0,
      refittingAuthority: 'Garden_Reach',
      refittingAuthorityName: 'Garden Reach Shipbuilders & Engineers',
      commandHq: 'Eastern_Naval_Command',
      commandHqName: 'Eastern Naval Command',
      status: 'Initiated',
      stage: 'Draft',
      priority: 'Low',
      submittedDate: '2024-01-08',
      scheduledDate: '2024-03-15'
    },
    // {
    //   id: 'DP-2024-004',
    //   vessel: 'INS Chennai',
    //   command: 'Eastern Naval Command',
    //   dockyard: 'Kolkata Dry Dock',
    //   reason: 'Hull Inspection',
    //   initiator: 'Lt. Commander A. Patel',
    //   status: 'Revision Requested',
    //   stage: 'Revision',
    //   priority: 'Medium',
    //   submittedDate: '2024-01-05',
    //   reviewerComments: 'Additional safety documentation required',
    //   scheduledDate: '2024-02-20'
    // }
  ]);

  const calendarEvents = [
    {
      date: '2024-01-25',
      vessel: 'INS Vikramaditya',
      type: 'Emergency Repair',
      dockyard: 'Mumbai Naval Dockyard',
      status: 'confirmed'
    },
    {
      date: '2024-02-01',
      vessel: 'INS Vikrant',
      type: 'Routine Maintenance',
      dockyard: 'Cochin Shipyard',
      status: 'confirmed'
    },
    {
      date: '2024-02-20',
      vessel: 'INS Chennai',
      type: 'Hull Inspection',
      dockyard: 'Kolkata Dry Dock',
      status: 'pending'
    },
    {
      date: '2024-03-15',
      vessel: 'INS Kolkata',
      type: 'Scheduled Overhaul',
      dockyard: 'Garden Reach Shipyard',
      status: 'tentative'
    }
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      'Approved': 'bg-hull-success text-white',
      'Under Review': 'bg-hull-warning text-white',
      'Initiated': 'bg-hull-primary text-white',
      'Revision Requested': 'bg-hull-accent text-white',
      'Rejected': 'bg-red-500 text-white'
    };
    return statusMap[status] || 'bg-gray-500 text-white';
  };

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      'High': 'bg-hull-accent text-white',
      'Medium': 'bg-hull-warning text-white',
      'Low': 'bg-hull-success text-white'
    };
    return priorityMap[priority] || 'bg-gray-500 text-white';
  };

  const getStageIcon = (stage) => {
    switch(stage) {
      case 'Draft': return <PencilIcon className="h-4 w-4" />;
      case 'Review': return <ClockIcon className="h-4 w-4" />;
      case 'Approved': return <CheckCircleIcon className="h-4 w-4" />;
      case 'Revision': return <XCircleIcon className="h-4 w-4" />;
      default: return <DocumentTextIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navbar with Gradient and Sticky Heading */}
      <nav className="w-full bg-gradient-to-r from-blue-200 via-blue-100 to-blue-300 border-b border-blue-300 z-10 shadow py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div>
            <h1 className="text-2xl font-bold text-hull-primary">Dockyard Plan Approval</h1>
            <p className="text-muted-foreground mt-1 text-sm">Manage vessel docking plans, approvals, and scheduling</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
            {/* <Button variant="outline" size="sm">
              <CalendarIcon className="h-4 w-4 mr-2" />
              View Calendar
            </Button> */}
            <Button className="bg-hull-primary hover:bg-hull-primary-dark" size="sm" onClick={handleAddPlan}>
              <PlusIcon className="h-4 w-4 mr-2" />
              New Docking Plan
            </Button>
          </div>
        </div>
      </nav>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plans">Docking Plans</TabsTrigger>
          <TabsTrigger value="review">Under Review</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-hull-primary/10">
                    <DocumentTextIcon className="h-5 w-5 text-hull-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">12</h3>
                    <p className="text-sm text-muted-foreground">Total Plans</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-hull-warning/10">
                    <ClockIcon className="h-5 w-5 text-hull-warning" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">3</h3>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-hull-success/10">
                    <CheckCircleIcon className="h-5 w-5 text-hull-success" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">7</h3>
                    <p className="text-sm text-muted-foreground">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-hull-accent/10">
                    <XCircleIcon className="h-5 w-5 text-hull-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">2</h3>
                    <p className="text-sm text-muted-foreground">Need Revision</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plans Table */}
          <Card>
            <CardHeader>
              <CardTitle>Docking Plans</CardTitle>
              <CardDescription>Manage and track all vessel docking plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dockyardPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-lg font-semibold text-foreground">{plan.id}</h3>
                          <Badge className={getStatusBadge(plan.status)} variant="secondary">
                            {plan.status}
                          </Badge>
                          <Badge className={getPriorityBadge(plan.priority)} variant="secondary">
                            {plan.priority}
                          </Badge>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            {getStageIcon(plan.stage)}
                            <span>{plan.stage}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <BuildingOffice2Icon className="h-4 w-4 text-hull-primary" />
                            <span className="font-medium text-foreground">{plan.vesselName || plan.vessel}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPinIcon className="h-4 w-4 text-hull-primary" />
                            <span className="text-sm text-muted-foreground">{plan.refittingAuthorityName || plan.refittingAuthority}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-4 w-4 text-hull-primary" />
                            <span className="text-sm text-muted-foreground">
                              Scheduled: {plan.scheduledDate}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              Purpose: {plan.dockingPurposeName || plan.dockingPurpose}
                            </span>
                          </div>
                        </div>

                        {/* New Technical Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm">
                            <span className="font-medium text-gray-600">Dimensions:</span>
                            <div className="text-gray-800">
                              L: {plan.length}m × B: {plan.beam}m × D: {plan.draught}m
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-600">Stability:</span>
                            <div className="text-gray-800">
                              List: {plan.list}° | Trim: {plan.trim}°
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-600">Entry:</span>
                            <div className="text-gray-800">
                              {plan.entryDirectionName || plan.entryDirection}
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-600">Version:</span>
                            <div className="text-gray-800">
                              {plan.dockingVersion}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            <span>Purpose: {plan.dockingPurposeName || plan.dockingPurpose}</span>
                            <span className="mx-2">•</span>
                            <span>Command: {plan.commandHqName || plan.commandHq}</span>
                            <span className="mx-2">•</span>
                            <span>Submitted: {plan.submittedDate}</span>
                          </div>
                        </div>

                        {plan.reviewerComments && (
                          <div className="mt-3 p-3 bg-hull-warning/10 rounded-lg border-l-4 border-hull-warning">
                            <p className="text-sm text-foreground">
                              <span className="font-medium">Reviewer Comments:</span> {plan.reviewerComments}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {/* <Button variant="ghost" size="sm">
                          <EyeIcon className="h-4 w-4" />
                        </Button> */}
                        <Button variant="ghost" size="sm" onClick={() => handleEditPlan(plan)}>
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        {plan.status === 'Under Review' && (
                          <Button className="bg-hull-primary hover:bg-hull-primary-dark" size="sm">
                            Review
                          </Button>
                        )}
                        {plan.status === 'Initiated' && (
                          <Button className="bg-hull-success hover:bg-hull-success/90" size="sm">
                            Submit
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plans Under Review</CardTitle>
              <CardDescription>Plans awaiting review and approval decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[{
                  id: 'DP-2024-002',
                  vessel: 'INS Vikramaditya',
                  dockyard: 'Mumbai Naval Dockyard',
                  reason: 'Emergency Repair',
                  initiator: 'Commander R. Nair',
                  status: 'Under Review',
                  submittedDate: '2024-01-12',
                  reviewerComments: 'Awaiting technical assessment',
                  scheduledDate: '2024-01-25'
                }, {
                  id: 'DP-2024-004',
                  vessel: 'INS Chennai',
                  dockyard: 'Kolkata Dry Dock',
                  reason: 'Hull Inspection',
                  initiator: 'Lt. Commander A. Patel',
                  status: 'Revision Requested',
                  submittedDate: '2024-01-05',
                  reviewerComments: 'Additional safety documentation required',
                  scheduledDate: '2024-02-20'
                }].map((plan) => (
                  <div key={plan.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-lg font-semibold text-foreground">{plan.id}</h3>
                          <Badge className={getStatusBadge(plan.status)} variant="secondary">{plan.status}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <BuildingOffice2Icon className="h-4 w-4 text-hull-primary" />
                            <span className="font-medium text-foreground">{plan.vessel}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPinIcon className="h-4 w-4 text-hull-primary" />
                            <span className="text-sm text-muted-foreground">{plan.dockyard}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-4 w-4 text-hull-primary" />
                            <span className="text-sm text-muted-foreground">Scheduled: {plan.scheduledDate}</span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span>Reason: {plan.reason}</span>
                          <span className="mx-2">•</span>
                          <span>Initiated by: {plan.initiator}</span>
                          <span className="mx-2">•</span>
                          <span>Submitted: {plan.submittedDate}</span>
                        </div>
                        {plan.reviewerComments && (
                          <div className="mt-3 p-3 bg-hull-warning/10 rounded-lg border-l-4 border-hull-warning">
                            <p className="text-sm text-foreground">
                              <span className="font-medium">Reviewer Comments:</span> {plan.reviewerComments}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button className="bg-hull-primary hover:bg-hull-primary-dark" size="sm">Review</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Docking Schedule Calendar</CardTitle>
              <CardDescription>Visual overview of planned vessel docking dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {calendarEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-hull-secondary/20 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-center min-w-[80px]">
                        <div className="text-sm font-semibold text-hull-primary">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                          {new Date(event.date).getDate()}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{event.vessel}</h4>
                        <p className="text-sm text-muted-foreground">{event.type}</p>
                        <p className="text-xs text-muted-foreground">{event.dockyard}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={
                        event.status === 'confirmed' ? 'bg-hull-success text-white' :
                        event.status === 'pending' ? 'bg-hull-warning text-white' :
                        'bg-gray-500 text-white'
                      }
                    >
                      {event.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Docking Reports</CardTitle>
              <CardDescription>Generate and export docking plan reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-xl mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Approval Status Report</h3>
                  <table className="min-w-full text-sm">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="p-2">Plan ID</th>
                        <th className="p-2">Vessel</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Submitted</th>
                        <th className="p-2">Approved</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2">DP-2024-001</td>
                        <td className="p-2">INS Vikrant</td>
                        <td className="p-2">Approved</td>
                        <td className="p-2">2024-01-10</td>
                        <td className="p-2">2024-01-15</td>
                      </tr>
                      <tr>
                        <td className="p-2">DP-2024-002</td>
                        <td className="p-2">INS Vikramaditya</td>
                        <td className="p-2">Under Review</td>
                        <td className="p-2">2024-01-12</td>
                        <td className="p-2">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border border-gray-200 rounded-xl mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Docking Schedule Report</h3>
                  <table className="min-w-full text-sm">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="p-2">Date</th>
                        <th className="p-2">Vessel</th>
                        <th className="p-2">Dockyard</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2">2024-01-25</td>
                        <td className="p-2">INS Vikramaditya</td>
                        <td className="p-2">Mumbai Naval Dockyard</td>
                        <td className="p-2">Emergency Repair</td>
                        <td className="p-2">Confirmed</td>
                      </tr>
                      <tr>
                        <td className="p-2">2024-02-01</td>
                        <td className="p-2">INS Vikrant</td>
                        <td className="p-2">Cochin Shipyard</td>
                        <td className="p-2">Routine Maintenance</td>
                        <td className="p-2">Confirmed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border border-gray-200 rounded-xl mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Custom Report</h3>
                  <p className="text-muted-foreground mb-2">Custom docking plan analytics and summaries will appear here.</p>
                  <ul className="list-disc pl-6 text-sm">
                    <li>Total plans: 12</li>
                    <li>Approved: 7</li>
                    <li>Pending Review: 3</li>
                    <li>Need Revision: 2</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Docking Plan Form Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editData ? 'Edit Docking Plan' : 'Create New Docking Plan'}
            </DialogTitle>
          </DialogHeader>
          <DockingPlanForm
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            editData={editData}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DockyardPlans;