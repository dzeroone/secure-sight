import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setPisKey, addPisData, updatePisData, removePisData, updatePendingIncidentSummaryData } from '../../features/weekly/weeklySlice';
import { MdClose } from 'react-icons/md';

const PisForm = () => {
  const dispatch = useDispatch();
  const pis = useSelector((state: RootState) => state.pis);
  const pendingIncidentSummary = useSelector((state: RootState) => state.pendingIncidentSummary);

  const handlePisKeyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setPisKey(event.target.value as 'Recommendations' | 'Notes' | 'Summary'));
  };

  const handlePisChange = (index: number, value: string) => {
    dispatch(updatePisData({ index, text: value }));
  };

  const handleAddPis = () => {
    dispatch(addPisData(''));
  };

  const handleRemovePis = (index: number) => {
    dispatch(removePisData(index));
  };

  const handlePendingIncidentChange = (field: 'totalPendingIncidents' | 'customerPendingIncidents' | 'socTeamPendingIncidents', value: string) => {
    let updatedData = { ...pendingIncidentSummary };
    updatedData[field] = Number(value);
    dispatch(updatePendingIncidentSummaryData([updatedData.totalPendingIncidents, updatedData.customerPendingIncidents, updatedData.socTeamPendingIncidents]));
  };

  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <h3 className="text-lg font-semibold mb-4">Pending Incidents Summary Form</h3>
      <div className="mb-4">
        <label htmlFor="pis-key" className="block text-sm font-medium text-gray-700 mb-2">Recommendations/Notes/Summary</label>
        <select
          id="pis-key"
          value={pis.key}
          onChange={handlePisKeyChange}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="Recommendations">Recommendations</option>
          <option value="Notes">Notes</option>
          <option value="Summary">Summary</option>
        </select>
      </div>
      {pis.key && (
        <div className="mb-4">
          <h4 className="text-md font-medium text-gray-800 mb-2">{pis.key}</h4>
          <p className="text-sm text-gray-600">Here you can add {pis.key.toLowerCase()}.</p>
        </div>
      )}
      {Array.isArray(pis.data[pis.key]) && pis.data[pis.key].map((item, index) => (
        <div key={index} className="flex items-center mb-4">
          <textarea
            value={item}
            onChange={(e) => handlePisChange(index, e.target.value)}
            rows={3}
            className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mr-2"
          />
          <button
            onClick={() => handleRemovePis(index)}
            className="flex items-center justify-center p-2 bg-[#0d9488] text-white rounded-md focus:outline-none"
          >
            <MdClose size={20} />
          </button>
        </div>
      ))}
      <button
        onClick={handleAddPis}
        className="w-full px-4 py-2 bg-[#2f3848] text-white rounded-md focus:outline-none"
      >
        Add
      </button>
      <div className='my-4'>
        <h3 className="text-lg font-semibold mb-1">Pending Incident Summary</h3>
        <div className='flex flex-col gap-2'>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Pending Incidents
            </label>
            <input
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder='Total Pending Incidents'
              type="number"
              value={pendingIncidentSummary.totalPendingIncidents}
              onChange={(e) => handlePendingIncidentChange('totalPendingIncidents', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pending Incidents from Customer
            </label>
            <input
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder='Pending Incidents from Customer'
              type="number"
              value={pendingIncidentSummary.customerPendingIncidents}
              onChange={(e) => handlePendingIncidentChange('customerPendingIncidents', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pending Incidents from SOC Team
            </label>
            <input
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder='Pending Incidents from SOC Team'
              type="number"
              value={pendingIncidentSummary.socTeamPendingIncidents}
              onChange={(e) => handlePendingIncidentChange('socTeamPendingIncidents', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PisForm;
