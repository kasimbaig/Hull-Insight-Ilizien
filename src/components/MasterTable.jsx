import React, { useState, useEffect } from 'react';
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

const cellClass = "px-3 py-1 text-blue-900 text-base align-top border-r border-blue-100 max-h-10 min-h-[32px] max-w-[180px] min-w-[120px] overflow-y-auto overflow-x-hidden whitespace-pre-line bg-white";

// z-20 by default, z-0 when dropdown is open
const headerClassBase = "px-3 py-1 text-left text-base font-semibold bg-blue-100 text-blue-900 sticky top-0 border-r border-blue-200 max-h-10 min-h-[32px] max-w-[180px] min-w-[120px] whitespace-nowrap";


const MasterTable = ({ items, fields, onEdit, onDelete }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        // Listen for custom events from Topbar dropdown
        const handleDropdownOpen = () => setDropdownOpen(true);
        const handleDropdownClose = () => setDropdownOpen(false);
        window.addEventListener('topbar-dropdown-open', handleDropdownOpen);
        window.addEventListener('topbar-dropdown-close', handleDropdownClose);
        return () => {
            window.removeEventListener('topbar-dropdown-open', handleDropdownOpen);
            window.removeEventListener('topbar-dropdown-close', handleDropdownClose);
        };
    }, []);

    const headerClass = `${headerClassBase} ${dropdownOpen ? 'z-0' : 'z-20'}`;

    return (
        <div className="overflow-x-auto w-full">
            <table className="bg-white border border-blue-200 rounded-lg" style={{ width: 'max-content', minWidth: '100%' }}>
                <thead className="bg-blue-100 sticky top-0">
                    <tr>
                        {fields.list.map(field => (
                            <th
                                key={field.key}
                                className={headerClass}
                                title={field.label}
                                style={{ maxWidth: 180 }}
                            >
                                {field.label}
                            </th>
                        ))}
                        <th className={headerClass} style={{ maxWidth: 120 }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id} className="border-b border-blue-100 hover:bg-blue-50">
                            {fields.list.map(field => {
                                const value = getDisplayValue(item, field, fields);
                                return (
                                    <td
                                        key={field.key}
                                        className={cellClass}
                                        title={typeof value === 'string' ? value : ''}
                                        style={{ maxWidth: 180 }}
                                    >
                                        {value}
                                    </td>
                                );
                            })}
                            <td className={cellClass} style={{ maxWidth: 120 }}>
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
};

export default MasterTable;
