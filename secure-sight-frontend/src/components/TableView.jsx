import { Table } from "reactstrap";

export default function TableView({
  columns,
  data
}) {
  return (
    <Table>
      <thead>
        <tr>
          {columns.map(c => {
            return <th key={c.key}>{c.title}</th>
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((d, i) => {
          return (
            <tr key={i}>
              {columns.map(c => {
                return (
                  <td key={c.key}>{c.onRenderRow ? c.onRenderRow(d) : d[c.key]}</td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}