import ReactApexChart from "react-apexcharts"

export default function HorizontalBarChart({ data, labels }) {
  const config = {
    series: data,
    options: {
      chart: {
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: 'end',
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: true
      },
      legend: {
        position: 'right',
        offsetY: 40
      },
      xaxis: {
        categories: labels
      }
    }
  }

  return (
    <ReactApexChart options={config.options} series={config.series} type="bar" style={{ color: '#000' }} />
  )
}