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
        plugins: {
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
