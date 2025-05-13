import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  updateClientName,
  deleteClientName,
  updateClientState,
} from "../../features/weekly/weeklySlice";
import { FiTrash2 } from "react-icons/fi"; // Import icons
import Label from "./Label";
import { TextInput } from "./Inputs";

function FirstPageForm() {
  const dispatch = useDispatch();
  const client = useSelector((state: RootState) => state.client);

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
    <div className="p-6 flex flex-col gap-4 bg-white rounded-lg border shadow-md">
      <div>
        <Label>Subtitle</Label>
        <TextInput
          value={client.subtitle}
          onChange={(e) => {
            dispatch(updateClientState({ field: 'subtitle', value: e.target.value }))
          }}
        />
      </div>
      <div>
        <Label>Title</Label>
        <TextInput
          value={client.title}
          onChange={(e) => {
            dispatch(updateClientState({ field: 'title', value: e.target.value }))
          }}
        />
      </div>
      <div>
        <Label htmlFor="client-name">Client Name</Label>
        <div className="flex space-x-4">
          <TextInput
            id="client-name"
            type="text"
            value={client.clientName}
            onChange={handleClientNameChange}
            placeholder="Enter client name"
          />
          <button
            onClick={handleDeleteClientName}
            className="p-2 bg-[#ef4444] text-white rounded-md flex items-center"
            aria-label="Delete Name"
          >
            <FiTrash2 size={20} />
          </button>
        </div>
      </div>
      <div>
        <Label>Tenant code</Label>
        <TextInput
          value={client.tenantCode}
          onChange={(e) => {
            dispatch(updateClientState({ field: 'tenantCode', value: e.target.value }))
          }}
        />
      </div>
      <div>
        <Label>Date start</Label>
        <TextInput
          value={client.dateFrom}
          onChange={(e) => {
            dispatch(updateClientState({ field: 'dateFrom', value: e.target.value }))
          }}
        />
      </div>
      <div>
        <Label>Date end</Label>
        <TextInput
          value={client.dateTo}
          onChange={(e) => {
            dispatch(updateClientState({ field: 'dateTo', value: e.target.value }))
          }}
        />
      </div>
    </div>
  );
}

export default FirstPageForm;
