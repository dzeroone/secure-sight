import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setKfaKey, addKfaData, updateKfaData, removeKfaData, toggleKfaVisibility } from '../../features/weekly/weeklySlice';
import { MdClose } from 'react-icons/md';

const KfaForm = () => {
  const dispatch = useDispatch();
  const kfa = useSelector((state: RootState) => state.kfa);

  const handleKfaKeyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setKfaKey(event.target.value as 'Recommendations' | 'Notes' | 'Summary'));
  };

  const handleKfaChange = (index: number, value: string) => {
    dispatch(updateKfaData({ index, text: value }));
  };

  const handleAddKfa = () => {
    dispatch(addKfaData(''));
  };

  const handleRemoveKfa = (index: number) => {
    dispatch(removeKfaData(index));
  };

  const handleToggleFormVisibility = () => {
    dispatch(toggleKfaVisibility());
  };

  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <h3 className="text-lg font-semibold mb-4">Key Feature Apex Form</h3>
      <label className="flex items-center mb-4 cursor-pointer">
        <input
          type="checkbox"
          onChange={handleToggleFormVisibility}
          checked={kfa.visible}
          className="hidden"
        />
        <div className="relative">
          <div className={`block w-10 h-6 rounded-full transition ${kfa.visible ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${kfa.visible ? 'transform translate-x-full bg-[#0d9488]' : ''}`}></div>
        </div>
        <span className="ml-3 text-white">{kfa.visible ? 'Hide' : 'Show'}</span>
      </label>
      {kfa.visible && (
        <>
          <div className="mb-4">
            <label htmlFor="kfa-key" className="block text-sm font-medium text-gray-700 mb-2">Recommendations/Notes/Summary</label>
            <select
              id="kfa-key"
              value={kfa.key}
              onChange={handleKfaKeyChange}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="Recommendations">Recommendations</option>
              <option value="Notes">Notes</option>
              <option value="Summary">Summary</option>
            </select>
          </div>
          {kfa.key && (
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-800 mb-2">{kfa.key}</h4>
              <p className="text-sm text-gray-600">Here you can add {kfa.key.toLowerCase()}.</p>
            </div>
          )}
          {Array.isArray(kfa.data[kfa.key]) && kfa.data[kfa.key].map((item, index) => (
            <div key={index} className="flex items-center mb-4">
              <textarea
                value={item}
                onChange={(e) => handleKfaChange(index, e.target.value)}
                rows={3}
                className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mr-2"
              />
              <button
                onClick={() => handleRemoveKfa(index)}
                className="flex items-center justify-center p-2 bg-[#0d9488] text-white rounded-md focus:outline-none"
              >
                <MdClose size={20} />
              </button>
            </div>
          ))}
          <button
            onClick={handleAddKfa}
            className="w-full px-4 py-2 bg-[#2f3848] text-white rounded-md focus:outline-none"
          >
            Add
          </button>
        </>
      )}
    </div>
  );
};

export default KfaForm;
