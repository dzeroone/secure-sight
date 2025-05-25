import { useDispatch, useSelector } from "react-redux";
import { SwitchInput } from "./Inputs";
import { updateTableOfContents } from "@/features/weekly/weeklySlice";
import { RootState } from "@/store/store";

export default function ThreatIntelSummaryForm() {
  const dispatch = useDispatch();
  const tableOfContents = useSelector((s: RootState) => s.tableOfContents);

  return (
    <div className="p-6 flex flex-col gap-4 bg-white rounded-lg border shadow-md">
      <div>Threat intel summary</div>
      <div className="mb-4">
        Visibility{" "}
        <SwitchInput
          checked={tableOfContents[1].visible}
          onChange={(e) => {
            dispatch(
              updateTableOfContents({
                attr: `[${1}].visible`,
                value: e.target.checked,
              })
            );
          }}
        />
      </div>
    </div>
  );
}
