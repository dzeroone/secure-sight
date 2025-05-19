import moment from "moment";
import { enqueueSnackbar } from "notistack";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { GrFormPrevious } from "react-icons/gr";
import {
  MdDownload,
  MdOutlineNavigateNext,
  MdSave,
  MdUpload,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import AlcForm from "../../components/form/AlcForm";
import EndpointProtectionForm from "../../components/form/EndpointProtectionForm";
import EpiForm from "../../components/form/EpiForm";
import { LicenseForm, ProductForm } from "../../components/form/EpiTableForm";
import FirstPageForm from "../../components/form/FirstPageForm";
import KfaForm from "../../components/form/KfaForm";
import KfdForm from "../../components/form/KfdForm";
import KfwForm from "../../components/form/KfwForm";
import Label from "../../components/form/Label";
import PisForm from "../../components/form/PisForm";
import SloForm from "../../components/form/SloFrom";
import TableOfContentsForm from "../../components/form/TableOfContentsForm";
import TisForm from "../../components/form/TisForm";
import Navbar from "../../components/Navbar";
import EndpointInventory from "../../components/pdf-components/EndpointInventory";
import ExecutiveSummary from "../../components/pdf-components/ExecutiveSummary";
import FirstPage from "../../components/pdf-components/FirstPage";
import KeyFeatureApex from "../../components/pdf-components/KeyFeatureApex";
import KeyFeatureDeepSecurity from "../../components/pdf-components/KeyFeatureDeepSecurity";
import KeyFeatureWorkLoad from "../../components/pdf-components/KeyFeatureWorkLoad";
import PendingIncidentsSummary from "../../components/pdf-components/PendingIncidentsSummary";
import SloSummary from "../../components/pdf-components/SloSummary";
import TableOfContents from "../../components/pdf-components/TableOfContents";
import ThreatIntelSummary from "../../components/pdf-components/ThreatIntelSummary";
import Alert from "../../components/ui/Alert";
import axiosApi from "../../config/axios";
import { REPORT_AUDIT_STATUS, REPORT_STATUS } from "../../data/data";
import {
  updateClientName,
  updateClientState,
  updateDataProp,
  updateExecutiveSummary,
  updateTableOfContents,
} from "../../features/weekly/weeklySlice";
import { withAuth } from "../../hocs/withAuth";
import { useAuth } from "../../providers/AuthProvider";
import store, { RootState } from "../../store/store";
import { getErrorMessage } from "../../utils/helpers";
import ExecutiveSummaryForm from "../../components/form/ExecutiveSummaryForm";
import { SelectInput } from "../../components/form/Inputs";

const Dashboard = () => {
  const router = useNavigate();
  const location = useLocation();

  const [searchParams] = useSearchParams();

  const [reportData, setReportData] = useState<any>(null);
  const [reportState, setReportState] = useState({
    serverStatus: 0,
    status: 0,
    auditStatus: -999,
    canSubmitReport: false,
    reporterId: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isPreparingPdf, setIsPreparingPdf] = useState<boolean>(
    searchParams.get("print") ? true : false
  );
  const { currentUser } = useAuth();

  const elasticIndex = searchParams.get("index");
  const reportId = searchParams.get("id");

  // Get visibility status from Redux
  const dispatch = useDispatch();
  const sliderRef = useRef<Slider>(null);

  const alc = useSelector((state: RootState) => state.alc);
  const slo = useSelector((state: RootState) => state.slo);

  const tableOfContents = useSelector((s: RootState) => s.tableOfContents)

  /**
   * get report data from elastic index
   */

  const getElasticData = useCallback(async () => {
    try {
      if (reportId) {
        setLoading(true);

        const res = await axiosApi({
          url: `/assignment-reports/weekly/${reportId}`,
          method: "GET",
          responseType: "json",
        });
        const responseData = res.data;
        const reportDoc = responseData.data;

        dispatch({
          type: "RESTORE",
          payload: reportDoc.data.formData,
        });
        setReportData(reportDoc.data.reportData);
        setReportState((s) => {
          return {
            ...s,
            serverStatus: reportDoc.status,
            status: reportDoc.status,
            auditStatus: reportDoc.auditStatus,
            reporterId: reportDoc.reporterId,
            canSubmitReport: responseData.canSubmitReport,
          };
        });
      } else if (elasticIndex) {
        setLoading(true);
        let payload = {
          index: elasticIndex,
          column: [],
        };
        const res = await axiosApi({
          url: `/elastic/data/search`,
          method: "POST",
          responseType: "json",
          data: payload,
        });
        const responseData = res.data;
        if (responseData && responseData.data.length > 0) {
          const data = responseData.data[0]._source;

          setReportData(data);
          setReportState((s) => {
            return {
              ...s,
              serverStatus: 0,
              status: 0,
              auditStatus: -999,
              canSubmitReport: responseData.canSubmitReport,
            };
          });
          dispatch(updateClientName(responseData.customer.name));
          dispatch(
            updateClientState({
              field: "tenantCode",
              value: responseData.customer.tCode.toUpperCase(),
            })
          );
          dispatch(
            updateClientState({
              field: "dateFrom",
              value: moment(data.WEEKLY_REPORT?.start_date).format(
                "Do MMMM YYYY"
              ),
            })
          );
          dispatch(
            updateClientState({
              field: "dateTo",
              value: moment(data.WEEKLY_REPORT?.end_date).format(
                "Do MMMM YYYY"
              ),
            })
          );

          data.TABLE_OF_CONTENTS?.date?.TABLE_OF_CONTENTS?.forEach(
            (t: any, i: number) => {
              dispatch(
                updateTableOfContents({
                  attr: `[${i}]`,
                  value: {
                    title: t.title,
                    page: Number(t.page_no) || 0,
                    visible: true
                  }
                })
              );
            }
          );
          dispatch(
            updateExecutiveSummary({
              field: "nOfIncidents",
              value:
                Number(
                  data.EXECUTIVE_SUMMARY?.date.EXECUTIVE_SUMMARY.total_incidents
                    .total_incidents
                ) || 0,
            })
          );
          dispatch(
            updateExecutiveSummary({
              field: "riskIndex",
              value:
                Number(
                  data.EXECUTIVE_SUMMARY?.date.EXECUTIVE_SUMMARY.risk_index.chart
                    .data[0]
                ) || 0,
            })
          );
          dispatch(
            updateExecutiveSummary({
              field: "nOfDVul",
              value:
                Number(
                  data.EXECUTIVE_SUMMARY?.date.EXECUTIVE_SUMMARY
                    .highly_exploitable
                ) || 0,
            })
          );
          dispatch(
            updateExecutiveSummary({
              field: "nOfICWoAck",
              value:
                Number(
                  data.EXECUTIVE_SUMMARY?.date.EXECUTIVE_SUMMARY.Incident_Closed
                ) || 0,
            })
          );
          dispatch(
            updateExecutiveSummary({
              field: "nOfTIncidents",
              value:
                Number(
                  data.EXECUTIVE_SUMMARY?.date.EXECUTIVE_SUMMARY
                    .Highest_incidient
                ) || 0,
            })
          );
          dispatch(
            updateExecutiveSummary({
              field: "iTDate",
              value: moment(
                data.EXECUTIVE_SUMMARY?.date.EXECUTIVE_SUMMARY
                  .Highest_incidient_date
              ).format("Do MMMM YYYY"),
            })
          );
          dispatch(
            updateExecutiveSummary({
              field: "epTAgents",
              value: Number(
                data.EXECUTIVE_SUMMARY?.date.EXECUTIVE_SUMMARY.endpoint_protection.data[1]
              ) || 0,
            })
          );
          dispatch(
            updateExecutiveSummary({
              field: "epDAgents",
              value: Number(
                data.EXECUTIVE_SUMMARY?.date.EXECUTIVE_SUMMARY.endpoint_protection.data[0]
              ) || 0,
            })
          );
          dispatch(
            updateExecutiveSummary({
              field: "epTSensors",
              value: Number(
                data.EXECUTIVE_SUMMARY?.date.EXECUTIVE_SUMMARY.endpoint_sensor.data[1]
              ) || 0,
            })
          );
          dispatch(
            updateExecutiveSummary({
              field: "epDSensors",
              value: Number(
                data.EXECUTIVE_SUMMARY?.date.EXECUTIVE_SUMMARY.endpoint_sensor.data[0]
              ) || 0,
            })
          );

          // threat intel summary
          dispatch(updateDataProp({
            attr: 'isSeverity',
            value: data.THREAT_INTEL_SUMMARY?.date.THREAT_INTEL_SUMMARY.Incident_Summary_by_Severity?.data
          }))
          dispatch(updateDataProp({
            attr: 'isStatus',
            value: [...data.THREAT_INTEL_SUMMARY?.date.THREAT_INTEL_SUMMARY.Incident_Summary_by_status?.data, 0]
          }))

        }
      } else {
        dispatch({
          type: "RESET",
        });
        setReportState((s) => {
          return {
            ...s,
            reporterId: "",
            canSubmitReport: false,
            serverStatus: 0,
            status: 0,
            auditStatus: -999,
          };
        });
      }
    } catch (e) {
      console.error(e);
      const msg = getErrorMessage(e);
      enqueueSnackbar(msg, {
        variant: "error",
      });
      router(location.pathname, {
        replace: true,
      });
    } finally {
      setLoading(false);
    }
  }, [elasticIndex, reportId, dispatch]);

  // - end

  const handlePrint = async () => {
    setIsPreparingPdf(true);
    const response = await axiosApi.post("/pdf/weekly", null, {
      params: {
        index: elasticIndex ?? undefined,
        id: reportId ?? undefined,
      },
      responseType: "arraybuffer",
    });
    if (typeof window !== "undefined") {
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "weekly-report.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
    setIsPreparingPdf(false);
    // setTimeout(() => {
    //   window.print();
    //   setIsPreparingPdf(false);
    // }, 1000);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);
  };

  const handleFileRead = (event: ProgressEvent<FileReader>) => {
    if (event.target?.result) {
      try {
        const json = JSON.parse(event.target.result as string);
        setReportData(json);
        setError("");
      } catch (e) {
        console.error("JSON parse error: ", e);
        setError("Failed to parse JSON file. Please check the file format.");
      }
      setLoading(false);
    }
  };

  const saveReport = async () => {
    try {
      setLoading(true);
      let url = `/assignment-reports/weekly`;
      let requestMethod = "POST";
      if (reportId) {
        url = `/assignment-reports/weekly/${reportId}`;
        requestMethod = "PATCH";
      }

      const toSubmit: any = {
        formData: store.getState(),
        reportData,
        status: reportState.status,
      };
      if (elasticIndex) {
        toSubmit.index = elasticIndex;
      }

      const res = await axiosApi({
        url,
        method: requestMethod,
        responseType: "json",
        data: toSubmit,
      });
      const responseData = res.data;
      enqueueSnackbar("Report has been saved", {
        variant: "success",
      });
      if (elasticIndex) {
        router(`/dashboard?id=${responseData._id}`, {
          replace: true,
        });
      } else {
        router(0);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (file) {
      setLoading(true);
      setError("");
      const reader = new FileReader();
      reader.onload = handleFileRead;
      reader.onerror = () => {
        setError("Failed to read file.");
        setLoading(false);
      };
      reader.readAsText(file);
    }
  }, [file]);

  useEffect(() => {
    getElasticData();
  }, [getElasticData]);

  const formData8 = {
    key: slo.key,
  };

  const client = useSelector((state: RootState) => state.client);

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="w-full">
      <Navbar />
      <div className="print-action">
        {reportData ? (
          <button
            className="btn-primary rounded-md inline-flex items-center disabled:cursor-not-allowed disabled:opacity-50"
            disabled={
              loading ||
              reportState.auditStatus === REPORT_AUDIT_STATUS.APPROVED ||
              (reportState.reporterId === currentUser?.id &&
                (REPORT_STATUS.SUBMIT === reportState.serverStatus ||
                  [
                    REPORT_AUDIT_STATUS.APPROVED,
                    REPORT_AUDIT_STATUS.PENDING,
                  ].includes(reportState.auditStatus)))
            }
            onClick={saveReport}
          >
            <MdSave className="mr-2" />{" "}
            {reportState.status === 0 ? "Save" : "Submit"} report
          </button>
        ) : null}
        <form>
          <label
            htmlFor="file"
            className="btn-primary rounded-md inline-flex items-center"
          >
            <MdUpload className="mr-2" /> Upload JSON file
            <input
              type="file"
              id="file"
              name="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </form>
        {reportData && (
          <button
            className="btn-primary rounded-md inline-flex items-center disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isPreparingPdf}
            onClick={handlePrint}
          >
            <MdDownload className="mr-2" /> Download Pdf
          </button>
        )}
      </div>
      {loading && (
        <div className="w-full h-screen grid place-items-center">
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      {error && <div className="container">{error}</div>}

      {reportData && (
        <div className="">
          <div className="flex">
            <div className="sticky top-0 flex flex-col gap-4 max-h-screen overflow-auto max-w-[450px]">
              {!isPreparingPdf && (
                <div className="ml-[50px]">
                  {reportState.auditStatus === REPORT_AUDIT_STATUS.APPROVED ? (
                    <div className="mb-2">
                      <Alert variant="success" elevated>
                        This report has been approved.
                      </Alert>
                    </div>
                  ) : null}
                  {reportState.canSubmitReport ? (
                    <div>
                      <Label htmlFor="status-select-label">Status</Label>
                      <SelectInput
                        id="status-select-label"
                        value={reportState.status}
                        onChange={(e) => {
                          // dispatch(setStatus(e.target.value as number));
                          setReportState((s) => {
                            return {
                              ...s,
                              status: Number(e.target.value),
                            };
                          });
                        }}
                      >
                        <option value={0}>Draft</option>
                        <option value={1}>Submit for review</option>
                      </SelectInput>
                    </div>
                  ) : null}
                  <div className="flex justify-between my-4 sticky top-2 z-50 bg-white">
                    <button
                      onClick={handlePrev}
                      className="border flex items-center justify-center border-gray-300 rounded-md p-2 text-sm font-semibold"
                    >
                      <GrFormPrevious />
                      Previous
                    </button>
                    <button
                      onClick={handleNext}
                      className="border border-gray-300 flex items-center justify-center rounded-md p-2 text-sm font-semibold"
                    >
                      Next
                      <MdOutlineNavigateNext />
                    </button>
                  </div>

                  <Slider {...sliderSettings} ref={sliderRef}>
                    <div>
                      <FirstPageForm />
                    </div>
                    <div>
                      <TableOfContentsForm />
                    </div>
                    <div>
                      <ExecutiveSummaryForm />
                    </div>
                    <div>
                      <AlcForm />
                    </div>
                    <div>
                      <EndpointProtectionForm />
                    </div>
                    <div>
                      <TisForm />
                    </div>
                    <div>
                      <PisForm />
                    </div>
                    <div>
                      <SloForm />
                    </div>
                    <div>
                      <EpiForm />
                    </div>
                    <div>
                      <LicenseForm />
                    </div>
                    <div>
                      <ProductForm />
                    </div>
                    <div>
                      <KfaForm />
                    </div>
                    <div>
                      <KfwForm />
                    </div>
                    <div>
                      <KfdForm />
                    </div>
                  </Slider>
                </div>
              )}
            </div>

            <div className="print-section">
              {/* First page */}
              {reportData?.WEEKLY_REPORT && (
                <FirstPage data={reportData.WEEKLY_REPORT} client={client} />
              )}

              {/* Table of contents */}
              {reportData?.TABLE_OF_CONTENTS && <TableOfContents />}

              {/* Executive summary */}
              {reportData?.EXECUTIVE_SUMMARY && tableOfContents[0].visible && (
                <ExecutiveSummary
                  data={reportData.EXECUTIVE_SUMMARY}
                />
              )}

              {/* Threat intel summary */}
              {reportData?.THREAT_INTEL_SUMMARY && (
                <ThreatIntelSummary
                  data={reportData.THREAT_INTEL_SUMMARY}
                />
              )}

              {/* Pending incidents summary */}
              {reportData?.PENDING_INCIDENTS_SUMMARY && tableOfContents[7].visible && (
                <PendingIncidentsSummary
                  data={reportData.PENDING_INCIDENTS_SUMMARY}
                />
              )}

              {/* SLO summary */}
              {reportData?.SLO_SUMMARY && tableOfContents[8].visible && (
                <SloSummary
                  formData={formData8}
                  data={reportData.SLO_SUMMARY}
                />
              )}

              {/* Endpoint inventory */}
              {reportData?.ENDPOINT_INVENTORY && (
                <EndpointInventory
                  data={reportData.ENDPOINT_INVENTORY}
                />
              )}

              {/* Key feature apex one */}
              {reportData?.Key_feature_adoption_rate_of_Ap && tableOfContents[11].visible && (
                <KeyFeatureApex
                  data={reportData.Key_feature_adoption_rate_of_Ap}
                />
              )}

              {/* Key feature workload */}
              {reportData?.Key_feature_adoption_rate_of_Cw && tableOfContents[12].visible && (
                <KeyFeatureWorkLoad
                  data={reportData.Key_feature_adoption_rate_of_Cw}
                />
              )}

              {/* Key feature deep security */}
              {reportData?.Key_feature_adoption_rate_of_Ds && tableOfContents[13]?.visible && (
                <KeyFeatureDeepSecurity
                  data={reportData.Key_feature_adoption_rate_of_Ds}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Dashboard);
