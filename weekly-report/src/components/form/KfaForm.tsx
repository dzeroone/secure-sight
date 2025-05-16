import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import RecommendationInput from './RecommendationInput';
import { SwitchInput } from './Inputs';
import { updateTableOfContents } from '../../features/weekly/weeklySlice';

const KfaForm = () => {
  const dispatch = useDispatch();
  const kFApexRecommendations = useSelector((s: RootState) => s.recommendation.kFApex);
  const tableOfContents = useSelector((s: RootState) => s.tableOfContents);

  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <h3 className="text-lg font-semibold mb-4">Key Feature Apex Form</h3>
      <div className='mb-4'>
        Visibility <SwitchInput checked={tableOfContents[11].visible} onChange={(e) => {
          dispatch(updateTableOfContents({
            attr: `[${11}].visible`,
            value: e.target.checked
          }))
        }}/>
      </div>

      {tableOfContents[11].visible && (
        <>
          <div className="mb-4">
            <RecommendationInput entity="kFApex" values={kFApexRecommendations} />
          </div>
        </>
      )}
    </div>
  );
};

export default KfaForm;
