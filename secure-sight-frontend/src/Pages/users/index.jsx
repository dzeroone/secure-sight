import { Edit2Icon, Search, TrashIcon, UserPlus2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Table, UncontrolledTooltip } from "reactstrap";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import ModalLoading from "../../components/ModalLoading";
import { getErrorMessage, getRoleTitle } from "../../helpers/utils";
import swal from "sweetalert";
import { toast } from "react-toastify";

export default function UserIndexPage() {
  const [users, setUsers] = useState([])
  const [busy, setBusy] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedTeam, setSelectedTeam] = useState('')
  const [teams, setTeams] = useState([])

  const getUsers = useCallback(async () => {
    try {
      setBusy(true)
      const response = await ApiServices(
        'get',
        null,
        ApiEndPoints.Users,
      );
      setUsers(response)
    }catch(e){
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }, [])

  const deleteUser = async (user) => {
    try {
      const confirmed = await swal({
        title: 'Are you sure?',
        text: 'Your action will remove this user.',
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true
        }
      })
      if(!confirmed) return
      setBusy(true)
      const response = await ApiServices(
        'delete',
        null,
        `${ApiEndPoints.Users}/${user._id}`,
      );
      toast.success("User is deleted.")
      getUsers()
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }

  const getTeams = useCallback(async () => {
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

  const applyTeam = async () => {
    try {
      setBusy(true)
      await ApiServices(
        "patch",
        {
          users: selectedUsers,
          team: selectedTeam
        },
        `${ApiEndPoints.Users}/team-assign`
      )
      toast.success("Team assigned")
      setSelectedUsers([])
      setSelectedTeam('')
      getUsers()
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }

  useEffect(() => {
    getUsers()
  }, [getUsers])

  useEffect(() => {
    getTeams()
  }, [getTeams])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Users" />
      <Table className="overflow-auto">
        <thead>
          {selectedUsers.length ? (
          <tr>
            <td colSpan="6" className="border-0">
              <form className="d-flex justify-content-between">
                <div></div>
                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex align-items-center gap-1">
                    <div>Team</div>
                    <Input
                      type="select"
                      bsSize='sm'
                      value={selectedTeam}
                      onChange={(e) => {
                        setSelectedTeam(e.target.value)
                      }}
                    >
                      <option value='' disabled>No team</option>
                      {teams.map(t => {
                        return <option value={t._id} key={t._id}>{t.name}</option>
                      })}
                    </Input>
                  </div>
                  <div>
                    <Button color="primary" size="sm" onClick={applyTeam}>Apply</Button>
                  </div>
                </div>
              </form>
            </td>
          </tr>
          ) : null}
          <tr>
            <th>#</th>
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
                <td>
                  <Input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={(e) => {
                      if(e.target.checked) {
                        setSelectedUsers(s => {
                          return [...s, user._id]
                        })
                      }else{
                        setSelectedUsers(s => {
                          return s.filter(u => u !== user._id)
                        })
                      }
                    }}
                  />
                </td>
                <th>{user.fullname}</th>
                <td>{user.team?.name}</td>
                <td>{user.position}</td>
                <td>{getRoleTitle(user.role)}</td>
                <td>
                  <div className="d-flex gap-1">
                    <Link className="btn btn-warning btn-sm" id={`edu-${user._id}`} to={`/users/${user._id}`}>
                      <Edit2Icon size="1em" />
                    </Link>
                    <Button size="sm" color="danger" id={`ddu-${user._id}`} onClick={() => deleteUser(user)}>
                      <TrashIcon size="1em" />
                    </Button>
                  </div>
                  <UncontrolledTooltip
                    placement="left"
                    target={`edu-${user._id}`}
                  >
                    Edit user
                  </UncontrolledTooltip>
                  <UncontrolledTooltip
                    placement="left"
                    target={`ddu-${user._id}`}
                  >
                    Delete user
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