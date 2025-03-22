import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import swal from "sweetalert";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import { getErrorMessage } from "../../helpers/utils";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";

export default function DLChangeRequestsPage() {
  const [busy, setBusy] = useState(false)
  const { id } = useParams()

  const [info, setInfo] = useState({
    proposals: [],
    customer: null
  })

  const navigate = useNavigate();

  const linkStack = useMemo(() => {
    return [
      { title: 'Customers', route: '/customers' },
      { title: id, route: `/customers/${id}`},
      { title: 'DL change requests'}
    ]
  }, [id])

  const getRequests = useCallback(async () => {
    try {
      setBusy(false)
      const res = await ApiServices(
        'get',
        null,
        `${ApiEndPoints.Customers}/${id}/dl`
      )
      setInfo(res)
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg, {
        autoClose: 5000
      })
    }finally{
      setBusy(false)
    }
  }, [])

  const acceptProposal = async (proposal) => {
    try {
      const confirmed = await swal({
        title: "Are you sure?",
        buttons: {
          cancel: true,
          confirm: true
        }
      })
      if(!confirmed) return
      
      const res = await ApiServices(
        'post',
        null,
        `${ApiEndPoints.Customers}/${id}/dl/${proposal._id}/accept`
      )
      toast.success("Data updated")
      navigate("/customers")
      setBusy(true)
    }catch(e){
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }

  useEffect(() => {
    getRequests()
  }, [getRequests])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="DL change requests" linkStack={linkStack} />
      <div className="px-2 py-1 mb-4 bg-pitch-black">
        <div>Customer name: {info.customer?.name}</div>
        <div>
          <div className="mb-0">Emails -</div>
          <div className="d-flex gap-4">
            <div>To: {info.customer?.emails?.to}</div>
            <div>CC: {info.customer?.emails?.cc}</div>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-1"><strong>Proposals</strong></div>
        {info.proposals.map(proposal => {
          return (
            <div className="mb-2 d-flex flex-column gap-1" key={proposal._id}>
              <div>Submitted by: {proposal.user.fullname}</div>
              <div>
                <div>To: {proposal.emails.to}</div>
                <div>CC: {proposal.emails.cc}</div>
              </div>
              <div>
                <Button size="sm" color="success" onClick={() => acceptProposal(proposal)}>Accept</Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}