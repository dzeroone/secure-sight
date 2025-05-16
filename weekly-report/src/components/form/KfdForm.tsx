import { useDispatch, useSelector } from 'react-redux';
import { updateTableOfContents } from '../../features/weekly/weeklySlice';
import { RootState } from '../../store/store';
import { SwitchInput } from './Inputs';
import RecommendationInput from './RecommendationInput';

const KfdForm = () => {
  const dispatch = useDispatch();
  const tableOfContents = useSelector((s: RootState) => s.tableOfContents);
  const kFDeepRecommendations = useSelector((s: RootState) => s.recommendation.kFDeep);

  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <h3 className="text-lg font-semibold mb-4">Key Feature Deep Security <br /> Form</h3>
      <div className='mb-4'>
        Visibility <SwitchInput checked={tableOfContents[13]?.visible} onChange={(e) => {
          dispatch(updateTableOfContents({
            attr: `[${13}].visible`,
            value: e.target.checked
          }))
        }}/>
      </div>

      {/* Conditionally Render the Form Based on Visibility */}
      {tableOfContents[13]?.visible && (
        <>
          <div className="mb-4">
            <RecommendationInput entity="kFDeep" values={kFDeepRecommendations} />
          </div>
        </>
      )}
    </div>
  );
};

export default KfdForm;
