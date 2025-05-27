import { useDispatch, useSelector } from "react-redux";
import { updateExecutiveSummary } from "../../features/weekly/weeklySlice";
import { RootState } from "../../store/store";
import AlcForm from "./AlcForm";
import EndpointProtectionForm from "./EndpointProtectionForm";
import { TextAreaInput, TextInput } from "./Inputs";
import Label from "./Label";

export default function ExecutiveSummaryForm() {
  const dispatch = useDispatch();
  const data = useSelector((s: RootState) => s.executiveSummary);

  return (
    <div className="p-6 flex flex-col gap-4 bg-white rounded-lg border shadow-md">
      <div>Executive summary</div>
      <div>
        <Label>Number of incidents</Label>
        <TextInput
          value={data.nOfIncidents}
          type="number"
          onChange={(e) => {
            dispatch(
              updateExecutiveSummary({
                field: "nOfIncidents",
                value: Number(e.target.value) || 0,
              })
            );
          }}
        />
      </div>
      <div>
        <Label>Risk index</Label>
        <TextInput
          value={data.riskIndex}
          type="number"
          onChange={(e) => {
            dispatch(
              updateExecutiveSummary({
                field: "riskIndex",
                value: Number(e.target.value) || 0,
              })
            );
          }}
        />
      </div>
      <div>
        <Label>Content of risk index</Label>
        <TextAreaInput
          value={data.riskContent}
          onChange={(e) => {
            dispatch(
              updateExecutiveSummary({
                field: "riskContent",
                value: e.target.value,
              })
            );
          }}
        />
      </div>
      <div>
        <Label>Number of detected vulnerabilities</Label>
        <TextInput
          value={data.nOfDVul}
          type="number"
          onChange={(e) => {
            dispatch(
              updateExecutiveSummary({
                field: "nOfDVul",
                value: Number(e.target.value) || 0,
              })
            );
          }}
        />
      </div>
      <div>
        <Label>Number of Incidents closed without Acknowledgement</Label>
        <TextInput
          value={data.nOfICWoAck}
          type="number"
          onChange={(e) => {
            dispatch(
              updateExecutiveSummary({
                field: "nOfICWoAck",
                value: Number(e.target.value) || 0,
              })
            );
          }}
        />
      </div>
      <div>
        <Label>Highest incidents triggered</Label>
        <TextInput
          value={data.nOfTIncidents}
          type="number"
          onChange={(e) => {
            dispatch(
              updateExecutiveSummary({
                field: "nOfTIncidents",
                value: Number(e.target.value) || 0,
              })
            );
          }}
        />
      </div>
      <div>
        <Label>Highest incidents triggered on date</Label>
        <TextInput
          value={data.iTDate}
          onChange={(e) => {
            dispatch(
              updateExecutiveSummary({
                field: "iTDate",
                value: e.target.value,
              })
            );
          }}
        />
      </div>
      <AlcForm />
      <EndpointProtectionForm />
    </div>
  );
}
