import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const UnitMaster = () => {
  const [units, setUnits] = useState([
    { id: 1, name: 'Western Naval Command' },
    { id: 2, name: 'Eastern Naval Command' },
    { id: 3, name: 'Southern Naval Command' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '' });

  const openAdd = () => {
    setEditId(null);
    setForm({ name: '' });
    setShowForm(true);
  };
  const openEdit = (unit) => {
    setEditId(unit.id);
    setForm({ name: unit.name });
    setShowForm(true);
  };
  const closeForm = () => setShowForm(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setUnits(units.map(u => u.id === editId ? { ...u, ...form } : u));
    } else {
      setUnits([...units, { id: Date.now(), ...form }]);
    }
    closeForm();
  };

  const handleDelete = (id) => setUnits(units.filter(u => u.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-900">Unit Master</h2>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={openAdd}>
          Add Unit
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-blue-200 rounded-lg">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-6 py-3 text-left text-base font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-base font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {units.map(unit => (
              <tr key={unit.id} className="border-b border-blue-100 hover:bg-blue-50">
                <td className="px-6 py-3 text-blue-900 text-base">{unit.name}</td>
                <td className="px-6 py-3">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(unit)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(unit.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Unit' : 'Add Unit'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-blue-900 font-medium mb-1">Name</label>
              <Input name="name" value={form.name} onChange={handleChange} required className="bg-blue-50 border-blue-200" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">{editId ? 'Update' : 'Add'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnitMaster;
