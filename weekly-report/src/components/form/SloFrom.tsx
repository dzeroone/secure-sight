import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { addSloData, removeSloDataPropArr, updateSloData } from '../../features/weekly/sloSlice';
import { MdClose, MdEdit } from 'react-icons/md';
import Label from './Label';
import { TextAreaInput, TextInput } from './Inputs';
import { updateDataProp } from '../../features/weekly/weeklySlice';
import Button from '../Button';
import { confirm } from '../../utils/confirm';

const SloForm: React.FC = () => {
    const dispatch = useDispatch();
    const sloData = useSelector((state: RootState) => state.slo.data);
    const sloCV = useSelector((state: RootState) => state.data.sloCV);

    // Function to handle adding or editing SLO data
    const handleAdd = () => {
        dispatch(updateSloData({
            attr: `data[${sloData.length}]`,
            value: {
                Priority: "",
                Description: "",
                Response_Time: ""
            }
        }))
    };

    // Function to handle removing an existing SLO entry
    const onClickRemoveSloData = async (index: number) => {
        const confirmed = await confirm({
            title: "Are you sure?",
            confirmation: "You are going to remove a SLO entry."
        })
        if(confirmed) {
            dispatch(removeSloDataPropArr({
                attr: "data",
                index
            }));
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg border shadow-md">
            <h3 className="text-lg font-semibold mb-4">SLO Details Table</h3>
            <div className="flex flex-col gap-2 mb-4">
                <div>
                    <Label>Total closed incidents</Label>
                    <TextInput
                        type="number"
                        value={sloCV.tCI}
                        onChange={(e) => {
                            dispatch(updateDataProp({
                                attr: "sloCV.tCI",
                                value: Number(e.target.value) || 0
                            }))
                        }}
                    />
                </div>
                <div>
                    <Label>SLO Met</Label>
                    <TextInput
                        type="number"
                        value={sloCV.sloMet}
                        onChange={(e) => {
                            dispatch(updateDataProp({
                                attr: "sloCV.sloMet",
                                value: Number(e.target.value) || 0
                            }))
                        }}
                    />
                </div>
                <div>
                    <Label>SLO not Met</Label>
                    <TextInput
                        type="number"
                        value={sloCV.sloNMet}
                        onChange={(e) => {
                            dispatch(updateDataProp({
                                attr: "sloCV.sloNMet",
                                value: Number(e.target.value) || 0
                            }))
                        }}
                    />
                </div>
            </div>
            <div>
                <div className="font-semibold">SLO details</div>
                <div className="flex flex-col gap-4">
                    {sloData.map((sd, i) => {
                        return (
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col flex-1 gap-2" key={i}>
                                    <div>
                                        <Label htmlFor={`priority-${i}`}>Priority</Label>
                                        <TextInput
                                            id={`priority-${i}`}
                                            value={sloData[i].Priority}
                                            onChange={(e) => dispatch(updateSloData({
                                                attr: `data[${i}].Priority`,
                                                value: e.target.value
                                            }))}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`description-${i}`}>Description</Label>
                                        <TextAreaInput
                                            id={`description-${i}`}
                                            value={sloData[i].Description}
                                            onChange={(e) => dispatch(updateSloData({
                                                attr: `data[${i}].Description`,
                                                value: e.target.value
                                            }))}
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`responseTime-${i}`}>Response Time</Label>
                                        <TextAreaInput
                                            id={`responseTime-${i}`}
                                            value={sloData[i].Response_Time}
                                            onChange={(e) => dispatch(updateSloData({
                                                attr: `data[${i}].Response_Time`,
                                                value: e.target.value
                                            }))}
                                        />
                                    </div>
                                    <div>
                                        <hr />
                                    </div>
                                </div>
                                <div>
                                    <Button onClick={() => {
                                        onClickRemoveSloData(i)
                                    }}>X</Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            
            <button
                onClick={handleAdd}
                className="w-full px-4 py-2 bg-[#2f3848] text-white rounded-md focus:outline-none"
            >
                Add SLO
            </button>


        </div>
    );
};

export default SloForm;
