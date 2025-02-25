import { Doughnut } from "react-chartjs-2";

const DoughnutChat = ({ data, label, isPendingIncidentSummary }: any) => {
  const displayLabel = label === undefined ? true : label;

  const chartData = {
    labels: data.label,
    datasets: [
      {
        data: data?.data,
        backgroundColor: data?.backgroundColor,
        label: data?.label,
        borderWidth: 0,
      },
    ],
  };



  return (
    <Doughnut
      data={chartData}
      height={300}
      options={{
        maintainAspectRatio: false,
        devicePixelRatio: 4,
        plugins: {
          datalabels: {
            display: displayLabel,
            anchor: "end",
            align: "start",
            formatter: (value: any) => (value !== 0 ? value : ""),
            color: "#000000",
            font: {
              size: 20,
              weight: 700,
            },
          },
          legend: {
            position: isPendingIncidentSummary ? "right" : "top",
            labels: {
              boxWidth: 10,
              boxPadding: 10,
              font: {
                size: 13,
              },
            },
          },
        },
      }}
    />
  );
};

export default DoughnutChat;
