import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import RecommendationInput from './RecommendationInput';

const EndpointProtectionForm = () => {
    const endPointProtectionRecommendations = useSelector(
        (s: RootState) => s.recommendation.endPointProtection
    );
    const endPointSensorRecommendations = useSelector(
        (s: RootState) => s.recommendation.endPointSensor
    );

    return (
        <div className="p-6 bg-white rounded-lg border shadow-md">
            <h3 className="text-lg font-semibold mb-4">Endpoint Protection: Agents Deployed</h3>
            <div className="mb-4">
                <RecommendationInput entity="endPointProtection" values={endPointProtectionRecommendations} />
            </div>

            {/* Endpoint Sensor Form */}
            <h3 className="text-lg font-semibold mt-8 mb-4">Endpoint Sensor: Agents Deployed</h3>
            <div className="mb-4">
                <RecommendationInput entity="endPointSensor" values={endPointSensorRecommendations} />
            </div>
        </div>
    );
};

export default EndpointProtectionForm;
