// import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DoughnutChat from "../charts/DoughnutChat";
import GroupedBarChart from "../charts/GroupedBarChart";
import StackedHorizontalBarChart from "../charts/StackedHorizontalBarChart";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  Key,
  useMemo,
} from "react";
import { RootState } from "../../store/store";
import RecommendationNotes from "../RecommendationNotes";

interface ThreatIntelSummaryProps {
  data: any;
}

const ThreatIntelSummary: React.FC<ThreatIntelSummaryProps> = ({
  data,
}: any) => {
  const matchedIcosData = useSelector(
    (state: any) => state.matchedIcos.matchedIcosData
  );

  const incidentSummary = useSelector(
    (state: RootState) => state.incidentSummary
  );
  const matchSummary = useSelector((state: RootState) => state.matchSummary);
  const tableOfContents = useSelector((s: RootState) => s.tableOfContents);
  const iocMatchedRecommendations = useSelector(
    (s: RootState) => s.recommendation.iocMatched
  );
  const iSeverityRecommendations = useSelector(
    (s: RootState) => s.recommendation.iSeverity
  );
  const iStatusRecommendations = useSelector(
    (s: RootState) => s.recommendation.iStatus
  );
  const iPriorityRecommendations = useSelector(
    (s: RootState) => s.recommendation.iPriority
  );
  const tIByCategoryRecommendations = useSelector(
    (s: RootState) => s.recommendation.tIByCategory
  );
  const dataState = useSelector((s: RootState) => s.data);
  const client = useSelector((s: RootState) => s.client);

  const chartData = {
    Key: ["P1", "P2", "P3", "P4"],
    data: [
      {
        label: "Closed",
        data: incidentSummary.closed,
        backgroundColor: "#ff8200",
      },
      {
        label: "Closed without acknowledgement",
        data: incidentSummary.closedWOAck,
        backgroundColor: "#ffa950",
      },
      {
        label: "Pending from SOC",
        data: incidentSummary.pendingFromSOC,
        backgroundColor: "#ffd9b2",
      },
      {
        label: `Pending from ${client.tenantCode}`,
        data: incidentSummary.pendingFromCustomer,
        backgroundColor: "#ffe5b2",
      },
    ],
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
    <div className="threat-intel-summary" id="threat-intel">
      <div className="">
        {tableOfContents[1].visible && (
          <>
            <p className="title">THREAT INTEL SUMMARY</p>
            <p className="font-normal">
              It refers to the process of collecting, analyzing, and
              disseminating information about potential and current cyber
              threats.
            </p>
          </>
        )}
        {tableOfContents[2].visible && (
          <>
            <p className="title" id="indicators-of-compromise">
              INDICATORS OF COMPROMISE (IOC) MATCH SUMMARY
            </p>
            <div className="w-4/5 mx-auto">
              <GroupedBarChart
                data={matchSummaryData}
                // data={data?.date.THREAT_INTEL_SUMMARY.Indicators_of_Compromise_IOC}
              />
            </div>

            <RecommendationNotes notes={iocMatchedRecommendations} />

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
                {matchedIcosData.map(
                  (
                    item: {
                      srNo:
                        | string
                        | number
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | null
                        | undefined;
                      advisoryName:
                        | string
                        | number
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | null
                        | undefined;
                      matchedIocType:
                        | string
                        | number
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | null
                        | undefined;
                      matchedIocDetails:
                        | string
                        | number
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | null
                        | undefined;
                      noOfendpoint:
                        | string
                        | number
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | null
                        | undefined;
                    },
                    i: Key | null | undefined
                  ) => (
                    <tr key={i}>
                      <td className="p-4 font-medium">{item.srNo}</td>
                      <td className="p-4 font-medium">{item.advisoryName}</td>
                      <td className="p-4 font-medium">{item.matchedIocType}</td>
                      <td className="p-4 font-medium">
                        {item.matchedIocDetails}
                      </td>
                      <td className="p-4 font-medium">{item.noOfendpoint}</td>
                    </tr>
                  )
                )}
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
          </>
        )}
        {tableOfContents[3].visible && (
          <>
            <p
              className="title break-before-page"
              id="incident-summary-severity"
            >
              INCIDENTS SUMMARY BY SEVERITY
            </p>
            <div className="w-full grid grid-flow-row grid-cols-2 items-center gap-6">
              <div>
                <DoughnutChat
                  data={{
                    data: dataState.isSeverity,
                    label: ["Critical", "High", "Medium", "Low"],
                    backgroundColor: [
                      "#ff8200",
                      "#ffa950",
                      "#ffd9b2",
                      "#ffc0cb",
                    ],
                    chart_type: "doughnut",
                  }}
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
                <RecommendationNotes notes={iSeverityRecommendations} />
              </div>
            </div>
          </>
        )}
        {tableOfContents[4].visible && (
          <>
            <p className="title" id="incident-summary-status">
              Incident Summary by status
            </p>
            <div className="w-full grid grid-flow-row grid-cols-2 items-center gap-6">
              <div>
                <DoughnutChat
                  data={{
                    data: dataState.isStatus,
                    label: [
                      "Closed Incidents",
                      "Pending Incidents from SOC Team",
                      `Pending Incidents from ${client.tenantCode}`,
                    ],
                    backgroundColor: ["#ff8200", "#ffa950", "#ffe950"],
                    chart_type: "doughnut",
                  }}
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
                <RecommendationNotes notes={iStatusRecommendations} />
              </div>
            </div>
          </>
        )}
        {tableOfContents[5].visible && (
          <>
            <p
              className="title break-before-page"
              id="incident-summary-priority"
            >
              INCIDENTS SUMMARY BY PRIORITY
            </p>
            <div className="w-full flex flex-row items-center">
              <div className="w-3/5">
                {/* <GroupedBarChart
              data={
                data?.date.THREAT_INTEL_SUMMARY.Incidents_Summary_by_Priority
              }
            /> */}
                <GroupedBarChart data={chartData} />
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
                <RecommendationNotes notes={iPriorityRecommendations} />
              </div>
            </div>
          </>
        )}
        {tableOfContents[6].visible && (
          <>
            <p className="title" id="top-incident-summary-status">
              Top {dataState.t10ISCat.Key.length} Incidents Summary by Category
            </p>
            <div className="w-full" style={{height: `${dataState.t10ISCat.Key.length * 60}px`}}>
              <StackedHorizontalBarChart data={dataState.t10ISCat} />
            </div>
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
            <RecommendationNotes notes={tIByCategoryRecommendations} />
          </>
        )}
      </div>
      {/* <div
        className="blank-page"
        style={{ height: `${1123 * data?.blank ?? 0}px` }}
      ></div> */}
    </div>
  );
};

export default ThreatIntelSummary;
