import { TextAreaInput, TextInput } from "./Inputs";
import Label from "./Label";

export default function ExecutiveSummaryForm() {
  return (
    <div className="p-6 flex flex-col gap-4 bg-white rounded-lg border shadow-md">
      <div>Executive summary</div>
      <div>
        <Label>Number of incidents</Label>
        <TextInput type="number" />
      </div>
      <div>
        <Label>Risk index</Label>
        <TextInput type="number" />
      </div>
      <div>
        <Label>Content of risk index</Label>
        <TextAreaInput />
      </div>
      <div>
        <Label>Number of detected vulnerabilities</Label>
        <TextInput type="number" />
      </div>
      <div>
        <Label>Number of Incidents closed without Acknowledgement</Label>
        <TextInput type="number" />
      </div>
      <div>
        <Label>Highest incidents triggered</Label>
        <TextInput type="number" />
      </div>
      <div>
        <Label>Highest incidents triggered on date</Label>
        <TextInput />
      </div>
    </div>
  )
}