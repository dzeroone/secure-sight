import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  updateClientName,
  deleteClientName,
} from "../../features/weekly/weeklySlice";
import { FiTrash2 } from "react-icons/fi"; // Import icons

function FirstPageForm() {
  const dispatch = useDispatch();
  const clientName = useSelector((state: RootState) => state.client.clientName);

  const handleClientNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(updateClientName(event.target.value));
  };

  //   const handleUpdateClientName = () => {
  //     dispatch(updateClientName(nameInput));
  //   };

  const handleDeleteClientName = () => {
    dispatch(deleteClientName());
  };

  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <div className="mb-4">
        <label
          htmlFor="client-name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Client Name
        </label>
        <input
          id="client-name"
          type="text"
          value={clientName}
          onChange={handleClientNameChange}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter client name"
        />
      </div>
      <div className="flex space-x-4">
        {/* <button
                    onClick={handleUpdateClientName}
                    className="p-2 bg-[#2f3848] text-white rounded-md flex items-center"
                    aria-label="Update Name"
                >
                    <IoCheckmarkCircleOutline
                        size={20} />
                </button> */}
        <button
          onClick={handleDeleteClientName}
          className="p-2 bg-[#ef4444] text-white rounded-md flex items-center"
          aria-label="Delete Name"
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    </div>
  );
}

export default FirstPageForm;
