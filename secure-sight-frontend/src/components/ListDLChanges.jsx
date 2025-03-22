import { format } from "date-fns"
import { Link } from "react-router-dom"
import { Button } from "reactstrap"

export default function ListDLChanges({
  data
}) {
  if(!(Array.isArray(data) && data.length)) return null

  return (
    <div>
      {data.map(info => {
        return (
          <div className="d-flex justify-content-between gap-1" key={info._id}>
            <div>
              <div>DL changes for <Link to={`/customers/${info.customer._id}`}>{info.customer.name}</Link> has been requested by <Link to={`/users/${info.user._id}`}>{info.user.fullname}</Link></div>
              <div><small>{format(info.uAt, 'PPpp')}</small></div>
            </div>
            <div><Link className="btn btn-outline-info btn-sm" to={`/customers/${info.customer._id}/dl-change-requests`}>View changes</Link></div>
          </div>
        )
      })}
    </div>
  )
}