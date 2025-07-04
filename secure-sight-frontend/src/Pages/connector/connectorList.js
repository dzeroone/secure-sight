import { CloseOutlined } from "@mui/icons-material";
import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  FormGroup,
  FormText,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  Table,
  UncontrolledTooltip
} from "reactstrap";
import swal from "sweetalert";

//Import Breadcrumb
import { Link } from "react-router-dom";
import { Breadcrumbsub } from "../../components/Common/Breadcrumb";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";
import { allReplace, formatCapilize } from "../ulit/commonFunction";
import { LogsIcon, TrashIcon, UploadIcon } from "lucide-react";
import { getErrorMessage } from "../../helpers/utils";

const ConnectorList = () => {
  const [openLoader, setOpenLoader] = useState(false);
  const [connectorListData, setConnectorListData] = useState([]);
  const [searchedVal, setSearchedVal] = useState("");
  const [userData, setUserData] = useState({
    email: "",
    dbName: "",
    user_id: "",
  });

  const [uploadModalShown, setUploadModalShown] = useState(false)
  const [connectorFile, setConnectorFile] = useState(null)

  const refConnectorOnOperation = useRef(null)

  useEffect(() => {
    let userObject = localStorage.getItem("authUser");
    var userInfo = userObject ? JSON.parse(userObject) : "";
    setUserData(() => ({
      email: userInfo.email,
      dbName: userInfo.dbName,
      user_id: userInfo._id,
    }));
    connectorData(userInfo.dbName);
  }, []);

  //   ######################################## connector list  ##########################################
  const connectorData = async (dbName) => {
    setOpenLoader(true);
    const response = await ApiServices(
      "get",
      null,
      ApiEndPoints.ConnectorList
    );
    setConnectorListData(response);
    setOpenLoader(false);
  };
  // ############################################## connector conig ######################################

  const ConnectorConfigDetail = async ({ id, connectorData }) => {
    setOpenLoader(true);
    const payload = {
      info: { dbName: userData.dbName, connectorId: id },
      data: {
        config: connectorData?.config?.properties,
        connectorBasePath: connectorData?.display_name,
        connectorFileNameWithExtension: "inventry.py",
      },
    };
    const response = await ApiServices(
      "post",
      payload,
      ApiEndPoints.ConnectorConfig
    );
    toast.success(response.msg);
    setOpenLoader(false);
  };

  // ############################################## connector delete ######################################
  const DeleteAlert = (item) => {
    swal("Are you sure?", " You want to delete connector!", "warning", {
      buttons: ["CANCEL", "DELETE"],
      dangerMode: true,
      className: "bgcolor",
    }).then((okay) => {
      if (okay) {
        DeleteConnecter(item);
      }
    });
  };

  const DeleteConnecter = async (item) => {
    setOpenLoader(true);
    const payload = {
      info: { dbName: userData.dbName, connectorId: item },
    };
    const response = await ApiServices(
      "post",
      payload,
      ApiEndPoints.ConnecterDeleteTenant
    );
    toast.success(response.msg);
    setOpenLoader(false);
    connectorData(userData.dbName);
  };

  const onClickUpload = (connectorId) => {
    setUploadModalShown(true)
    refConnectorOnOperation.current = connectorId
  }

  const uploadConnectorFile = async () => {
    if (!connectorFile || !connectorFile.length) return
    if (!refConnectorOnOperation.current) return
    try {
      setOpenLoader(true)
      const formData = new FormData()
      formData.append('file', connectorFile[0])
      await ApiServices(
        'patch',
        formData,
        `${ApiEndPoints.Connector}/${refConnectorOnOperation.current}/file`
      )
      toast.success('File updated')
    } catch (e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    } finally {
      setOpenLoader(false)
    }
  }

  // const handleRowClick = (rowData) => {
  //   setSelectedRow(rowData);
  // };

  return (
    <Fragment>
      {/* <ToastContainer />
      <div className="page-content"> */}
      {/* <Container fluid={true}>
          <Breadcrumbs title="connector" breadcrumbItem="Connector List" /> */}
      <Row>
        <Col md={12}>
          <Card>
            <CardBody>
              <CardTitle>
                <div>
                  <Breadcrumbsub
                    title={<span>Connector List {openLoader ? <Spinner color="dark" size="sm" /> : null}</span>}
                    breadcrumbItem={
                      <div className="input-group">
                        <button
                          onClick={() => {
                            setSearchedVal("");
                          }}
                          className="input-group-text"
                        >
                          <CloseOutlined />
                        </button>
                        <input
                          type="text"
                          className="form-control"
                          id="autoSizingInputGroup"
                          placeholder="Search"
                          value={searchedVal}
                          onChange={(e) => {
                            setSearchedVal(e.target.value);
                          }}
                        />
                      </div>
                    }
                  />
                </div>
              </CardTitle>
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Connector Name</th>
                    <th>Installed On</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {connectorListData &&
                    connectorListData
                      .filter(
                        (x) =>
                          !searchedVal.length ||
                          x.display_name
                            .toString()
                            .toLowerCase()
                            .includes(
                              searchedVal.toString().toLowerCase()
                            ) ||
                          x.created_at
                            .toString()
                            .toLowerCase()
                            .includes(searchedVal.toString().toLowerCase())
                      )
                      // .slice(
                      //   page * rowsPerPage,
                      //   page * rowsPerPage + rowsPerPage
                      // )
                      .map((item, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>
                            {item.display_name ? formatCapilize(
                              allReplace(item.display_name, {
                                _: " ",
                                "-": " ",
                              })
                            ) : ''}
                          </td>
                          <td>{item.created_at}</td>
                          <td>
                            {item?.isConnectorScheduled &&
                              item?.isConnectorScheduled === true
                              ? "Scheduled"
                              : item?.isConnectorScheduled === false
                                ? "Stopped"
                                : "Pending"}
                          </td>
                          <td>
                            {/* <button
                              onClick={() => {
                                ConnectorConfigDetail({
                                  id: item._id,
                                  connectorData: item,
                                });
                              }}
                              type="button"
                              className="btn  noti-icon  m-0 p-0    "
                            >
                              <i className="mdi mdi-timer"></i>
                            </button> */}
                            <div className="d-flex gap-1">
                              <Button
                                onClick={() => {
                                  onClickUpload(item._id);
                                }}
                                size="sm"
                              >
                                <UploadIcon size="1rem" />
                              </Button>
                              <a
                                id={`log-link-${item._id}`}
                                className="btn btn-secondary btn-sm"
                                href={`/connector-logs/${item._id}`}
                              >
                                <LogsIcon size="1rem" />
                              </a>
                              <UncontrolledTooltip target={`log-link-${item._id}`}>
                                Logs
                              </UncontrolledTooltip>
                              <Button
                                onClick={() => {
                                  DeleteAlert(item._id);
                                }}
                                size="sm"
                              >
                                <TrashIcon size="1rem" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Modal centered isOpen={uploadModalShown} toggle={() => setUploadModalShown(false)}>
        <ModalHeader>Upload connector file</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Input type="file" accept=".py,.env" onChange={(e) => {
              console.log(e.target.files)
              setConnectorFile(e.target.files)
            }} />
            <FormText>
              Upload Py file and Env file of Connector
            </FormText>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button onClick={uploadConnectorFile}>Upload</Button>
        </ModalFooter>
      </Modal>
      {/* </Container> */}
      {/* </div> */}
    </Fragment>
  );
};

export default ConnectorList;
