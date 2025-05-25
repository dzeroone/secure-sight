import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { SwitchInput, TextInput } from "./Inputs";
import { updateTableOfContents } from "../../features/weekly/weeklySlice";

export default function TableOfContentsForm() {
  const dispatch = useDispatch();
  const tableOfContents = useSelector((s: RootState) => s.tableOfContents);

  return (
    <div className="p-6 flex flex-col gap-4 bg-white rounded-lg border shadow-md">
      <div>Table of contents</div>
      {tableOfContents.map((tc, i) => {
        return (
          <div key={i}>
            <div className="flex gap-2">
              <TextInput
                value={tc.title}
                onChange={(e) => {
                  dispatch(
                    updateTableOfContents({
                      attr: `[${i}].title`,
                      value: e.target.value,
                    })
                  );
                }}
                className="w-0 flex-1"
              />
              <TextInput
                value={tc.page}
                onChange={(e) => {
                  dispatch(
                    updateTableOfContents({
                      attr: `[${i}].page`,
                      value: Number(e.target.value),
                    })
                  );
                }}
                className="w-12"
              />
            </div>
            <div className="text-sm mt-1">
              Visibility{" "}
              <SwitchInput
                checked={tc.visible}
                onChange={(e) => {
                  dispatch(
                    updateTableOfContents({
                      attr: `[${i}].visible`,
                      value: e.target.checked,
                    })
                  );
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
