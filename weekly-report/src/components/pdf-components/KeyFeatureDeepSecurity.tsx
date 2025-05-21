import { useSelector } from "react-redux";
import GroupedBarChartHorizontal from "../charts/GroupedBarChartHorizontal";
import RecommendationNotes from "../RecommendationNotes";
import { RootState } from "../../store/store";

interface KeyFeatureWorDeepSecurityProps {
}

const KeyFeatureWorDeepSecurity: React.FC<KeyFeatureWorDeepSecurityProps> = () => {
  const kFDeepRecommendations = useSelector((s: RootState) => s.recommendation.kFDeep);
  const kFARDs = useSelector((s: RootState) => s.data.kFARDs);

  return (
    <div className="key-feature-workload">
      <div className="p-8">
        <p className="title">Key Feature Adoption Rate of Deep Security</p>
        {/* <p className="title">{data?.date.title}</p> */}
        <GroupedBarChartHorizontal
          data={{
            Key: kFARDs.key,
            data: kFARDs.data
          }}
        />
        <div className="mt-12">
          <RecommendationNotes notes={kFDeepRecommendations} />
        </div>
      </div>
      {/* <div
        className="blank-page"
        style={{ height: `${1123 * data?.blank ?? 0}px` }}
      ></div> */}
    </div>
  );
};

export default KeyFeatureWorDeepSecurity;
