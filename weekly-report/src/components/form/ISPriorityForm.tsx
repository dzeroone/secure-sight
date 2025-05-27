import { updateIncidentSummaryData } from "@/features/weekly/weeklySlice";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { TextInput } from "./Inputs";
import Label from "./Label";
import RecommendationInput from "./RecommendationInput";

export default function ISPriorityForm() {
  const dispatch = useDispatch()
  const iPriorityRecommendations = useSelector((s: RootState) => s.recommendation.iPriority);
  const client = useSelector((state: RootState) => state.client);
  const incidentSummary = useSelector((state: RootState) => state.incidentSummary);
  
    const handleInputChange = (field: 'closed' | 'closedWOAck' | 'pendingFromSOC' | 'pendingFromCustomer', index: number, value: string) => {
      const updatedValues = [...incidentSummary[field]];
      updatedValues[index] = Number(value);
  
      // Dispatch updated data to Redux
      dispatch(updateIncidentSummaryData({
        closed: field === 'closed' ? updatedValues : incidentSummary.closed,
        closedWOAck: field === 'closedWOAck' ? updatedValues : incidentSummary.closedWOAck,
        pendingFromSOC: field === 'pendingFromSOC' ? updatedValues : incidentSummary.pendingFromSOC,
        pendingFromCustomer: field === 'pendingFromCustomer' ? updatedValues : incidentSummary.pendingFromCustomer,
      }));
    };

  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <div>
        <h3 className="text-lg font-semibold mb-4">Incidents Summary by Priority Chart</h3>
        <div className="mb-4">
          <Label>Closed</Label>
          <div className='grid grid-cols-3 gap-2'>
            {incidentSummary.closed.map((value, index) => (
              <TextInput
                key={index}
                type="number"
                value={value}
                onChange={(e) => handleInputChange('closed', index, e.target.value)}
              />
            ))}
          </div>
        </div>
        <div className="mb-4">
          <Label>Closed without acknowledgement</Label>
          <div className='grid grid-cols-3 gap-2'>
            {incidentSummary.closedWOAck.map((value, index) => (
              <TextInput
                key={index}
                type="number"
                value={value}
                onChange={(e) => handleInputChange('closedWOAck', index, e.target.value)}
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
          <label className="block text-sm font-medium text-gray-700">Pending from {client.tenantCode}</label>
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
    </div>
  )
}