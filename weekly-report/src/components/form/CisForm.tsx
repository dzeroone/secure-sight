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
  const cIncident = useSelector((state: RootState) => state.data.cIncidentSummary);
  const cIncidentRecommendations = useSelector((s: RootState) => s.recommendation.cIncident);

  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <h3 className="text-lg font-semibold mb-4">Closed Incidents Summary Form</h3>
      <div className="flex flex-col gap-2 mb-4">
        {
          cIncident.data.map((d, i) => {
            return (
              <div key={i}>
                <Label>{d.label}</Label>
                <div className='grid grid-cols-3 gap-2'>
                  {d.data.map((value, index) => (
                    <TextInput
                      key={index}
                      type="number"
                      value={value}
                      onChange={(e) => dispatch(updateDataProp({
                        attr: `cIncidentSummary.data[${i}].data[${index}]`,
                        value: Number(e.target.value) || 0
                      }))}
                    />
                  ))}
                </div>
              </div>
            )
          })
        }
      </div>
      <div className="mb-4">
        <RecommendationInput entity="cIncident" values={cIncidentRecommendations} />
      </div>
    </div>
  );
};

export default CisForm;
