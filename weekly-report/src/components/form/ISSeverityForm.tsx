import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import Label from "./Label";
import { TextInput } from "./Inputs";
import { updateDataProp } from "@/features/weekly/weeklySlice";
import RecommendationInput from "./RecommendationInput";

export default function ISSeverityForm() {
  const dispatch = useDispatch()
  const isSeverity = useSelector((s: RootState) => s.data.isSeverity);
  const iSeverityRecommendations = useSelector((s: RootState) => s.recommendation.iSeverity);

  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <h3 className="text-lg font-semibold mb-4">INCIDENTS SUMMARY BY SEVERITY</h3>
      <div className='mb-4 flex flex-col gap-2'>
        <div>
          <Label>Critical</Label>
          <TextInput
            placeholder="Critical"
            type='number'
            value={isSeverity[0]}
            onChange={(e) => dispatch(
              updateDataProp({
                attr: "isSeverity[0]",
                value: Number(e.target.value) || 0,
              })
            )}
          />
        </div>
        <div>
          <Label>High</Label>
          <TextInput
            placeholder="High"
            type='number'
            value={isSeverity[1]}
            onChange={(e) => dispatch(
              updateDataProp({
                attr: "isSeverity[1]",
                value: Number(e.target.value) || 0,
              })
            )}
          />
        </div>
        <div>
          <Label>Medium</Label>
          <TextInput
            placeholder="Medium"
            type='number'
            value={isSeverity[2]}
            onChange={(e) => dispatch(
              updateDataProp({
                attr: "isSeverity[2]",
                value: Number(e.target.value) || 0,
              })
            )}
          />
        </div>
        <div>
          <Label>Low</Label>
          <TextInput
            placeholder="Low"
            type='number'
            value={isSeverity[3]}
            onChange={(e) => dispatch(
              updateDataProp({
                attr: "isSeverity[3]",
                value: Number(e.target.value) || 0,
              })
            )}
          />
        </div>
      </div>
      <div className="mb-4">
        <RecommendationInput entity="iSeverity" values={iSeverityRecommendations} />
      </div>
    </div>
  )
}