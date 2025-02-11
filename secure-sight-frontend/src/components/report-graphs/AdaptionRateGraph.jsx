import GroupHorizontalBarChart from "./GroupHorizontalBarChart";

export default function AdaptionRateGraph({ data }) {

  const labels = []
  const total = {
    name: 'Total',
    data: []
  }
  const count = {
    name: 'Count',
    data: []
  }
  const rate = {
    name: 'Rate',
    data: []
  }

  data.forEach(feature => {
    labels.push(feature['Feature Name'])
    total.data.push(Number(feature['Total']) || 0)
    count.data.push(Number(feature['Count']) || 0)
    rate.data.push(Number(feature['Rate']) || 0)
  })

  return (
    <GroupHorizontalBarChart
      data={[total, count, rate]}
      labels={labels}
    />
  )
}