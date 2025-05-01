import { format } from "date-fns";
import { Edit2Icon, Trash2Icon, UserPlus2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Table, UncontrolledTooltip } from "reactstrap";
import { useProfile } from "../../Hooks/UserHooks";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import ModalLoading from "../../components/ModalLoading";
import { ROLES } from "../../data/app";
import swal from "sweetalert";
import { getErrorMessage } from "../../helpers/utils";
import { toast } from "react-toastify";

export default function CustomerIndexPage() {
  const [customers, setCustomers] = useState([])
  const {userProfile} = useProfile()
  const [busy, setBusy] = useState(false)

  const getCustomers = useCallback(async () => {
    try {
      setBusy(true)
      const response = await ApiServices(
        'get',
        null,
        ApiEndPoints.Customers,
      );
      setCustomers(response)
    }catch(e){
      console.log(e)
    }finally{
      setBusy(false)
    }
  }, [])

  const deleteCustomer = async (customer) => {
    try {
      setBusy(true)
      await ApiServices(
        "delete",
        null,
        `${ApiEndPoints.Customers}/${customer._id}`
      )
      toast.success("Customer is deleted.")
      getCustomers()
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }

  const onClickDeleteCustomer = async (customer) => {
    try {
      const confirmed = await swal({
        title: 'Are you sure?',
        text: 'Your action will remove this customer!',
        buttons: [true, "Okay"]
      })
      if(confirmed) {
        deleteCustomer(customer)
      }
    }catch(e) {

    }
  }

  const formatDate = (d) => {
    return format(d, 'MMM dd, yyyy')
  }

  useEffect(() => {
    getCustomers()
  }, [getCustomers])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Customers" endContent={
        userProfile.role === ROLES.ADMIN ? (<div>
          <Link className="btn btn-primary" id="btn-add" to='/customers/new'>
            <UserPlus2Icon />
          </Link>
          <UncontrolledTooltip
            placement="left"
            target="btn-add"
          >
            Add Customer
          </UncontrolledTooltip>
        </div>) : null
        }
      />
      <Table className="overflow-auto">
        <thead>
          <tr>
            <th>Name</th>
            <th>Tenant Code</th>
            <th>Tenant type</th>
            <th>Monitoring start date</th>
            <th>Monitoring end date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => {
            return (
              <tr key={customer._id}>
                <th>{customer.name}</th>
                <td>{customer.tCode}</td>
                <td>{customer.tType}</td>
                <td>{formatDate(customer.msDate)}</td>
                <td>{formatDate(customer.meDate)}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Link className="btn btn-warning btn-sm" id={`edu-${customer._id}`} to={`/customers/${customer._id}`}>
                      <Edit2Icon size="1em" />
                    </Link>
                    <UncontrolledTooltip
                      placement="left"
                      target={`edu-${customer._id}`}
                    >
                      Edit customer
                    </UncontrolledTooltip>
                    {userProfile.role === ROLES.ADMIN ? (
                      <>
                        <Button size="sm" id={`de-${customer._id}`} onClick={() => {
                          onClickDeleteCustomer(customer)
                        }}>
                          <Trash2Icon size="1em" />
                        </Button>
                        <UncontrolledTooltip
                          placement="left"
                          target={`de-${customer._id}`}
                        >
                          Delete customer
                        </UncontrolledTooltip>
                      </>
                    ) : null }
                  </div>
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