import { useCallback, useEffect, useState } from "react";
import BreadcrumbWithTitle from "../../../components/Common/BreadcrumbWithTitle";
import { getErrorMessage } from "../../../helpers/utils";
import { toast } from "react-toastify";
import ModalLoading from "../../../components/ModalLoading";
import { Button, Spinner, Table } from "reactstrap";
import ApiServices from "../../../Network_call/apiservices";
import ApiEndPoints from "../../../Network_call/ApiEndPoints";
import { useParams } from "react-router-dom";
import { DeleteIcon, DownloadIcon, TrashIcon } from "lucide-react";
import { allReplace, formatCapilize } from "../../ulit/commonFunction";

export default function ConnectorLogsIndexPage() {
  const params = useParams()
  const id = params.id

  const [busy, setBusy] = useState(false)
  const [info, setInfo] = useState({
    connector: null,
    files: []
  })

  const [downloading, setDownloading] = useState([])

  const loadFiles = useCallback(async () => {
    try {
      setBusy(true)
      const res = await ApiServices(
        'get',
        null,
        `${ApiEndPoints.ConnectorLog}/${id}`
      )
      setInfo(res)
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }, [])

  const downloadLog = async (fileName) => {
    try {
      setDownloading(s => {
        return [...s, fileName]
      })
      const res = await ApiServices(
        'get',
        null,
        `${ApiEndPoints.ConnectorLog}/${id}/${fileName}`,
        null,
        false,
        {
          responseType: 'arraybuffer'
        }
      )

      const blob = new Blob([res], { type: 'text/plain' }); // Create a Blob from the response data
      saveAs(blob, fileName); // Use file-saver to trigger the download
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally {
      setDownloading(s => {
        return s.filter(f => f!=fileName)
      })
    }
  }

  const onRemoveLog = async (fileName) => {
    try {
      const confirmed = await swal({
        title: "Are you sure?",
        text: `You are about to remove ${fileName}`,
        buttons: {
          cancel: true,
          confirm: true,
        },
      })
      if(confirmed) {
        setBusy(true)
        await ApiServices(
          'delete',
          null,
          `${ApiEndPoints.ConnectorLog}/${id}/${fileName}`
        )
        toast.success(`${fileName} has been removed successfully.`)
        loadFiles()
      }
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }


  useEffect(() => {
    loadFiles()
  }, [loadFiles])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title={`Log: ${info.connector?.display_name ? formatCapilize(
                              allReplace(info.connector.display_name, {
                                _: " ",
                                "-": " ",
                              })
                            ) : ''}`} />
      <div>
        <Table>
          <thead>
            <tr>
              <th>Files</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              info.files.map(f => {
                return (
                  <tr key={f}>
                    <td>{f}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button size="sm" disabled={downloading.includes(f)} onClick={() => downloadLog(f)}>
                          { downloading.includes(f) ? <Spinner size="sm">
                            Loading...
                          </Spinner> : <DownloadIcon size="1rem" />
                          }
                        </Button>
                        <Button size="sm" onClick={() => onRemoveLog(f)}>
                          <TrashIcon size="1rem" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
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