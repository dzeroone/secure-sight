import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  updateChartData,
} from '../../features/weekly/weeklySlice';
import { MdClose } from 'react-icons/md';
import RecommendationInput from './RecommendationInput';

const EpiForm = () => {
  const dispatch = useDispatch();
  const chartData = useSelector((state: RootState) => state.chart.chartData);
  const eInventoryRecommendations = useSelector((s: RootState) => s.recommendation.eInventory);

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
        <RecommendationInput entity="eInventory" values={eInventoryRecommendations} />
      </div>

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
