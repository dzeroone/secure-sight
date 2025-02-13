import { Doughnut } from "react-chartjs-2";

const DoughnutChart = ({ data }: any) => {
  return (
    <Doughnut
      data={data}
      options={{
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            color: "transparent",
          },
        },
      }}
    />
  );
};

export default DoughnutChart;
