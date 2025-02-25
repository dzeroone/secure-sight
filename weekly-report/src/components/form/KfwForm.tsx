import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setKfwKey, addKfwData, updateKfwData, removeKfwData, toggleKfwVisibility } from '../../features/weekly/weeklySlice';
import { MdClose } from 'react-icons/md';

const KfwForm = () => {
  const dispatch = useDispatch();
  const kfw = useSelector((state: RootState) => state.kfw);

  const handleKfwKeyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setKfwKey(event.target.value as 'Recommendations' | 'Notes' | 'Summary'));
  };

  const handleKfwChange = (index: number, value: string) => {
    dispatch(updateKfwData({ index, text: value }));
  };

  const handleAddKfw = () => {
    dispatch(addKfwData(''));
  };

  const handleRemoveKfw = (index: number) => {
    dispatch(removeKfwData(index));
  };

  const handleToggleFormVisibility = () => {
    dispatch(toggleKfwVisibility());
  };

  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <h3 className="text-lg font-semibold mb-4">Key Feature Workload Form</h3>
      <label className="flex items-center mb-4 cursor-pointer">
        <input
          type="checkbox"
          onChange={handleToggleFormVisibility}
          checked={kfw.visible}
          className="hidden"
        />
        <div className="relative">
          <div className={`block w-10 h-6 rounded-full transition ${kfw.visible ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${kfw.visible ? 'transform translate-x-full bg-[#0d9488]' : ''}`}></div>
        </div>
        <span className="ml-3 text-white">{kfw.visible ? 'Hide' : 'Show'}</span>
      </label>

      {kfw.visible && (
        <>
          <div className="mb-4">
            <label htmlFor="kfw-key" className="block text-sm font-medium text-gray-700 mb-2">Recommendations/Notes/Summary</label>
            <select
              id="kfw-key"
              value={kfw.key}
              onChange={handleKfwKeyChange}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="Recommendations">Recommendations</option>
              <option value="Notes">Notes</option>
              <option value="Summary">Summary</option>
            </select>
          </div>
          {kfw.key && (
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-800 mb-2">{kfw.key}</h4>
              <p className="text-sm text-gray-600">Here you can add {kfw.key.toLowerCase()}.</p>
            </div>
          )}
          {Array.isArray(kfw.data[kfw.key]) && kfw.data[kfw.key].map((item, index) => (
            <div key={index} className="flex items-center mb-4">
              <textarea
                value={item}
                onChange={(e) => handleKfwChange(index, e.target.value)}
                rows={3}
                className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mr-2"
              />
              <button
                onClick={() => handleRemoveKfw(index)}
                className="flex items-center justify-center p-2 bg-[#0d9488] text-white rounded-md focus:outline-none"
              >
                <MdClose size={20} />
              </button>
            </div>
          ))}
          <button
            onClick={handleAddKfw}
            className="w-full px-4 py-2 bg-[#2f3848] text-white rounded-md focus:outline-none"
          >
            Add
          </button>
        </>
      )}
    </div>
  );
};

export default KfwForm;
