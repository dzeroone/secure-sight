import { useSelector } from "react-redux";
import GroupedBarChartHorizontal from "../charts/GroupedBarChartHorizontal";
import { RootState } from "../../store/store";
import RecommendationNotes from "../RecommendationNotes";

interface KeyFeatureWorkLoadProps {
  data: any;
}

const KeyFeatureWorkLoad: React.FC<KeyFeatureWorkLoadProps> = ({ data }: any) => {
  const kFWorkloadRecommendations = useSelector((s: RootState) => s.recommendation.kFWorkload);

  return (
    <div className="key-feature-workload" id={Object.keys(data.date)[0]}>
      <div className="p-8">
        <p className="title">Key feature adoption rate of C1WS / server & workload security / protection</p>
        {/* <p className="title">{data?.date.title}</p> */}
        <GroupedBarChartHorizontal
          data={data?.date.Key_feature_adoption_rate_of_Cw?.graph}
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
