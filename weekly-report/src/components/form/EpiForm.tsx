import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  setEpiKey,
  addEpiData,
  updateEpiData,
  removeEpiData,
  updateChartData,
} from '../../features/weekly/weeklySlice';
import { MdClose } from 'react-icons/md';

const EpiForm = () => {
  const dispatch = useDispatch();
  const epi = useSelector((state: RootState) => state.epi);
  const chartData = useSelector((state: RootState) => state.chart.chartData);

  const handleEpiKeyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setEpiKey(event.target.value as 'Recommendations' | 'Notes' | 'Summary'));
  };

  const handleEpiChange = (index: number, value: string) => {
    dispatch(updateEpiData({ index, text: value }));
  };

  const handleAddEpi = () => {
    dispatch(addEpiData(''));
  };

  const handleRemoveEpi = (index: number) => {
    dispatch(removeEpiData(index));
  };

  const handleInputChange = (index: number, field: "label" | "dataPoint", value: string) => {
    dispatch(updateChartData({
      index,
      label: field === "label" ? value : chartData[index].label,
      dataPoint: field === "dataPoint" ? parseFloat(value) : chartData[index].dataPoint,
    }));
  };

  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <h3 className="text-lg font-semibold mb-4">Endpoint Inventory Form</h3>
      <div className="mb-4">
        <label htmlFor="epi-key" className="block text-sm font-medium text-gray-700 mb-2">Recommendations/Notes/Summary</label>
        <select
          id="epi-key"
          value={epi.key}
          onChange={handleEpiKeyChange}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="Recommendations">Recommendations</option>
          <option value="Notes">Notes</option>
          <option value="Summary">Summary</option>
        </select>
      </div>
      {epi.key && (
        <div className="mb-4">
          <h4 className="text-md font-medium text-gray-800 mb-2">{epi.key}</h4>
          <p className="text-sm text-gray-600">Here you can add {epi.key.toLowerCase()}.</p>
        </div>
      )}
      {Array.isArray(epi.data[epi.key]) && epi.data[epi.key].map((item, index) => (
        <div key={index} className="flex items-center mb-4">
          <textarea
            value={item}
            onChange={(e) => handleEpiChange(index, e.target.value)}
            rows={3}
            className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mr-2"
          />
          <button
            onClick={() => handleRemoveEpi(index)}
            className="flex items-center justify-center p-2 bg-[#0d9488] text-white rounded-md focus:outline-none"
          >
            <MdClose size={20} />
          </button>
        </div>
      ))}
      <button
        onClick={handleAddEpi}
        className="w-full px-4 py-2 bg-[#2f3848] text-white rounded-md focus:outline-none"
      >
        Add
      </button>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Endpoint Inventory Chart Data</h3>
        {chartData.map((data, index) => (
          <div key={index} className="grid grid-cols-2 gap-2 items-center mt-3">
            <div>
              <label htmlFor={`label${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                Label {index + 1}
              </label>
              <input
                id={`label${index}`}
                value={data.label}
                onChange={(e) => handleInputChange(index, "label", e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor={`dataPoint${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                Data Point {index + 1}
              </label>
              <input
                type='number'
                id={`dataPoint${index}`}
                value={data.dataPoint.toString()}
                onChange={(e) => handleInputChange(index, "dataPoint", e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EpiForm;
