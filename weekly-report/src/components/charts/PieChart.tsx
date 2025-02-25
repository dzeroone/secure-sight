import { Pie } from "react-chartjs-2";

const PieChart = ({ data }: any) => {
  const chartData = {
    labels: data.label,
    datasets: [
      {
        data: data.data,
        backgroundColor: [
          "rgb(255, 130, 0)",
          "rgb(255, 169, 80)",
          "rgb(255, 217, 178)",
        ],
        borderWidth: 0,
      },
    ],
  };
  return (
    <Pie
      data={chartData}
      options={{
        devicePixelRatio: 4,
        plugins: {
          datalabels: {
            anchor: "end",
            align: "end",
            display: "auto",
            formatter: (value: any, context: any) => {
              return value === 0 ? null : value;
            },
          },
          legend: {
            position: "right",
            labels: {
              boxWidth: 10,
              boxPadding: 10,
              font: {
                size: 9,
              },
            },
          },
        },
      }}
    />
  );
};

export default PieChart;
