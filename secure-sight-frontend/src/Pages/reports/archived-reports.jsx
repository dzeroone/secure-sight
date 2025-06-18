import { useCallback, useEffect, useState } from "react";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import { getErrorMessage } from "../../helpers/utils";
import { toast } from "react-toastify";
import ApiServices from "../../Network_call/apiservices";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import { Button, Table } from "reactstrap";
import { PictureAsPdf } from "@mui/icons-material";
import ReactPaginate from "react-paginate";

export default function ArchivedReportsPage() {
  const [busy, setBusy] = useState(false)
  const [reportData, setReportData] = useState({
    page: 1,
    total: 0,
    items: []
  })

  const loadReportData = useCallback(async () => {
    try {
      const data = await ApiServices(
        'get',
        {
          page: reportData.page
        },
        `${ApiEndPoints.AssignmentReports}/approved`
      )
      setReportData(s => {
        return {
          ...s,
          total: data.total,
          items: data.items
        }
      })
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }, [reportData.page])

  useEffect(() => {
    loadReportData()
  }, [loadReportData])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Archived reports" />
      <div>
        <Table>
          <thead>
            <tr>
              <td>Report type</td>
              <td>Session</td>
              <td>Customer</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {reportData.items.map((data, i) => {
              return (
                <tr key={i}>
                  <td>{data.report_type}</td>
                  <td>{data.report_session}</td>
                  <td>{data.customer.name}</td>
                  <td>
                    <a href={`${ApiEndPoints.AssignmentReports}/files/${data.report.fileName}`} target="_blank" className="btn btn-sm">
                      <PictureAsPdf />
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}>
                <ReactPaginate
                  className="pagination mb-0"
                  pageClassName="page-item"
                  activeClassName="active"
                  pageLinkClassName="page-link"
                  activeLinkClassName=""
                  previousClassName="page-item"
                  nextClassName="page-item"
                  previousLinkClassName="page-link"
                  nextLinkClassName="page-link"
                  breakLabel="..."
                  nextLabel="next >"
                  onPageChange={(data) => {
                    setReportData(s => {
                      return {
                        ...s,
                        page: data.selected + 1
                      }
                    });
                  }}
                  pageRangeDisplayed={5}
                  pageCount={Math.ceil(reportData.total / 20)}
                  previousLabel="< previous"
                  renderOnZeroPageCount={null}
                />
              </td>
            </tr>
          </tfoot>
        </Table>
      </div>
    </div>
  )
}