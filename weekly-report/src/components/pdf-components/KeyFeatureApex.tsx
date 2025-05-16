import { useSelector } from "react-redux";
import GroupedBarChartHorizontal from "../charts/GroupedBarChartHorizontal";
import { RootState } from "../../store/store";
import RecommendationNotes from "../RecommendationNotes";
interface KeyFeatureApexProps {
  data: any;
}

const KeyFeatureApex: React.FC<KeyFeatureApexProps> = ({ data }: any) => {
  const kFApexRecommendations = useSelector((s: RootState) => s.recommendation.kFApex);

  return (
    <div className="key-feature-apex" id={Object.keys(data.date)[0]}>
      <div className="p-8">
        <p className="title">Key Feature Adoption Rate of Apex one as Service / Std Endpoint Protection</p>
        {/* <p className="title">{data?.date.title}</p> */}
        <GroupedBarChartHorizontal
          data={data?.date.Key_feature_adoption_rate_of_Ap.graph}
          height={700}
        />
        <div className="mt-12">
          <RecommendationNotes notes={kFApexRecommendations} />
        </div>
      </div>
      {/* <div
        className="blank-page"
        style={{ height: `${1123 * data?.blank ?? 0}px` }}
      ></div> */}
    </div>
  );
};

export default KeyFeatureApex;
