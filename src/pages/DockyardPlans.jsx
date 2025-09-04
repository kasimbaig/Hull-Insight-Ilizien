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
  MapPinIcon
} from '@heroicons/react/24/outline';

const DockyardPlans = () => {
  const [activeTab, setActiveTab] = useState('plans');

  const dockyardPlans = [
    {
      id: 'DP-2024-001',
      vessel: 'INS Vikrant',
      command: 'Western Naval Command',
      dockyard: 'Cochin Shipyard',
      reason: 'Routine Maintenance',
      initiator: 'Captain S. Sharma',
      status: 'Approved',
      stage: 'Approved',
      priority: 'Medium',
      submittedDate: '2024-01-10',
      approvedDate: '2024-01-15',
      scheduledDate: '2024-02-01'
    },
    {
      id: 'DP-2024-002',
      vessel: 'INS Vikramaditya',
      command: 'Western Naval Command',
      dockyard: 'Mumbai Naval Dockyard',
      reason: 'Emergency Repair',
      initiator: 'Commander R. Nair',
      status: 'Under Review',
      stage: 'Review',
      priority: 'High',
      submittedDate: '2024-01-12',
      reviewerComments: 'Awaiting technical assessment',
      scheduledDate: '2024-01-25'
    },
    {
      id: 'DP-2024-003',
      vessel: 'INS Kolkata',
      command: 'Eastern Naval Command',
      dockyard: 'Garden Reach Shipyard',
      reason: 'Scheduled Overhaul',
      initiator: 'Captain M. Singh',
      status: 'Initiated',
      stage: 'Draft',
      priority: 'Low',
      submittedDate: '2024-01-08',
      scheduledDate: '2024-03-15'
    },
    {
      id: 'DP-2024-004',
      vessel: 'INS Chennai',
      command: 'Eastern Naval Command',
      dockyard: 'Kolkata Dry Dock',
      reason: 'Hull Inspection',
      initiator: 'Lt. Commander A. Patel',
      status: 'Revision Requested',
      stage: 'Revision',
      priority: 'Medium',
      submittedDate: '2024-01-05',
      reviewerComments: 'Additional safety documentation required',
      scheduledDate: '2024-02-20'
    }
  ];

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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dockyard Plan Approval</h1>
          <p className="text-muted-foreground mt-1">
            Manage vessel docking plans, approvals, and scheduling
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <CalendarIcon className="h-4 w-4 mr-2" />
            View Calendar
          </Button>
          <Button className="bg-hull-primary hover:bg-hull-primary-dark" size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Docking Plan
          </Button>
        </div>
      </div>

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
                            <span className="text-sm text-muted-foreground">
                              Scheduled: {plan.scheduledDate}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            <span>Reason: {plan.reason}</span>
                            <span className="mx-2">•</span>
                            <span>Initiated by: {plan.initiator}</span>
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
                        <Button variant="ghost" size="sm">
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
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
              <div className="text-center py-12">
                <ClockIcon className="h-12 w-12 text-hull-warning mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Review Queue</h3>
                <p className="text-muted-foreground mb-4">
                  Plans pending review will appear here for authorized reviewers
                </p>
                <Button className="bg-hull-primary hover:bg-hull-primary-dark">
                  View Review Queue
                </Button>
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
              <div className="text-center py-12">
                <DocumentTextIcon className="h-12 w-12 text-hull-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Report Generation</h3>
                <p className="text-muted-foreground mb-4">
                  Generate detailed reports for docking plans, approvals, and schedules
                </p>
                <div className="flex justify-center space-x-3">
                  <Button variant="outline">
                    Approval Status Report
                  </Button>
                  <Button variant="outline">
                    Docking Schedule Report
                  </Button>
                  <Button className="bg-hull-primary hover:bg-hull-primary-dark">
                    Custom Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DockyardPlans;