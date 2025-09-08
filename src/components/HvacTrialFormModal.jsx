import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator, Trash2 } from "lucide-react";
import api from "@/lib/axios";

const PLACE_CHOICES = [
  'Mumbai',
  'Visakhapatnam',
  'Kochi',
  'Karwar',
  'Sri Vijayapuram',
  'Porbandar',
  'Okha',
];
const OCCASION_CHOICES = [
  { value: 'Pre-Refit', label: 'Pre-Refit Trials' },
  { value: 'End-Refit', label: 'End of Refit Trials' },
  { value: 'Surprise', label: 'Surprise Checks' },
  { value: 'Audit', label: 'HVAC Audit' },
];

// Modal for inputting multiple readings and calculating averages
const ReadingsModal = ({ open, onOpenChange, readings, onSave, compartment, numDucts, onDuctsChange, currentRowData }) => {
  const [localReadings, setLocalReadings] = useState([]);
  const [numReadings, setNumReadings] = useState(1);

  useEffect(() => {
    if (open) {
      // Reset state when modal opens
      setLocalReadings([]);
      setNumReadings(1);
      
      const existingReadings = readings || [];
      const ductCount = numDucts || 1;
      
      // If we have existing readings, use them
      if (existingReadings.length > 0) {
        setLocalReadings(existingReadings);
        setNumReadings(Math.max(1, existingReadings.length));
      } else {
        // Check if this row has calculated averages (not just empty values)
        const hasCalculatedValues = currentRowData && (
          (currentRowData.air_flow && currentRowData.air_flow !== '') ||
          (currentRowData.flow_rate_at_duct && currentRowData.flow_rate_at_duct !== '') ||
          (currentRowData.design_air_flow_rate && currentRowData.design_air_flow_rate !== '') ||
          (currentRowData.measured_air_flow_rate && currentRowData.measured_air_flow_rate !== '')
        );
        
        if (hasCalculatedValues) {
          // If we have calculated averages, reconstruct the readings that would produce those averages
          // Only fill the first few readings with existing values, leave new ones empty
          const newReadings = Array.from({ length: ductCount }, (_, index) => {
            // If we're within the range of existing values, use them
            if (index < (existingReadings.length || 0)) {
              return existingReadings[index] || {
                air_flow: currentRowData?.air_flow || '',
                flow_rate_at_duct: currentRowData?.flow_rate_at_duct || '',
                design_air_flow_rate: currentRowData?.design_air_flow_rate || '',
                measured_air_flow_rate: currentRowData?.measured_air_flow_rate || ''
              };
            } else {
              // For new ducts beyond existing ones, use current averages
              return {
                air_flow: currentRowData?.air_flow || '',
                flow_rate_at_duct: currentRowData?.flow_rate_at_duct || '',
                design_air_flow_rate: currentRowData?.design_air_flow_rate || '',
                measured_air_flow_rate: currentRowData?.measured_air_flow_rate || ''
              };
            }
          });
          setLocalReadings(newReadings);
          setNumReadings(ductCount);
        } else {
          // For new rows or rows without calculated values, start with empty readings
          const newReadings = Array.from({ length: ductCount }, () => ({
            air_flow: '',
            flow_rate_at_duct: '',
            design_air_flow_rate: '',
            measured_air_flow_rate: ''
          }));
          setLocalReadings(newReadings);
          setNumReadings(ductCount);
        }
      }
    } else {
      // Reset state when modal closes
      setLocalReadings([]);
      setNumReadings(1);
    }
  }, [open, readings, numDucts, currentRowData]);

  const handleReadingChange = (index, field, value) => {
    const newReadings = [...localReadings];
    if (!newReadings[index]) {
      newReadings[index] = { air_flow: '', flow_rate_at_duct: '', design_air_flow_rate: '', measured_air_flow_rate: '' };
    }
    newReadings[index][field] = value;
    setLocalReadings(newReadings);
  };

  const calculateAverages = () => {
    const validReadings = localReadings.filter(r => r && Object.values(r).some(val => val && !isNaN(parseFloat(val))));
    
    if (validReadings.length === 0) return null;

    const averages = {
      air_flow: 0,
      flow_rate_at_duct: 0,
      design_air_flow_rate: 0,
      measured_air_flow_rate: 0
    };

    Object.keys(averages).forEach(field => {
      const validValues = validReadings
        .map(r => parseFloat(r[field]))
        .filter(val => !isNaN(val));
      
      if (validValues.length > 0) {
        averages[field] = (validValues.reduce((sum, val) => sum + val, 0) / validValues.length).toFixed(2);
      }
    });

    return averages;
  };

  const handleSave = () => {
    const averages = calculateAverages();
    if (averages) {
      // Sync the number of ducts with parent row when saving
      if (onDuctsChange) {
        onDuctsChange(numReadings);
      }
      onSave(averages);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" aria-describedby="readings-modal-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculate Input Readings for {numReadings} number of ducts
          </DialogTitle>
          <p id="readings-modal-description" className="text-sm text-gray-600">
            Enter readings for each duct to calculate averages. Modify values and click "Apply Averages" to update the parent row.
          </p>
        </DialogHeader>
        
        <div className="space-y-4 overflow-y-auto flex-1 min-h-0">
          {readings && readings.length > 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                <strong>Updating existing readings:</strong> Modify the values below to recalculate averages. 
                Current averages will be updated when you click "Apply Averages".
              </p>
            </div>
          ) : currentRowData && (currentRowData.air_flow || currentRowData.flow_rate_at_duct || currentRowData.design_air_flow_rate || currentRowData.measured_air_flow_rate) ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-700">
                <strong>Reconstructing readings:</strong> The modal shows {numReadings} rows with the same values as your current averages. 
                Modify any values to recalculate new averages.
              </p>
            </div>
          ) : null}
          <div className="flex items-center space-x-4">
            <label className="font-medium">Number of Ducts:</label>
            <Input
              type="number"
              min="1"
              max="20"
              value={numReadings}
              onChange={(e) => {
                const newNum = parseInt(e.target.value) || 1;
                setNumReadings(newNum);
                // Don't sync with parent immediately - only when Apply Averages is clicked
                // Preserve existing readings when changing number of readings
                const newReadings = Array.from({ length: newNum }, (_, i) => 
                  localReadings[i] || { air_flow: '', flow_rate_at_duct: '', design_air_flow_rate: '', measured_air_flow_rate: '' }
                );
                setLocalReadings(newReadings);
              }}
              className="w-20"
            />
            <span className="text-sm text-gray-500">(Will sync with parent row when you click "Apply Averages")</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-2 border">Reading #</th>
                  <th className="p-2 border">Air Flow</th>
                  <th className="p-2 border">Flow Rate at Duct</th>
                  <th className="p-2 border">Design Air Flow Rate</th>
                  <th className="p-2 border">Measured Air Flow Rate</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: numReadings }, (_, i) => (
                  <tr key={i}>
                    <td className="p-2 border font-medium">{i + 1}</td>
                    <td className="p-2 border">
                      <Input
                        type="number"
                        value={localReadings[i]?.air_flow || ''}
                        onChange={(e) => handleReadingChange(i, 'air_flow', e.target.value)}
                        className="bg-blue-50 border-blue-200"
                      />
                    </td>
                    <td className="p-2 border">
                      <Input
                        type="number"
                        value={localReadings[i]?.flow_rate_at_duct || ''}
                        onChange={(e) => handleReadingChange(i, 'flow_rate_at_duct', e.target.value)}
                        className="bg-blue-50 border-blue-200"
                      />
                    </td>
                    <td className="p-2 border">
                      <Input
                        type="number"
                        value={localReadings[i]?.design_air_flow_rate || ''}
                        onChange={(e) => handleReadingChange(i, 'design_air_flow_rate', e.target.value)}
                        className="bg-blue-50 border-blue-200"
                      />
                    </td>
                    <td className="p-2 border">
                      <Input
                        type="number"
                        value={localReadings[i]?.measured_air_flow_rate || ''}
                        onChange={(e) => handleReadingChange(i, 'measured_air_flow_rate', e.target.value)}
                        className="bg-blue-50 border-blue-200"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Calculated Averages:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Air Flow: <span className="font-semibold">{calculateAverages()?.air_flow || '0.00'}</span></div>
              <div>Flow Rate at Duct: <span className="font-semibold">{calculateAverages()?.flow_rate_at_duct || '0.00'}</span></div>
              <div>Design Air Flow Rate: <span className="font-semibold">{calculateAverages()?.design_air_flow_rate || '0.00'}</span></div>
              <div>Measured Air Flow Rate: <span className="font-semibold">{calculateAverages()?.measured_air_flow_rate || '0.00'}</span></div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Apply Averages</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AirFlowTable = ({ rows, setRows, compartments, onRemove }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState(null);
  const [currentReadings, setCurrentReadings] = useState([]);

  const emptyRow = {
    compartment: '',
    no_of_ducts: '',
    duct_area: '',
    air_flow: '',
    flow_rate_at_duct: '',
    design_air_flow_rate: '',
    measured_air_flow_rate: '',
    served_by: '',
    observations: '',
    remarks: '',
  };

  const handleChange = (idx, e) => {
    const newRows = [...rows];
    newRows[idx][e.target.name] = e.target.value;
    setRows(newRows);
  };

  const handleCalculateAverage = (idx) => {
    setCurrentRowIndex(idx);
    // If readings exist, use them; otherwise start with empty readings
    const existingReadings = rows[idx].readings || [];
    setCurrentReadings(existingReadings);
    setModalOpen(true);
  };

  const handleDuctsChange = (newNumDucts) => {
    if (currentRowIndex !== null && rows && rows[currentRowIndex]) {
      const newRows = [...rows];
      if (newRows[currentRowIndex]) {
        newRows[currentRowIndex].no_of_ducts = newNumDucts.toString();
        setRows(newRows);
      }
    }
  };

  const handleSaveAverages = (averages) => {
    const newRows = [...rows];
    newRows[currentRowIndex] = {
      ...newRows[currentRowIndex],
      ...averages,
      readings: currentReadings
    };
    setRows(newRows);
  };

  const addRow = () => setRows([...rows, { ...emptyRow }]);
  const removeRow = idx => {
    setRows(rows.filter((_, i) => i !== idx));
    if(onRemove) onRemove(rows[idx]);
  };
  return (
    <div className="mb-6">
      <h2 className="font-bold mb-2">Air Flow Measurements</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border mb-2 text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="p-2">Compartment</th>
              <th className="p-2">No. of Ducts</th>
              <th className="p-2">Duct Area</th>
              <th className="p-2">Air Flow</th>
              <th className="p-2">Flow Rate at Duct</th>
              <th className="p-2">Design Air Flow Rate</th>
              <th className="p-2">Measured Air Flow Rate</th>
              <th className="p-2">Served By</th>
              <th className="p-2">Observations</th>
              <th className="p-2">Remarks</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="even:bg-blue-50">
                <td className="p-1">
                  <select name="compartment" value={row.compartment} onChange={e => handleChange(idx, e)} className="bg-blue-50 border-blue-200 rounded-md px-2 py-1">
                    <option value="">Select</option>
                    {compartments.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </td>
                <td className="p-1"><Input name="no_of_ducts" value={row.no_of_ducts} onChange={e => handleChange(idx, e)} className="bg-blue-50 border-blue-200" type="number" /></td>
                <td className="p-1"><Input name="duct_area" value={row.duct_area} onChange={e => handleChange(idx, e)} className="bg-blue-50 border-blue-200" type="number" /></td>
                <td className="p-1"><Input name="air_flow" value={row.air_flow} onChange={e => handleChange(idx, e)} className="bg-blue-50 border-blue-200" type="number" /></td>
                <td className="p-1"><Input name="flow_rate_at_duct" value={row.flow_rate_at_duct} onChange={e => handleChange(idx, e)} className="bg-blue-50 border-blue-200" type="number" /></td>
                <td className="p-1"><Input name="design_air_flow_rate" value={row.design_air_flow_rate} onChange={e => handleChange(idx, e)} className="bg-blue-50 border-blue-200" type="number" /></td>
                <td className="p-1"><Input name="measured_air_flow_rate" value={row.measured_air_flow_rate} onChange={e => handleChange(idx, e)} className="bg-blue-50 border-blue-200" type="number" /></td>
                <td className="p-1"><Input name="served_by" value={row.served_by} onChange={e => handleChange(idx, e)} className="bg-blue-50 border-blue-200" /></td>
                <td className="p-1"><Input name="observations" value={row.observations} onChange={e => handleChange(idx, e)} className="bg-blue-50 border-blue-200" /></td>
                <td className="p-1"><Input name="remarks" value={row.remarks} onChange={e => handleChange(idx, e)} className="bg-blue-50 border-blue-200" /></td>
                <td className="p-1">
                  <div className="flex space-x-1">
                    <Button 
                      variant="outline" 
                      type="button" 
                      size="sm" 
                      onClick={() => handleCalculateAverage(idx)}
                      className="p-2 h-8 w-8"
                      title="Calculate Average"
                    >
                      <Calculator className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      type="button" 
                      size="sm" 
                      onClick={() => removeRow(idx)}
                      className="p-2 h-8 w-8"
                      title="Remove Row"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <Button size="sm" type="button" onClick={addRow}>Add Row</Button>
      
      <ReadingsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        readings={currentReadings}
        onSave={handleSaveAverages}
        compartment={currentRowIndex !== null ? rows[currentRowIndex]?.compartment || 'Unknown' : ''}
        numDucts={currentRowIndex !== null ? parseInt(rows[currentRowIndex]?.no_of_ducts) || 1 : 1}
        onDuctsChange={handleDuctsChange}
        currentRowData={currentRowIndex !== null ? rows[currentRowIndex] : null}
      />
    </div>
  );
};

const MachineryAirFlowTable = ({ rows, setRows, compartments, onRemove }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState(null);
  const [currentReadings, setCurrentReadings] = useState([]);

  const emptyRow = {
    compartment: '',
    no_of_ducts: '',
    duct_area: '',
    air_flow: '',
    flow_rate_at_duct: '',
    design_air_flow_rate: '',
    measured_air_flow_rate: '',
    served_by: '',
    observations: '',
    remarks: '',
  };

  const handleChange = (idx, e) => {
    const newRows = [...rows];
    newRows[idx][e.target.name] = e.target.value;
    setRows(newRows);
  };

  const handleCalculateAverage = (idx) => {
    setCurrentRowIndex(idx);
    // If readings exist, use them; otherwise start with empty readings
    const existingReadings = rows[idx].readings || [];
    setCurrentReadings(existingReadings);
    setModalOpen(true);
  };

  const handleDuctsChange = (newNumDucts) => {
    if (currentRowIndex !== null && rows && rows[currentRowIndex]) {
      const newRows = [...rows];
      if (newRows[currentRowIndex]) {
        newRows[currentRowIndex].no_of_ducts = newNumDucts.toString();
        setRows(newRows);
      }
    }
  };

  const handleSaveAverages = (averages) => {
    const newRows = [...rows];
    newRows[currentRowIndex] = {
      ...newRows[currentRowIndex],
      ...averages,
      readings: currentReadings
    };
    setRows(newRows);
  };

  const addRow = () => setRows([...rows, { ...emptyRow }]);
  const removeRow = idx => {
    setRows(rows.filter((_, i) => i !== idx));
    if(onRemove) onRemove(rows[idx]);
  };
  return (
    <div className="mb-6">
      <h2 className="font-bold mb-2">Machinery Air Flow Measurements</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border mb-2 text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="p-2">Compartment</th>
              <th className="p-2">No. of Ducts</th>
              <th className="p-2">Duct Area</th>
              <th className="p-2">Air Flow</th>
              <th className="p-2">Flow Rate at Duct</th>
              <th className="p-2">Design Air Flow Rate</th>
              <th className="p-2">Measured Air Flow Rate</th>
              <th className="p-2">Served By</th>
              <th className="p-2">Observations</th>
              <th className="p-2">Remarks</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="even:bg-blue-50">
                <td className="p-1">
                  <select name="compartment" value={row.compartment} onChange={e => handleChange(idx, e)} className="bg-blue-50 border-blue-200 rounded-md px-2 py-1">
                    <option value="">Select</option>
                    {compartments.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </td>
                <td className="p-1"><Input name="no_of_ducts" value={row.no_of_ducts} onChange={e => handleChange(idx, e)} className="bg-blue-50 border-blue-200" type="number" /></td>
                <td className="p-1"><Input name="duct_area" value={row.duct_area} onChange={e => handleChange(idx, e)} className="bg-blue-50 border-blue-200" type="number" /></td>
                <td className="p-1"><Input name="air_flow" value={row.air_flow} onChange={e => handleChange(idx, e)} className="bg-blue-50 border-blue-200" type="number" /></td>
                <td className="p-1"><Input name="flow_rate_at_duct" value={row.flow_rate_at_duct} onChange={e => handleChange(idx, e)} className="bg-blue-50 border-blue-200" type="number" /></td>
                <td className="p-1"><Input name="design_air_flow_rate" value={row.design_air_flow_rate} onChange={e => handleChange(idx, e)} className="bg-blue-50 border-blue-200" type="number" /></td>
                <td className="p-1"><Input name="measured_air_flow_rate" value={row.measured_air_flow_rate} onChange={e => handleChange(idx, e)} className="bg-blue-50 border-blue-200" type="number" /></td>
                <td className="p-1"><Input name="served_by" value={row.served_by} onChange={e => handleChange(idx, e)} className="bg-blue-50 border-blue-200" /></td>
                <td className="p-1"><Input name="observations" value={row.observations} onChange={e => handleChange(idx, e)} className="bg-blue-50 border-blue-200" /></td>
                <td className="p-1"><Input name="remarks" value={row.remarks} onChange={e => handleChange(idx, e)} className="bg-blue-50 border-blue-200" /></td>
                <td className="p-1">
                  <div className="flex space-x-1">
                    <Button 
                      variant="outline" 
                      type="button" 
                      size="sm" 
                      onClick={() => handleCalculateAverage(idx)}
                      className="p-2 h-8 w-8"
                      title="Calculate Average"
                    >
                      <Calculator className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      type="button" 
                      size="sm" 
                      onClick={() => removeRow(idx)}
                      className="p-2 h-8 w-8"
                      title="Remove Row"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    <Button size="sm" type="button" onClick={addRow}>Add Row</Button>
    
    <ReadingsModal
      open={modalOpen}
      onOpenChange={setModalOpen}
      readings={currentReadings}
      onSave={handleSaveAverages}
      compartment={currentRowIndex !== null ? rows[currentRowIndex]?.compartment || 'Unknown' : ''}
      numDucts={currentRowIndex !== null ? parseInt(rows[currentRowIndex]?.no_of_ducts) || 1 : 1}
      onDuctsChange={handleDuctsChange}
    />
    </div>
  );
};

const HvacTrialFormModal = ({ open, onClose, onSuccess, editId }) => {
  const [form, setForm] = useState({
    ship: '',
    date_of_trials: '',
    place_of_trials: '',
    document_no: '',
    occasion_of_trials: '',
    authority_for_trials: '',
  });
  const [vessels, setVessels] = useState([]);
  const [compartments, setCompartments] = useState([]);
  const [airRows, setAirRows] = useState([]);
  const [machineryRows, setMachineryRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletedAirRows, setDeletedAirRows] = useState([]);
  const [deletedMachineryRows, setDeletedMachineryRows] = useState([]);

  useEffect(() => {
    api.get('/master/vessels/')
      .then(res => setVessels(res.data.data))
      .catch(() => setVessels([]));
    api.get('/master/compartments/')
      .then(res => setCompartments(res.data.data))
      .catch(() => setCompartments([]));
  }, []);

  useEffect(() => {
    if (editId) {
      setLoading(true);
      api.get(`/shipmodule/trials/${editId}/`)
        .then(res => {
            res = res.data;
          setForm({
            ship: res.data.ship,
            date_of_trials: res.data.date_of_trials,
            place_of_trials: res.data.place_of_trials,
            document_no: res.data.document_no,
            occasion_of_trials: res.data.occasion_of_trials,
            authority_for_trials: res.data.authority_for_trials,
          });
        })
        .catch(() => setError('Failed to fetch trial'));
      api.get(`/shipmodule/ac-measurements/?hvac_trial=${editId}`)
        .then(res => setAirRows(res.data.data))
        .catch(() => setAirRows([]));
      api.get(`/shipmodule/machinery-measurements/?hvac_trial=${editId}`)
        .then(res => setMachineryRows(res.data.data))
        .catch(() => setMachineryRows([]));
      setLoading(false);
    } else {
      setForm({
        ship: '',
        date_of_trials: '',
        place_of_trials: '',
        document_no: '',
        occasion_of_trials: '',
        authority_for_trials: '',
      });
      setAirRows([]);
      setMachineryRows([]);
    }
  }, [editId, open]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let trialRes;
      if (editId) {
        trialRes = await api.put(`/shipmodule/trials/${editId}/`, form);

      } else {
        trialRes = await api.post('/shipmodule/trials/', form);
      }
      if(!editId){
        const trialId = trialRes.data.id;
        // Post AirFlowMeasurement rows
        for (const row of airRows) {
            if (row.compartment) {
            await api.post('/shipmodule/ac-measurements/', { ...row, hvac_trial: trialId });
            }
        }
        // Post MachineryAirFlowMeasurement rows
        for (const row of machineryRows) {
            if (row.compartment) {
            await api.post('/shipmodule/machinery-measurements/', { ...row, hvac_trial: trialId });
            }
        }
    }
    else{
        const trialId = editId;
        // Update AirFlowMeasurement rows
        for (const row of airRows) {
            if (row.id) {
                await api.put(`/shipmodule/ac-measurements/${row.id}/`, row);
            } else {
                await api.post('/shipmodule/ac-measurements/', { ...row, hvac_trial: trialId });
            }
        }
        for (const row of machineryRows) {
            if (row.id) {
                await api.put(`/shipmodule/machinery-measurements/${row.id}/`, row);
            } else {
                await api.post('/shipmodule/machinery-measurements/', { ...row, hvac_trial: trialId });
            }
        }
        // Delete removed AirFlowMeasurement rows
        for (const row of deletedAirRows) {
            if (row.id) {
                await api.delete(`/shipmodule/ac-measurements/${row.id}/`);
            }
        }
        // Delete removed MachineryAirFlowMeasurement rows
        for (const row of deletedMachineryRows) {
            if (row.id) {
                await api.delete(`/shipmodule/machinery-measurements/${row.id}/`);
            }
        }
    }
      onSuccess(trialRes.data); // Only close modal from parent after refresh
    } catch (err) {
      setError('Failed to save.');
    }
    setLoading(false);
  };
//improve toast and on update display fields inside the modals
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-[1400px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editId ? 'Edit HVAC Trial' : 'Add HVAC Trial'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
          <div className="flex flex-col px-1 min-w-0">
            <label className="block text-blue-900 font-medium mb-1 truncate">Vessel</label>
            <select name="ship" value={form.ship} onChange={handleChange} required className="bg-blue-50 border-blue-200 rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
              <option value="">Select Vessel</option>
              {vessels.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col px-1 min-w-0">
            <label className="block text-blue-900 font-medium mb-1 truncate">Date of Trials</label>
            <Input type="date" name="date_of_trials" value={form.date_of_trials} onChange={handleChange} required className="bg-blue-50 border-blue-200" />
          </div>
          <div className="flex flex-col px-1 min-w-0">
            <label className="block text-blue-900 font-medium mb-1 truncate">Place of Trials</label>
            <select name="place_of_trials" value={form.place_of_trials} onChange={handleChange} required className="bg-blue-50 border-blue-200 rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
              <option value="">Select Place</option>
              {PLACE_CHOICES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col px-1 min-w-0">
            <label className="block text-blue-900 font-medium mb-1 truncate">Document No</label>
            <Input type="text" name="document_no" value={form.document_no} onChange={handleChange} required className="bg-blue-50 border-blue-200" />
          </div>
          <div className="flex flex-col px-1 min-w-0">
            <label className="block text-blue-900 font-medium mb-1 truncate">Occasion of Trials</label>
            <select name="occasion_of_trials" value={form.occasion_of_trials} onChange={handleChange} required className="bg-blue-50 border-blue-200 rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
              <option value="">Select Occasion</option>
              {OCCASION_CHOICES.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col px-1 min-w-0">
            <label className="block text-blue-900 font-medium mb-1 truncate">Authority for Trials</label>
            <Input type="text" name="authority_for_trials" value={form.authority_for_trials} onChange={handleChange} required className="bg-blue-50 border-blue-200" />
          </div>
          <div className="col-span-full">
            <AirFlowTable rows={airRows} setRows={setAirRows} compartments={compartments} onRemove={removedRow => setDeletedAirRows([...deletedAirRows, removedRow])} />
          </div>
          <div className="col-span-full">
            <MachineryAirFlowTable rows={machineryRows} setRows={setMachineryRows} compartments={compartments} onRemove={removedRow => setDeletedMachineryRows([...deletedMachineryRows, removedRow])} />
          </div>
          {error && <div className="col-span-full text-red-500">{error}</div>}
          <div className="col-span-full flex justify-end space-x-2 mt-2">
            <DialogFooter className="flex flex-row gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>{editId ? 'Update' : 'Add'}</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HvacTrialFormModal;
