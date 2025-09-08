import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const DockingPlanForm = ({ onSubmit, onCancel, editData = null }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    vessel: '',
    dockingPurpose: '',
    dockingVersion: '',
    entryDirection: '',
    
    // Vessel Dimensions
    length: '',
    beam: '',
    draught: '',
    
    // Stability Parameters
    list: '',
    trim: '',
    metacentricHeight: '',
    weightChanges: '',
    
    // Authorities
    refittingAuthority: '',
    commandHq: ''
  });

  // Dropdown options
  const vesselOptions = [
    { value: 'INS_Vikrant', label: 'INS Vikrant' },
    { value: 'INS_Vikramaditya', label: 'INS Vikramaditya' },
    { value: 'INS_Viraat', label: 'INS Viraat' },
    { value: 'INS_Delhi', label: 'INS Delhi' },
    { value: 'INS_Mumbai', label: 'INS Mumbai' },
    { value: 'INS_Kolkata', label: 'INS Kolkata' },
    { value: 'INS_Chennai', label: 'INS Chennai' },
    { value: 'INS_Kochi', label: 'INS Kochi' },
    { value: 'INS_Visakhapatnam', label: 'INS Visakhapatnam' },
    { value: 'INS_Imphal', label: 'INS Imphal' }
  ];

  const dockingPurposeOptions = [
    { value: 'Routine_Maintenance', label: 'Routine Maintenance' },
    { value: 'Major_Refit', label: 'Major Refit' },
    { value: 'Emergency_Repair', label: 'Emergency Repair' },
    { value: 'Upgrade_Modification', label: 'Upgrade/Modification' },
    { value: 'Inspection', label: 'Inspection' },
    { value: 'Dry_Docking', label: 'Dry Docking' },
    { value: 'Hull_Cleaning', label: 'Hull Cleaning' },
    { value: 'Propeller_Service', label: 'Propeller Service' }
  ];

  const entryDirectionOptions = [
    { value: 'Bow_First', label: 'Bow First' },
    { value: 'Stern_First', label: 'Stern First' },
    { value: 'Port_Side', label: 'Port Side' },
    { value: 'Starboard_Side', label: 'Starboard Side' }
  ];

  const refittingAuthorityOptions = [
    { value: 'Cochin_Shipyard', label: 'Cochin Shipyard Limited' },
    { value: 'Mazagon_Dock', label: 'Mazagon Dock Shipbuilders Limited' },
    { value: 'Garden_Reach', label: 'Garden Reach Shipbuilders & Engineers' },
    { value: 'Hindustan_Shipyard', label: 'Hindustan Shipyard Limited' },
    { value: 'Larsen_Toubro', label: 'Larsen & Toubro Shipbuilding' },
    { value: 'Reliance_Naval', label: 'Reliance Naval & Engineering' },
    { value: 'Bharati_Shipyard', label: 'Bharati Shipyard Limited' }
  ];

  const commandHqOptions = [
    { value: 'Eastern_Naval_Command', label: 'Eastern Naval Command' },
    { value: 'Western_Naval_Command', label: 'Western Naval Command' },
    { value: 'Southern_Naval_Command', label: 'Southern Naval Command' },
    { value: 'Northern_Naval_Command', label: 'Northern Naval Command' },
    { value: 'Andaman_Nicobar_Command', label: 'Andaman & Nicobar Command' },
    { value: 'Strategic_Forces_Command', label: 'Strategic Forces Command' }
  ];

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-900">1. Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vessel">Vessel *</Label>
              <Select value={formData.vessel} onValueChange={(value) => handleInputChange('vessel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Vessel" />
                </SelectTrigger>
                <SelectContent>
                  {vesselOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dockingPurpose">Docking Purpose *</Label>
              <Select value={formData.dockingPurpose} onValueChange={(value) => handleInputChange('dockingPurpose', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Purpose" />
                </SelectTrigger>
                <SelectContent>
                  {dockingPurposeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dockingVersion">Docking Version *</Label>
              <Input
                id="dockingVersion"
                value={formData.dockingVersion}
                onChange={(e) => handleInputChange('dockingVersion', e.target.value)}
                placeholder="e.g., v2.1, Rev A"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entryDirection">Entry Direction *</Label>
              <Select value={formData.entryDirection} onValueChange={(value) => handleInputChange('entryDirection', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Entry Direction" />
                </SelectTrigger>
                <SelectContent>
                  {entryDirectionOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vessel Dimensions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-900">2. Vessel Dimensions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length">Length (m) *</Label>
              <Input
                id="length"
                type="number"
                step="0.1"
                value={formData.length}
                onChange={(e) => handleInputChange('length', e.target.value)}
                placeholder="e.g., 262.5"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="beam">Beam (m) *</Label>
              <Input
                id="beam"
                type="number"
                step="0.1"
                value={formData.beam}
                onChange={(e) => handleInputChange('beam', e.target.value)}
                placeholder="e.g., 60.0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="draught">Draught (m) *</Label>
              <Input
                id="draught"
                type="number"
                step="0.1"
                value={formData.draught}
                onChange={(e) => handleInputChange('draught', e.target.value)}
                placeholder="e.g., 8.4"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stability Parameters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-900">3. Stability Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="list">List (degrees)</Label>
              <Input
                id="list"
                type="number"
                step="0.1"
                value={formData.list}
                onChange={(e) => handleInputChange('list', e.target.value)}
                placeholder="e.g., 0.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trim">Trim (degrees)</Label>
              <Input
                id="trim"
                type="number"
                step="0.1"
                value={formData.trim}
                onChange={(e) => handleInputChange('trim', e.target.value)}
                placeholder="e.g., 1.2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metacentricHeight">Metacentric Height (m)</Label>
              <Input
                id="metacentricHeight"
                type="number"
                step="0.1"
                value={formData.metacentricHeight}
                onChange={(e) => handleInputChange('metacentricHeight', e.target.value)}
                placeholder="e.g., 2.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weightChanges">Weight Changes (tons)</Label>
              <Input
                id="weightChanges"
                type="number"
                step="0.1"
                value={formData.weightChanges}
                onChange={(e) => handleInputChange('weightChanges', e.target.value)}
                placeholder="e.g., 150.0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authorities Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-900">4. Authorities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="refittingAuthority">Refitting Authority *</Label>
              <Select value={formData.refittingAuthority} onValueChange={(value) => handleInputChange('refittingAuthority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Refitting Authority" />
                </SelectTrigger>
                <SelectContent>
                  {refittingAuthorityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commandHq">Command HQ *</Label>
              <Select value={formData.commandHq} onValueChange={(value) => handleInputChange('commandHq', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Command HQ" />
                </SelectTrigger>
                <SelectContent>
                  {commandHqOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          {editData ? 'Update Plan' : 'Create Plan'}
        </Button>
      </div>
    </form>
  );
};

export default DockingPlanForm;
