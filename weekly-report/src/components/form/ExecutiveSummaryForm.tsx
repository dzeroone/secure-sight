import { useDispatch, useSelector } from "react-redux";
import { updateExecutiveSummary, updateExecutiveSummaryProp } from "../../features/weekly/weeklySlice";
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
        <h3 className="text-lg font-semibold">Top incidents</h3>
        <div className="flex flex-col gap-4">
          {data.topIncidents?.map((incident, i) => {
            return (
              <div className="flex flex-col gap-2" key={i}>
                <div>
                  <Label>Incident name {i+1}</Label>
                  <TextInput
                    value={incident.incident_name}
                    onChange={(e) => {
                      dispatch(
                        updateExecutiveSummaryProp({
                          attr: `topIncidents[${i}].incident_name`,
                          value: e.target.value,
                        })
                      );
                    }}
                  />
                </div>
                <div>
                  <Label>Incident source {i+1}</Label>
                  <TextInput
                    value={incident.source}
                    onChange={(e) => {
                      dispatch(
                        updateExecutiveSummaryProp({
                          attr: `topIncidents[${i}].source`,
                          value: e.target.value,
                        })
                      );
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <AlcForm />
      <EndpointProtectionForm />
    </div>
  );
}
