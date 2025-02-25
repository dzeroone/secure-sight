import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  setAlcKey,
  addAlcData,
  updateAlcData,
  removeAlcData,
  addEndpointData,
  editEndpointData,
  removeEndpointData,
  updateApexOneData,
  updateWorkloadSecurityData
} from '../../features/weekly/weeklySlice';
import { MdClose, MdEdit } from 'react-icons/md';

const AlcForm = () => {
  const dispatch = useDispatch();
  const alc = useSelector((state: RootState) => state.alc);
  const { endpointData } = useSelector((state: RootState) => state.endpoint);

  const handleAlcKeyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setAlcKey(event.target.value as 'Recommendations' | 'Notes' | 'Summary'));
  };

  const handleAlcChange = (index: number, value: string) => {
    dispatch(updateAlcData({ index, text: value }));
  };

  const handleAddAlc = () => {
    dispatch(addAlcData(''));
  };

  const handleRemoveAlc = (index: number) => {
    dispatch(removeAlcData(index));
  };

  const [endpointName, setEndpointName] = useState('');
  const [detectionsWithSeverity, setDetectionsWithSeverity] = useState('');
  const [actionTakenBySoc, setActionTakenBySoc] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAddOrEditEndpoint = () => {
    if (endpointName && detectionsWithSeverity) {
      if (editIndex !== null) {
        dispatch(editEndpointData({
          index: editIndex,
          updatedData: {
            endpointName,
            detectionsWithSeverity,
            actionTakenBySoc,
          },
        }));
        setEditIndex(null);
      } else {
        dispatch(addEndpointData({
          endpointName,
          detectionsWithSeverity,
          actionTakenBySoc,
        }));
      }
      setEndpointName('');
      setDetectionsWithSeverity('');
    }
  };

  const handleEditClick = (index: number) => {
    const endpoint = endpointData[index];
    setEndpointName(endpoint.endpointName);
    setDetectionsWithSeverity(endpoint.detectionsWithSeverity);
    setEditIndex(index);
  };

  const handleRemoveClick = (index: number) => {
    dispatch(removeEndpointData(index));
  };

  const apexOne = useSelector((state: RootState) => state.apexOne);
  const workloadSecurity = useSelector((state: RootState) => state.workloadSecurity);

  const handleApexOneChange = (field: 'latestVersion' | 'olderVersion' | 'endOfLife', value: string) => {
    let updatedData = { ...apexOne };
    updatedData[field] = Number(value);
    dispatch(updateApexOneData([updatedData.latestVersion, updatedData.olderVersion, updatedData.endOfLife]));
  };

  const handleWorkloadSecurityChange = (field: 'latestVersion' | 'olderVersion' | 'endOfLife', value: string) => {
    let updatedData = { ...workloadSecurity };
    updatedData[field] = Number(value);
    dispatch(updateWorkloadSecurityData([updatedData.latestVersion, updatedData.olderVersion, updatedData.endOfLife]));
  };

  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <h3 className="text-lg font-semibold mb-4">Agent Life Cycle Form</h3>
      <div className="mb-4">
        <label htmlFor="alc-key" className="block text-sm font-medium text-gray-700 mb-2">Recommendations/Notes/Summary</label>
        <select
          id="alc-key"
          value={alc.key}
          onChange={handleAlcKeyChange}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="Recommendations">Recommendations</option>
          <option value="Notes">Notes</option>
          <option value="Summary">Summary</option>
        </select>
      </div>
      {alc.key && (
        <div className="mb-4">
          <h4 className="text-md font-medium text-gray-800 mb-2">{alc.key}</h4>
          <p className="text-sm text-gray-600">Here you can add {alc.key.toLowerCase()}.</p>
        </div>
      )}
      {Array.isArray(alc.data[alc.key]) && alc.data[alc.key].map((item, index) => (
        <div key={index} className="flex items-center mb-4">
          <textarea
            value={item}
            onChange={(e) => handleAlcChange(index, e.target.value)}
            rows={3}
            className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mr-2"
          />
          <button
            onClick={() => handleRemoveAlc(index)}
            className="flex items-center justify-center p-2 bg-[#0d9488] text-white rounded-md focus:outline-none"
          >
            <MdClose size={20} />
          </button>
        </div>
      ))}
      <button
        onClick={handleAddAlc}
        className="w-full px-4 py-2 bg-[#2f3848] text-white rounded-md focus:outline-none"
      >
        Add
      </button>
      <div>
        <div className='my-4'>
          <h3 className="text-lg font-semibold mb-1">Apex One Chart</h3>
          <div className='flex flex-col gap-2'>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Latest Version
              </label>
              <input
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder='Latest Version'
                type="text"
                value={apexOne.latestVersion}
                onChange={(e) => handleApexOneChange('latestVersion', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Older Version
              </label>
              <input
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder='Older Version'
                type="text"
                value={apexOne.olderVersion}
                onChange={(e) => handleApexOneChange('olderVersion', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End of Life
              </label>
              <input
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder='End of Life'
                type="text"
                value={apexOne.endOfLife}
                onChange={(e) => handleApexOneChange('endOfLife', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Workload Security Chart Section */}
        <div className='my-4'>
          <h3 className="text-lg font-semibold mb-1">Workload Security Chart</h3>
          <div className='flex flex-col gap-2'>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Latest Version
              </label>
              <input
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder='Latest Version'
                type="text"
                value={workloadSecurity.latestVersion}
                onChange={(e) => handleWorkloadSecurityChange('latestVersion', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Older Version
              </label>
              <input
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder='Older Version'
                type="text"
                value={workloadSecurity.olderVersion}
                onChange={(e) => handleWorkloadSecurityChange('olderVersion', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End of Life
              </label>
              <input
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder='End of Life'
                type="text"
                value={workloadSecurity.endOfLife}
                onChange={(e) => handleWorkloadSecurityChange('endOfLife', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Endpoint Section */}
        <div className="my-4">
          <h3 className="text-lg font-semibold mb-1">Top 5 Endpoint with Highest Observed Attack Technique</h3>
          <div className="mt-2">
            {endpointData.map((endpoint, index) => (
              <div key={index} className="flex items-center mb-4">
                <div className="flex-1">
                  <p><strong>Endpoint:</strong> {endpoint.endpointName}</p>
                  <p><strong>Detections with Severity:</strong> {endpoint.detectionsWithSeverity}</p>
                  <p><strong>Action Taken by SOC:</strong> {endpoint.actionTakenBySoc}</p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleEditClick(index)}
                    className="p-2 bg-[#0d9488] text-white rounded-md focus:outline-none"
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleRemoveClick(index)}
                    className="ml-2 p-2 bg-[#ef4444] text-white rounded-md focus:outline-none"
                  >
                    <MdClose size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mb-4">
            <label htmlFor="endpoint-name" className="block text-sm font-medium text-gray-700 mb-2">
              Endpoint Name
            </label>
            <input
              id="endpoint-name"
              type="text"
              value={endpointName}
              onChange={(e) => setEndpointName(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter endpoint name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="detections-with-severity" className="block text-sm font-medium text-gray-700 mb-2">
              Detections with Severity
            </label>
            <input
              id="detections-with-severity"
              type="text"
              value={detectionsWithSeverity}
              onChange={(e) => setDetectionsWithSeverity(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter detections with severity"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="action-taken-by-soc" className="block text-sm font-medium text-gray-700 mb-2">
              Action Taken by SOC
            </label>
            <input
              id="action-taken-by-soc"
              type="text"
              value={actionTakenBySoc}
              onChange={(e) => setActionTakenBySoc(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter action taken by SOC"
            />
          </div>

          <button
            onClick={handleAddOrEditEndpoint}
            className="w-full px-4 py-2 bg-[#2f3848] text-white rounded-md focus:outline-none"
          >
            {editIndex !== null ? 'Update Endpoint' : 'Add Endpoint'}
          </button>
        </div>


      </div>
    </div>
  );
};

export default AlcForm;
