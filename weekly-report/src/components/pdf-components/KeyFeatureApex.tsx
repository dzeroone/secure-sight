import { useSelector } from "react-redux";
import GroupedBarChartHorizontal from "../charts/GroupedBarChartHorizontal";
import { RootState } from "../../store/store";
import RecommendationNotes from "../RecommendationNotes";
interface KeyFeatureApexProps {}

const KeyFeatureApex: React.FC<KeyFeatureApexProps> = () => {
  const kFApexRecommendations = useSelector(
    (s: RootState) => s.recommendation.kFApex
  );
  const kFARAp = useSelector((s: RootState) => s.data.kFARAp);

  return (
    <div className="key-feature-apex" id="key-feature-apex">
      <div className="p-8">
        <p className="title">Key Feature Adoption Rate of Apex one as Service / Std Endpoint Protection</p>
        {/* <p className="title">{data?.date.title}</p> */}
        <GroupedBarChartHorizontal
          data={{
            Key: kFARAp.key,
            data: kFARAp.data,
          }}
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
