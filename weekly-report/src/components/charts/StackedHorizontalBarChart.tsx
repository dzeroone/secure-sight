import { Bar } from "react-chartjs-2";

const StackedHorizontalBarChart = ({ data }: any) => {
  const chartData = {
    labels: [...data.Key],
    datasets: data?.data ? data.data : [],
  };
  return (
    <Bar
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: 4,
        indexAxis: "y",
        scales: {
          x: {
            stacked: true,
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
            stacked: true,
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
            formatter: (value: any, context: any) => {
              return value !== 0 ? value : "";
            },
          },
          legend: {
            labels: {
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

export default StackedHorizontalBarChart;
