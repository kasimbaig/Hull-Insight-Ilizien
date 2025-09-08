import React, { useState, useEffect } from 'react';
import MasterTable from '@/components/MasterTable';
import MasterModal from '@/components/MasterModal';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import api from '@/lib/axios';
import { MagnifyingGlassIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import Pagination from '@/components/ui/Pagination.jsx';
import { exportToCSV, formatDataForExport } from '@/utils/csvExport';

const QUARTER_DATES = [
  { value: '31-03', label: '31 March' },
  { value: '30-06', label: '30 June' },
  { value: '30-09', label: '30 September' },
  { value: '31-12', label: '31 December' },
];

const STATUS_OPTIONS = [
  { value: 'Open', label: 'Open' },
  { value: 'Closed', label: 'Closed' },
  { value: 'In Progress', label: 'In Progress' },
];

const initialSurvey = {
  quarter: '',
  date: '',
  ship: '',
  reporting_officer: '',
  status: '',
  defects: [],
};

const initialDefect = {
  description: '',
  status: '',
  markings: '',
  compartment: '',
  remarks: '',
};

const QuartelyHullSurvey = () => {
  const [surveys, setSurveys] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialSurvey);
  const [defects, setDefects] = useState([]);
  const [vessels, setVessels] = useState([]);
  const [compartments, setCompartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    api.get('/master/vessels/').then(res => setVessels(res.data.data || [])).catch(() => setVessels([]));
    api.get('/master/compartments/').then(res => setCompartments(res.data.data || [])).catch(() => setCompartments([]));
    // Static data for demo
    const allSurveys = [
      {
        id: 1,
        quarter: '31-03',
        date: '2025-03-31',
        ship: 1,
        reporting_officer: 'John Doe',
        status: 'Open',
        defects: [
          { description: 'Crack in hull', status: 'Open', markings: 'Red', compartment: 1, remarks: 'Needs urgent repair' },
        ],
      },
      {
        id: 2,
        quarter: '30-06',
        date: '2025-06-30',
        ship: 2,
        reporting_officer: 'Jane Smith',
        status: 'Closed',
        defects: [
          { description: 'Rust on deck', status: 'Closed', markings: 'Yellow', compartment: 2, remarks: 'Repaired successfully' },
          { description: 'Leak in engine room', status: 'In Progress', markings: 'Orange', compartment: 3, remarks: 'Under investigation' },
        ],
      },
      {
        id: 3,
        quarter: '30-09',
        date: '2025-09-30',
        ship: 3,
        reporting_officer: 'Mike Johnson',
        status: 'In Progress',
        defects: [
          { description: 'Paint peeling', status: 'Open', markings: 'Blue', compartment: 4, remarks: 'Scheduled for repainting' },
        ],
      },
    ];
    setTotalPages(Math.max(1, Math.ceil(allSurveys.length / 10)));
    setSurveys(allSurveys.slice((currentPage - 1) * 10, currentPage * 10));
  }, [currentPage]);

  const handleAdd = () => {
    setEditId(null);
    setForm(initialSurvey);
    setDefects([]);
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    setForm({ ...row, defects: row.defects || [] });
    setDefects([...(row.defects || [])]); // Create a copy of the defects array
    setModalOpen(true);
  };

  const handleDelete = (row) => {
    setSurveys(surveys.filter(s => s.id !== row.id));
  };

  const handleModalChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDefectChange = (idx, e) => {
    const newDefects = [...defects];
    newDefects[idx][e.target.name] = e.target.value;
    setDefects(newDefects);
  };

  const addDefectRow = () => setDefects([...defects, { ...initialDefect }]);
  const removeDefectRow = idx => setDefects(defects.filter((_, i) => i !== idx));

  const handleExportCSV = () => {
    const formattedData = formatDataForExport(surveys, 'quarterly-survey');
    exportToCSV(formattedData, 'quarterly-hull-survey');
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    const surveyData = { 
      ...form, 
      defects: [...defects] // Create a copy of the defects array
    };
    
    if (editId) {
      setSurveys(surveys.map(s => s.id === editId ? surveyData : s));
    } else {
      setSurveys([{ ...surveyData, id: Date.now() }, ...surveys]);
    }
    setModalOpen(false);
  };

  const surveyFields = {
    title: 'Quarterly Hull Survey',
    list: [
      { key: 'quarter', label: 'Quarter', type: 'select', options: QUARTER_DATES, required: true },
      { key: 'date', label: 'Date', type: 'date', required: true },
      { key: 'ship', label: 'Ship', type: 'select', ref: 'vessels', required: true },
      { key: 'reporting_officer', label: 'Reporting Officer', type: 'text', required: true },
      { key: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, required: true },
    ],
    relatedOptions: { vessels },
  };

  return (
    <div className="space-y-6 w-full">
      {/* Top Navbar with Gradient and Sticky Heading */}
      <nav className="w-full bg-gradient-to-r from-blue-200 via-blue-100 to-blue-300 border-b border-blue-300 sticky top-0 z-10 shadow">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-hull-primary">Quarterly Hull Survey</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
            <Button className="bg-hull-primary hover:bg-hull-primary-dark" size="sm" onClick={handleAdd}>Add New</Button>
          </div>
        </div>
      </nav>
      <Card className="bg-white/95 shadow-lg rounded-2xl w-full p-4">
      <CardHeader>
            <div className="flex justify-end items-center">
             
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={`Search HVAC...`}
                    className="pl-9 pr-4 py-2 w-64 border border-input rounded-lg bg-background focus:ring-2 focus:ring-hull-primary focus:border-hull-primary transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
        <CardContent>
          <MasterTable
            items={surveys}
            fields={{
              title: 'Quarterly Hull Survey',
              list: [
                { key: 'quarter', label: 'Quarter' },
                { key: 'date', label: 'Date' },
                { key: 'ship', label: 'Ship', ref: 'vessels' },
                { key: 'reporting_officer', label: 'Reporting Officer' },
                { key: 'status', label: 'Status' },
              ],
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
            allItems={{ vessels }}
          />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </CardContent>
      </Card>
      <MasterModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleModalSubmit}
        onChange={handleModalChange}
        form={form}
        fields={surveyFields}
        editId={editId}
        onCancel={() => setModalOpen(false)}
      >
        <div className="col-span-full mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Defects & Observations</h2>
            <Button size="sm" type="button" onClick={addDefectRow} className="bg-green-600 hover:bg-green-700">
              + Add Defect
            </Button>
          </div>
          
          {defects.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <p>No defects added yet. Click "Add Defect" to start.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-blue-50 border-b">
                  <tr>
                    <th className="p-3 text-left font-semibold text-gray-700">Description</th>
                    <th className="p-3 text-left font-semibold text-gray-700">Status</th>
                    <th className="p-3 text-left font-semibold text-gray-700">Markings</th>
                    <th className="p-3 text-left font-semibold text-gray-700">Compartment</th>
                    <th className="p-3 text-left font-semibold text-gray-700">Remarks</th>
                    <th className="p-3 text-center font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {defects.map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <input 
                          name="description" 
                          value={row.description} 
                          onChange={e => handleDefectChange(idx, e)} 
                          placeholder="Enter defect description"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                      </td>
                      <td className="p-2">
                        <select 
                          name="status" 
                          value={row.status} 
                          onChange={e => handleDefectChange(idx, e)} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Status</option>
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <input 
                          name="markings" 
                          value={row.markings} 
                          onChange={e => handleDefectChange(idx, e)} 
                          placeholder="Enter markings"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                      </td>
                      <td className="p-2">
                        <select 
                          name="compartment" 
                          value={row.compartment} 
                          onChange={e => handleDefectChange(idx, e)} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Compartment</option>
                          {compartments.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <input 
                          name="remarks" 
                          value={row.remarks} 
                          onChange={e => handleDefectChange(idx, e)} 
                          placeholder="Enter remarks"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                      </td>
                      <td className="p-2 text-center">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          type="button" 
                          onClick={() => removeDefectRow(idx)}
                          className="px-3 py-1"
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </MasterModal>
    </div>
  );
};

export default QuartelyHullSurvey;
