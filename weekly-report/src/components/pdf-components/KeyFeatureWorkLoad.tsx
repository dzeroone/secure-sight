import { useSelector } from "react-redux";
import GroupedBarChartHorizontal from "../charts/GroupedBarChartHorizontal";
import { RootState } from "../../store/store";
import RecommendationNotes from "../RecommendationNotes";

interface KeyFeatureWorkLoadProps {
}

const KeyFeatureWorkLoad: React.FC<KeyFeatureWorkLoadProps> = () => {
  const kFWorkloadRecommendations = useSelector((s: RootState) => s.recommendation.kFWorkload);
  const kFARWl = useSelector((s: RootState) => s.data.kFARWl);

  return (
    <div className="key-feature-workload">
      <div className="p-8">
        <p className="title">Key feature adoption rate of C1WS / server & workload security / protection</p>
        {/* <p className="title">{data?.date.title}</p> */}
        <GroupedBarChartHorizontal
          data={{
            Key: kFARWl.key,
            data: kFARWl.data
          }}
        />
        <div className="mt-12">
          <RecommendationNotes notes={kFWorkloadRecommendations} />
        </div>
      </div>
      {/* <div
        className="blank-page"
        style={{ height: `${1123 * data?.blank ?? 0}px` }}
      ></div> */}
    </div>
  );
};

export default KeyFeatureWorkLoad;
