import PropTypes from "prop-types";
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

TableView.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    title: PropTypes.string,
    onRenderRow: PropTypes.func
  })),
  data: PropTypes.array.isRequired
}