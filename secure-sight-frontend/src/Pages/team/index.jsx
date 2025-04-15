import { Button, Table } from "reactstrap";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../../helpers/utils";
import { toast } from "react-toastify";
import ApiServices from "../../Network_call/apiservices";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ModalLoading from "../../components/ModalLoading";

export default function TeamIndex() {
  const [busy, setBusy] = useState(false)
  const [teams, setTeams] = useState([])

  const load = useCallback(async () => {
    try {
      setBusy(true)
      const data = await ApiServices(
        "get",
        null,
        ApiEndPoints.Teams
      )
      setTeams(data)
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Teams" endContent={
        <Link to="/teams/new" className="btn btn-primary">New team</Link>
      } />
      <div>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              teams.map((t) => {
                return (
                  <tr key={t._id}>
                    <td>{t.name}</td>
                    <td style={{width: '1%'}}>
                      <Link to={`/teams/${t._id}`} className="btn btn-secondary">Edit</Link>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </div>
      <ModalLoading
        isOpen={busy}
        onClose={() => setBusy(false)}
      />
    </div>
  )
}