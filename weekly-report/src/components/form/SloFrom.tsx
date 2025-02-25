import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { addSloData, updateSloData, removeSloData } from '../../features/weekly/sloSlice';
import { MdClose, MdEdit } from 'react-icons/md';

const SloForm: React.FC = () => {
    const dispatch = useDispatch();
    const sloData = useSelector((state: RootState) => state.slo.data);

    const [priority, setPriority] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [responseTime, setResponseTime] = useState<string>('');
    const [editIndex, setEditIndex] = useState<number | null>(null); // To track the entry being edited

    // Function to handle adding or editing SLO data
    const handleAddOrUpdate = () => {
        if (priority && description && responseTime) {
            if (editIndex !== null) {
                // Edit existing SLO entry
                dispatch(updateSloData({
                    index: editIndex,
                    field: "Priority",
                    value: priority
                }));
                dispatch(updateSloData({
                    index: editIndex,
                    field: "Description",
                    value: description
                }));
                dispatch(updateSloData({
                    index: editIndex,
                    field: "Response_Time",
                    value: responseTime
                }));
                setEditIndex(null); // Reset after editing
            } else {
                // Add new SLO entry
                dispatch(addSloData({ Priority: priority, Description: description, Response_Time: responseTime }));
            }
            // Clear input fields
            setPriority('');
            setDescription('');
            setResponseTime('');
        }
    };

    // Function to handle editing an existing SLO entry
    const handleEdit = (index: number) => {
        const sloEntry = sloData[index];
        setPriority(sloEntry.Priority);
        setDescription(sloEntry.Description);
        setResponseTime(sloEntry.Response_Time);
        setEditIndex(index);
    };

    // Function to handle removing an existing SLO entry
    const handleRemove = (index: number) => {
        dispatch(removeSloData(index));
    };

    return (
        <div className="p-6 bg-white rounded-lg border shadow-md">
            <h3 className="text-lg font-semibold mb-4">SLO Details Table</h3>
            <div className="mt-6">
                <h4 className="text-md font-semibold mb-4">Added Data</h4>
                {sloData.map((slo, index) => (
                    <div key={index} className="flex justify-between items-center mb-2 pb-2">
                        <div>
                            <p><strong>Priority:</strong> {slo.Priority}</p>
                            <p><strong>Description:</strong> {slo.Description}</p>
                            <p><strong>Response Time:</strong> {slo.Response_Time}</p>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => handleEdit(index)}
                                className="flex items-center justify-center p-2 bg-[#2f3848] text-white rounded-md mr-2"
                            >
                                <MdEdit size={18} />
                            </button>
                            <button
                                onClick={() => handleRemove(index)}
                                className="flex items-center justify-center p-2 bg-red-500 text-white rounded-md"
                            >
                                <MdClose size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mb-4">
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <input
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="responseTime" className="block text-sm font-medium text-gray-700 mb-2">Response Time</label>
                <input
                    id="responseTime"
                    value={responseTime}
                    onChange={(e) => setResponseTime(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <button
                onClick={handleAddOrUpdate}
                className="w-full px-4 py-2 bg-[#2f3848] text-white rounded-md focus:outline-none"
            >
                {editIndex !== null ? "Update SLO" : "Add SLO"}
            </button>


        </div>
    );
};

export default SloForm;
