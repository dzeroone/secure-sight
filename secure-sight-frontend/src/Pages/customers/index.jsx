import { Edit2Icon, Search, UserPlus2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Table, UncontrolledTooltip } from "reactstrap";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";
import ModalLoading from "../../components/ModalLoading";
import { format } from "date-fns";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";

export default function CustomerIndexPage() {
  const [customers, setCustomers] = useState([])
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

  const formatDate = (d) => {
    return format(d, 'MMM dd, yyyy')
  }

  useEffect(() => {
    getCustomers()
  }, [getCustomers])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Customers" endContent={
        <div>
          <Link className="btn btn-primary" id="btn-add" to='/customers/new'>
            <UserPlus2Icon />
          </Link>
          <UncontrolledTooltip
            placement="left"
            target="btn-add"
          >
            Add Customer
          </UncontrolledTooltip>
        </div>
        }
      />
      <Table className="overflow-auto">
        <thead>
          <tr>
            <td colSpan="5" className="border-0">
              <form className="d-flex justify-content-between">
                <div>Filter</div>
                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex align-items-center gap-1">
                    <div>Search</div>
                    <Input
                      type="search"
                      placeholder="..."
                      bsSize="sm"
                    />
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
            <th>Name</th>
            <th>Tenant Code</th>
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
                <td>{formatDate(customer.msDate)}</td>
                <td>{formatDate(customer.meDate)}</td>
                <td>
                  <Link className="btn btn-warning btn-sm" id={`edu-${customer._id}`} to={`/customers/${customer._id}`}>
                    <Edit2Icon size="1em" />
                  </Link>
                  <UncontrolledTooltip
                    placement="left"
                    target={`edu-${customer._id}`}
                  >
                    Edit customer
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