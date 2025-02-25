import GroupedBarChartHorizontal from "../charts/GroupedBarChartHorizontal";

interface KeyFeatureWorkLoadProps {
  data: any;
  formData: {
    key: 'Recommendations' | 'Notes' | 'Summary';
    data: string[];
  };
}

const KeyFeatureWorkLoad: React.FC<KeyFeatureWorkLoadProps> = ({ data, formData }: any) => {
  return (
    <div className="key-feature-workload" id={Object.keys(data.date)[0]}>
      <div className="p-8">
        <p className="title">Key feature adoption rate of C1WS / server & workload security / protection</p>
        {/* <p className="title">{data?.date.title}</p> */}
        <GroupedBarChartHorizontal
          data={data?.date.Key_feature_adoption_rate_of_Cw?.graph}
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

export default KeyFeatureWorkLoad;
