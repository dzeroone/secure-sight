import ReactApexChart from "react-apexcharts"

export default function AgentVisionSummaryGraph({ data }) {
  const config = {
    series: [data['Latest Version (Endpoint + Server)'], data['Older Version (Endpoint + Server)'], data['End-of-Life version (Endpoint + Server)']],
    options: {
      labels: ['Latest Version (Endpoint + Server)', 'Older Version (Endpoint + Server)', 'End-of-Life version (Endpoint + Server)'],
      chart: {
        type: 'pie',
      },
      dataLabels: {
        enabled: true,
        formatter: function (value, { seriesIndex, dataPointIndex, w }) {
          // console.log('ss', value, seriesIndex, w.config)
          return w.config.labels[seriesIndex] + ":  " + w.config.series[seriesIndex]
        }
      },
      legend: {
        show: true,
        position: 'bottom'
      }
    }
  }

  return (
    <ReactApexChart options={config.options} series={config.series} type="pie" style={{ color: '#000' }} />
  )
}