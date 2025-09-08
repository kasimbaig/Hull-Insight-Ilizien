import React, { useState, useEffect } from 'react';
import Pagination from '../../components/ui/Pagination';
import { toast } from '@/components/ui/use-toast';
import api from '@/lib/axios';
import MasterModal from '../../components/MasterModal';
import MasterTable from '../../components/MasterTable';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/utils/csvExport';

const masterFields = {
  unit: {
    title: 'Unit',
    list: [ { key: 'name', label: 'Name', required: true } ],
  },
  classofvessel: {
    title: 'Class of Vessel',
    list: [ { key: 'name', label: 'Name', required: true } ],
  },
  vesseltype: {
    title: 'Vessel Type',
    list: [ { key: 'name', label: 'Name', required: true } ],
  },
  dockyard: {
    title: 'Dockyard',
    list: [ { key: 'name', label: 'Name', required: true } ],
  },
  command: {
    title: 'Command',
    list: [ { key: 'name', label: 'Name', required: true } ],
  },
  vessel: {
    title: 'Vessel',
    list: [
      { key: 'name', label: 'Name', required: true },
      { key: 'classofvessel', label: 'Class of Vessel', required: true, type: 'select', ref: 'classofvessel' },
      { key: 'vesseltype', label: 'Vessel Type', required: true, type: 'select', ref: 'vesseltype' },
      { key: 'yard', label: 'Dockyard', required: true, type: 'select', ref: 'dockyard' },
      { key: 'command', label: 'Command', required: true, type: 'select', ref: 'command' },
      { key: 'year_of_build', label: 'Year of Build', required: true, type: 'number' },
      { key: 'year_of_delivery', label: 'Year of Delivery', required: true, type: 'number' },
    ],
  },
  hullcompartment: {
    title: 'Hull Compartment',
    list: [
      { key: 'name', label: 'Name' },
      { key: 'remark', label: 'Remark' },
      { key: 'ser', label: 'SER' },
      { key: 'numbers', label: 'Numbers' },
      { key: 'location', label: 'Location' },
      { key: 'equipment', label: 'Equipment' },
      { key: 'features', label: 'Features' },
      { key: 'layout', label: 'Layout' },
      { key: 'special_requirements', label: 'Special Requirements' },
      { key: 'standards', label: 'Standards' },
    ],
  },
  hullsystem: {
    title: 'Hull System',
    list: [
      { key: 'name', label: 'Name' },
      { key: 'remark', label: 'Remark' },
      { key: 'ser', label: 'SER' },
      { key: 'numbers', label: 'Numbers' },
      { key: 'capabilities_feature', label: 'Capabilities/Feature' },
      { key: 'weight_volume_power_consumption', label: 'Weight/Volume/Power Consumption' },
      { key: 'location', label: 'Location' },
      { key: 'interface', label: 'Interface' },
      { key: 'procurement_router', label: 'Procurement Router' },
      { key: 'vendor', label: 'Vendor' },
      { key: 'cost', label: 'Cost' },
      { key: 'standards', label: 'Standards' },
      { key: 'sustenance', label: 'Sustenance' },
      { key: 'flag', label: 'Flag' },
      { key: 'sotr_type', label: 'SOTR Type' },
      { key: 'sequence', label: 'Sequence', type: 'number' },
    ],
  },
  hullequipment: {
    title: 'Hull Equipment',
    list: [
      { key: 'name', label: 'Name' },
      { key: 'weight_volume_power_consumption', label: 'Weight/Volume/Power Consumption' },
      { key: 'procurement_router', label: 'Procurement Router' },
      { key: 'remark', label: 'Remark' },
      { key: 'vendor', label: 'Vendor' },
      { key: 'cost', label: 'Cost' },
      { key: 'sustenance', label: 'Sustenance' },
      { key: 'ser', label: 'SER' },
      { key: 'numbers', label: 'Numbers' },
      { key: 'capabilities_feature', label: 'Capabilities/Feature' },
      { key: 'location', label: 'Location' },
      { key: 'interface', label: 'Interface' },
      { key: 'standards', label: 'Standards' },
      { key: 'flag', label: 'Flag' },
      { key: 'sotr_type', label: 'SOTR Type' },
      { key: 'equipment_type_name', label: 'Equipment Type Name' },
    ],
  },
  damagetype: {
    title: 'Damage Type',
    list: [ { key: 'name', label: 'Name', required: true } ],
  },
  severity: {
    title: 'Severity',
    list: [ { key: 'name', label: 'Name', required: true } ],
  },
  operationalstatus: {
    title: 'Operational Status',
    list: [ { key: 'name', label: 'Name', required: true } ],
  },
  module: {
    title: 'Module',
    list: [ { key: 'name', label: 'Name', required: true } ],
  },
  submodule: {
    title: 'SubModule',
    list: [
      { key: 'name', label: 'Name', required: true },
      { key: 'module', label: 'Module', required: true, type: 'select', ref: 'module' },
      { key: 'parent', label: 'Parent SubModule', required: false, type: 'select', ref: 'submodule' },
    ],
  },
  surveycycle: {
    title: 'Survey Cycle',
    list: [
      { key: 'name', label: 'Name', required: true },
      { key: 'cycle_unit', label: 'Cycle Unit', required: true, type: 'select', options: [ { value: 'DAYS', label: 'Days' }, { value: 'MONTHS', label: 'Months' }, { value: 'REFIT', label: 'Refit-to-Refit' } ] },
      { key: 'cycle_value', label: 'Cycle Value', type: 'number' },
      { key: 'description', label: 'Description' },
      { key: 'submodule', label: 'SubModule', required: true, type: 'select', ref: 'submodule' },
    ],
  },
  dynamicfield: {
    title: 'Dynamic Field',
    list: [
      { key: 'sub_module', label: 'SubModule', required: true, type: 'select', ref: 'submodule' },
      { key: 'label', label: 'Label', required: true },
      { key: 'field_type', label: 'Field Type', required: true, type: 'select', options: [ { value: 'text', label: 'Text' }, { value: 'number', label: 'Number' }, { value: 'dropdown', label: 'Dropdown' }, { value: 'date', label: 'Date' } ] },
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'dropdown_options', label: 'Dropdown Options' },
      { key: 'data_source', label: 'Data Source' },
    ],
  },
};




