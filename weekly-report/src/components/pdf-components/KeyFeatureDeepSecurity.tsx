import GroupedBarChartHorizontal from "../charts/GroupedBarChartHorizontal";

interface KeyFeatureWorDeepSecurityProps {
  data: any;
  formData: {
    key: 'Recommendations' | 'Notes' | 'Summary';
    data: string[];
  };
}

const KeyFeatureWorDeepSecurity: React.FC<KeyFeatureWorDeepSecurityProps> = ({ data, formData }: any) => {
  return (
    <div className="key-feature-workload" id={Object.keys(data.date)[0]}>
      <div className="p-8">
        <p className="title">Key Feature Adoption Rate of Deep Security</p>
        {/* <p className="title">{data?.date.title}</p> */}
        <GroupedBarChartHorizontal
          data={data?.date.Key_feature_adoption_rate_of_Ds?.graph}
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

export default KeyFeatureWorDeepSecurity;
