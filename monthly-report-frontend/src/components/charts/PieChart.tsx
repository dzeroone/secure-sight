import { Pie } from "react-chartjs-2";

const PieChart = ({ data }: any) => {
  const chartData = {
    labels: [...data?.key],
    datasets: data.datasets,
  };
  return (
    <Pie
      data={chartData}
      options={{
        layout: {
          padding: {
            top: 30,
            bottom: 30,
          },
        },
        plugins: {
          datalabels: {
            // anchor: "end",
            // align: "end",
            textStrokeColor: "#fff",
            textStrokeWidth: 10,
          },
          legend: {
            position: "right",
            labels: {
              boxWidth: 10,
              padding: 10,
              font: {
                size: 9,
              },
            },
          },
        },
        maintainAspectRatio: false,
      }}
    />
  );
};

export default PieChart;
