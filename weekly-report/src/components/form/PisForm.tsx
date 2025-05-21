import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updatePendingIncidentSummaryData } from '../../features/weekly/weeklySlice';
import { MdClose } from 'react-icons/md';
import RecommendationInput from './RecommendationInput';

const PisForm = () => {
  const dispatch = useDispatch();
  const pendingIncidentSummary = useSelector((state: RootState) => state.pendingIncidentSummary);
  const pIncidentRecommendations = useSelector((s: RootState) => s.recommendation.pIncident);
  const client = useSelector((state: RootState) => state.client);

  const handlePendingIncidentChange = (field: 'totalPendingIncidents' | 'customerPendingIncidents' | 'socTeamPendingIncidents', value: string) => {
    let updatedData = { ...pendingIncidentSummary };
    updatedData[field] = Number(value);
    dispatch(updatePendingIncidentSummaryData([updatedData.totalPendingIncidents, updatedData.customerPendingIncidents, updatedData.socTeamPendingIncidents]));
  };

  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <h3 className="text-lg font-semibold mb-4">Pending Incidents Summary Form</h3>
      <div className="mb-4">
        <RecommendationInput entity="pIncident" values={pIncidentRecommendations} />
      </div>
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
              Pending Incidents from {client.tenantCode}
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
