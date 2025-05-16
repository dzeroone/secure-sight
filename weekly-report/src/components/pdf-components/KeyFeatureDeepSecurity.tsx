import { useSelector } from "react-redux";
import GroupedBarChartHorizontal from "../charts/GroupedBarChartHorizontal";
import RecommendationNotes from "../RecommendationNotes";
import { RootState } from "../../store/store";

interface KeyFeatureWorDeepSecurityProps {
  data: any;
}

const KeyFeatureWorDeepSecurity: React.FC<KeyFeatureWorDeepSecurityProps> = ({ data }: any) => {
  const kFDeepRecommendations = useSelector((s: RootState) => s.recommendation.kFDeep);

  return (
    <div className="key-feature-workload" id={Object.keys(data.date)[0]}>
      <div className="p-8">
        <p className="title">Key Feature Adoption Rate of Deep Security</p>
        {/* <p className="title">{data?.date.title}</p> */}
        <GroupedBarChartHorizontal
          data={data?.date.Key_feature_adoption_rate_of_Ds?.graph}
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
