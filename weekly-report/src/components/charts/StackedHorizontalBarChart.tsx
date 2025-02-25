import { Bar } from "react-chartjs-2";

const StackedHorizontalBarChart = ({ data }: any) => {
  const chartData = {
    labels: data?.Key,
    datasets: data?.data ? data.data : [],
  };
  return (
    <Bar
      data={chartData}
      options={{
        responsive: true,
        devicePixelRatio: 4,
        indexAxis: "y",
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false,
            },
          },
          y: {
            stacked: true,
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          datalabels: {
            formatter: (value: any, context: any) => {
              return value !== 0 ? value : "";
            },
          },
        },
      }}
    />
  );
};

export default StackedHorizontalBarChart;
