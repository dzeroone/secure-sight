import { Bar } from "react-chartjs-2";
const VerticalBarChart2 = ({ data }: any) => {
  const chartData = {
    labels: [...data.key],
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
          },
          legend: {
            display: false,
          },
        },
      }}
    />
  );
};

export default VerticalBarChart2;
