import { Bar } from "react-chartjs-2";

const GroupedBarChartHorizontal = ({ data }: any) => {
  const chartData = {
    labels: [...data.Key],
    datasets: data?.data ? data.data : [],
    // options: {
    //   indexAxis: "x" as const,
    //   responsive: true,
    //   plugins: {
    //     legend: {
    //       position: "right",
    //     },
    //     title: {
    //       display: false,
    //     },
    //   },
    // },
  };
  return (
    <Bar
      data={chartData}
      options={{
        indexAxis: "y",
        devicePixelRatio: 4,
        responsive: true,
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
          legend: {
            position: "top",
            labels: {
              font: {
                weight: "bold"
              }
            }
          },
          title: {
            display: false,
          },
          datalabels: {
            anchor: "end",
            align: "end",
            offset: -1,
            formatter: (value, context) => {
              return value;
            },
          },
        },
        maintainAspectRatio: true,
      }}
      height={280}
    />
  );
};

export default GroupedBarChartHorizontal;
