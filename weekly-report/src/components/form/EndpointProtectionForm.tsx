import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
    setEndPointProtectionKey,
    addEndPointProtectionData,
    updateEndPointProtectionData,
    removeEndPointProtectionData,
    setEndPointSensorKey,
    addEndPointSensorData,
    updateEndPointSensorData,
    removeEndPointSensorData
} from '../../features/weekly/weeklySlice';
import { MdClose } from 'react-icons/md';

const EndpointProtectionForm = () => {
    const dispatch = useDispatch();
    const endPointProtection = useSelector((state: RootState) => state.endPointProtection);
    const endPointSensor = useSelector((state: RootState) => state.endPointSensor);

    const handleEpKeyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setEndPointProtectionKey(event.target.value as 'Recommendations' | 'Notes' | 'Summary'));
    };

    const handleEpChange = (index: number, value: string) => {
        dispatch(updateEndPointProtectionData({ index, text: value }));
    };

    const handleAddEp = () => {
        dispatch(addEndPointProtectionData(''));
    };

    const handleRemoveEp = (index: number) => {
        dispatch(removeEndPointProtectionData(index));
    };

    // Endpoint Sensor Handlers
    const handleEsKeyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setEndPointSensorKey(event.target.value as 'Recommendations' | 'Notes' | 'Summary'));
    };

    const handleEsChange = (index: number, value: string) => {
        dispatch(updateEndPointSensorData({ index, text: value }));
    };

    const handleAddEs = () => {
        dispatch(addEndPointSensorData(''));
    };

    const handleRemoveEs = (index: number) => {
        dispatch(removeEndPointSensorData(index));
    };

    return (
        <div className="p-6 bg-white rounded-lg border shadow-md">
            <h3 className="text-lg font-semibold mb-4">Endpoint Protection: Agents Deployed</h3>
            <div className="mb-4">
                <label htmlFor="epi-key" className="block text-sm font-medium text-gray-700 mb-2">Recommendations/Notes/Summary</label>
                <select
                    id="epi-key"
                    value={endPointProtection.key}
                    onChange={handleEpKeyChange}
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="Recommendations">Recommendations</option>
                    <option value="Notes">Notes</option>
                    <option value="Summary">Summary</option>
                </select>
            </div>
            {endPointProtection.key && (
                <div className="mb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-2">{endPointProtection.key}</h4>
                    <p className="text-sm text-gray-600">Here you can add {endPointProtection.key.toLowerCase()}.</p>
                </div>
            )}
            {Array.isArray(endPointProtection.data[endPointProtection.key]) && endPointProtection.data[endPointProtection.key].map((item, index) => (
                <div key={index} className="flex items-center mb-4">
                    <textarea
                        value={item}
                        onChange={(e) => handleEpChange(index, e.target.value)}
                        rows={3}
                        className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mr-2"
                    />
                    <button
                        onClick={() => handleRemoveEp(index)}
                        className="flex items-center justify-center p-2 bg-[#0d9488] text-white rounded-md focus:outline-none"
                    >
                        <MdClose size={20} />
                    </button>
                </div>
            ))}
            <button
                onClick={handleAddEp}
                className="w-full px-4 py-2 bg-[#2f3848] text-white rounded-md focus:outline-none"
            >
                Add
            </button>

            {/* Endpoint Sensor Form */}
            <h3 className="text-lg font-semibold mt-8 mb-4">Endpoint Sensor: Agents Deployed</h3>
            <div className="mb-4">
                <label htmlFor="esi-key" className="block text-sm font-medium text-gray-700 mb-2">Recommendations/Notes/Summary</label>
                <select
                    id="esi-key"
                    value={endPointSensor.key}
                    onChange={handleEsKeyChange}
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="Recommendations">Recommendations</option>
                    <option value="Notes">Notes</option>
                    <option value="Summary">Summary</option>
                </select>
            </div>
            {endPointSensor.key && (
                <div className="mb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-2">{endPointSensor.key}</h4>
                    <p className="text-sm text-gray-600">Here you can add {endPointSensor.key.toLowerCase()}.</p>
                </div>
            )}
            {Array.isArray(endPointSensor.data[endPointSensor.key]) && endPointSensor.data[endPointSensor.key].map((item, index) => (
                <div key={index} className="flex items-center mb-4">
                    <textarea
                        value={item}
                        onChange={(e) => handleEsChange(index, e.target.value)}
                        rows={3}
                        className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mr-2"
                    />
                    <button
                        onClick={() => handleRemoveEs(index)}
                        className="flex items-center justify-center p-2 bg-[#0d9488] text-white rounded-md focus:outline-none"
                    >
                        <MdClose size={20} />
                    </button>
                </div>
            ))}
            <button
                onClick={handleAddEs}
                className="w-full px-4 py-2 bg-[#2f3848] text-white rounded-md focus:outline-none"
            >
                Add
            </button>
        </div>
    );
};

export default EndpointProtectionForm;
