import React from 'react';
import { Button } from '@/components/ui/button';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';


const getDisplayValue = (item, field, fields) => {
    const value = item[field.key];
    // For select with options (choices)
    if (field.type === 'select' && field.options) {
        const opt = field.options.find(o => o.value === value);
        return opt ? opt.label : value;
    }
    // For select with ref (foreign key)
    if (field.type === 'select' && field.ref && fields.relatedOptions && fields.relatedOptions[field.ref]) {
        // If value is an object (nested), use .id or .name
        if (value && typeof value === 'object') {
            return value.name || value.id || '';
        }
        const opt = fields.relatedOptions[field.ref].find(o => String(o.id) === String(value));
        return opt ? opt.name : value;
    }
    // For checkbox
    if (field.type === 'checkbox') {
        return value ? 'Yes' : 'No';
    }
    // If value is an object (nested), use .name or .id
    if (value && typeof value === 'object') {
        return value.name || value.id || '';
    }
    return value;
};

const MasterTable = ({ items, fields, onEdit, onDelete }) => (
    <div className="overflow-x-auto w-full">
        <table className="w-full table-fixed bg-white border border-blue-200 rounded-lg">
            <thead>
                <tr className="bg-blue-100 text-blue-900">
                    {fields.list.map(field => (
                        <th key={field.key} className="px-6 py-3 text-left text-base font-semibold">{field.label}</th>
                    ))}
                    <th className="px-6 py-3 text-left text-base font-semibold">Actions</th>
                </tr>
            </thead>
            <tbody>
                {items.map(item => (
                    <tr key={item.id} className="border-b border-blue-100 hover:bg-blue-50">
                        {fields.list.map(field => (
                            <td key={field.key} className="px-6 py-3 text-blue-900 text-base">{getDisplayValue(item, field, fields)}</td>
                        ))}
                        <td className="px-6 py-3">
                            <Button variant="ghost" size="icon" onClick={() => onEdit(item)} title="Edit">
                                <PencilSquareIcon className="h-5 w-5 text-blue-700" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-600" onClick={() => onDelete(item.id)} title="Delete">
                                <TrashIcon className="h-5 w-5" />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default MasterTable;
