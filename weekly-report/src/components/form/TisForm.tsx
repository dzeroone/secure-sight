import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  addMatchedIco,
  editMatchedIco,
  removeMatchedIco,
  updateIncidentSummaryData,
  updateMatchSummaryData,
  addChartBar,
  removeChartBar,
  updateLabel
} from '../../features/weekly/weeklySlice';
import { MdClose, MdEdit } from 'react-icons/md';
import RecommendationInput from './RecommendationInput';

const TisForm = () => {
  const dispatch = useDispatch();
  const iocMatchedRecommendations = useSelector((s: RootState) => s.recommendation.iocMatched);
  const iSeverityRecommendations = useSelector((s: RootState) => s.recommendation.iSeverity);
  const iStatusRecommendations = useSelector((s: RootState) => s.recommendation.iStatus);
  const iPriorityRecommendations = useSelector((s: RootState) => s.recommendation.iPriority);
  const tIByCategoryRecommendations = useSelector((s: RootState) => s.recommendation.tIByCategory);

  const [srNo, setSrNo] = useState<number>(0);
  const [advisoryName, setAdvisoryName] = useState<string>("");
  const [matchedIocType, setMatchedIocType] = useState<string>("");
  const [matchedIocDetails, setMatchedIocDetails] = useState<string>("");
  const [noOfendpoint, setNoOfendpoint] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const matchedIcos = useSelector((state: RootState) => state.matchedIcos.matchedIcosData);

  const handleAddOrEditMatchedIco = () => {
    const newIcoData = {
      srNo,
      advisoryName,
      matchedIocType,
      matchedIocDetails,
      noOfendpoint,
    };

    if (isEditing && editIndex !== null) {
      // Dispatch edit action
      dispatch(
        editMatchedIco({
          index: editIndex,
          updatedData: newIcoData,
        })
      );
      setIsEditing(false);
      setEditIndex(null);
    } else {
      // Dispatch add action
      dispatch(addMatchedIco(newIcoData));
    }

    // Reset form fields
    resetForm();
  };

  const resetForm = () => {
    setSrNo(0);
    setAdvisoryName('');
    setMatchedIocType('');
    setMatchedIocDetails('');
    setNoOfendpoint(0);
  };

  const handleEditMatchedIco = (index: number) => {
    const ico = matchedIcos[index];
    setSrNo(ico.srNo);
    setAdvisoryName(ico.advisoryName);
    setMatchedIocType(ico.matchedIocType);
    setMatchedIocDetails(ico.matchedIocDetails);
    setNoOfendpoint(ico.noOfendpoint);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleRemoveMatchedIco = (index: number) => {
    dispatch(removeMatchedIco(index));
  };


  const incidentSummary = useSelector((state: RootState) => state.incidentSummary);

  const handleInputChange = (field: 'closed' | 'pendingFromSOC' | 'pendingFromCustomer', index: number, value: string) => {
    const updatedValues = [...incidentSummary[field]];
    updatedValues[index] = Number(value);

    // Dispatch updated data to Redux
    dispatch(updateIncidentSummaryData({
      closed: field === 'closed' ? updatedValues : incidentSummary.closed,
      pendingFromSOC: field === 'pendingFromSOC' ? updatedValues : incidentSummary.pendingFromSOC,
      pendingFromCustomer: field === 'pendingFromCustomer' ? updatedValues : incidentSummary.pendingFromCustomer,
    }));
  };

  const matchSummary = useSelector((state: RootState) => state.matchSummary);

  const handleMatchSummaryChange = (field: 'iocSweeped' | 'iocMatched', index: number, value: string) => {
    const updatedValues = [...matchSummary[field]];
    updatedValues[index] = Number(value);

    dispatch(updateMatchSummaryData({
      iocSweeped: field === 'iocSweeped' ? updatedValues : matchSummary.iocSweeped,
      iocMatched: field === 'iocMatched' ? updatedValues : matchSummary.iocMatched,
      labels: matchSummary.labels,
    }));
  };

  const handleAddChartBar = () => {
    dispatch(addChartBar());
  };

  const handleRemoveChartBar = (index: number) => {
    dispatch(removeChartBar(index));
  };

  const handleLabelChange = (index: number, value: string) => {
    dispatch(updateLabel({ index, label: value }));
  };



  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">

      <h3 className="text-lg font-semibold mb-4">Threat Intel Summary Form</h3>
      <div className="">
        <h3 className="text-lg font-semibold mb-4">Match Summary by IOC Chart</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">IOC Sweeped</label>
          <div className='grid grid-cols-1 gap-2'>
            {matchSummary.iocSweeped.map((value, index) => (
              <div key={index} className="relative flex items-center space-x-2">
                <input
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  type="number"
                  value={value}
                  onChange={(e) => handleMatchSummaryChange('iocSweeped', index, e.target.value)}
                />
                <input
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  type="text"
                  placeholder="Label"
                  value={matchSummary.labels[index]}
                  onChange={(e) => handleLabelChange(index, e.target.value)}
                />
                <button onClick={() => handleRemoveChartBar(index)} className="text-red-500">
                  <MdClose />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">IOC Matched</label>
          <div className='grid grid-cols-1 gap-2'>
            {matchSummary.iocMatched.map((value, index) => (
              <div key={index} className="relative flex items-center space-x-2">
                <input
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  type="number"
                  value={value}
                  onChange={(e) => handleMatchSummaryChange('iocMatched', index, e.target.value)}
                />
                {/* <input
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  type="text"
                  placeholder="Label"
                  value={matchSummary.labels[index]}
                  onChange={(e) => handleLabelChange(index, e.target.value)}
                /> */}
                <button onClick={() => handleRemoveChartBar(index)} className="text-red-500">
                  <MdClose />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleAddChartBar}
          className="mb-2 w-full px-4 py-2 bg-[#2f3848] text-white rounded-md focus:outline-none"
        >
          Add Bar
        </button>
      </div>


      <div className="my-4">
        <h3 className="text-lg font-semibold mb-4">IOC Match Summary</h3>
      </div>
      <div className="mb-4">
        <RecommendationInput entity="iocMatched" values={iocMatchedRecommendations} />
      </div>

      <div>
        <h3 className="text-lg font-semibold my-4">Matched IOCs Detailed Summary</h3>
        <div className="mt-6">
          <h3 className="text-lg font-semibold m">Added Data</h3>
          {matchedIcos.length > 0 ? (
            matchedIcos.map((ico, index) => (
              <div key={index} className="flex items-center justify-between p-4rounded-md mb-4">
                <div>
                  <p className="text-sm">Sr. No: {ico.srNo}</p>
                  <p className="text-sm">Advisory Type: {ico.advisoryName}</p>
                  <p className="text-sm">IOC Type: {ico.matchedIocType}</p>
                  <p className="text-sm">IOC Details: {ico.matchedIocDetails}</p>
                  <p className="text-sm">No. of Endpoints: {ico.noOfendpoint}</p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleEditMatchedIco(index)}
                    className="flex items-center justify-center p-2 bg-[#2f3848] text-white rounded-md mr-2"
                  >
                    <MdEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleRemoveMatchedIco(index)}
                    className="flex items-center justify-center p-2 bg-red-500 text-white rounded-md"
                  >
                    <MdClose size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No matched IOCs added yet.</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="sr_no" className="block text-sm font-medium text-gray-700 mb-2">Sr. No.</label>
          <input
            id="sr_no"
            type="text"
            value={srNo}
            onChange={(e) => setSrNo(Number(e.target.value))}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="advisory_name" className="block text-sm font-medium text-gray-700 mb-2">Advisory Name</label>
          <input
            id="advisory_name"
            type="text"
            value={advisoryName}
            onChange={(e) => setAdvisoryName(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="matched_ioc_type" className="block text-sm font-medium text-gray-700 mb-2">Matched IOC Type</label>
          <input
            id="matched_ioc_type"
            type="text"
            value={matchedIocType}
            onChange={(e) => setMatchedIocType(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="matched_ioc_details" className="block text-sm font-medium text-gray-700 mb-2">Matched IOC Details</label>
          <input
            id="matched_ioc_details"
            type="text"
            value={matchedIocDetails}
            onChange={(e) => setMatchedIocDetails(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="no_of_endpoint" className="block text-sm font-medium text-gray-700 mb-2">No. of Endpoints</label>
          <input
            id="no_of_endpoint"
            type="number"
            value={noOfendpoint}
            onChange={(e) => setNoOfendpoint(Number(e.target.value))}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          onClick={handleAddOrEditMatchedIco}
          className="w-full px-4 py-2 bg-[#2f3848] text-white rounded-md focus:outline-none"
        >
          {isEditing ? 'Update' : 'Add'}
        </button>
      </div>

      {/* INCIDENTS SUMMARY BY SEVERITY */}
      <div>
        <h3 className="text-lg font-semibold mt-8 mb-4">INCIDENTS SUMMARY BY SEVERITY</h3>
        <div className="mb-4">
          <RecommendationInput entity="iSeverity" values={iSeverityRecommendations} />
        </div>
      </div>



      {/* List of Matched IOCs */}


      {/* Incident Summary by status Form */}
      <div>
        <h3 className="text-lg font-semibold mt-8 mb-4">Incident Summary by status</h3>
        <div className="mb-4">
          <RecommendationInput entity="iStatus" values={iStatusRecommendations} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mt-8 mb-4">Incidents Summary by Priority Chart</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Closed</label>
          <div className='grid grid-cols-3 gap-2'>
            {incidentSummary.closed.map((value, index) => (
              <input
                key={index}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                type="number"
                value={value}
                onChange={(e) => handleInputChange('closed', index, e.target.value)}
              />
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Pending from SOC</label>
          <div className='grid grid-cols-3 gap-2'>
            {incidentSummary.pendingFromSOC.map((value, index) => (
              <input
                key={index}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                type="number"
                value={value}
                onChange={(e) => handleInputChange('pendingFromSOC', index, e.target.value)}
              />
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Pending from Customer</label>
          <div className='grid grid-cols-3 gap-2'>
            {incidentSummary.pendingFromCustomer.map((value, index) => (
              <input
                key={index}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                type="number"
                value={value}
                onChange={(e) => handleInputChange('pendingFromCustomer', index, e.target.value)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Incidents Summary by Priority Form */}
      <div>
        <h3 className="text-lg font-semibold mt-8 mb-4">Incidents Summary by Priority</h3>
        <div className="mb-4">
          <RecommendationInput entity="iPriority" values={iPriorityRecommendations} />
        </div>
      </div>

      {/* Top Incidents Summary by Category Form */}
      <div>
        <h3 className="text-lg font-semibold mt-8 mb-4">Top Incidents Summary by Category</h3>
        <div className="mb-4">
          <RecommendationInput entity="tIByCategory" values={tIByCategoryRecommendations} />
        </div>
      </div>
    </div>
  );
};

export default TisForm;
