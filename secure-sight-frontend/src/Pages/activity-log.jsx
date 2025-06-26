import { format } from "date-fns"
import { DownloadIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Button, FormGroup, Input, Label, Pagination, PaginationItem, PaginationLink, Table } from "reactstrap"
import ApiEndPoints from "../Network_call/ApiEndPoints"
import ApiServices from "../Network_call/apiservices"
import BreadcrumbWithTitle from "../components/Common/BreadcrumbWithTitle"
import ModalLoading from "../components/ModalLoading"
import { getErrorMessage } from "../helpers/utils"
import { saveAs } from "file-saver"

export default function ActivityLogPage() {
  const [logs, setLogs] = useState([])
  const [busy, setBusy] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [pages, setPages] = useState([])

  const [activePage, setActivePage] = useState(null)

  const loadLogs = useCallback(async () => {
    try {
      if(activePage === null) return
      if(activePage >= pages.length) return
      setBusy(true)
      const data = await ApiServices(
        "get",
        {
          startDate: pages[activePage].startDate,
          endDate: pages[activePage].endDate
        },
        ApiEndPoints.ActivityLogs
      )
      setLogs(data.map(l => {
        return {
          date: l[0],
          data: l[1]
        }
      }))
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }, [pages, activePage])

  const gotoPage = (pageIndex) => {
    if(pageIndex === pages.length) {
      setPages([
        ...pages,
        {
          startDate: new Date(startDate).toISOString(),
          endDate: logs[logs.length - 1].date // new Date(logs[logs.length - 1].date * 1e-6).toISOString()
        }
      ])
    }
    setActivePage(pageIndex)
  }

  const startDownloading = async () => {
    const data = await ApiServices(
      "get",
      {
        startDate: pages[0].startDate,
        endDate: pages[0].endDate
      },
      `${ApiEndPoints.ActivityLogs}/download`,
      null,
      false,
      {
        responseType: 'arraybuffer'
      }
    )

    const blob = new Blob([data], { type: 'application/vnd.ms-excel' }); // Create a Blob from the response data
    saveAs(blob, 'activity-log.xlsx'); // Use file-saver to trigger the download
  }

  useEffect(() => {
    loadLogs()
  }, [loadLogs])

  useEffect(() => {
    // set start date and end date to datetime-local time format
    // to populate the input field
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    const _15minBefore = new Date()
    _15minBefore.setMinutes(_15minBefore.getMinutes() - _15minBefore.getTimezoneOffset());
    _15minBefore.setMinutes(_15minBefore.getMinutes() - 15)

    const sD = _15minBefore.toISOString().slice(0,16)
    const eD = now.toISOString().slice(0,16)
    setStartDate(sD)
    setEndDate(eD)

    setPages([{
      startDate: new Date(sD).toISOString(),
      endDate: new Date(eD).toISOString()
    }])

    setActivePage(0)
  }, [])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Activity log" />
      <div className="d-flex justify-content-between">
        <div>Filter</div>
        <div className="d-flex gap-2">
          <div>
            <FormGroup>
              <Label size="sm">Start date</Label>
              <Input
                name="start_date"
                type="datetime-local"
                bsSize="sm"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                }}
              />
            </FormGroup>
          </div>
          <div>
            <FormGroup>
              <Label size="sm">End date</Label>
              <Input
                name="end_date"
                type="datetime-local"
                bsSize="sm"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value)
                }}
              />
            </FormGroup>
          </div>
          <div>
            <FormGroup>
              <Label size="sm">&nbsp;</Label>
              <div><Button size="sm" onClick={() => {
                setPages([{
                  startDate: startDate ? new Date(startDate).toISOString() : '',
                  endDate: endDate ? new Date(endDate).toISOString() : ''
                }])
                setActivePage(0)
              }}>Apply</Button></div>
            </FormGroup>
          </div>
          <div>
            <FormGroup>
              <Label size="sm">&nbsp;</Label>
              <div><Button size="sm" color="primary" disabled={busy} onClick={() => {
                startDownloading()
              }}><DownloadIcon size={'1rem'} /> Download</Button></div>
            </FormGroup>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Table>
          <tbody>
            {
              logs.map((l, i) => {
                return (
                  <tr key={i}>
                    <td>{format(l.date * 1e-6, "PPpp")}</td>
                    <td>{l.data}</td>
                  </tr>
                )
              })
            }
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>
                <Pagination listClassName="mb-0">
                  <PaginationItem disabled={activePage === 0}>
                    <PaginationLink previous onClick={() => {
                      gotoPage(activePage - 1)
                    }}>Previous</PaginationLink>
                  </PaginationItem>
                  {
                    pages.map((p, i) => {
                      return (
                        <PaginationItem disabled={activePage === i} active={activePage === i} key={i}>
                          <PaginationLink onClick={() => {
                            gotoPage(i)
                          }}>{i + 1}</PaginationLink>
                        </PaginationItem>
                      )
                    })
                  }
                  <PaginationItem disabled={logs.length < 100}>
                    <PaginationLink next onClick={() => {
                      gotoPage(activePage + 1)
                    }}>Next</PaginationLink>
                  </PaginationItem>
                </Pagination>
              </td>
            </tr>
          </tfoot>
        </Table>
      </div>
      <ModalLoading
        isOpen={busy}
        onClose={() => {
          setBusy(false)
        }}
      />
    </div>
  )
}