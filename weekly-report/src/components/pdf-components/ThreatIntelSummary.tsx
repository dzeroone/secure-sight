// import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DoughnutChat from "../charts/DoughnutChat";
import GroupedBarChart from "../charts/GroupedBarChart";
import StackedHorizontalBarChart from "../charts/StackedHorizontalBarChart";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key, useMemo } from "react";
import { RootState } from "../../store/store";

interface ThreatIntelSummaryProps {
  data: any;
  formData: {
    key: 'Recommendations' | 'Notes' | 'Summary';
    data: string[];
  };
  formData2: {
    key: 'Recommendations' | 'Notes' | 'Summary';
    data: string[];
  };
  formData3: {
    key: 'Recommendations' | 'Notes' | 'Summary';
    data: string[];
  };
  formData4: {
    key: 'Recommendations' | 'Notes' | 'Summary';
    data: string[];
  };
  formData5: {
    key: 'Recommendations' | 'Notes' | 'Summary';
    data: string[];
  };
}


const ThreatIntelSummary: React.FC<ThreatIntelSummaryProps> = ({ data, formData, formData2, formData3, formData4, formData5 }: any) => {
  const matchedIcosData = useSelector((state: any) => state.matchedIcos.matchedIcosData);

  const incidentSummary = useSelector((state: RootState) => state.incidentSummary);
  const matchSummary = useSelector((state: RootState) => state.matchSummary);

  const chartData = {
    Key: ['P1', 'P2', 'P3', 'P4'],
    data: [
      {
        label: "Closed",
        data: incidentSummary.closed,
        backgroundColor: "#ff8200"
      },
      {
        label: "Pending from SOC",
        data: incidentSummary.pendingFromSOC,
        backgroundColor: "#ffa950"
      },
      {
        label: "Pending from Customer",
        data: incidentSummary.pendingFromCustomer,
        backgroundColor: "#ffd9b2"
      }
    ]
  };

  // const matchSummaryData = useMemo(() => ({
  //   Key: ['IP', 'URL', 'Hash', 'Domain', 'Email', 'File', 'Certificate'],
  //   data: [
  //     {
  //       label: "IOC Sweeped",
  //       data: matchSummary.iocSweeped,
  //       backgroundColor: "#e67701",
  //     },
  //     {
  //       label: "IOC Matched",
  //       data: matchSummary.iocMatched,
  //       backgroundColor: "#696969",
  //     },
  //   ],
  // }), [matchSummary.iocSweeped, matchSummary.iocMatched]);

  const matchSummaryData = useMemo(() => {
    return {
      Key: matchSummary.labels, // Use labels from matchSummary as the keys for each bar
      data: [
        {
          label: "IOC Sweeped",
          data: matchSummary.iocSweeped,
          backgroundColor: "#e67701",
        },
        {
          label: "IOC Matched",
          data: matchSummary.iocMatched,
          backgroundColor: "#696969",
        },
      ],
    };
  }, [matchSummary.iocSweeped, matchSummary.iocMatched, matchSummary.labels]);




  return (
    <div className="threat-intel-summary" id={Object.keys(data.date)[0]}>
      <div className="">
        <p className="title">THREAT INTEL SUMMARY</p>
        <p className="font-normal">
          It refers to the process of collecting, analyzing, and disseminating
          information about potential and current cyber threats.
        </p>
        <p className="title">INDICATORS OF COMPROMISE (IOC) MATCH SUMMARY</p>
        <div className="w-4/5 mx-auto">
          <GroupedBarChart
            data={matchSummaryData}
          // data={data?.date.THREAT_INTEL_SUMMARY.Indicators_of_Compromise_IOC}
          />
        </div>

        <p className="font-bold capitalize">
          {formData?.key}
        </p>
        <ul>
          {formData?.data.map((item: string, i: number) => (
            <li key={i} className="text-sm">
              {item}
            </li>
          ))}
        </ul>
        <p className="title">MATCHED IOCs DETAILED SUMMARY</p>
        <table
          className="w-full border-spacing-1 mb-12 border-none border-separate"
          cellPadding={5}
          cellSpacing={5}
        >
          <thead>
            <tr className="bg-[#696969] text-white text-left text-base tracking-wide">
              <th className="p-4">Sr. No.</th>
              <th className="p-4">Advisory Name</th>
              <th className="p-4">Matched IOC Type</th>
              <th className="p-4">Matched IOC Details</th>
              <th className="p-4">No of Endpoints / Email</th>
            </tr>
          </thead>
          <tbody className="bg-[#ededed] text-sm font-light">
            {matchedIcosData.map((item: { srNo: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; advisoryName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; matchedIocType: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; matchedIocDetails: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; noOfendpoint: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, i: Key | null | undefined) => (
              <tr key={i}>
                <td className="p-4 font-medium">{item.srNo}</td>
                <td className="p-4 font-medium">{item.advisoryName}</td>
                <td className="p-4 font-medium">{item.matchedIocType}</td>
                <td className="p-4 font-medium">{item.matchedIocDetails}</td>
                <td className="p-4 font-medium">{item.noOfendpoint}</td>
              </tr>
            ))}
          </tbody>
          {/* <tbody className="bg-[#ededed] text-sm font-light">
            {data?.date.THREAT_INTEL_SUMMARY.Matched_IOCs_Detailed_Summary.map(
              (item: any, i: number) => (
                <tr key={i}>
                  <td className="p-4 font-medium">{item.Sr_No}</td>
                  <td className="p-4 font-medium">{item.Advisory_Name}</td>
                  <td className="p-4 font-medium">{item.M_IOC_Type}</td>
                  <td className="p-4 font-medium">{item.M_IOC_Detail}</td>
                  <td className="p-4 font-medium">{item["No_of_End/Email"]}</td>
                </tr>
              )
            )}
          </tbody> */}

        </table>
        <p className="title break-before-page">INCIDENTS SUMMARY BY SEVERITY</p>
        <div className="w-full grid grid-flow-row grid-cols-2 items-center gap-6">
          <div>
            <DoughnutChat
              data={
                data?.date.THREAT_INTEL_SUMMARY.Incident_Summary_by_Severity
              }
            />
          </div>
          {/* <div className="pl-10">
            <p className="font-bold capitalize">
              {data?.date.THREAT_INTEL_SUMMARY.R_S_N_ISBS.key}
            </p>
            <ul className="list-outside text-justify">
              {data?.date.THREAT_INTEL_SUMMARY.R_S_N_ISBS.data.map(
                (item: string, i: number) => (
                  <li key={i} className="text-sm text-justify">
                    {item}
                  </li>
                )
              )}
            </ul>
          </div> */}
          <div className="pl-10">
            <p className="font-bold capitalize">
              {formData5.key}
            </p>
            <ul className="list-outside text-justify">
              {formData5?.data.map((item: string, i: number) => (
                <li key={i} className="text-sm text-justify">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="title">Incident Summary by status</p>
        <div className="w-full grid grid-flow-row grid-cols-2 items-center gap-6">
          <div>
            <DoughnutChat
              data={data?.date.THREAT_INTEL_SUMMARY.Incident_Summary_by_status}
              legend
            />
          </div>
          {/* <div className="pl-10">
            <p className="font-bold capitalize">
              {data?.date.THREAT_INTEL_SUMMARY.R_S_N_ISB_Status.key}
            </p>
            <ul className="list-outside text-justify">
              {data?.date.THREAT_INTEL_SUMMARY.R_S_N_ISB_Status.data.map(
                (item: string, i: number) => (
                  <li key={i} className="text-sm text-justify">
                    {item}
                  </li>
                )
              )}
            </ul>
          </div> */}
          <div className="pl-10">
            <p className="font-bold capitalize">
              {formData4.key}
            </p>
            <ul className="list-outside text-justify">
              {formData4?.data.map((item: string, i: number) => (
                <li key={i} className="text-sm text-justify">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="title break-before-page">INCIDENTS SUMMARY BY PRIORITY</p>
        <div className="w-full flex flex-row items-center">
          <div className="w-3/5">
            {/* <GroupedBarChart
              data={
                data?.date.THREAT_INTEL_SUMMARY.Incidents_Summary_by_Priority
              }
            /> */}
            <GroupedBarChart
              data={chartData}
            />
          </div>
          {/* <div className="w-2/5 pl-14">
            <p className="font-bold capitalize">
              {data?.date.THREAT_INTEL_SUMMARY.R_S_N_ISBP.key}
            </p>
            <ul className="list-outside text-justify">
              {data?.date.THREAT_INTEL_SUMMARY.R_S_N_ISBP.data.map(
                (item: string, i: number) => (
                  <li key={i} className="text-sm text-justify">
                    {item}
                  </li>
                )
              )}
            </ul>
          </div> */}
          <div className="w-2/5 pl-14">
            <p className="font-bold capitalize">
              {formData3.key}
            </p>
            <ul>
              {formData3?.data.map((item: string, i: number) => (
                <li key={i} className="text-sm text-justify">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="title">Top Incidents Summary by Category</p>
        <StackedHorizontalBarChart
          data={data?.date.THREAT_INTEL_SUMMARY.T10IS_by_Category}
        />
        {/* <p className="font-bold capitalize">
          {data?.date.THREAT_INTEL_SUMMARY.R_S_N_T10IS.key}
        </p>
        <ul>
          {data?.date.THREAT_INTEL_SUMMARY.R_S_N_T10IS.data.map(
            (item: string, i: number) => (
              <li key={i} className="text-sm text-justify">
                {item}
              </li>
            )
          )}
        </ul> */}
        <p className="font-bold capitalize">
          {formData2?.key}
        </p>
        <ul>
          {formData2?.data.map((item: string, i: number) => (
            <li key={i} className="text-sm">
              {item}
            </li>
          ))}
        </ul>
      </div>
      {/* <div
        className="blank-page"
        style={{ height: `${1123 * data?.blank ?? 0}px` }}
      ></div> */}
    </div >
  );
};

export default ThreatIntelSummary;
