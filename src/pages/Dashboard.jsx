import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BuildingOffice2Icon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const kpiCards = [
    {
      title: 'Active Vessels',
      value: '47',
      description: '3 in maintenance',
      icon: BuildingOffice2Icon,
      trend: '+2',
      color: 'hull-primary'
    },
    {
      title: 'Pending Plans',
      value: '12',
      description: '5 awaiting approval',
      icon: DocumentTextIcon,
      trend: '-3',
      color: 'hull-warning'
    },
    {
      title: 'Due Surveys',
      value: '8',
      description: 'Next 30 days',
      icon: MagnifyingGlassIcon,
      trend: '+1',
      color: 'hull-accent'
    },
    {
      title: 'Critical Issues',
      value: '3',
      description: 'Immediate attention',
      icon: ExclamationTriangleIcon,
      trend: '0',
      color: 'hull-accent'
    }
  ];

  const recentPlans = [
    {
      id: 'DP-2024-001',
      vessel: 'INS Vikrant',
      type: 'Routine Maintenance',
      status: 'Approved',
      date: '2024-01-15',
      priority: 'Medium'
    },
    {
      id: 'DP-2024-002',
      vessel: 'INS Vikramaditya',
      type: 'Emergency Repair',
      status: 'Under Review',
      date: '2024-01-12',
      priority: 'High'
    },
    {
      id: 'DP-2024-003',
      vessel: 'INS Kolkata',
      type: 'Scheduled Overhaul',
      status: 'In Progress',
      date: '2024-01-10',
      priority: 'Low'
    }
  ];

  const upcomingSurveys = [
    {
      vessel: 'INS Shivalik',
      type: 'Quarterly Hull Survey',
      dueDate: '2024-01-20',
      inspector: 'Lt. Commander A. Patel',
      status: 'Scheduled'
    },
    {
      vessel: 'INS Chennai',
      type: 'Annual Safety Inspection',
      dueDate: '2024-01-22',
      inspector: 'Commander R. Singh',
      status: 'Overdue'
    },
    {
      vessel: 'INS Kochi',
      type: 'Pre-deployment Check',
      dueDate: '2024-01-25',
      inspector: 'Lt. Commander S. Nair',
      status: 'Scheduled'
    }
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      'Approved': 'bg-hull-success text-white',
      'Under Review': 'bg-hull-warning text-white',
      'In Progress': 'bg-hull-primary text-white',
      'Scheduled': 'bg-hull-primary text-white',
      'Overdue': 'bg-hull-accent text-white'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fleet Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of naval operations and vessel management
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <ChartBarIcon className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button className="bg-hull-primary hover:bg-hull-primary-dark" size="sm">
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            New Plan
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg bg-${kpi.color}/10`}>
                    <Icon className={`h-5 w-5 text-${kpi.color}`} />
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <ArrowTrendingUpIcon className="h-3 w-3" />
                    <span className={kpi.trend.startsWith('+') ? 'text-hull-success' : 'text-hull-accent'}>
                      {kpi.trend}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-foreground">{kpi.value}</h3>
                  <p className="text-sm font-medium text-foreground">{kpi.title}</p>
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Dockyard Plans */}
        <Card>
          <CardHeader>
          <CardTitle className="flex items-center">
            <BuildingOffice2Icon className="h-5 w-5 mr-2 text-hull-primary" />
            Recent Dockyard Plans
          </CardTitle>
            <CardDescription>
              Latest dockyard plan submissions and approvals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPlans.map((plan, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-hull-secondary/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-foreground">{plan.id}</h4>
                      <Badge className={getPriorityBadge(plan.priority)} variant="secondary">
                        {plan.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{plan.vessel} - {plan.type}</p>
                    <p className="text-xs text-muted-foreground">Created: {plan.date}</p>
                  </div>
                  <Badge className={getStatusBadge(plan.status)} variant="secondary">
                    {plan.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Plans
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Surveys */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MagnifyingGlassIcon className="h-5 w-5 mr-2 text-hull-primary" />
              Upcoming Hull Surveys
            </CardTitle>
            <CardDescription>
              Scheduled inspections and surveys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSurveys.map((survey, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-hull-secondary/50 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{survey.vessel}</h4>
                    <p className="text-sm text-muted-foreground">{survey.type}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <ClockIcon className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Due: {survey.dueDate} • {survey.inspector}
                      </span>
                    </div>
                  </div>
                  <Badge className={getStatusBadge(survey.status)} variant="secondary">
                    {survey.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Surveys
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BuildingOffice2Icon className="h-5 w-5 mr-2 text-hull-primary" />
            Fleet Status Overview
          </CardTitle>
          <CardDescription>
            Real-time status of naval vessels across all commands
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-hull-success/10 border border-hull-success/20">
              <CheckCircleIcon className="h-8 w-8 text-hull-success mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-foreground">32</h3>
              <p className="text-sm text-muted-foreground">Operational</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-hull-warning/10 border border-hull-warning/20">
              <ClockIcon className="h-8 w-8 text-hull-warning mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-foreground">12</h3>
              <p className="text-sm text-muted-foreground">Under Maintenance</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-hull-accent/10 border border-hull-accent/20">
              <ExclamationTriangleIcon className="h-8 w-8 text-hull-accent mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-foreground">3</h3>
              <p className="text-sm text-muted-foreground">Needs Attention</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;