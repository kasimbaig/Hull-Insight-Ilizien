import React, { useState, useEffect, useCallback } from "react";
import MasterTable from '@/components/MasterTable';
import MasterModal from '@/components/MasterModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Eye, User, Mail, Phone, Shield } from 'lucide-react';
import { getRequest, postRequest, putRequest, deleteRequest } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import { exportToCSV } from '@/utils/csvExport';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const [formVisible, setFormVisible] = useState(false);
  const [viewDetailsVisible, setViewDetailsVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [globalFilter, setGlobalFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});

  const { toast } = useToast();

  // Load users from API
  const loadUsers = useCallback(async (page = 0, search = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        ...(search && { search })
      });
      
      const response = await getRequest(`api/auth/users/?${params}`);
      
      if (response.results && response.results.data) {
        const userData = response.results.data;
        setAllUsers(userData);
        
        let filteredUsers = userData;
        
        if (search) {
          filteredUsers = userData.filter(user => 
            user.loginname.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.first_name.toLowerCase().includes(search.toLowerCase()) ||
            user.last_name.toLowerCase().includes(search.toLowerCase()) ||
            (user.role_name && user.role_name.toLowerCase().includes(search.toLowerCase())) ||
            (user.process_name && user.process_name.toLowerCase().includes(search.toLowerCase()))
          );
        }
        
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
        
        setUsers(paginatedUsers);
        setTotalRecords(filteredUsers.length);
        setCurrentPage(page);
        setTotalPages(Math.ceil(filteredUsers.length / rowsPerPage));
        setHasNext(page < Math.ceil(filteredUsers.length / rowsPerPage) - 1);
        setHasPrev(page > 0);
      } else {
        setUsers([]);
        setTotalRecords(0);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [rowsPerPage, toast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const userFields = {
    title: 'User',
    list: [
      { key: 'first_name', label: 'First Name', required: true, type: 'text' },
      { key: 'last_name', label: 'Last Name', required: true, type: 'text' },
      { key: 'loginname', label: 'Login Name', required: true, type: 'text' },
      { key: 'email', label: 'Email', required: true, type: 'email' },
      { key: 'password', label: 'Password', required: true, type: 'password' },
      { key: 'phone_no', label: 'Phone Number', required: false, type: 'text' },
      { key: 'user_role', label: 'User Role', required: true, type: 'number' },
      { key: 'unit', label: 'Unit', required: true, type: 'number' },
      { key: 'hrcdf_desig', label: 'HRCDF Designation', required: false, type: 'text' },
      { key: 'rankCode', label: 'Rank Code', required: false, type: 'text' },
      { key: 'rankName', label: 'Rank Name', required: false, type: 'text' },
      { key: 'status', label: 'Active Status', required: false, type: 'checkbox' },
      { key: 'ad_user', label: 'AD User', required: false, type: 'checkbox' }
    ]
  };

  const openForm = (mode, user = null) => {
    setFormMode(mode);
    setSelectedUser(user);
    setForm(user || {});
    setFormVisible(true);
  };

  const openViewDetails = (user) => {
    setSelectedUser(user);
    setViewDetailsVisible(true);
  };

  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialogVisible(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formMode === 'create') {
        const payload = {
          first_name: form.first_name,
          last_name: form.last_name,
          loginname: form.loginname,
          email: form.email,
          password: form.password,
          user_role: form.user_role,
          hrcdf_desig: form.hrcdf_desig || "",
          unit: form.unit,
          status: 1,
          ad_user: form.ad_user ? "true" : "false",
          rankCode: form.rankCode || "",
          rankName: form.rankName || "",
          phone_no: form.phone_no || null
        };
        await postRequest('api/auth/users/', payload);
        toast({
          title: "Success",
          description: "User created successfully",
        });
      } else if (formMode === 'edit' && selectedUser) {
        const payload = {
          first_name: form.first_name,
          last_name: form.last_name,
          loginname: form.loginname,
          email: form.email,
          user_role: form.user_role,
          hrcdf_desig: form.hrcdf_desig || "",
          unit: form.unit,
          status: 1,
          ad_user: form.ad_user ? "true" : "false",
          rankCode: form.rankCode || "",
          rankName: form.rankName || "",
          phone_no: form.phone_no || null
        };
        if (form.password) {
          payload.password = form.password;
        }
        await putRequest(`api/auth/users/${selectedUser.id}/`, payload);
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      }
      setFormVisible(false);
      await loadUsers(currentPage, globalFilter);
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: "Error",
        description: "Failed to save user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      await deleteRequest(`api/auth/users/${selectedUser.id}/`);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      setDeleteDialogVisible(false);
      setSelectedUser(null);
      await loadUsers(currentPage, globalFilter);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
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
    
    if (allUsers.length > 0) {
      let filteredUsers = allUsers;
      
      if (value) {
        filteredUsers = allUsers.filter(user => 
          user.loginname.toLowerCase().includes(value.toLowerCase()) ||
          user.email.toLowerCase().includes(value.toLowerCase()) ||
          user.first_name.toLowerCase().includes(value.toLowerCase()) ||
          user.last_name.toLowerCase().includes(value.toLowerCase()) ||
          (user.role_name && user.role_name.toLowerCase().includes(value.toLowerCase())) ||
          (user.process_name && user.process_name.toLowerCase().includes(value.process_name))
        );
      }
      
      const startIndex = 0;
      const endIndex = rowsPerPage;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      setUsers(paginatedUsers);
      setTotalRecords(filteredUsers.length);
      setCurrentPage(0);
    } else {
      loadUsers(0, value);
    }
  };

  const handleExportCSV = () => {
    const csvData = users.map(user => ({
      'User ID': user.id || '',
      'First Name': user.first_name || '',
      'Last Name': user.last_name || '',
      'Login Name': user.loginname || '',
      'Email': user.email || '',
      'Phone Number': user.phone_no || '',
      'Role': user.role_name || '',
      'Process': user.process_name || '',
      'Rank Code': user.rankCode || '',
      'Rank Name': user.rankName || '',
      'HRCDF Designation': user.hrcdf_designation || '',
      'Status': user.status === 1 ? 'Active' : 'Inactive',
      'AD User': user.ad_user ? 'Yes' : 'No',
      'Last Login': user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never',
      'Created On': user.created_on ? new Date(user.created_on).toLocaleDateString() : ''
    }));

    exportToCSV(csvData, 'users');
    toast({
      title: "Export Successful",
      description: `Exported ${users.length} user records as CSV`,
    });
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Badge className={rowData.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        {rowData.status === 1 ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-blue-600" />
        </div>
        <div>
          <div className="font-medium text-foreground">{rowData.first_name} {rowData.last_name}</div>
          <div className="text-sm text-muted-foreground">@{rowData.loginname}</div>
        </div>
      </div>
    );
  };

  const roleBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center space-x-2">
        <Shield className="h-4 w-4 text-blue-600" />
        <div>
          <div className="font-medium text-foreground">{rowData.role_name || 'No Role'}</div>
          {rowData.process_name && (
            <div className="text-sm text-muted-foreground">{rowData.process_name}</div>
          )}
        </div>
      </div>
    );
  };

  const lastLoginBodyTemplate = (rowData) => {
    if (!rowData.last_login) {
      return <span className="text-muted-foreground">Never</span>;
    }
    
    const lastLogin = new Date(rowData.last_login);
    return (
      <div>
        <div className="text-sm">{lastLogin.toLocaleDateString()}</div>
        <div className="text-xs text-muted-foreground">{lastLogin.toLocaleTimeString()}</div>
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
    { key: 'name', label: 'Name', template: nameBodyTemplate, className: 'min-w-[200px]' },
    { key: 'email', label: 'Email', template: (row) => (
      <div className="flex items-center space-x-2">
        <Mail className="h-4 w-4 text-gray-500" />
        <span>{row.email}</span>
      </div>
    ), className: 'min-w-[200px]' },
    { key: 'role', label: 'Role & Process', template: roleBodyTemplate, className: 'min-w-[180px]' },
    { key: 'last_login', label: 'Last Login', template: lastLoginBodyTemplate, className: 'min-w-[120px]' },
    { key: 'status', label: 'Status', template: statusBodyTemplate, className: 'min-w-[120px]' },
    { key: 'actions', label: 'Actions', template: actionBodyTemplate, className: 'w-[140px] text-center' }
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Top Navbar */}
      <nav className="w-full bg-gradient-to-r from-blue-200 via-blue-100 to-blue-300 border-b border-blue-300 z-10 shadow py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-hull-primary">Manage Users</h1>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Search className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
            <Button className="bg-hull-primary hover:bg-hull-primary-dark" size="sm" onClick={() => openForm('create')}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
      </nav>

      <Card className="bg-white/95 shadow-lg rounded-2xl w-full p-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Users</CardTitle>
              <CardDescription>Manage system users and their access</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={globalFilter}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search users, names, emails..."
                  className="pl-9 pr-4 py-2 w-64 border border-input rounded-lg bg-background focus:ring-2 focus:ring-hull-primary focus:border-hull-primary transition-colors text-sm"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <MasterTable
            items={users}
            fields={{ ...userFields, tableColumns }}
            onEdit={(user) => openForm('edit', user)}
            onDelete={openDeleteDialog}
            loading={loading}
            pagination={{
              currentPage,
              totalPages,
              hasNext,
              hasPrev,
              onPageChange: (page) => {
                if (allUsers.length > 0) {
                  let filteredUsers = allUsers;
                  
                  if (globalFilter) {
                    filteredUsers = allUsers.filter(user => 
                      user.loginname.toLowerCase().includes(globalFilter.toLowerCase()) ||
                      user.email.toLowerCase().includes(globalFilter.toLowerCase()) ||
                      user.first_name.toLowerCase().includes(globalFilter.toLowerCase()) ||
                      user.last_name.toLowerCase().includes(globalFilter.toLowerCase()) ||
                      (user.role_name && user.role_name.toLowerCase().includes(globalFilter.toLowerCase())) ||
                      (user.process_name && user.process_name.toLowerCase().includes(globalFilter.toLowerCase()))
                    );
                  }
                  
                  const startIndex = page * rowsPerPage;
                  const endIndex = startIndex + rowsPerPage;
                  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
                  
                  setUsers(paginatedUsers);
                  setTotalRecords(filteredUsers.length);
                  setCurrentPage(page);
                } else {
                  loadUsers(page, globalFilter);
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
        fields={userFields}
        editId={selectedUser?.id}
        onCancel={() => setFormVisible(false)}
      />

      {/* Delete Confirmation Dialog */}
      {deleteDialogVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Delete User</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Are you sure you want to delete this user? This action cannot be undone.</p>
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

export default ManageUsers;
