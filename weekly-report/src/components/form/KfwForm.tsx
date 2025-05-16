import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { MdClose } from 'react-icons/md';
import { SwitchInput } from './Inputs';
import { updateTableOfContents } from '../../features/weekly/weeklySlice';
import RecommendationInput from './RecommendationInput';

const KfwForm = () => {
  const dispatch = useDispatch();
  const tableOfContents = useSelector((s: RootState) => s.tableOfContents);
  const kFWorkloadRecommendations = useSelector((s: RootState) => s.recommendation.kFWorkload);
  
  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <h3 className="text-lg font-semibold mb-4">Key Feature Workload Form</h3>
      <div className='mb-4'>
        Visibility <SwitchInput checked={tableOfContents[12].visible} onChange={(e) => {
          dispatch(updateTableOfContents({
            attr: `[${12}].visible`,
            value: e.target.checked
          }))
        }}/>
      </div>

      {tableOfContents[12].visible && (
        <>
          <div className="mb-4">
            <RecommendationInput entity="kFWorkload" values={kFWorkloadRecommendations} />
          </div>
        </>
      )}
    </div>
  );
};

export default KfwForm;
