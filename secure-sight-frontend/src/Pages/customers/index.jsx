import { format } from "date-fns";
import { Edit2Icon, Trash2Icon, UserPlus2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, FormGroup, Input, Label, PopoverBody, PopoverHeader, Table, UncontrolledPopover, UncontrolledTooltip } from "reactstrap";
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
  const [selectedCustomers, setSelectedCustomers] = useState([])
  const {userProfile} = useProfile()
  const [busy, setBusy] = useState(false)
  const [connectors, setConnectors] = useState([])
  const [selectedConnectors, setSelectedConnectors] = useState([])

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

  const getConnectors = useCallback(async () => {
    try {
      setBusy(true)
      const response = await ApiServices(
        'get',
        null,
        ApiEndPoints.ConnectorList,
      );
      setConnectors(response)
    }catch(e){
      console.log(e)
    }finally{
      setBusy(false)
    }
  },[])

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

  const applyConnectors = async () => {
    try {
      setBusy(true)
      await ApiServices(
        "patch",
        {
          customers: selectedCustomers,
          connectors: selectedConnectors
        },
        `${ApiEndPoints.Customers}/connectors`
      )
      toast.success("Connectors are applied to the selected customers.")
      setSelectedConnectors([])
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

  useEffect(() => {
    getConnectors()
  }, [getConnectors])

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
          {selectedCustomers.length ? (
            <tr>
              <td colSpan={7}>
                <div className="d-flex justify-content-between">
                  <div></div>
                  <div className="d-flex align-items-center gap-1">
                    <div>Connectors</div>
                    <Button id="connectors-dw" size="sm" disabled={busy}>
                      {selectedConnectors.length} connector selected
                    </Button>
                    <Button size="sm" color="success" onClick={applyConnectors} disabled={busy || (selectedConnectors.length < 1)}>Apply</Button>
                    <UncontrolledPopover target="connectors-dw" trigger="legacy">
                      <PopoverHeader>Connectors</PopoverHeader>
                      <PopoverBody>
                        {connectors.map(c => {
                          return (
                            <FormGroup className="text-capitalize" check key={c._id}>
                              <Input
                                id={`c_in_${c._id}`}
                                type="checkbox"
                                checked={selectedConnectors.includes(c._id)}
                                onChange={(e) => {
                                  if(e.target.checked) {
                                    setSelectedConnectors(s => {
                                      return [...s, c._id]
                                    })
                                  }else{
                                    setSelectedConnectors(s => {
                                      return s.filter(u => u !== c._id)
                                    })
                                  }
                                }}
                              />
                              <Label htmlFor={`c_in_${c._id}`} check>{c.display_name.replaceAll('_', ' ')}</Label>
                            </FormGroup>
                          )
                        })}
                      </PopoverBody>
                    </UncontrolledPopover>
                  </div>
                </div>
              </td>
            </tr>
          ) : null}
          <tr>
            <th></th>
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
                <td>
                  <Input
                    type="checkbox"
                    checked={selectedCustomers.includes(customer._id)}
                    onChange={(e) => {
                      if(e.target.checked) {
                        setSelectedCustomers(s => {
                          return [...s, customer._id]
                        })
                      }else{
                        setSelectedCustomers(s => {
                          return s.filter(u => u !== customer._id)
                        })
                      }
                    }}
                  />
                </td>
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