import { Fragment, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row
} from "reactstrap";

//Import Breadcrumb
import { useLocation } from "react-router-dom";
import { Breadcrumbsub } from "../../components/Common/Breadcrumb";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import ModalLoading from "../../components/ModalLoading";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";
import { getErrorMessage } from "../../helpers/utils";

const ConnectorLogFile = () => {

  const location = useLocation();
  const [openLoader, setOpenLoader] = useState(false);
  const [connectorLogs, setConnectorLogs] = useState("");

  useEffect(() => {
    Connectorlog();
  }, [location]);
  const Connectorlog = async () => {
    try {
      setOpenLoader(true);
      const payload = {
        connectorBasePath: location.state.display_name,
        logfileName: location.state.display_name + ".log",
      };
      const response = await ApiServices(
        "post",
        payload,
        ApiEndPoints.ConnectorLog
      );

      setConnectorLogs(response.data);
    } catch (e) {
      console.log(e)
      const msg = getErrorMessage(e)
      alert(msg)
    } finally {
      setOpenLoader(false);
    }
  };

  return (
    <Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <BreadcrumbWithTitle title="Connector" />
          <Row>
            <Col md={12}>
              <Card>
                <CardBody>
                  <CardTitle>
                    <Breadcrumbsub
                      title={<div>Connector Log Detail</div>}
                      breadcrumbItem={
                        <DownloadLog
                          connectorLogs={connectorLogs}
                          title={location.state.display_name}
                        />
                      }
                    />{" "}
                  </CardTitle>
                  <div>
                    {connectorLogs ? connectorLogs : "Data not found! "}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <ModalLoading
        isOpen={openLoader}
        onClose={() => setOpenLoader(false)}
      />
    </Fragment>
  );
};

export default ConnectorLogFile;

function DownloadLog({ connectorLogs, title }) {
  const handleDownload = () => {
    const text = connectorLogs;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <button onClick={handleDownload} className="btn btn-primary w-md">
        Download Log
      </button>
      {/* <button onClick={handleDownload}>Download Log</button> */}
    </div>
  );
}
