export default function ObjectProperties({ data }) {
  return (
    <div className="mb-2">
      {
        Object.entries(data).map(([key, value]) => {
          return (
            <div key={key}>{key}: <span className="opacity-75">{value}</span></div>
          )
        })
      }
    </div>
  )
}