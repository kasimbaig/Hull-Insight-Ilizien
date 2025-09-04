import React, { useState } from 'react';
import MasterModal from './MasterModal';
import MasterTable from './MasterTable';
import { Button } from '@/components/ui/button';

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

const initialData = {
  unit: [
    { id: 1, name: 'Western Naval Command' },
    { id: 2, name: 'Eastern Naval Command' },
    { id: 3, name: 'Southern Naval Command' },
  ],
  classofvessel: [
    { id: 1, name: 'Aircraft Carrier' },
    { id: 2, name: 'Destroyer' },
    { id: 3, name: 'Frigate' },
  ],
  vesseltype: [
    { id: 1, name: 'Capital Ship' },
    { id: 2, name: 'Patrol Boat' },
    { id: 3, name: 'Submarine' },
  ],
  dockyard: [
    { id: 1, name: 'Cochin Shipyard' },
    { id: 2, name: 'Mazagon Dock' },
    { id: 3, name: 'Sevmash Shipyard' },
  ],
  command: [
    { id: 1, name: 'Western Naval Command' },
    { id: 2, name: 'Eastern Naval Command' },
    { id: 3, name: 'Southern Naval Command' },
  ],
  severity: [
    { id: 1, name: 'Minor' },
    { id: 2, name: 'Moderate' },
    { id: 3, name: 'Severe' },
  ],
  vessel: [
    { id: 1, name: 'INS Vikrant', classofvessel: 1, vesseltype: 1, yard: 1, command: 1, year_of_build: 2013, year_of_delivery: 2022 },
    { id: 2, name: 'INS Kolkata', classofvessel: 2, vesseltype: 2, yard: 2, command: 2, year_of_build: 2006, year_of_delivery: 2014 },
    { id: 3, name: 'INS Chakra', classofvessel: 3, vesseltype: 3, yard: 3, command: 3, year_of_build: 2010, year_of_delivery: 2012 },
  ],
  module: [
    { id: 1, name: 'Propulsion' },
    { id: 2, name: 'Navigation' },
    { id: 3, name: 'Weapons' },
  ],
  submodule: [
    { id: 1, name: 'Engine Room', module: 1 },
    { id: 2, name: 'Bridge', module: 2 },
    { id: 3, name: 'Missile Bay', module: 3, parent: 2 },
  ],
  operationalstatus: [
    { id: 1, name: 'Active' },
    { id: 2, name: 'Maintenance' },
    { id: 3, name: 'Inactive' },
  ],
  hullcompartment: [
    { id: 1, name: 'Forepeak', remark: 'Front', ser: 'A1', numbers: '2', location: 'Bow', equipment: 'Anchor', features: 'Watertight', layout: 'Standard', special_requirements: 'None', standards: 'ISO' },
    { id: 2, name: 'Aftpeak', remark: 'Rear', ser: 'A2', numbers: '1', location: 'Stern', equipment: 'Winch', features: 'Watertight', layout: 'Standard', special_requirements: 'None', standards: 'ISO' },
  ],
  hullsystem: [
    { id: 1, name: 'Ballast System', remark: 'Main', ser: 'B1', numbers: '2', capabilities_feature: 'Stability', weight_volume_power_consumption: '500kg', location: 'Midship', interface: 'Manual', procurement_router: 'VendorA', vendor: 'VendorA', cost: '10000', standards: 'ISO', sustenance: '5 years', flag: 'A', sotr_type: 'Type1', sequence: 1 },
    { id: 2, name: 'Steering System', remark: 'Aux', ser: 'B2', numbers: '1', capabilities_feature: 'Direction', weight_volume_power_consumption: '200kg', location: 'Aft', interface: 'Auto', procurement_router: 'VendorB', vendor: 'VendorB', cost: '8000', standards: 'ISO', sustenance: '3 years', flag: 'B', sotr_type: 'Type2', sequence: 2 },
  ],
  hullequipment: [
    { id: 1, name: 'Anchor', weight_volume_power_consumption: '100kg', procurement_router: 'VendorA', remark: 'Heavy', vendor: 'VendorA', cost: '2000', sustenance: '10 years', ser: 'E1', numbers: '2', capabilities_feature: 'Hold', location: 'Bow', interface: 'Manual', standards: 'ISO', flag: 'A', sotr_type: 'Type1', equipment_type_name: 'Anchor' },
    { id: 2, name: 'Winch', weight_volume_power_consumption: '50kg', procurement_router: 'VendorB', remark: 'Light', vendor: 'VendorB', cost: '1000', sustenance: '8 years', ser: 'E2', numbers: '1', capabilities_feature: 'Pull', location: 'Stern', interface: 'Auto', standards: 'ISO', flag: 'B', sotr_type: 'Type2', equipment_type_name: 'Winch' },
  ],
  damagetype: [
    { id: 1, name: 'Corrosion' },
    { id: 2, name: 'Fracture' },
    { id: 3, name: 'Dent' },
  ],
  surveycycle: [
    { id: 1, name: 'Annual', cycle_unit: 'MONTHS', cycle_value: 12, description: 'Yearly survey', submodule: 1 },
    { id: 2, name: 'Special', cycle_unit: 'DAYS', cycle_value: 30, description: 'Special survey', submodule: 2 },
    { id: 3, name: 'Refit', cycle_unit: 'REFIT', cycle_value: null, description: 'Refit-to-Refit', submodule: 3 },
  ],
  dynamicfield: [
    { id: 1, sub_module: 1, label: 'Pressure', field_type: 'number', required: true, dropdown_options: '', data_source: '' },
    { id: 2, sub_module: 2, label: 'Material', field_type: 'dropdown', required: false, dropdown_options: 'Steel,Aluminum', data_source: '' },
    { id: 3, sub_module: 3, label: 'Inspection Date', field_type: 'date', required: false, dropdown_options: '', data_source: '' },
  ],
};


const GenericMaster = ({ masterKey }) => {
  const fields = masterFields[masterKey];
  // Store all master items in a state object keyed by masterKey
  const [allItems, setAllItems] = useState(() => ({ ...initialData }));
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});

  // Get items for the current master
  const items = allItems[masterKey] || [];

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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    let newItems;
    if (editId) {
      newItems = items.map(u => u.id === editId ? { ...u, ...form } : u);
    } else {
      newItems = [...items, { id: Date.now(), ...form }];
    }
    setAllItems(prev => ({ ...prev, [masterKey]: newItems }));
    closeForm();
  };

  const handleDelete = (id) => {
    const newItems = items.filter(u => u.id !== id);
    setAllItems(prev => ({ ...prev, [masterKey]: newItems }));
  };

  if (!fields) return <div className="text-center text-red-500">Master not configured.</div>;

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-900">{fields.title} Master</h2>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={openAdd}>
          Add {fields.title}
        </Button>
      </div>
      <div className="w-full">
        <MasterTable
          items={items}
          fields={{ ...fields, relatedOptions }}
          onEdit={openEdit}
          onDelete={handleDelete}
          allItems={allItems}
        />
      </div>
      <MasterModal
        open={showForm}
        onOpenChange={setShowForm}
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
