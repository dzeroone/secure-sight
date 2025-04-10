import { Bar } from "react-chartjs-2";
const VerticalBarChart = ({ data }: any) => {
  const chartData = {
    labels: [...data.datasets[0].label],
    datasets: data.datasets,
  };
  return (
    <Bar
      data={chartData}
      options={{
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            anchor: "end",
            align: "end",
            offset: -6,
            formatter: (value, context) => {
              return value !== 0 ? value : "";
            },
          },
          legend: {
            display: false,
          },
        },
      }}
    />
  );
};

export default VerticalBarChart;
