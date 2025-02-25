import { Bar } from "react-chartjs-2";

const GroupedBarChart = ({ data }: any) => {
  const chartData = {
    labels: data?.Key,
    datasets: data?.data ? data.data : [],
  };
  return (
    <Bar
      data={chartData}
      options={{
        indexAxis: "x",
        devicePixelRatio: 4,
        responsive: true,
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
        plugins: {
          datalabels: {
            anchor: "end",
            align: "end",
            offset: -6,
            formatter: (value, context) => {
              return value;
            },
          },
          legend: {
            position: "top",
            labels: {
              padding: 15,
              boxWidth: 10,
              boxPadding: 10,
            },
          },
          title: {
            display: false,
          },
        },
      }}
    />
  );
};

export default GroupedBarChart;
