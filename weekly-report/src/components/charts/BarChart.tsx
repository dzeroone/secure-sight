import { Bar } from "react-chartjs-2";

const BarChart = ({ data }: any) => {
  const chartData = {
    labels: [...data.Key],
    datasets: [
      {
        data: data?.data,
        label: data?.label,
        backgroundColor: data?.backgroundColor,
      },
    ],
  };
  return (
    <Bar
      data={chartData}
      options={{
        devicePixelRatio: 4,
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                weight: "bold"
              }
            }
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                weight: "bold"
              }
            }
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
            labels: {
              padding: 20,
              font: {
                weight: "bold"
              }
            }
          }
        },
      }}
    />
  );
};

export default BarChart;