const apiMap = {
  unit: 'units',
  classofvessel: 'classofvessels',
  vesseltype: 'vesseltypes',
  dockyard: 'dockyards',
  command: 'commands',
  vessel: 'vessels',
  hullcompartment: 'compartments',
  hullsystem: 'systems',
  hullequipment: 'equipments',
  damagetype: 'damagetypes',
  severity: 'severities',
  operationalstatus: 'operationalstatuses',
  module: 'modules',
  submodule: 'submodules',
  // Add more as needed
};

const PAGE_SIZE = 20;

const GenericMaster = ({ masterKey, searchValue='', onDataChange }) => {
  const fields = masterFields[masterKey];
  const [allItems, setAllItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  // Accept searchValue as prop
  // Remove local search state

  // Fetch all master data (for select fields too)
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const keys = Object.keys(masterFields);
      const results = {};
      for (const key of keys) {
        const endpoint = apiMap[key];
        if (!endpoint) continue;
        let params = {};
        if (key === masterKey) {
          params = { page, order_by: '-id' };
          if (typeof searchValue === 'string' && searchValue) params.search = searchValue;
        }
        try {
          const res = await api.get(`/master/${endpoint}/`, { params });
          if (key === masterKey && res.data && (res.data.results !== undefined || res.data.next !== undefined || res.data.previous !== undefined)) {
            results[key] = Array.isArray(res.data.results) ? res.data.results : [];
            setHasNext(!!res.data.next);
            setHasPrev(!!res.data.previous);
            setTotalPages(res.data.count ? Math.ceil(res.data.count / PAGE_SIZE) : 1);
          } else {
            results[key] = Array.isArray(res.data.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
          }
        } catch (e) {
          results[key] = [];
        }
      }
      setAllItems(results);
      setLoading(false);
    };
    fetchAll();
  }, [masterKey, page, searchValue]);

  // Get items for the current master
  const items = Array.isArray(allItems[masterKey]) ? allItems[masterKey] : [];

  // Notify parent component when data changes
  useEffect(() => {
    if (onDataChange && fields) {
      onDataChange({
        items,
        fields,
        loading
      });
    }
  }, [items, fields, loading, onDataChange]);


  // Build related options for select fields (foreign keys)
  const relatedOptions = {};
  if (fields && fields.list) {
    fields.list.forEach(field => {
      if (field.ref && allItems[field.ref]) {
        relatedOptions[field.ref] = allItems[field.ref].map(opt => ({ id: opt.id, name: opt.name }));
      }
    });
  }

  const openAdd = () => {
    setEditId(null);
    setForm({});
    setShowForm(true);
  };
  const openEdit = (item) => {
    setEditId(item.id);
    setForm(item);
    setShowForm(true);
  };
  const closeForm = () => setShowForm(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  // CRUD API integration
  const refresh = async () => {
    // re-fetch all data for current master and related
    const keys = Object.keys(masterFields);
    const results = {};
    for (const key of keys) {
      const endpoint = apiMap[key];
      if (!endpoint) continue;
      let params = {};
      if (key === masterKey) {
        params = { page, order_by: '-id' };
        if (searchValue) params.search = searchValue;
      }
      try {
        const res = await api.get(`/master/${endpoint}/`, { params });
        if (key === masterKey && res.data && (res.data.results !== undefined || res.data.next !== undefined || res.data.previous !== undefined)) {
          results[key] = Array.isArray(res.data.results) ? res.data.results : [];
          setHasNext(!!res.data.next);
          setHasPrev(!!res.data.previous);
          setTotalPages(res.data.count ? Math.ceil(res.data.count / PAGE_SIZE) : 1);
        } else {
          results[key] = Array.isArray(res.data.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        }
      } catch (e) {
        results[key] = [];
      }
    }
    setAllItems(results);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = apiMap[masterKey];
    if (!endpoint) return;
    try {
      if (editId) {
        await api.post(`/master/${endpoint}/`, { ...form, id: editId });
        toast({ title: `${fields.title} updated successfully!` });
      } else {
        await api.post(`/master/${endpoint}/`, form);
        toast({ title: `${fields.title} added successfully!` });
      }
      await refresh();
      closeForm();
    } catch (err) {
      console.error('API Error:', err);
      toast({ 
        title: `Error saving ${fields.title.toLowerCase()}!`, 
        description: err.response?.data?.message || 'Please try again',
        variant: 'destructive' 
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${fields.title}?`)) return;
    const endpoint = apiMap[masterKey];
    if (!endpoint) return;
    try {
      await api.post(`/master/${endpoint}/`, { id, delete: true });
      toast({ title: `${fields.title} deleted successfully!` });
      await refresh();
    } catch (err) {
      console.error('Delete Error:', err);
      toast({ 
        title: `Error deleting ${fields.title.toLowerCase()}!`, 
        description: err.response?.data?.message || 'Please try again',
        variant: 'destructive' 
      });
    }
  };

  if (!fields) return <div className="text-center text-red-500">Master not configured.</div>;
  if (loading) return <div className="text-center text-blue-500">Loading...</div>;

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-900">{fields.title} Master</h2>
        <div className="flex gap-2 items-center">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={openAdd}>
            Add {fields.title}
          </Button>
        </div>
      </div>
      <div className="w-full">
        <MasterTable
          items={items}
          fields={{ ...fields, relatedOptions }}
          onEdit={openEdit}
          onDelete={handleDelete}
          allItems={allItems}
        />
        <Pagination page={page} setPage={setPage} hasNext={hasNext} hasPrev={hasPrev} totalPages={totalPages} />
      </div>
      <MasterModal
        open={showForm}
        onOpenChange={(open) => {
          if (!open) {
            closeForm();
          }
        }}
        onSubmit={handleSubmit}
        onChange={handleChange}
        form={form}
        fields={{ ...fields, relatedOptions }}
        editId={editId}
        onCancel={closeForm}
      />
    </div>
  );
};

export default GenericMaster;
