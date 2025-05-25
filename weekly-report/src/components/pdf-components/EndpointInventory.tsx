import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import BarChart from "../charts/BarChart";
import RecommendationNotes from "../RecommendationNotes";

interface EndpointInventoryProps {
  data: any;
}

const EndpointInventory: React.FC<EndpointInventoryProps> = ({ data }) => {
  const licenses = useSelector((state: RootState) => state.data.licenses);
  const products = useSelector((state: RootState) => state.data.products);
  const licensesVisible = useSelector(
    (state: RootState) => state.data.licensesVisible
  );
  const productsVisible = useSelector(
    (state: RootState) => state.data.productsVisible
  );

  const chartData = useSelector((state: RootState) => state.chart.chartData);
  const eInventoryRecommendations = useSelector(
    (s: RootState) => s.recommendation.eInventory
  );

  const tableOfContents = useSelector((s: RootState) => s.tableOfContents);

  const newChartData = useMemo(() => {
    const obj = {
      backgroundColor: "#ff8200",
      data: chartData.map((data) => data.dataPoint),
      Key: chartData.map((data) => data.label),
      label: "Endpoint Inventory",
    };
    return obj;
  }, [chartData]);

  return (
    <div className="endpoint-inventory" id="endpoint-inventory">
      <div className="">
        {tableOfContents[9].visible && (
          <>
            <p className="title">Endpoint Inventory</p>
            <div className="w-full flex flex-row flex-nowrap items-center">
              <div className="w-3/5">
                <BarChart data={newChartData} />
              </div>
              <div className="w-2/5 pl-14">
                <RecommendationNotes notes={eInventoryRecommendations} />
              </div>
            </div>
          </>
        )}

        {/* License Information */}

        {tableOfContents[10].visible && (
          <>
            <p className="title" id="connected-products">
              Connected Products and License Information
            </p>
            {licensesVisible && (
              <>
                <ul>
                  <li className="font-bold">License Information:</li>
                </ul>
                <table
                  className="w-full border-spacing-1 mb-12 border-none border-separate"
                  cellPadding={5}
                  cellSpacing={5}
                >
                  <thead>
                    <tr className="bg-[#696969] text-white text-left text-base tracking-wide">
                      <td className="p-4">Status</td>
                      <td className="p-4">Product</td>
                    </tr>
                  </thead>

                  <tbody className="bg-[#ededed] text-sm font-light">
                    {licenses.map((item, i) => (
                      <tr key={i}>
                        <td className="font-medium">{item.Status}</td>
                        <td className="font-medium">{item.Product}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {/* Products Connected */}
            {productsVisible && (
              <>
                <ul>
                  <li className="font-bold">Products Connected:</li>
                </ul>
                <table
                  className="w-full border-spacing-1 mb-12 border-none border-separate"
                  cellPadding={5}
                  cellSpacing={5}
                >
                  <thead>
                    <tr className="bg-[#696969] text-white text-left text-base tracking-wide">
                      <td className="p-4">Status</td>
                      <td className="p-4">Product</td>
                    </tr>
                  </thead>
                  <tbody className="bg-[#ededed] text-sm font-light">
                    {products.map((item, i) => (
                      <tr key={i}>
                        <td className="font-medium">{item.Status}</td>
                        <td className="font-medium">{item.Product}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EndpointInventory;
