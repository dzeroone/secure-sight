import { Bar } from "react-chartjs-2";

const BarChartHorizontal = ({ data }: any) => {
  const chartData = {
    labels: [...data.key],
    datasets: data.datasets,
  };

  return (
    <Bar
      data={chartData}
      options={{
        indexAxis: "y",
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
            offset: -1,
            formatter: (value, context) => {
              return value !== 0 ? value : "";
            },
            clip: false,
          },
          legend: {
            labels: {
              padding: 20,
              font: {
                weight: "bold"
              }
            },
          },
        },
        layout: {
          padding: {
            right: 30,
            left: 10,
          },
        },
        maintainAspectRatio: false,
      }}
    />
  );
};

export default BarChartHorizontal;
