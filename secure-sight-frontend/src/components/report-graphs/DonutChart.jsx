import ReactApexChart from "react-apexcharts"

export default function DonutChart({ data, labels }) {
  const config = {
    series: data,
    options: {
      labels,
      chart: {
        type: 'donut',
      },
      dataLabels: {
        enabled: true,
        formatter: function (value, { seriesIndex, dataPointIndex, w }) {
          return w.config.labels[seriesIndex] + ":  " + w.config.series[seriesIndex]
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
          }
        }
      },
      legend: {
        position: 'bottom'
      }
    }
  }

  return (
    <ReactApexChart options={config.options} series={config.series} type="donut" style={{ color: '#000' }} />
  )
}