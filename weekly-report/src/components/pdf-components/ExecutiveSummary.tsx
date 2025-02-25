import DoughnutChat from "../charts/DoughnutChat";
import PieChart from "../charts/PieChart";
import moment from "moment";
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface ExecutiveSummaryProps {
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
}


const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ data, formData, formData2, formData3 }) => {

  const endpointData = useSelector(
    (state: RootState) => state.endpoint.endpointData
  );
  const apexOne = useSelector((state: RootState) => state.apexOne);

  const chartData = {
    title: "apex_one",
    data: [
      Number(apexOne.latestVersion),
      Number(apexOne.olderVersion),
      Number(apexOne.endOfLife),
    ],
    backgroundColor: [
      "rgb(255, 130, 0)",
      "rgb(105, 105, 105)",
      "rgb(211, 47, 47)",
    ],
    label: ["Latest Version", "Older Version", "End of Life"],
  };

  const workloadSecurity = useSelector((state: RootState) => state.workloadSecurity);

  const chartData2 = {
    title: "workload_security",
    data: [
      Number(workloadSecurity.latestVersion),
      Number(workloadSecurity.olderVersion),
      Number(workloadSecurity.endOfLife),
    ],
    backgroundColor: [
      "rgb(255, 130, 0)",
      "rgb(105, 105, 105)",
      "rgb(211, 47, 47)",
    ],
    label: ["Latest Version", "Older Version", "End of Life"],
  };

  return (
    <div className="executive-summary" id={Object.keys(data.date)[0]}>
      <div className="">
        <p className="title">EXECUTIVE SUMMARY</p>
        <ul>
          <li className="text-sm mb-2">
            A total number of{" "}
            <strong>
              {data?.date.EXECUTIVE_SUMMARY.total_incidents.total_incidents}{" "}
              incidents
            </strong>{" "}
            were observed during the time frame of{" "}
            <strong>
              {moment(
                data?.date.EXECUTIVE_SUMMARY.total_incidents.start_date
              ).format("Do MMMM YYYY")}
            </strong>{" "}
            to{" "}
            <strong>
              {moment(
                data?.date.EXECUTIVE_SUMMARY.total_incidents.end_date
              ).format("Do MMMM YYYY")}
            </strong>
            .
          </li>
          <li>
            <strong>Risk Index:</strong>
            <table
              className="w-full border-none"
              cellPadding={0}
              cellSpacing={0}
            >
              <tbody>
                <tr>
                  <td width="15%" className="p-5">
                    <div className="w-[150px] relative">
                      <DoughnutChat
                        data={
                          data?.date.EXECUTIVE_SUMMARY.risk_index.chart || ""
                        }
                        label={false}
                      />
                      <p className="absolute top-1/2 left-1/2 m-0 text-2xl font-normal -translate-x-1/2 -translate-y-1/2">
                        {data?.date.EXECUTIVE_SUMMARY.risk_index.chart.data[0]}%
                      </p>
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="m-0 text-justify italic text-black font-normal">
                      The Risk Index is a comprehensive score based on the
                      dynamic assessment of risk factors inclusive of exposure,
                      attack risk, and security configurations risk.
                    </p>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </li>
          <li className="text-sm mb-2">
            <strong>
              {data?.date.EXECUTIVE_SUMMARY.highly_exploitable} Highly
              exploitable unique CVEs
            </strong>{" "}
            in Endpoints.
          </li>
          <li className="text-sm mb-2">
            <strong>
              {data?.date.EXECUTIVE_SUMMARY.Incident_Closed} Incident
            </strong>{" "}
            Closed without Customer Acknowledgement.
          </li>
        </ul>

        <p>
          <strong>
            Top {data?.date.EXECUTIVE_SUMMARY.top_incident.no_incidents}{" "}
            Incidents:
          </strong>
        </p>
        <ul>
          <li className="mb-4 text-sm">
            Highest({data?.date.EXECUTIVE_SUMMARY.Highest_incidient}) Incidents
            triggered on{" "}
            <strong>
              {moment(
                data?.date.EXECUTIVE_SUMMARY.Highest_incidient_date
              ).format("Do MMMM YYYY")}
            </strong>
          </li>
        </ul>
        <table
          className="w-full border-spacing-1 mb-1 border-none border-separate"
          cellPadding={5}
          cellSpacing={5}
        >
          <thead>
            <tr className="bg-[#696969] text-white text-left text-sm tracking-wide">
              <th className="w-8/12 px-4 py-2">Incident Names</th>
              <th className="4/12 px-4 py-2">Data Source</th>
            </tr>
          </thead>
          <tbody className="bg-[#ededed] text-sm font-light">
            {data?.date.EXECUTIVE_SUMMARY.top_incident?.table.map(
              (item: any, i: number) => (
                <tr key={i}>
                  <td className="px-4 py-2 font-medium">
                    {item.incident_name}
                  </td>
                  <td className="px-4 py-2 font-medium">{item.source}</td>
                </tr>
              )
            )}
          </tbody>
        </table>

        <ul>
          <li className="mt-1">
            <strong>Agent Life Cycle</strong>
          </li>
        </ul>
        <table className="w-full border-none" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td width="35%">
                <div className="w-[220px] mx-auto">
                  {/* <canvas id="apexOne" /> */}
                  <PieChart
                    data={
                      chartData
                    }
                  />
                  {/* <PieChart
                    data={
                      data?.date.EXECUTIVE_SUMMARY.agent_life_cycle.apex_chart
                    }
                  /> */}
                  <p className="text-xs font-bold mt-3 capitalize">
                    {data?.date.EXECUTIVE_SUMMARY.agent_life_cycle.apex_chart.title
                      .split("_")
                      .join(" ")}
                  </p>
                </div>
              </td>
              <td width="35%">
                <div className="w-[220px] mx-auto">
                  {/* <canvas id="workloadSecurity" /> */}
                  <PieChart
                    data={
                      chartData2
                    }
                  />
                  {/* <PieChart
                    data={
                      data?.date.EXECUTIVE_SUMMARY.agent_life_cycle
                        .workload_chart
                    }
                  /> */}
                  {/* <p className="text-xs font-bold mt-3 capitalize">
                    {data?.date.EXECUTIVE_SUMMARY.agent_life_cycle.workload_chart.title
                      .split("_")
                      .join(" ")}/Deep Security
                  </p> */}
                  <p className="text-xs font-bold mt-3 capitalize">
                    Workload/Deep Security
                  </p>
                </div>
              </td>
              <td width="30%">
                <p className="font-bold capitalize">
                  {formData?.key}
                </p>
                <ul className="list-inside text-justify">
                  {formData?.data.map((item: string, i: number) => (
                    <li key={i} className="text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
            <tr className="h-6"></tr>
          </tbody>
        </table>

        <ul className="pt-8 break-before-page">
          <li>
            <strong>
              Top {data?.date.EXECUTIVE_SUMMARY.top_endpoint.no_endpoint}{" "}
              Endpoint with Highest Observed Attack Technique Detection and
              Severity
            </strong>
          </li>
        </ul>
        <table
          className="w-full border-spacing-1 mb-6 border-none border-separate"
          cellPadding={5}
          cellSpacing={5}
        >
          {/* <thead>
            <tr className="bg-[#696969] text-white text-left text-sm tracking-wide">
              <th className="w-2/5 p-4">Endpoint Name</th>
              <th className="w-1/5 p-4">Number of Detection with Severity</th>
              <th className="w-2/5 p-4">Action Taken from SOC Team</th>
            </tr>
          </thead>
          <tbody className="bg-[#ededed] text-sm font-light">
            {data?.date.EXECUTIVE_SUMMARY.top_endpoint?.top_incident_table.map(
              (item: any, i: number) => (
                <tr key={i}>
                  <td className="p-4 font-medium">{item.endpoint_name}</td>
                  <td className="p-4 font-medium">{item.no_of_detections}</td>
                  {i === 0 && (
                    <td
                      className="p-4 font-medium"
                      rowSpan={
                        data?.date.EXECUTIVE_SUMMARY.top_endpoint
                          ?.top_incident_table.length
                      }
                    >
                      {data?.date.EXECUTIVE_SUMMARY.top_endpoint?.action}
                    </td>
                  )}
                </tr>
              )
            )}
          </tbody> */}

          <thead>
            <tr className="bg-[#696969] text-white text-left text-sm tracking-wide">
              <th className="w-2/5 p-4">Endpoint Name</th>
              <th className="w-1/5 p-4">Number of Detection with Severity</th>
              <th className="w-2/5 p-4">Action Taken from SOC Team</th>
            </tr>
          </thead>
          <tbody className="bg-[#ededed] text-sm font-light">
            {endpointData.map((item, index) => (
              <tr key={index}>
                <td className="p-4 font-medium">{item.endpointName}</td>
                <td className="p-4 font-medium">{item.detectionsWithSeverity}</td>
                {index === 0 && (
                  <td
                    className="p-4 font-medium"
                    rowSpan={endpointData.length}
                  >
                    {item.actionTakenBySoc}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <ul>
          <li className="text-sm">
            <strong>
              Endpoint Protection:{" "}
              {data?.date.EXECUTIVE_SUMMARY.endpoint_protection.key}
            </strong>{" "}
          </li>
        </ul>

        <div className="w-2/3 mx-auto mb-2">
          <table className="mx-auto">
            <thead>
              <tr>
                <td>&nbsp;</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="single-bar-chart">
                    <div
                      className="bar-progress"
                      style={{
                        width: `${(data?.date.EXECUTIVE_SUMMARY.endpoint_protection
                          .data[0] /
                          data?.date.EXECUTIVE_SUMMARY.endpoint_protection
                            .data[1]) *
                          100
                          }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-center font-bold mt-2">
                    {data?.date.EXECUTIVE_SUMMARY.endpoint_protection.data[0]} /{" "}
                    {data?.date.EXECUTIVE_SUMMARY.endpoint_protection.data[1]}{" "}
                    {data?.date.EXECUTIVE_SUMMARY.endpoint_protection.key}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="my-4">
          <td width="30%">
            <p className="font-bold capitalize">
              {formData2?.key}
            </p>
            <ul className="list-inside text-justify">
              {formData2?.data.map((item: string, i: number) => (
                <li key={i} className="text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </td>
        </div>

        <ul>
          <li className="text-sm">
            <strong>
              Endpoint Sensor:{" "}
              {data?.date.EXECUTIVE_SUMMARY.endpoint_sensor.key}
            </strong>{" "}
          </li>
        </ul>

        <div className="w-2/3 mx-auto mb-4">
          <table className="mx-auto">
            <thead>
              <tr>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="single-bar-chart">
                    <div
                      className="bar-progress"
                      style={{
                        width: `${(data?.date.EXECUTIVE_SUMMARY.endpoint_sensor
                          .data[0] /
                          data?.date.EXECUTIVE_SUMMARY.endpoint_sensor
                            .data[1]) *
                          100
                          }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-center font-bold mt-2">
                    {data?.date.EXECUTIVE_SUMMARY.endpoint_sensor.data[0]} /{" "}
                    {data?.date.EXECUTIVE_SUMMARY.endpoint_sensor.data[1]}{" "}
                    {data?.date.EXECUTIVE_SUMMARY.endpoint_sensor.key}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="my-4">
          <td width="30%">
            <p className="font-bold capitalize">
              {formData3?.key}
            </p>
            <ul className="list-inside text-justify">
              {formData3?.data.map((item: string, i: number) => (
                <li key={i} className="text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </td>
        </div>
      </div>
      {/* <div
        className="blank-page"
        style={{ height: `${1123 * data?.blank ?? 0}px` }}
      ></div> */}
    </div>
  );
};

export default ExecutiveSummary;
