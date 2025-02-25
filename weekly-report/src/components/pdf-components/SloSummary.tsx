import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import BarChart from '../charts/BarChart';

interface SloSummaryProps {
  data: any;
  formData: {
    key: string;
    data?: any;
  };
}
const SloSummary: React.FC<SloSummaryProps> = ({ data }) => {
  const sloDetails = useSelector((state: RootState) => state.slo.data);

  return (
    <div className="slo-summary">
      <div>
        <p className="title">SLO Summary</p>
        <BarChart data={data?.date.SLO_SUMMARY.graph} />
        <p className="title">SLO Details</p>
        <table
          className="w-full border-spacing-1 mb-12 border-none border-separate"
          cellPadding={5}
          cellSpacing={5}
        >
          <thead>
            <tr className="bg-[#696969] text-white text-left text-base tracking-wide">
              <th className="p-4">Priority</th>
              <th className="p-4">Description</th>
              <th className="p-4">Response Time</th>
            </tr>
          </thead>
          <tbody className="bg-[#ededed] text-sm font-light">
            {sloDetails.map((item, index) => (
              <tr key={index}>
                <td className="font-medium">{item.Priority}</td>
                <td className="font-medium">{item.Description}</td>
                <td className="font-medium">{item.Response_Time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SloSummary;
