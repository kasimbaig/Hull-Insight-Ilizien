import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { 
  BuildingOffice2Icon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const kpiCards = [
    {
      title: 'Fleet Readiness',
      value: '94%',
      description: 'Operational efficiency',
      icon: CheckCircleIcon,
      trend: '+2.3%',
      color: 'hull-success',
      bgGradient: 'from-emerald-500 to-green-600'
    },
    {
      title: 'Maintenance Queue',
      value: '18',
      description: 'Scheduled repairs',
      icon: WrenchScrewdriverIcon,
      trend: '-4',
      color: 'hull-warning',
      bgGradient: 'from-amber-500 to-orange-600'
    },
    {
      title: 'Survey Compliance',
      value: '87%',
      description: 'Quarterly targets met',
      icon: ChartBarIcon,
      trend: '+5.2%',
      color: 'hull-primary',
      bgGradient: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Safety Alerts',
      value: '2',
      description: 'Require immediate action',
      icon: ExclamationTriangleIcon,
      trend: '-1',
      color: 'hull-accent',
      bgGradient: 'from-red-500 to-rose-600'
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

  // Chart data
  const maintenanceData = [
    { month: 'Jan', completed: 12, pending: 8, overdue: 2 },
    { month: 'Feb', completed: 15, pending: 6, overdue: 1 },
    { month: 'Mar', completed: 18, pending: 4, overdue: 3 },
    { month: 'Apr', completed: 14, pending: 7, overdue: 2 },
    { month: 'May', completed: 16, pending: 5, overdue: 1 },
    { month: 'Jun', completed: 20, pending: 3, overdue: 0 }
  ];

  const fleetPerformanceData = [
    { week: 'Week 1', readiness: 85, efficiency: 78, safety: 92 },
    { week: 'Week 2', readiness: 88, efficiency: 82, safety: 89 },
    { week: 'Week 3', readiness: 92, efficiency: 85, safety: 94 },
    { week: 'Week 4', readiness: 89, efficiency: 88, safety: 91 },
    { week: 'Week 5', readiness: 94, efficiency: 90, safety: 93 },
    { week: 'Week 6', readiness: 91, efficiency: 87, safety: 95 }
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
    <div className="space-y-8 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-cyan-50/20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-cyan-100/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      {/* Header */}
      <div className="flex justify-between items-center mt-1 mb-1">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 bg-clip-text text-transparent">
            Naval Command Center
          </h1>
  
        </div>
        <div className="flex space-x-3">
          {/* <Button variant="outline" size="sm">
            <ChartBarIcon className="h-4 w-4 mr-2" />
            Generate Report
          </Button> */}
          {/* <Button className="bg-hull-primary hover:bg-hull-primary-dark" size="sm">
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            New Plan
          </Button> */}
        </div>
      </div>

      {/* KPI Cards - Modern Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          const isPositiveTrend = kpi.trend.startsWith('+');
          return (
            <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${kpi.bgGradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-8 -translate-x-8"></div>
              
              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.bgGradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <ArrowTrendingUpIcon className={`h-4 w-4 ${isPositiveTrend ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-sm font-semibold ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.trend}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-foreground group-hover:text-gray-700 transition-colors duration-300">
                    {kpi.value}
                  </h3>
                  <p className="text-sm font-semibold text-foreground group-hover:text-gray-600 transition-colors duration-300">
                    {kpi.title}
                  </p>
                  <p className="text-xs text-muted-foreground group-hover:text-gray-500 transition-colors duration-300">
                    {kpi.description}
                  </p>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${kpi.bgGradient} rounded-full transition-all duration-1000 group-hover:animate-pulse`}
                    style={{ 
                      width: kpi.value.includes('%') 
                        ? kpi.value.replace('%', '') + '%' 
                        : Math.min(parseInt(kpi.value) * 5, 100) + '%' 
                    }}
                  ></div>
                </div>
              </CardContent>
              
              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-white/20 transition-colors duration-300"></div>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Maintenance Progress Bar Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2 text-hull-primary" />
              Maintenance Progress Overview
            </CardTitle>
            <CardDescription>
              Monthly maintenance completion trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={maintenanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f8fafc', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Bar dataKey="completed" fill="#3b82f6" name="Completed" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" fill="#8b5cf6" name="Pending" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="overdue" fill="#f59e0b" name="Overdue" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Fleet Performance Line Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BuildingOffice2Icon className="h-5 w-5 mr-2 text-hull-primary" />
              Fleet Performance Metrics
            </CardTitle>
            <CardDescription>
              Weekly performance indicators and trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fleetPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="readinessGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="safetyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" domain={[70, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f8fafc', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="readiness"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="url(#readinessGradient)"
                    strokeWidth={3}
                    name="Readiness %"
                  />
                  <Area
                    type="monotone"
                    dataKey="efficiency"
                    stackId="2"
                    stroke="#10b981"
                    fill="url(#efficiencyGradient)"
                    strokeWidth={3}
                    name="Efficiency %"
                  />
                  <Area
                    type="monotone"
                    dataKey="safety"
                    stackId="3"
                    stroke="#8b5cf6"
                    fill="url(#safetyGradient)"
                    strokeWidth={3}
                    name="Safety %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Statistics Dashboard */}
      <Card className="relative z-10 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2 text-hull-primary" />
            Operational Statistics Dashboard
          </CardTitle>
          <CardDescription>
            Key performance indicators and operational metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mission Success Rate */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-700 mb-1">98.7%</h3>
              <p className="text-sm font-semibold text-blue-600 mb-1">Mission Success Rate</p>
              <p className="text-xs text-blue-500">Last 30 days</p>
            </div>

            {/* Fuel Efficiency */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BuildingOffice2Icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-700 mb-1">94.2%</h3>
              <p className="text-sm font-semibold text-green-600 mb-1">Fuel Efficiency</p>
              <p className="text-xs text-green-500">Above target</p>
            </div>

            {/* Response Time */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-purple-700 mb-1">2.3m</h3>
              <p className="text-sm font-semibold text-purple-600 mb-1">Avg Response Time</p>
              <p className="text-xs text-purple-500">Emergency calls</p>
            </div>

            {/* System Uptime */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExclamationTriangleIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-orange-700 mb-1">99.9%</h3>
              <p className="text-sm font-semibold text-orange-600 mb-1">System Uptime</p>
              <p className="text-xs text-orange-500">This month</p>
            </div>
          </div>

          {/* Additional Metrics Row */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg border border-cyan-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-cyan-700">Active Patrols</p>
                  <p className="text-2xl font-bold text-cyan-800">24</p>
                </div>
                <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <MagnifyingGlassIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700">Training Hours</p>
                  <p className="text-2xl font-bold text-emerald-800">1,247</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-lg border border-rose-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-rose-700">Alert Level</p>
                  <p className="text-2xl font-bold text-rose-800">LOW</p>
                </div>
                <div className="w-12 h-12 bg-rose-500 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;