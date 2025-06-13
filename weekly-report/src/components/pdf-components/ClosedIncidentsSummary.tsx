import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import RecommendationNotes from "../RecommendationNotes";
import BarChart from "../charts/BarChart";
import GroupedBarChart from "../charts/GroupedBarChart";

interface ClosedIncidentsSummaryProps {
}

const ClosedIncidentsSummary: React.FC<ClosedIncidentsSummaryProps> = () => {
  const cIncidentRecommendations = useSelector((s: RootState) => s.recommendation.cIncident);
  const cIncident = useSelector((state: RootState) => state.data.cIncidentSummary);

  

  return (
    <div className="closed-incidents-summary text-[#696969]" id="closed-incidents">
      <div className="">
        <p className="title">Closed Incidents Summary</p>
        <div className="mb-4">
          <GroupedBarChart data={{
            Key: cIncident.key,
            data: cIncident.data
          }} />
        </div>
        <div>
          <RecommendationNotes notes={cIncidentRecommendations} />
        </div>
      </div>
    </div>
  );
};

export default ClosedIncidentsSummary;
