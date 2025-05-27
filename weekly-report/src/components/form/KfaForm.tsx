import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import RecommendationInput from './RecommendationInput';
import { SwitchInput, TextInput } from './Inputs';
import { removeDataPropArr, updateDataProp, updateTableOfContents } from '../../features/weekly/weeklySlice';
import { useState } from 'react';
import { confirm } from '../../utils/confirm';
import Button from '../Button';
import Label from './Label';

const KfaForm = () => {
  const dispatch = useDispatch();
  const kFApexRecommendations = useSelector((s: RootState) => s.recommendation.kFApex);
  const tableOfContents = useSelector((s: RootState) => s.tableOfContents);
  const kFARAp = useSelector((s: RootState) => s.data.kFARAp);

  const [showAddNewKFARAp, setShowAddNewKFARAp] = useState(false)
  const [newKFARAp, setNewKFARAp] = useState('')

  const onClickRemoveKFARAp = async (index: number) => {
    const confirmed = await confirm({
      title: 'Are you sure?',
      confirmation: 'You are going to remove a feature key from Apex One'
    })
    if(confirmed) {
      dispatch(removeDataPropArr({
        attr: 'kFARAp.key',
        index
      }))
      kFARAp.data.forEach((d, i) => {
        dispatch(removeDataPropArr({
          attr: `kFARAp.data[${i}].data`,
          index
        }))
      })
    }
  }

  const onClickAddNewKFARAp = () => {
    setShowAddNewKFARAp(true)
  }

  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <h3 className="text-lg font-semibold mb-4">Key Feature Apex Form</h3>
      <div className='mb-4'>
        Visibility <SwitchInput checked={tableOfContents[11].visible} onChange={(e) => {
          dispatch(updateTableOfContents({
            attr: `[${11}].visible`,
            value: e.target.checked
          }))
        }}/>
      </div>

      <div className='mb-4 flex flex-col gap-2'>
        {kFARAp.key.map((k, i) => {
          return (
            <div key={k}>
              <div className='text-sm font-semibold mb-1'>
                {k}
                <Button className='inline-flex ml-1 px-2 py-1 from-red-400 to-red-800' onClick={() => {
                  onClickRemoveKFARAp(i)
                }}>X</Button>
              </div>
              <div className='flex flex-col gap-1'>
                {kFARAp.data.map((cd, cdi) => {
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
                              attr: `kFARAp.data[${cdi}].data[${i}]`,
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
        {showAddNewKFARAp ? (
          <div>
            <div className="text-sm font-semibold">New key</div>
            <div className='mb-1'>
              <Label>New key name</Label>
              <TextInput
                value={newKFARAp}
                onChange={(e) => {
                  setNewKFARAp(e.target.value)
                }}
              />
            </div>
            <div className='flex gap-1'>
              <Button onClick={() => {
                setNewKFARAp('')
                setShowAddNewKFARAp(false)
              }}>Cancel</Button>
              <Button onClick={() => {
                if(newKFARAp) {
                  let l = kFARAp.key.length
                  dispatch(updateDataProp({
                    attr: `kFARAp.key[${l}]`,
                    value: newKFARAp
                  }))
                  kFARAp.data.forEach((d, i) => {
                    dispatch(updateDataProp({
                      attr: `kFARAp.data[${i}].data[${l}]`,
                      value: 0
                    }))
                  })
                  setNewKFARAp('')
                  setShowAddNewKFARAp(false)
                }
              }}>Save</Button>
            </div>
          </div>
        ) : (
        <div>
          <Button onClick={() => {
            onClickAddNewKFARAp()
          }}>Add new key</Button>
        </div>
        )}
      </div>

      {tableOfContents[11].visible && (
        <>
          <div className="mb-4">
            <RecommendationInput entity="kFApex" values={kFApexRecommendations} />
          </div>
        </>
      )}
    </div>
  );
};

export default KfaForm;
