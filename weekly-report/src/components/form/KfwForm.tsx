import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { MdClose } from 'react-icons/md';
import { SwitchInput, TextInput } from './Inputs';
import { removeDataPropArr, updateDataProp, updateTableOfContents } from '../../features/weekly/weeklySlice';
import RecommendationInput from './RecommendationInput';
import { confirm } from '../../utils/confirm';
import Button from '../Button';
import Label from './Label';

const KfwForm = () => {
  const dispatch = useDispatch();
  const tableOfContents = useSelector((s: RootState) => s.tableOfContents);
  const kFWorkloadRecommendations = useSelector((s: RootState) => s.recommendation.kFWorkload);
  const kFARWl = useSelector((s: RootState) => s.data.kFARWl);
  
  const [showAddNewKFARWl, setShowAddNewKFARWl] = useState(false)
  const [newKFARWl, setNewKFARWl] = useState('')

  const onClickRemoveKFARWl = async (index: number) => {
    const confirmed = await confirm({
      title: 'Are you sure?',
      confirmation: 'You are going to remove a feature key from Workload'
    })
    if(confirmed) {
      dispatch(removeDataPropArr({
        attr: 'kFARWl.key',
        index
      }))
      kFARWl.data.forEach((d, i) => {
        dispatch(removeDataPropArr({
          attr: `kFARWl.data[${i}].data`,
          index
        }))
      })
    }
  }

  const onClickAddNewKFARWl = () => {
    setShowAddNewKFARWl(true)
  }
  
  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <h3 className="text-lg font-semibold mb-4">Key Feature Workload Form</h3>
      <div className='mb-4'>
        Visibility <SwitchInput checked={tableOfContents[12].visible} onChange={(e) => {
          dispatch(updateTableOfContents({
            attr: `[${12}].visible`,
            value: e.target.checked
          }))
        }}/>
      </div>

      <div className='mb-4 flex flex-col gap-2'>
        {kFARWl.key.map((k, i) => {
          return (
            <div key={k}>
              <div className='text-sm font-semibold mb-1'>
                {k}
                <Button className='inline-flex ml-1 px-2 py-1 from-red-400 to-red-800' onClick={() => {
                  onClickRemoveKFARWl(i)
                }}>X</Button>
              </div>
              <div className='flex flex-col gap-1'>
                {kFARWl.data.map((cd, cdi) => {
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
                              attr: `kFARWl.data[${cdi}].data[${i}]`,
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
        {showAddNewKFARWl ? (
          <div>
            <div className="text-sm font-semibold">New key</div>
            <div className='mb-1'>
              <Label>New key name</Label>
              <TextInput
                value={newKFARWl}
                onChange={(e) => {
                  setNewKFARWl(e.target.value)
                }}
              />
            </div>
            <div className='flex gap-1'>
              <Button onClick={() => {
                setNewKFARWl('')
                setShowAddNewKFARWl(false)
              }}>Cancel</Button>
              <Button onClick={() => {
                if(newKFARWl) {
                  let l = kFARWl.key.length
                  dispatch(updateDataProp({
                    attr: `kFARWl.key[${l}]`,
                    value: newKFARWl
                  }))
                  kFARWl.data.forEach((d, i) => {
                    dispatch(updateDataProp({
                      attr: `kFARWl.data[${i}].data[${l}]`,
                      value: 0
                    }))
                  })
                  setNewKFARWl('')
                  setShowAddNewKFARWl(false)
                }
              }}>Save</Button>
            </div>
          </div>
        ) : (
        <div>
          <Button onClick={() => {
            onClickAddNewKFARWl()
          }}>Add new key</Button>
        </div>
        )}
      </div>

      {tableOfContents[12].visible && (
        <>
          <div className="mb-4">
            <RecommendationInput entity="kFWorkload" values={kFWorkloadRecommendations} />
          </div>
        </>
      )}
    </div>
  );
};

export default KfwForm;
