import { useCallback, useEffect, useState } from "react";
import { Button, Table, UncontrolledTooltip } from "reactstrap";
import swal from "sweetalert";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import ModalLoading from "../../components/ModalLoading";
import { getErrorMessage, getRoleTitle } from "../../helpers/utils";
import { toast } from "react-toastify";

export default function DeletedUserIndexPage() {
  const [users, setUsers] = useState([])
  const [busy, setBusy] = useState(false)

  const getUsers = useCallback(async () => {
    try {
      setBusy(true)
      const response = await ApiServices(
        'get',
        null,
        `${ApiEndPoints.Users}/deleted`,
      );
      setUsers(response)
    }catch(e){
      console.log(e)
      alert(e.message)
    }finally{
      setBusy(false)
    }
  }, [])

  const restoreUser = async (user) => {
    try {
      const confirmed = await swal({
        title: 'Are you sure?',
        buttons: {
          cancel: true,
          confirm: true
        }
      })
      if(!confirmed) return
      setBusy(true)
      const response = await ApiServices(
        'post',
        null,
        `${ApiEndPoints.Users}/${user._id}/restore`,
      );
      toast.success("User restored.")
      getUsers()
    }catch(e) {
      const msg = getErrorMessage(e)
      alert(msg)
    }finally{
      setBusy(false)
    }
  }

  

  useEffect(() => {
    getUsers()
  }, [getUsers])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Deleted users" />
      <Table className="overflow-auto">
        <thead>
          <tr>
            <th>Name</th>
            <th>Team</th>
            <th>Position</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => {
            return (
              <tr key={user._id}>
                <th>{user.fullname}</th>
                <td>{user.team?.name}</td>
                <td>{user.position}</td>
                <td>{getRoleTitle(user.role)}</td>
                <td>
                  <div className="d-flex gap-1">
                    <Button size="sm" color="success" id={`ddu-${user._id}`} onClick={() => restoreUser(user)}>
                      Restore
                    </Button>
                  </div>
                  <UncontrolledTooltip
                    placement="left"
                    target={`ddu-${user._id}`}
                  >
                    Restore user
                  </UncontrolledTooltip>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      <ModalLoading
        isOpen={busy}
        onClose={() => setBusy(false)}
      />
    </div>
  )
}