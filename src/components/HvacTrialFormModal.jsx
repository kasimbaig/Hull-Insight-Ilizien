import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const AirFlowTable = ({ rows, setRows, compartments }) => {
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
  const addRow = () => setRows([...rows, { ...emptyRow }]);
  const removeRow = idx => setRows(rows.filter((_, i) => i !== idx));
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
                <td className="p-1"><Button variant="destructive" type="button" size="sm" onClick={() => removeRow(idx)}>Remove</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <Button size="sm" type="button" onClick={addRow}>Add Row</Button>
    </div>
  );
};

const MachineryAirFlowTable = ({ rows, setRows, compartments }) => {
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
  const addRow = () => setRows([...rows, { ...emptyRow }]);
  const removeRow = idx => setRows(rows.filter((_, i) => i !== idx));
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
                <td className="p-1"><Button variant="destructive" type="button" size="sm" onClick={() => removeRow(idx)}>Remove</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    <Button size="sm" type="button" onClick={addRow}>Add Row</Button>
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
    }
      onSuccess(trialRes.data); // Only close modal from parent after refresh
    } catch (err) {
      setError('Failed to save.');
    }
    setLoading(false);
  };
//improve toast and on update display fields inside the modals
  return (
    <Dialog open={open} onOpenChange={v => { if (!v) { setAirRows([]); setMachineryRows([]); } }}>
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
            <AirFlowTable rows={airRows} setRows={setAirRows} compartments={compartments} />
          </div>
          <div className="col-span-full">
            <MachineryAirFlowTable rows={machineryRows} setRows={setMachineryRows} compartments={compartments} />
          </div>
          {error && <div className="col-span-full text-red-500">{error}</div>}
          <div className="col-span-full flex justify-end space-x-2 mt-2">
            <DialogFooter className="flex flex-row gap-2">
              <Button type="button" variant="outline" onClick={() => { setAirRows([]); setMachineryRows([]); onClose(); }}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>{editId ? 'Update' : 'Add'}</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HvacTrialFormModal;
