import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import Label from "./Label";
import { TextInput } from "./Inputs";
import { updateDataProp } from "@/features/weekly/weeklySlice";
import RecommendationInput from "./RecommendationInput";

export default function ISStatusForm() {
  const dispatch = useDispatch()
  const isStatus = useSelector((s: RootState) => s.data.isStatus);
  const iStatusRecommendations = useSelector((s: RootState) => s.recommendation.iStatus);
  const client = useSelector((state: RootState) => state.client);

  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <h3 className="text-lg font-semibold mb-4">Incident Summary by status</h3>
        <div className='mb-4 flex flex-col gap-2'>
          <div>
            <Label>Closed Incidents</Label>
            <TextInput
              placeholder="Closed Incidents"
              type='number'
              value={isStatus[0]}
              onChange={(e) => dispatch(
                updateDataProp({
                  attr: "isStatus[0]",
                  value: Number(e.target.value) || 0,
                })
              )}
            />
          </div>
          <div>
            <Label>Pending Incidents from SOC Team</Label>
            <TextInput
              placeholder="Pending Incidents from SOC Team"
              type='number'
              value={isStatus[1]}
              onChange={(e) => dispatch(
                updateDataProp({
                  attr: "isStatus[1]",
                  value: Number(e.target.value) || 0,
                })
              )}
            />
          </div>
          <div>
            <Label>Pending Incidents from {client.tenantCode}</Label>
            <TextInput
              placeholder={`Pending Incidents from ${client.tenantCode}`}
              type='number'
              value={isStatus[2]}
              onChange={(e) => dispatch(
                updateDataProp({
                  attr: "isStatus[2]",
                  value: Number(e.target.value) || 0,
                })
              )}
            />
          </div>
        </div>
        <div className="mb-4">
          <RecommendationInput entity="iStatus" values={iStatusRecommendations} />
        </div>
    </div>
  )
}