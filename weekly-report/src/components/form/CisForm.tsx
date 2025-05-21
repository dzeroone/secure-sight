import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateDataProp, updatePendingIncidentSummaryData } from '../../features/weekly/weeklySlice';
import { MdClose } from 'react-icons/md';
import RecommendationInput from './RecommendationInput';
import Label from './Label';
import { TextInput } from './Inputs';

const CisForm = () => {
  const dispatch = useDispatch();
  const cIncident = useSelector((state: RootState) => state.data.cIncident);
  const cIncidentRecommendations = useSelector((s: RootState) => s.recommendation.cIncident);

  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <h3 className="text-lg font-semibold mb-4">Closed Incidents Summary Form</h3>
      <div className="flex flex-col gap-2 mb-4">
        <div>
          <Label>Closed as true positive</Label>
          <TextInput type="number" value={cIncident.data[0].data[0]} onChange={(e) => {
            dispatch(updateDataProp({
              attr: 'cIncident.data[0].data[0]',
              value: Number(e.target.value) || 0
            }))
          }} />
        </div>
        <div>
          <Label>Closed as false positive</Label>
          <TextInput type="number" value={cIncident.data[0].data[1]} onChange={(e) => {
            dispatch(updateDataProp({
              attr: 'cIncident.data[0].data[1]',
              value: Number(e.target.value) || 0
            }))
          }} />
        </div>
        <div>
          <Label>Closed as remeditate</Label>
          <TextInput type="number" value={cIncident.data[0].data[2]} onChange={(e) => {
            dispatch(updateDataProp({
              attr: 'cIncident.data[0].data[2]',
              value: Number(e.target.value) || 0
            }))
          }} />
        </div>
        <div>
          <Label>Closed as duplicate according to priority</Label>
          <TextInput type="number" value={cIncident.data[0].data[3]} onChange={(e) => {
            dispatch(updateDataProp({
              attr: 'cIncident.data[0].data[3]',
              value: Number(e.target.value) || 0
            }))
          }} />
        </div>
      </div>
      <div className="mb-4">
        <RecommendationInput entity="cIncident" values={cIncidentRecommendations} />
      </div>
    </div>
  );
};

export default CisForm;
