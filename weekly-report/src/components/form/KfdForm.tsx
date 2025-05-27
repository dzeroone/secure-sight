import { useDispatch, useSelector } from 'react-redux';
import { removeDataPropArr, updateDataProp, updateTableOfContents } from '../../features/weekly/weeklySlice';
import { RootState } from '../../store/store';
import { SwitchInput, TextInput } from './Inputs';
import RecommendationInput from './RecommendationInput';
import { useState } from 'react';
import Button from '../Button';
import Label from './Label';
import { confirm } from '../../utils/confirm';

const KfdForm = () => {
  const dispatch = useDispatch();
  const tableOfContents = useSelector((s: RootState) => s.tableOfContents);
  const kFDeepRecommendations = useSelector((s: RootState) => s.recommendation.kFDeep);

  const kFARDs = useSelector((s: RootState) => s.data.kFARDs);
    
  const [showAddNewKFARDs, setShowAddNewKFARDs] = useState(false)
  const [newKFARDs, setNewKFARDs] = useState('')

  const onClickRemoveKFARDs = async (index: number) => {
    const confirmed = await confirm({
      title: 'Are you sure?',
      confirmation: 'You are going to remove a feature key from Deep Security'
    })
    if(confirmed) {
      dispatch(removeDataPropArr({
        attr: 'kFARDs.key',
        index
      }))
      kFARDs.data.forEach((d, i) => {
        dispatch(removeDataPropArr({
          attr: `kFARDs.data[${i}].data`,
          index
        }))
      })
    }
  }

  const onClickAddNewKFARDs = () => {
    setShowAddNewKFARDs(true)
  }

  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <h3 className="text-lg font-semibold mb-4">Key Feature Deep Security <br /> Form</h3>
      <div className='mb-4'>
        Visibility <SwitchInput checked={tableOfContents[13]?.visible} onChange={(e) => {
          dispatch(updateTableOfContents({
            attr: `[${13}].visible`,
            value: e.target.checked
          }))
        }}/>
      </div>

      <div className='mb-4 flex flex-col gap-2'>
        {kFARDs.key.map((k, i) => {
          return (
            <div key={k}>
              <div className='text-sm font-semibold mb-1'>
                {k}
                <Button className='inline-flex ml-1 px-2 py-1 from-red-400 to-red-800' onClick={() => {
                  onClickRemoveKFARDs(i)
                }}>X</Button>
              </div>
              <div className='flex flex-col gap-1'>
                {kFARDs.data.map((cd, cdi) => {
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
                              attr: `kFARDs.data[${cdi}].data[${i}]`,
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
        {showAddNewKFARDs ? (
          <div>
            <div className="text-sm font-semibold">New key</div>
            <div className='mb-1'>
              <Label>New key name</Label>
              <TextInput
                value={newKFARDs}
                onChange={(e) => {
                  setNewKFARDs(e.target.value)
                }}
              />
            </div>
            <div className='flex gap-1'>
              <Button onClick={() => {
                setNewKFARDs('')
                setShowAddNewKFARDs(false)
              }}>Cancel</Button>
              <Button onClick={() => {
                if(newKFARDs) {
                  let l = kFARDs.key.length
                  dispatch(updateDataProp({
                    attr: `kFARDs.key[${l}]`,
                    value: newKFARDs
                  }))
                  kFARDs.data.forEach((d, i) => {
                    dispatch(updateDataProp({
                      attr: `kFARDs.data[${i}].data[${l}]`,
                      value: 0
                    }))
                  })
                  setNewKFARDs('')
                  setShowAddNewKFARDs(false)
                }
              }}>Save</Button>
            </div>
          </div>
        ) : (
        <div>
          <Button onClick={() => {
            onClickAddNewKFARDs()
          }}>Add new key</Button>
        </div>
        )}
      </div>

      {/* Conditionally Render the Form Based on Visibility */}
      {tableOfContents[13]?.visible && (
        <>
          <div className="mb-4">
            <RecommendationInput entity="kFDeep" values={kFDeepRecommendations} />
          </div>
        </>
      )}
    </div>
  );
};

export default KfdForm;
