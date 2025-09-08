import React, { useState, useEffect, useCallback } from "react";
import MasterTable from '@/components/MasterTable';
import MasterModal from '@/components/MasterModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Eye, Shield, Users } from 'lucide-react';
import { getRequest, postRequest, putRequest, deleteRequest } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import { exportToCSV } from '@/utils/csvExport';

const ManageUserRoles = () => {
  const [userRoles, setUserRoles] = useState([]);
  const [allUserRoles, setAllUserRoles] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const [formVisible, setFormVisible] = useState(false);
  const [viewDetailsVisible, setViewDetailsVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedUserRole, setSelectedUserRole] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [globalFilter, setGlobalFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});

  const { toast } = useToast();

  // Load user roles from API
  const loadUserRoles = useCallback(async (page = 0, search = '') => {
    setLoading(true);
    try {
      const response = await getRequest(`access/user-roles/`);
      
      if (Array.isArray(response)) {
        setAllUserRoles(response);
        
        let filteredRoles = response;
        
        if (search) {
          filteredRoles = response.filter(role => 
            role.name.toLowerCase().includes(search.toLowerCase()) ||
            role.code.toLowerCase().includes(search.toLowerCase()) ||
            role.description.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedRoles = filteredRoles.slice(startIndex, endIndex);
        
        setUserRoles(paginatedRoles);
        setTotalRecords(filteredRoles.length);
        setCurrentPage(page);
        setTotalPages(Math.ceil(filteredRoles.length / rowsPerPage));
        setHasNext(page < Math.ceil(filteredRoles.length / rowsPerPage) - 1);
        setHasPrev(page > 0);
      } else {
        setUserRoles(response.results || []);
        setTotalRecords(response.count || 0);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error loading user roles:', error);
      toast({
        title: "Error",
        description: "Failed to load user roles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [rowsPerPage, toast]);

  useEffect(() => {
    loadUserRoles();
  }, [loadUserRoles]);

  const userRoleFields = {
    title: 'User Role',
    list: [
      { key: 'name', label: 'Role Name', required: true, type: 'text' },
      { key: 'code', label: 'Role Code', required: true, type: 'text' },
      { key: 'description', label: 'Description', required: true, type: 'textarea' },
      { key: 'active', label: 'Active Status', required: false, type: 'checkbox' }
    ]
  };

  const openForm = (mode, userRole = null) => {
    setFormMode(mode);
    setSelectedUserRole(userRole);
    setForm(userRole || {});
    setFormVisible(true);
  };

  const openViewDetails = (userRole) => {
    setSelectedUserRole(userRole);
    setViewDetailsVisible(true);
  };

  const openDeleteDialog = (userRole) => {
    setSelectedUserRole(userRole);
    setDeleteDialogVisible(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formMode === 'create') {
        const payload = {
          name: form.name,
          code: form.code,
          description: form.description
        };
        await postRequest('access/user-roles/', payload);
        toast({
          title: "Success",
          description: "User role created successfully",
        });
      } else if (formMode === 'edit' && selectedUserRole) {
        const payload = {
          name: form.name,
          code: form.code,
          description: form.description
        };
        await putRequest(`access/user-roles/${selectedUserRole.id}/`, payload);
        toast({
          title: "Success",
          description: "User role updated successfully",
        });
      }
      setFormVisible(false);
      await loadUserRoles(currentPage, globalFilter);
    } catch (error) {
      console.error('Error saving user role:', error);
      toast({
        title: "Error",
        description: "Failed to save user role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUserRole) return;
    
    setLoading(true);
    try {
      await deleteRequest(`access/user-roles/${selectedUserRole.id}/`);
      toast({
        title: "Success",
        description: "User role deleted successfully",
      });
      setDeleteDialogVisible(false);
      setSelectedUserRole(null);
      await loadUserRoles(currentPage, globalFilter);
    } catch (error) {
      console.error('Error deleting user role:', error);
      toast({
        title: "Error",
        description: "Failed to delete user role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSearch = (value) => {
    setGlobalFilter(value);
    
    if (allUserRoles.length > 0) {
      let filteredRoles = allUserRoles;
      
      if (value) {
        filteredRoles = allUserRoles.filter(role => 
          role.name.toLowerCase().includes(value.toLowerCase()) ||
          role.code.toLowerCase().includes(value.toLowerCase()) ||
          role.description.toLowerCase().includes(value.toLowerCase())
        );
      }
      
      const startIndex = 0;
      const endIndex = rowsPerPage;
      const paginatedRoles = filteredRoles.slice(startIndex, endIndex);
      
      setUserRoles(paginatedRoles);
      setTotalRecords(filteredRoles.length);
      setCurrentPage(0);
    } else {
      loadUserRoles(0, value);
    }
  };

  const handleExportCSV = () => {
    const csvData = userRoles.map(role => ({
      'Role ID': role.id || '',
      'Role Name': role.name || '',
      'Role Code': role.code || '',
      'Description': role.description || '',
      'Active Status': role.active === 1 ? 'Active' : 'Inactive'
    }));

    exportToCSV(csvData, 'user-roles');
    toast({
      title: "Export Successful",
      description: `Exported ${userRoles.length} role records as CSV`,
    });
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Badge className={rowData.active === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        {rowData.active === 1 ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <Shield className="h-4 w-4 text-blue-600" />
        </div>
        <div>
          <div className="font-medium text-foreground">{rowData.name}</div>
          <div className="text-sm text-muted-foreground">{rowData.code}</div>
        </div>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openViewDetails(rowData)}
          className="hover:bg-blue-50 hover:text-blue-600"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openForm('edit', rowData)}
          className="hover:bg-blue-50 hover:text-blue-600"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openDeleteDialog(rowData)}
          className="hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const tableColumns = [
    { key: 'name', label: 'Role Name', template: nameBodyTemplate, className: 'min-w-[200px]' },
    { key: 'code', label: 'Code', template: (row) => (
      <div className="flex items-center space-x-2">
        <Shield className="h-4 w-4 text-gray-500" />
        <span className="font-mono text-sm">{row.code}</span>
      </div>
    ), className: 'min-w-[150px]' },
    { key: 'description', label: 'Description', template: (row) => (
      <div className="max-w-xs truncate" title={row.description}>
        {row.description}
      </div>
    ), className: 'min-w-[250px]' },
    { key: 'status', label: 'Status', template: statusBodyTemplate, className: 'min-w-[120px]' },
    { key: 'actions', label: 'Actions', template: actionBodyTemplate, className: 'w-[140px] text-center' }
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Top Navbar */}
      <nav className="w-full bg-gradient-to-r from-blue-200 via-blue-100 to-blue-300 border-b border-blue-300 z-10 shadow py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-hull-primary">Manage User Roles</h1>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Search className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
            <Button className="bg-hull-primary hover:bg-hull-primary-dark" size="sm" onClick={() => openForm('create')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </div>
        </div>
      </nav>

      <Card className="bg-white/95 shadow-lg rounded-2xl w-full p-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">User Roles</CardTitle>
              <CardDescription>Manage user roles and their permissions</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={globalFilter}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search roles, names, codes..."
                  className="pl-9 pr-4 py-2 w-64 border border-input rounded-lg bg-background focus:ring-2 focus:ring-hull-primary focus:border-hull-primary transition-colors text-sm"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <MasterTable
            items={userRoles}
            fields={{ ...userRoleFields, tableColumns }}
            onEdit={(role) => openForm('edit', role)}
            onDelete={openDeleteDialog}
            loading={loading}
            pagination={{
              currentPage,
              totalPages,
              hasNext,
              hasPrev,
              onPageChange: (page) => {
                if (allUserRoles.length > 0) {
                  let filteredRoles = allUserRoles;
                  
                  if (globalFilter) {
                    filteredRoles = allUserRoles.filter(role => 
                      role.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
                      role.code.toLowerCase().includes(globalFilter.toLowerCase()) ||
                      role.description.toLowerCase().includes(globalFilter.toLowerCase())
                    );
                  }
                  
                  const startIndex = page * rowsPerPage;
                  const endIndex = startIndex + rowsPerPage;
                  const paginatedRoles = filteredRoles.slice(startIndex, endIndex);
                  
                  setUserRoles(paginatedRoles);
                  setTotalRecords(filteredRoles.length);
                  setCurrentPage(page);
                } else {
                  loadUserRoles(page, globalFilter);
                }
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Form Modal */}
      <MasterModal
        open={formVisible}
        onOpenChange={setFormVisible}
        onSubmit={handleFormSubmit}
        onChange={handleChange}
        form={form}
        fields={userRoleFields}
        editId={selectedUserRole?.id}
        onCancel={() => setFormVisible(false)}
      />

      {/* Delete Confirmation Dialog */}
      {deleteDialogVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Delete User Role</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Are you sure you want to delete this user role? This action cannot be undone.</p>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setDeleteDialogVisible(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ManageUserRoles;
