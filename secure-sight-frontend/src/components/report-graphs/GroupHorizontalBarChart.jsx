import ReactApexChart from "react-apexcharts"

export default function GroupHorizontalBarChart({ data, labels }) {
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
          dataLabels: {
            position: 'top',
          },
        }
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: '12px',
          colors: ['#fff']
        }
      },
      stroke: {
        show: true,
        width: 1,
        colors: ['#fff']
      },
      tooltip: {
        shared: true,
        intersect: false
      },
      legend: {
        position: 'right',
        offsetY: 40
      },
      xaxis: {
        categories: labels,
      }
    }
  }
  return (
    <ReactApexChart options={config.options} series={config.series} type="bar" style={{ color: '#000' }} />
  )
}