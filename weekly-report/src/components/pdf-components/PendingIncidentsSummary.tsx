import { useSelector } from "react-redux";
import DoughnutChat from "../charts/DoughnutChat";
import { RootState } from "../../store/store";

interface PendingIncidentsSummaryProps {
  data: any;
  formData: {
    key: 'Recommendations' | 'Notes' | 'Summary';
    data: string[];
  };
}

const PendingIncidentsSummary: React.FC<PendingIncidentsSummaryProps> = ({ data, formData }: any) => {
  const pendingIncidentSummary = useSelector((state: RootState) => state.pendingIncidentSummary);
  const chartData = {
    data: [
      pendingIncidentSummary.totalPendingIncidents,
      pendingIncidentSummary.customerPendingIncidents,
      pendingIncidentSummary.socTeamPendingIncidents,
    ],
    backgroundColor: [
      "#ff8200",
      "#ffa950",
      "#ffd9b2",
    ],
    label: [
      "Total Pending Incidents",
      "Pending Incidents from Customer",
      "Pending Incidents from SOC Team",
    ],
  };
  return (
    <div className="pending-incidents-summary" id={Object.keys(data.date)[0]}>
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
            Pending Incidents from Customer:{" "}
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
        <p className="font-bold my-8 capitalize">
          {formData?.key}
        </p>
        <ul className="list-outside">
          {formData?.data.map((item: string, i: number) => (
            <li key={i} className="text-sm texy-justify">
              {item}
            </li>
          ))}
        </ul>
      </div>
      {/* <div
        className="blank-page"
        style={{ height: `${1123 * data?.blank ?? 0}px` }}
      ></div> */}
    </div>
  );
};

export default PendingIncidentsSummary;
