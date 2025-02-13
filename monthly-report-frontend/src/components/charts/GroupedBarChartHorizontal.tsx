import { Bar } from "react-chartjs-2";

const GroupedBarChartHorizontal = ({ data }: any) => {
  const chartData = {
    labels: data?.key,
    datasets: data.datasets ? data.datasets : [],
  };

  return (
    <Bar
      data={chartData}
      options={{
        indexAxis: "y", // Horizontal bar chart
        responsive: true,
        scales: {
          x: {
            grid: {
              display: false, // Hide x-axis grid
            },
            beginAtZero: true, // Start the x-axis from zero
          },
          y: {
            grid: {
              display: false, // Hide y-axis grid
            },
            ticks: {
              autoSkip: false, // Ensure all labels are displayed
            },
          },
        },
        plugins: {
          datalabels: {
            anchor: "end", // Data label positioned at the end of bars
            align: "end",  // Aligns data labels to the end of the bar
            offset: -1,
            formatter: (value, context) => {
              return value !== 0 ? value : ""; // Display only non-zero values
            },
            clip: false, // Prevent data labels from being clipped
          },
          legend: {
            position: "top", // Legend position at the top
            labels: {
              padding: 20, // Padding around legend labels
            },
          },
        },
        layout: {
          padding: {
            right: 30, // Extra space on the right
            left: 10,  // Extra space on the left
          },
        },
        maintainAspectRatio: false,
      }}
    />
  );
};

export default GroupedBarChartHorizontal;
