import { useCallback, useEffect, useMemo, useState } from "react";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import { getErrorMessage } from "../../helpers/utils";
import { toast } from "react-toastify";
import ApiServices from "../../Network_call/apiservices";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ModalLoading from "../../components/ModalLoading";
import ListDLChanges from "../../components/ListDLChanges";
import ListPendingAssignmentReviews from "../../components/ListPendingAssignmentReviews";

export default function DashboardPage() {
  const [busy, setBusy] = useState(false)

  const [dashboardData, setDashboardData] = useState({
    submissions: [],
    dlChanges: []
  })

  const isClean = useMemo(() => {
    return !(dashboardData.submissions.length || dashboardData.dlChanges.length)
  }, [dashboardData])

  const loadDashboardData = useCallback(async () => {
    try {
      setBusy(true)
      const res = await ApiServices(
        'get',
        null,
        `${ApiEndPoints.Users}/me/dashboard`
      )
      setDashboardData(res)
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg, {
        autoClose: 5000
      })
    }finally{
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Dashboard" />
      <div>
        <div className="w-50 border border-info border-opacity-25 p-2 rounded" style={{ minHeight: '10rem'}}>
          <div>Summary</div>
          <hr />
          {isClean ? (
            "Everything is clean."
          ) : null}
          <ListDLChanges data={dashboardData.dlChanges} />
          <ListPendingAssignmentReviews data={dashboardData.submissions} />
        </div>
      </div>
      <ModalLoading
        isOpen={busy}
        onClose={() => setBusy(false)}
      />
    </div>
  )
}