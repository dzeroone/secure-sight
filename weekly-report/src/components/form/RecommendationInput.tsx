import { useDispatch } from "react-redux";
import { confirm } from "../../utils/confirm";
import Label from "./Label";
import SelectInput, { TextAreaInput, TextInput } from "./Inputs";
import { MdAdd, MdClose, MdDelete } from "react-icons/md";
import Button from "../Button";
import {
  RecommendationNote,
  RecommendationState,
  removeRecommendationPropArr,
  updateRecommendationProp,
} from "../../features/weekly/weeklySlice";

interface RecommendationInputProps {
  values: RecommendationNote[];
  entity: keyof RecommendationState;
}

export default function RecommendationInput({
  values,
  entity,
}: RecommendationInputProps) {
  const dispatch = useDispatch();

  const onClickRemoveNote = async (index: number) => {
    try {
      const confirmed = await confirm({
        confirmation: "You are going to remove this note!",
        title: "Are you sure?",
      });
      if (confirmed) {
        dispatch(
          removeRecommendationPropArr({
            attr: entity,
            index,
          })
        );
      }
    } catch (e) {}
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-col gap-2">
          {values?.map((v, i) => {
            return (
              <div className="flex flex-col gap-2" key={i}>
                <div>
                  <Label htmlFor={`rsn-label-${i}`}>
                    Recommendations / Notes / Summary
                  </Label>
                  <SelectInput
                    id={`rsn-label-${i}`}
                    value={v.key}
                    onChange={(e) =>
                      dispatch(
                        updateRecommendationProp({
                          attr: `${entity}[${i}].key`,
                          value: e.target.value,
                        })
                      )
                    }
                  >
                    <option value="" disabled>
                      None
                    </option>
                    <option value="Recommendations">Recommendations</option>
                    <option value="Notes">Notes</option>
                    <option value="Summary">Summary</option>
                  </SelectInput>
                </div>
                <div>
                  <div className="flex flex-col gap-2">
                    {v.data.map((j, k) => (
                      <div className="flex items-center gap-1" key={k}>
                        <div>
                          <TextAreaInput
                            placeholder="Recommendations/Notes/Summary"
                            value={j}
                            rows={3}
                            onChange={(e) =>
                              dispatch(
                                updateRecommendationProp({
                                  attr: `${entity}[${i}].data[${k}]`,
                                  value: e.target.value,
                                })
                              )
                            }
                          />
                        </div>
                        <div>
                          <Button
                            aria-label="delete"
                            color="primary"
                            onClick={() =>
                              dispatch(
                                removeRecommendationPropArr({
                                  attr: `${entity}[${i}].data`,
                                  index: k,
                                })
                              )
                            }
                          >
                            <MdClose />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-col gap-2">
                      <div>
                        <Button
                          onClick={() => {
                            dispatch(
                              updateRecommendationProp({
                                attr: `${entity}[${i}].data[${v.data.length}]`,
                                value: "",
                              })
                            );
                          }}
                        >
                          <MdAdd className="mr-1" /> Note text
                        </Button>
                      </div>
                      <div>
                        <Button onClick={() => onClickRemoveNote(i)}>
                          <MdDelete className="mr-1" /> Note
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <Button
          onClick={() => {
            dispatch(
              updateRecommendationProp({
                attr: `${entity}[${values?.length || 0}]`,
                value: {
                  key: "",
                  data: [""],
                },
              })
            );
          }}
        >
          Add Note
        </Button>
      </div>
    </div>
  );
}
