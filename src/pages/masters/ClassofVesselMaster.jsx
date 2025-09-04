import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ClassofVesselMaster = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Aircraft Carrier' },
    { id: 2, name: 'Destroyer' },
    { id: 3, name: 'Frigate' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '' });

  const openAdd = () => {
    setEditId(null);
    setForm({ name: '' });
    setShowForm(true);
  };
  const openEdit = (item) => {
    setEditId(item.id);
    setForm({ name: item.name });
    setShowForm(true);
  };
  const closeForm = () => setShowForm(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setItems(items.map(u => u.id === editId ? { ...u, ...form } : u));
    } else {
      setItems([...items, { id: Date.now(), ...form }]);
    }
    closeForm();
  };

  const handleDelete = (id) => setItems(items.filter(u => u.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-900">Class of Vessel Master</h2>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={openAdd}>
          Add Class
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
            {items.map(item => (
              <tr key={item.id} className="border-b border-blue-100 hover:bg-blue-50">
                <td className="px-6 py-3 text-blue-900 text-base">{item.name}</td>
                <td className="px-6 py-3">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(item.id)}>
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
            <DialogTitle>{editId ? 'Edit Class' : 'Add Class'}</DialogTitle>
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

export default ClassofVesselMaster;
