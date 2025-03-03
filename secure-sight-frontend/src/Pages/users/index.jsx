import { Edit2Icon, PlusIcon, Search, UserPlus2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Table, UncontrolledTooltip } from "reactstrap";
import ApiServices from "../../Network_call/apiservices";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import { getRoleTitle } from "../../helpers/utils";

export default function UserIndexPage() {

  const [users, setUsers] = useState([])

  const getUsers = useCallback(async () => {
    try {
      const response = await ApiServices(
        'get',
        null,
        ApiEndPoints.Users,
      );
      setUsers(response)
    }catch(e){
      console.log(e)
    }
  }, [])

  useEffect(() => {
    getUsers()
  }, [getUsers])

  return (
    <div className="page-content">
      <div className="d-flex flex-row justify-content-between align-items-center">
        <h1>Users</h1>
        <div>
          <Link className="btn btn-primary" id="btn-add" to='/users/new'>
            <UserPlus2Icon />
          </Link>
          <UncontrolledTooltip
            placement="left"
            target="btn-add"
          >
            Add User
          </UncontrolledTooltip>
        </div>
      </div>
      <Table className="overflow-auto">
        <thead>
          <tr>
            <td colSpan="4" className="border-0">
              <form className="d-flex justify-content-between">
                <div>Filter</div>
                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex align-items-center gap-1">
                    <div>Search</div>
                    <Input
                      type="search"
                      placeholder="..."
                      size="sm"
                    />
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <div>Role</div>
                    <Input
                      type="select"
                      size='sm'
                    >
                      <option value=''>All</option>
                      <option value='admin'>Admin</option>
                      <option value='l1'>Level 1</option>
                      <option value='l2'>Level 2</option>
                      <option value='l3'>Level 3</option>
                    </Input>
                  </div>
                  <div>
                    <Button color="primary" size="sm"><Search size="1em" className="mr-1" /> Search</Button>
                  </div>
                  <div>
                    <Button color="danger" size="sm">Clear</Button>
                  </div>
                </div>
              </form>
            </td>
          </tr>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => {
            return (
              <tr key={user._id}>
                <th>{user.email}</th>
                <td>{user.fullname}</td>
                <td>{getRoleTitle(user.role)}</td>
                <td>
                  <Link className="btn btn-warning btn-sm" id={`edu-${user._id}`} to={`/users/${user._id}`}>
                    <Edit2Icon size="1em" />
                  </Link>
                  <UncontrolledTooltip
                    placement="left"
                    target={`edu-${user._id}`}
                  >
                    Edit user
                  </UncontrolledTooltip>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}