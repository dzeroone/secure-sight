import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  setKfdKey,
  addKfdData,
  updateKfdData,
  removeKfdData,
  toggleKfdVisibility
} from '../../features/weekly/weeklySlice';
import { MdClose } from 'react-icons/md';

const KfdForm = () => {
  const dispatch = useDispatch();
  const kfd = useSelector((state: RootState) => state.kfd);

  const handleKfdKeyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setKfdKey(event.target.value as 'Recommendations' | 'Notes' | 'Summary'));
  };

  const handleKfdChange = (index: number, value: string) => {
    dispatch(updateKfdData({ index, text: value }));
  };

  const handleAddKfd = () => {
    dispatch(addKfdData(''));
  };

  const handleRemoveKfd = (index: number) => {
    dispatch(removeKfdData(index));
  };

  const handleToggleFormVisibility = () => {
    dispatch(toggleKfdVisibility());
  };

  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <h3 className="text-lg font-semibold mb-4">Key Feature Deep Security <br /> Form</h3>
      <label className="flex items-center mb-4 cursor-pointer">
        <input
          type="checkbox"
          onChange={handleToggleFormVisibility}
          checked={kfd.visible}
          className="hidden"
        />
        <div className="relative">
          <div className={`block w-10 h-6 rounded-full transition ${kfd.visible ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${kfd.visible ? 'transform translate-x-full bg-[#0d9488]' : ''}`}></div>
        </div>
        <span className="ml-3 text-white">{kfd.visible ? 'Hide' : 'Show'}</span>
      </label>

      {/* Conditionally Render the Form Based on Visibility */}
      {kfd.visible && (
        <>
          <div className="mb-4">
            <label htmlFor="kfd-key" className="block text-sm font-medium text-gray-700 mb-2">Recommendations/Notes/Summary</label>
            <select
              id="kfd-key"
              value={kfd.key}
              onChange={handleKfdKeyChange}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="Recommendations">Recommendations</option>
              <option value="Notes">Notes</option>
              <option value="Summary">Summary</option>
            </select>
          </div>

          {/* Display the Section Title and Instructions */}
          {kfd.key && (
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-800 mb-2">{kfd.key}</h4>
              <p className="text-sm text-gray-600">Here you can add {kfd.key.toLowerCase()}.</p>
            </div>
          )}

          {/* Render the Textarea for Each Item in the Selected Section */}
          {Array.isArray(kfd.data[kfd.key]) && kfd.data[kfd.key].map((item, index) => (
            <div key={index} className="flex items-center mb-4">
              <textarea
                value={item}
                onChange={(e) => handleKfdChange(index, e.target.value)}
                rows={3}
                className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mr-2"
              />
              <button
                onClick={() => handleRemoveKfd(index)}
                className="flex items-center justify-center p-2 bg-[#0d9488] text-white rounded-md focus:outline-none"
              >
                <MdClose size={20} />
              </button>
            </div>
          ))}

          {/* Add New Item Button */}
          <button
            onClick={handleAddKfd}
            className="w-full px-4 py-2 bg-[#2f3848] text-white rounded-md focus:outline-none"
          >
            Add
          </button>
        </>
      )}
    </div>
  );
};

export default KfdForm;
