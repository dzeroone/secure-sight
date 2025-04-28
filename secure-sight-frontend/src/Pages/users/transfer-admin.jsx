import { Alert, Button, Input } from "reactstrap";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../../helpers/utils";
import { toast } from "react-toastify";
import ApiServices from "../../Network_call/apiservices";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import swal from "sweetalert";
import { useProfile } from "../../Hooks/UserHooks";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/actions";

export default function TransferAdminPage() {
  const [selectedUser, setSelectedUser] = useState('')
  const [users, setUsers] = useState([])
  const [busy, setBusy] = useState(false)
  const {userProfile} = useProfile()
  const dispatch = useDispatch()

  const loadUsers = useCallback(async () => {
    try {
      setBusy(true)
      const data = await ApiServices(
        "get",
        null,
        ApiEndPoints.Users
      )
      setUsers(data)
    }catch(e){
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }, [])

  const transferAdmin = async () => {
    try {
      setBusy(true)
      await ApiServices(
        "post",
        {
          userId: selectedUser
        },
        `${ApiEndPoints.Users}/transfer-admin`
      )
      dispatch(logoutUser());
    }catch(e){
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }

  const onClickTransfer = async () => {
    if(!selectedUser) {
      toast.error('No user is selected!')
      return
    }
    if(selectedUser === userProfile.id) {
      toast.error('You are already an admin!')
      return
    }
    try {
      const confirmed = await swal({
        title: 'Are you sure?',
        text: "Your action will assign switch admin user.",
        buttons: [true, 'Sure']
      })
      if(confirmed) {
        transferAdmin()
      }
    }catch(e){}
  }

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Transfer admin" />
      <div>
        <Alert color="info">
          Changing admin role will revoke your current access. Admin or level3 users will be able to assign your next role.
        </Alert>
        <div className="d-flex flex-column gap-2 mt-2">
          <div>Select user</div>
          <div>
            <Input
              type="select"
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value)
              }}
            >
              <option value='' disabled>No user is selected</option>
              {users.map(u => {
                return <option value={u._id} key={u._id} disabled={userProfile.id === u._id}>{u.fullname}</option>
              })}
            </Input>
          </div>
          <div>
            <Button onClick={onClickTransfer}>Change role</Button>
          </div>
        </div>
      </div>
    </div>
  )
}