import { useSelector } from "react-redux";
import DoughnutChat from "../charts/DoughnutChat";
import { RootState } from "../../store/store";
import RecommendationNotes from "../RecommendationNotes";

interface PendingIncidentsSummaryProps {
  data: any;
}

const PendingIncidentsSummary: React.FC<PendingIncidentsSummaryProps> = ({
  data,
}: any) => {
  const pendingIncidentSummary = useSelector(
    (state: RootState) => state.pendingIncidentSummary
  );
  const pIncidentRecommendations = useSelector(
    (s: RootState) => s.recommendation.pIncident
  );
  const client = useSelector((state: RootState) => state.client);

  const chartData = {
    data: [
      pendingIncidentSummary.totalPendingIncidents,
      pendingIncidentSummary.customerPendingIncidents,
      pendingIncidentSummary.socTeamPendingIncidents,
    ],
    backgroundColor: ["#ff8200", "#ffa950", "#ffd9b2"],
    label: [
      "Total Pending Incidents",
      `Pending Incidents from ${client.tenantCode}`,
      "Pending Incidents from SOC Team",
    ],
  };
  return (
    <div className="pending-incidents-summary" id="pending-incident-status">
      <div className="">
        <p className="title">Pending Incidents Summary</p>
        {/* <ul className="font-bold">
          <li>
            Total Pending Incidents:{" "}
            {data?.date.PENDING_INCIDENTS_SUMMARY.T_P_Incidents}
          </li>
          <li>
            Pending Incidents from Customer:{" "}
            {data?.date.PENDING_INCIDENTS_SUMMARY.P_I_F_Customer}
          </li>
          <li>
            Pending Incidents from SOC Team:{" "}
            {data?.date.PENDING_INCIDENTS_SUMMARY.P_Incidents_from_SOC}
          </li>
        </ul> */}
        <ul className="font-bold">
          <li>
            Total Pending Incidents:{" "}
            {pendingIncidentSummary.totalPendingIncidents}
          </li>
          <li>
            Pending Incidents from {client.tenantCode}:{" "}
            {pendingIncidentSummary.customerPendingIncidents}
          </li>
          <li>
            Pending Incidents from SOC Team:{" "}
            {pendingIncidentSummary.socTeamPendingIncidents}
          </li>
        </ul>

        <div className="w-full mx-auto">
          <div className="w-[500px] mx-auto">
            <DoughnutChat
              data={chartData}
              label={true}
              isPendingIncidentSummary={true}
            />
          </div>
          {/* <div>
            <DoughnutChat data={data?.date.PENDING_INCIDENTS_SUMMARY.Pie_chart} />
          </div> */}
        </div>
        <RecommendationNotes notes={pIncidentRecommendations} />
      </div>
      {/* <div
        className="blank-page"
        style={{ height: `${1123 * data?.blank ?? 0}px` }}
      ></div> */}
    </div>
  );
};

export default PendingIncidentsSummary;
