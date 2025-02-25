import GroupedBarChartHorizontal from "../charts/GroupedBarChartHorizontal";
interface KeyFeatureApexProps {
  data: any;
  formData: {
    key: 'Recommendations' | 'Notes' | 'Summary';
    data: string[];
  };
}

const KeyFeatureApex: React.FC<KeyFeatureApexProps> = ({ data, formData }: any) => {
  return (
    <div className="key-feature-apex" id={Object.keys(data.date)[0]}>
      <div className="p-8">
        <p className="title">Key Feature Adoption Rate of Apex one as Service / Std Endpoint Protection</p>
        {/* <p className="title">{data?.date.title}</p> */}
        <GroupedBarChartHorizontal
          data={data?.date.Key_feature_adoption_rate_of_Ap.graph}
          height={700}
        />
        <p className="font-bold mt-12 capitalize">
          {formData?.key}
        </p>
        <ul className="list-outside">
          {formData?.data.map((item: string, i: number) => (
            <li key={i} className="text-sm text-justify">
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

export default KeyFeatureApex;
