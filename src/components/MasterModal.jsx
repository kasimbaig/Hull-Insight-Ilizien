import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


const getModalWidth = (fieldCount) => {
  if (fieldCount > 10) return 'max-w-4xl';
  if (fieldCount > 6) return 'max-w-2xl';
  if (fieldCount > 3) return 'max-w-xl';
  return 'max-w-lg';
};

const MasterModal = ({ open, onOpenChange, onSubmit, onChange, form, fields, editId, onCancel, children }) => {
  const fieldCount = fields.list.length;
  const modalWidth = getModalWidth(fieldCount);
  const useGrid = fieldCount > 3;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`w-[80vw] max-w-[1400px] max-h-[90vh] overflow-y-auto`}
        style={{ minWidth: 400 }}
      >
        <DialogHeader>
          <DialogTitle>{editId ? 'Edit' : 'Add'} {fields.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}
          className={useGrid
            ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
            : 'flex flex-col space-y-4'}
          style={{ maxHeight: '65vh', overflowY: 'auto' }}
        >
          {fields.list.map(field => (
            <div key={field.key} className="flex flex-col px-1 min-w-0">
              <label className="block text-blue-900 font-medium mb-1 truncate">{field.label}</label>
              {field.type === 'select' && field.options ? (
                <select
                  name={field.key}
                  value={form[field.key] || ''}
                  onChange={onChange}
                  required={field.required}
                  className="bg-blue-50 border-blue-200 rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : field.type === 'select' && field.ref ? (
                <select
                  name={field.key}
                  value={form[field.key] || ''}
                  onChange={onChange}
                  required={field.required}
                  className="bg-blue-50 border-blue-200 rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                >
                  <option value="">Select {field.label}</option>
                  {/* Dynamically render options from related master */}
                  {Array.isArray(fields.relatedOptions?.[field.ref]) && fields.relatedOptions[field.ref].map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  name={field.key}
                  checked={!!form[field.key]}
                  onChange={e => onChange({ target: { name: field.key, value: e.target.checked } })}
                  className="h-5 w-5 text-blue-600 border-blue-200 rounded focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <Input
                  name={field.key}
                  value={form[field.key] || ''}
                  onChange={onChange}
                  required={field.required}
                  className="bg-blue-50 border-blue-200"
                  type={field.type || 'text'}
                />
              )}
            </div>
          ))}
          
          {/* Render children content */}
          {children}
          
          <div className={useGrid ? 'col-span-full flex justify-end space-x-2 mt-2' : ''}>
            <DialogFooter className="flex flex-row gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">{editId ? 'Update' : 'Add'}</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MasterModal;
