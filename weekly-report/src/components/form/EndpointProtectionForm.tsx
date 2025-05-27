import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import RecommendationInput from './RecommendationInput';
import Label from './Label';
import { TextInput } from './Inputs';
import { updateExecutiveSummary } from '../../features/weekly/weeklySlice';

const EndpointProtectionForm = () => {
    const dispatch = useDispatch()

    const endPointProtectionRecommendations = useSelector(
        (s: RootState) => s.recommendation.endPointProtection
    );
    const endPointSensorRecommendations = useSelector(
        (s: RootState) => s.recommendation.endPointSensor
    );

    const executiveSummaryData = useSelector(
        (s: RootState) => s.executiveSummary
    );

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Endpoint Protection: Agents Deployed</h3>
            <div className="mb-4">
                <RecommendationInput entity="endPointProtection" values={endPointProtectionRecommendations} />
            </div>
            <div className='mb-4 flex flex-col gap-2'>
                <div>
                    <Label>Total Agents</Label>
                    <TextInput
                    placeholder="Total Agents"
                    type='number'
                    value={executiveSummaryData.epTAgents}
                    onChange={(e) => dispatch(
                        updateExecutiveSummary({
                        field: "epTAgents",
                        value: Number(e.target.value) || 0,
                        })
                    )}
                    />
                </div>
                <div>
                    <Label>Agents Deployed</Label>
                    <TextInput
                    placeholder="Agents Deployed"
                    type='number'
                    value={executiveSummaryData.epDAgents}
                    onChange={(e) => dispatch(
                        updateExecutiveSummary({
                        field: "epDAgents",
                        value: Number(e.target.value) || 0,
                        })
                    )}
                    />
                </div>
            </div>

            {/* Endpoint Sensor Form */}
            <h3 className="text-lg font-semibold mt-8 mb-4">Endpoint Sensor: Agents Deployed</h3>
            <div className="mb-4">
                <RecommendationInput entity="endPointSensor" values={endPointSensorRecommendations} />
            </div>
            <div className='mb-4 flex flex-col gap-2'>
                <div>
                    <Label>Total Sensors</Label>
                    <TextInput
                        placeholder="Total Sensors"
                        type='number'
                        value={executiveSummaryData.epTSensors}
                        onChange={(e) => dispatch(
                            updateExecutiveSummary({
                            field: "epTSensors",
                            value: Number(e.target.value) || 0,
                            })
                        )}
                    />
                </div>
                <div>
                    <Label>Agents Deployed</Label>
                    <TextInput
                        placeholder="Sensors Deployed"
                        type='number'
                        value={executiveSummaryData.epDSensors}
                        onChange={(e) => dispatch(
                            updateExecutiveSummary({
                            field: "epDSensors",
                            value: Number(e.target.value) || 0,
                            })
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default EndpointProtectionForm;
