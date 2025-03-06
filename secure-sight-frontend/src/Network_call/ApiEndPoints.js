const APPConfig = {
  // Base URL for the API
  API_URL: process.env.REACT_APP_API_URL || "http://localhost:5001/api", // Use environment variable or fallback to local
};

// Helper function to construct API endpoints
const createEndpoint = (path) => `${APPConfig.API_URL}${path}`;

const ApiEndPoints = {
  Assignments: createEndpoint("/assignments"),
  Login: createEndpoint("/auth/login"),
  Register: createEndpoint('/auth/register'),
  Users: createEndpoint('/users'),
  Customers: createEndpoint('/customers'),
  TenantAddUpdate: createEndpoint("/master/add-update-tenant"),
  MasterList: createEndpoint("/master/list"),
  ConnectorList: createEndpoint("/connector/connector-list"),
  TenantList: createEndpoint("/tenant/user-list"),
  UserAddUpdate: createEndpoint("/tenant/add-update-user"),
  UserDelete: createEndpoint("/tenant/delete-user"),
  InstallConnector: createEndpoint("/upload-connector"),
  InsertMultiConnector: createEndpoint("/connector/insert-multi-connector"),
  AsynConnector: createEndpoint("/connector/share-connector"),
  ActiveConnector: createEndpoint("/connector/activate-connector"),
  AsynConnectorUser: createEndpoint("/connector/shareConnectorToUser"),
  UserCreateDashboard: createEndpoint("/dashboard/create-dashboard"),
  UserDashbordList: createEndpoint("/dashboard/get-dashboard"),
  UserConnnectorList: createEndpoint("/connector/connectorListForUser"),
  ConnecterDelete: createEndpoint("/connector/delete-connector"),
  ConnecterDeleteTenant: createEndpoint("/connector/delete-connectorByTenant"),
  ElasticData: createEndpoint("/elastic/data/"),
  GetDashboardData: createEndpoint("/dashboard/get-dashborad-data"),
  DeleteData: createEndpoint("/dashboard/delete-dashborad-data"),
  AddDashboardData: createEndpoint("/dashboard/add-dashborad-data"),
  Report: createEndpoint("/report"),
  CreateReport: createEndpoint("/report/create-report"),
  GetReportList: createEndpoint("/report/get-report"),
  AddReportData: createEndpoint("/report/add-report-data"),
  UpdateReportData: createEndpoint("/report/edit-report-data"),
  GetReportData: createEndpoint("/report/get-report-data"),
  DeleteReportData: createEndpoint("/report/delete-report-data"),
  DeleteDashboard: createEndpoint("/dashboard/delete-dashboard"),
  DeleteReport: createEndpoint("/report/delete-report"),
  UpdateDashboard: createEndpoint("/dashboard/update-dashboard"),
  UpdateDashboardTitle: createEndpoint("/dashboard/update-table-title"),
  UpdateReport: createEndpoint("/report/update-report"),
  UpdateReportTitle: createEndpoint("/report/update-reportTable-title"),
  CVESearch: createEndpoint("/elastic/cveSearch"),
  EmailScheduler: createEndpoint("/schedule/email-report"),
  ConnectorInsert: createEndpoint("/connector/insert-multi-connector"),
  UploadConnector: createEndpoint("/upload-connector?"),
  MurgeReort: createEndpoint("/report/merge-report"),
  Connector: createEndpoint("/connector"),
  ConnectorConfig: createEndpoint("/connector/add-connector-config"),
  ConnectorScheduler: createEndpoint("/connector/schedule"),
  ConnectorLog: createEndpoint("/connector/connector-log"),
  ConnectorConfigDetail: createEndpoint("/connector/connector-config-detail"),
  DSMList: createEndpoint("/elastic/dsmlist"),
  HostCompilanceData: createEndpoint("/elastic/hostCompilance"),
  CSVCompilanceData: createEndpoint("/elastic/cveReport"),
  ElasticIndexList: createEndpoint("/elastic/dataSource"),
  DeleteIndex: createEndpoint("/elastic/data/index"),
  SearchData: createEndpoint("/elastic/data/search"),
  ConnectorParameterSave: createEndpoint("/connector/connector-parameter-save"),
  UploadFileData: createEndpoint("/document/upload-document"),
  FileList: createEndpoint("/document/document-list"),
  FileGet: createEndpoint("/document/get-document/"),
  FileDelete: createEndpoint("/document/delete-document"),
  ConformityChecks: createEndpoint("/elastic/conformity-new-checks"),
  ContainerRuntimeSensor: createEndpoint("/elastic/container-runtime-sensor"),
  ContainerEvaluation: createEndpoint("/elastic/container-evaluation"),
  ContainerRuntimeVulnerabilityView: createEndpoint("/elastic/container-runtime-vulnerability-view"),
  SmartScanDetail: createEndpoint("/elastic/smart-scan-detail"),
  RegistriesList: createEndpoint("/elastic/smart-check-registries-list"),
  ChangeLanguage: createEndpoint("/connector/change-language"),
  Notifications: createEndpoint("/notifications"),
  // New CSV Upload endpoint
  // FileGet: "/api/file-get",
  UploadDocument: "/api/document/upload-document",
};

export default ApiEndPoints;
