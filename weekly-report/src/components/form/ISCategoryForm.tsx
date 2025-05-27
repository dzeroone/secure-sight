import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import Label from "./Label";
import { TextInput } from "./Inputs";
import { removeDataPropArr, updateDataProp } from "@/features/weekly/weeklySlice";
import RecommendationInput from "./RecommendationInput";
import { useState } from "react";
import { confirm } from "@/utils/confirm";
import Button from "../Button";

export default function ISCategoryForm() {
  const dispatch = useDispatch()
  const t10ISCat = useSelector((s: RootState) => s.data.t10ISCat);
  const [showAddNewT10ISCat, setShowAddNewT10ISCat] = useState(false)
  const [newT10ISCat, setNewT10ISCat] = useState('')
  const tIByCategoryRecommendations = useSelector((s: RootState) => s.recommendation.tIByCategory);

  const onClickRemoveT10ISCat = async (index: number) => {
    const confirmed = await confirm({
      title: 'Are you sure?',
      confirmation: 'You are going to remove a feature key from top 10 incidents summary by cateory'
    })
    if(confirmed) {
      dispatch(removeDataPropArr({
        attr: 't10ISCat.Key',
        index
      }))
      t10ISCat.data.forEach((d, i) => {
        dispatch(removeDataPropArr({
          attr: `t10ISCat.data[${i}].data`,
          index
        }))
      })
    }
  }

  const onClickAddNewT10ISCat = () => {
    setShowAddNewT10ISCat(true)
  }

  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <h3 className="text-lg font-semibold mb-4">Top 10 Incidents Summary by Category</h3>
      <div className='mb-4 flex flex-col gap-2'>
        {t10ISCat.Key.map((k, i) => {
          return (
            <div key={k}>
              <div className='text-sm font-semibold mb-1'>
                {k}
                <Button className='inline-flex ml-1 px-2 py-1 from-red-400 to-red-800' onClick={() => {
                  onClickRemoveT10ISCat(i)
                }}>X</Button>
              </div>
              <div className='flex flex-col gap-1'>
                {t10ISCat.data.map((cd, cdi) => {
                  return (
                    <div className='flex gap-1' key={cdi}>
                      <div className='flex-1'>
                        <Label>{cd.label}</Label>
                      </div>
                      <div className="w-16">
                        <TextInput
                          value={cd.data[i]}
                          type='number'
                          onChange={(e) => {
                            dispatch(updateDataProp({
                              attr: `t10ISCat.data[${cdi}].data[${i}]`,
                              value: Number(e.target.value) || 0
                            }))
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
        {showAddNewT10ISCat ? (
          <div>
            <div className="text-sm font-semibold">New key</div>
            <div className='mb-1'>
              <Label>New key name</Label>
              <TextInput
                value={newT10ISCat}
                onChange={(e) => {
                  setNewT10ISCat(e.target.value)
                }}
              />
            </div>
            <div className='flex gap-1'>
              <Button onClick={() => {
                setNewT10ISCat('')
                setShowAddNewT10ISCat(false)
              }}>Cancel</Button>
              <Button onClick={() => {
                if(newT10ISCat) {
                  let l = t10ISCat.Key.length
                  dispatch(updateDataProp({
                    attr: `t10ISCat.Key[${l}]`,
                    value: newT10ISCat
                  }))
                  t10ISCat.data.forEach((d, i) => {
                    dispatch(updateDataProp({
                      attr: `t10ISCat.data[${i}].data[${l}]`,
                      value: 0
                    }))
                  })
                  setNewT10ISCat('')
                  setShowAddNewT10ISCat(false)
                }
              }}>Save</Button>
            </div>
          </div>
        ) : (
        <div>
          <Button onClick={() => {
            onClickAddNewT10ISCat()
          }}>Add new key</Button>
        </div>
        )}
      </div>
      <div className="mb-4">
        <RecommendationInput entity="tIByCategory" values={tIByCategoryRecommendations} />
      </div>
    </div>
  )
}