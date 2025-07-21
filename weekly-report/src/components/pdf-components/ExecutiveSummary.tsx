import DoughnutChat from "../charts/DoughnutChat";
import PieChart from "../charts/PieChart";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { pluralize } from "../../utils/helpers";
import RecommendationNotes from "../RecommendationNotes";
import { useMemo } from "react";

interface ExecutiveSummaryProps {
  data: any;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ data }) => {
  const endpointData = useSelector(
    (state: RootState) => state.endpoint.endpointData
  );
  const apexOne = useSelector((state: RootState) => state.apexOne);

  const executiveSummaryData = useSelector(
    (s: RootState) => s.executiveSummary
  );
  const clientData = useSelector((s: RootState) => s.client);
  const agentLifeCycleRecommendations = useSelector(
    (s: RootState) => s.recommendation.agentLifeCycle
  );
  const endPointProtectionRecommendations = useSelector(
    (s: RootState) => s.recommendation.endPointProtection
  );
  const endPointSensorRecommendations = useSelector(
    (s: RootState) => s.recommendation.endPointSensor
  );

  const chartData = {
    title: "apex_one",
    data: [
      apexOne.allV,
      apexOne.latestVersion,
      apexOne.olderVersion,
      apexOne.nsOS,
      apexOne.osInc,
      apexOne.endOfLife,
    ],
    backgroundColor: [
      "rgb(255, 130, 0)",
      "rgb(255, 141, 24)",
      "rgb(255, 154, 52)",
      "rgb(255, 170, 84)",
      "rgb(255, 189, 121)",
      "rgb(255, 234, 211)",
    ],
    label: [
      "All version",
      "Latest version",
      "Older version",
      "Not supported OS",
      "OS incompatible",
      "End of Life",
    ],
  };

  const workloadSecurity = useSelector(
    (state: RootState) => state.workloadSecurity
  );
  const deepSecurity = useSelector(
    (state: RootState) => state.deepSecurity
  );

  const chartData2 = {
    title: "workload_security",
    data: [
      workloadSecurity.allV,
      workloadSecurity.latestVersion,
      workloadSecurity.olderVersion,
      workloadSecurity.nsOS,
      workloadSecurity.osInc,
      workloadSecurity.endOfLife,
    ],
    backgroundColor: [
      "rgb(255, 130, 0)",
      "rgb(255, 141, 24)",
      "rgb(255, 154, 52)",
      "rgb(255, 170, 84)",
      "rgb(255, 189, 121)",
      "rgb(255, 234, 211)",
    ],
    label: [
      "All version",
      "Latest version",
      "Older version",
      "Not supported OS",
      "OS incompatible",
      "End of Life",
    ],
  };

  const deepSecurityChartData = useMemo(() => {
    return {
      title: "deep_security",
      data: [
        deepSecurity.allV,
        deepSecurity.latestVersion,
        deepSecurity.olderVersion,
        deepSecurity.nsOS,
        deepSecurity.osInc,
        deepSecurity.endOfLife,
      ],
      backgroundColor: [
        "rgb(255, 130, 0)",
        "rgb(255, 141, 24)",
        "rgb(255, 154, 52)",
        "rgb(255, 170, 84)",
        "rgb(255, 189, 121)",
        "rgb(255, 234, 211)",
      ],
      label: [
        "All version",
        "Latest version",
        "Older version",
        "Not supported OS",
        "OS incompatible",
        "End of Life",
      ],
    }
  }, [deepSecurity])

  const visibleChartCount = useMemo(() => {
    return Number(apexOne.visible) + Number(workloadSecurity.visible) + Number(deepSecurity.visible)
  }, [apexOne, workloadSecurity, deepSecurity])

  return (
    <div className="executive-summary" id="executive-summary">
      <div className="">
        <p className="title">EXECUTIVE SUMMARY</p>
        <ul>
          <li className="text-sm mb-2">
            A total number of{" "}
            <strong>
              {pluralize(executiveSummaryData.nOfIncidents, "incident")}
            </strong>{" "}
            were observed during the time frame of{" "}
            <strong>{clientData.dateFrom}</strong> to{" "}
            <strong>{clientData.dateTo}</strong>.
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
                        data={{
                          data: [
                            executiveSummaryData.riskIndex,
                            100 - executiveSummaryData.riskIndex,
                          ],
                          backgroundColor: [
                            "rgb(255, 130, 0)",
                            "rgb(105, 105, 105)",
                          ],
                        }}
                        label={false}
                      />
                      <p className="absolute top-1/2 left-1/2 m-0 text-2xl font-normal -translate-x-1/2 -translate-y-1/2">
                        {executiveSummaryData.riskIndex}%
                      </p>
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="m-0 text-justify italic text-black font-normal">
                      {executiveSummaryData.riskContent}
                    </p>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </li>
          <li className="text-sm mb-2">
            <strong>
              {executiveSummaryData.nOfDVul} Highly exploitable unique CVEs
            </strong>{" "}
            in Endpoints.
          </li>
          <li className="text-sm mb-2">
            <strong>{executiveSummaryData.nOfICWoAck} Incident</strong> Closed
            without Customer Acknowledgement.
          </li>
        </ul>

        <p>
          <strong>
            Top{" "}
            {data?.date.EXECUTIVE_SUMMARY.top_incident.no_incidents > 5
              ? 5
              : data?.date.EXECUTIVE_SUMMARY.top_incident.no_incidents}{" "}
            Incidents:
          </strong>
        </p>
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
        {visibleChartCount > 0 ? (
          <table className="w-full border-none" cellPadding={0} cellSpacing={0}>
            <tbody>
              <tr>
                {apexOne.visible ? (
                  <td width={`${100/visibleChartCount}%`}>
                    <div className="w-[220px] mx-auto">
                      {/* <canvas id="apexOne" /> */}
                      <PieChart data={chartData} />
                      {/* <PieChart
                        data={
                          data?.date.EXECUTIVE_SUMMARY.agent_life_cycle.apex_chart
                        }
                      /> */}
                      <p className="text-xs font-bold mt-3 capitalize">
                        {apexOne.title}
                      </p>
                    </div>
                  </td>
                ) : null}
                {workloadSecurity.visible ? (
                  <td width={`${100/visibleChartCount}%`}>
                    <div className="w-[220px] mx-auto">
                      {/* <canvas id="workloadSecurity" /> */}
                      <PieChart data={chartData2} />
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
                        {workloadSecurity.title}
                      </p>
                    </div>
                  </td>
                ) : null}
                {deepSecurity.visible ? (
                  <td width={`${100/visibleChartCount}%`}>
                    <div className="w-[220px] mx-auto">
                      {/* <canvas id="workloadSecurity" /> */}
                      <PieChart data={deepSecurityChartData} />
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
                        {deepSecurity.title}
                      </p>
                    </div>
                  </td>
                ) : null}
              </tr>
              <tr className="h-6"></tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={visibleChartCount}>
                  <RecommendationNotes notes={agentLifeCycleRecommendations} />
                </td>
              </tr>
            </tfoot>
          </table>
        ) : null}

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
              <th className="w-1/5 p-4">No of OAT with Severity</th>
              <th className="w-2/5 p-4">Action Taken from SOC Team</th>
            </tr>
          </thead>
          <tbody className="bg-[#ededed] text-sm font-light">
            {endpointData.map((item, index) => (
              <tr key={index}>
                <td className="p-4 font-medium">{item.endpointName}</td>
                <td className="p-4 font-medium">
                  {item.detectionsWithSeverity}
                </td>
                {index === 0 && (
                  <td className="p-4 font-medium" rowSpan={endpointData.length}>
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
                        width: `${
                          (executiveSummaryData.epDAgents /
                            executiveSummaryData.epTAgents) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-center font-bold mt-2">
                    {executiveSummaryData.epDAgents} /{" "}
                    {executiveSummaryData.epTAgents}{" "}
                    {data?.date.EXECUTIVE_SUMMARY.endpoint_protection.key}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="my-4">
          <div className="w-1/3">
            <RecommendationNotes notes={endPointProtectionRecommendations} />
          </div>
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
                        width: `${
                          (executiveSummaryData.epDSensors /
                            executiveSummaryData.epTSensors) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-center font-bold mt-2">
                    {executiveSummaryData.epDSensors} /{" "}
                    {executiveSummaryData.epTSensors}{" "}
                    {data?.date.EXECUTIVE_SUMMARY.endpoint_sensor.key}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="my-4">
          <div className="w-1/3">
            <RecommendationNotes notes={endPointSensorRecommendations} />
          </div>
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
