import Button from "@/components/Button";
import ISCategoryForm from "@/components/form/ISCategoryForm";
import ISPriorityForm from "@/components/form/ISPriorityForm";
import ISSeverityForm from "@/components/form/ISSeverityForm";
import ISStatusForm from "@/components/form/ISStatusForm";
import ThreatIntelSummaryForm from "@/components/form/ThreatIntelSummaryForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import moment from "moment";
import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GrFormPrevious } from "react-icons/gr";
import { MdDownload, MdOutlineNavigateNext, MdSave } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import CisForm from "../../components/form/CisForm";
import EpiForm from "../../components/form/EpiForm";
import { LicenseForm, ProductForm } from "../../components/form/EpiTableForm";
import ExecutiveSummaryForm from "../../components/form/ExecutiveSummaryForm";
import FirstPageForm from "../../components/form/FirstPageForm";
import { SelectInput } from "../../components/form/Inputs";
import KfaForm from "../../components/form/KfaForm";
import KfdForm from "../../components/form/KfdForm";
import KfwForm from "../../components/form/KfwForm";
import Label from "../../components/form/Label";
import PisForm from "../../components/form/PisForm";
import SloForm from "../../components/form/SloFrom";
import TableOfContentsForm from "../../components/form/TableOfContentsForm";
import TisForm from "../../components/form/TisForm";
import Navbar from "../../components/Navbar";
import ClosedIncidentsSummary from "../../components/pdf-components/ClosedIncidentsSummary";
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
  updateChartData,
  updateClientName,
  updateClientState,
  updateDataProp,
  updateExecutiveSummary,
  updateMatchSummaryData,
} from "../../features/weekly/weeklySlice";
import { withAuth } from "../../hocs/withAuth";
import { useAuth } from "../../providers/AuthProvider";
import store, { RootState } from "../../store/store";
import { getErrorMessage } from "../../utils/helpers";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Dashboard = () => {
  const router = useNavigate();
  const location = useLocation();

  const [searchParams] = useSearchParams();

  const [reportData, setReportData] = useState<any>(null);
  const [reportState, setReportState] = useState<{
    auditStatus: number,
    serverStatus: number,
    status: number,
    reporterId: string,
    assignment: any,
    canSubmitReport: boolean
  }>({
    serverStatus: 0,
    status: 0,
    auditStatus: -999,
    canSubmitReport: false,
    assignment: null,
    reporterId: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [isPreparingPdf, setIsPreparingPdf] = useState<boolean>(
    searchParams.get("print") ? true : false
  );
  const [selectedPage, setSelectedPage] = useState("0");
  const { currentUser } = useAuth();

  const elasticIndex = searchParams.get("index");
  const reportId = searchParams.get("id");

  // Get visibility status from Redux
  const dispatch = useDispatch();
  const sliderRef = useRef<Slider>(null);

  const slo = useSelector((state: RootState) => state.slo);

  const tableOfContents = useSelector((s: RootState) => s.tableOfContents);
  const matchSummary = useSelector((state: RootState) => state.matchSummary);
  const [selectReporterShown, setSelectReporterShown] = useState(false);
  const [reporters, setReporters] = useState<any[]>([]);
  const [selectedReporter, setSelectedReporter] = useState("");

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
            assignment: responseData.assignment,
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
        if (responseData && responseData.data) {
          const data = responseData.data;

          setReportData(data);
          setReportState((s) => {
            return {
              ...s,
              serverStatus: 0,
              status: 0,
              auditStatus: -999,
              assignment: responseData.assignment,
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

          // data.TABLE_OF_CONTENTS?.date?.TABLE_OF_CONTENTS?.forEach(
          //   (t: any, i: number) => {
          //     dispatch(
          //       updateTableOfContents({
          //         attr: `[${i}]`,
          //         value: {
          //           title: t.title,
          //           page: Number(t.page_no) || 0,
          //           visible: true
          //         }
          //       })
          //     );
          //   }
          // );
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
                  data.EXECUTIVE_SUMMARY?.date.EXECUTIVE_SUMMARY.risk_index
                    .chart.data[0]
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
              value:
                Number(
                  data.EXECUTIVE_SUMMARY?.date.EXECUTIVE_SUMMARY
                    .endpoint_protection.data[1]
                ) || 0,
            })
          );
          dispatch(
            updateExecutiveSummary({
              field: "epDAgents",
              value:
                Number(
                  data.EXECUTIVE_SUMMARY?.date.EXECUTIVE_SUMMARY
                    .endpoint_protection.data[0]
                ) || 0,
            })
          );
          dispatch(
            updateExecutiveSummary({
              field: "epTSensors",
              value:
                Number(
                  data.EXECUTIVE_SUMMARY?.date.EXECUTIVE_SUMMARY.endpoint_sensor
                    .data[1]
                ) || 0,
            })
          );
          dispatch(
            updateExecutiveSummary({
              field: "epDSensors",
              value:
                Number(
                  data.EXECUTIVE_SUMMARY?.date.EXECUTIVE_SUMMARY.endpoint_sensor
                    .data[0]
                ) || 0,
            })
          );

          // CLOSED_INCIDENT_SUMMARY
          if(data.CLOSED_INCIDENT_SUMMARY?.date?.CLOSED_INCIDENT_SUMMARY?.graph) {
            const gData = data.CLOSED_INCIDENT_SUMMARY?.date?.CLOSED_INCIDENT_SUMMARY?.graph
            
            dispatch(updateDataProp({
              attr: "cIncidentSummary.data[0].data",
              value: gData.data["True Positive"]
            }))
            dispatch(updateDataProp({
              attr: "cIncidentSummary.data[1].data",
              value: gData.data["False Positive"]
            }))
            dispatch(updateDataProp({
              attr: "cIncidentSummary.data[2].data",
              value: gData.data["Remediated"]
            }))
            dispatch(updateDataProp({
              attr: "cIncidentSummary.data[3].data",
              value: gData.data["Duplicate"]
            }))
          }

          // threat intel summary
          dispatch(
            updateDataProp({
              attr: "isSeverity",
              value:
                data.THREAT_INTEL_SUMMARY?.date.THREAT_INTEL_SUMMARY
                  .Incident_Summary_by_Severity?.data,
            })
          );
          dispatch(
            updateDataProp({
              attr: "isStatus",
              value: [
                ...data.THREAT_INTEL_SUMMARY?.date.THREAT_INTEL_SUMMARY
                  .Incident_Summary_by_status?.data,
                0,
              ],
            })
          );
          if (data.THREAT_INTEL_SUMMARY?.date) {
            dispatch(
              updateDataProp({
                attr: "t10ISCat",
                value: {
                  Key: data.THREAT_INTEL_SUMMARY?.date.THREAT_INTEL_SUMMARY
                    .T10IS_by_Category.Key,
                  data: data.THREAT_INTEL_SUMMARY?.date.THREAT_INTEL_SUMMARY.T10IS_by_Category.data.map(
                    (d: any) => {
                      if (d.label == "Pending from Customer") {
                        d.label = `Pending from ${responseData.customer.tCode.toUpperCase()}`;
                      }
                      return d;
                    }
                  ),
                },
              })
            );
          }

          if (data.SLO_SUMMARY?.date) {
            dispatch(
              updateDataProp({
                attr: "sloCV.tCI",
                value:
                  Number(data.SLO_SUMMARY?.date.SLO_SUMMARY.graph.data[0]) || 0,
              })
            );
            dispatch(
              updateDataProp({
                attr: "sloCV.sloMet",
                value:
                  Number(data.SLO_SUMMARY?.date.SLO_SUMMARY.graph.data[1]) || 0,
              })
            );
            dispatch(
              updateDataProp({
                attr: "sloCV.sloNMet",
                value:
                  Number(data.SLO_SUMMARY?.date.SLO_SUMMARY.graph.data[2]) || 0,
              })
            );
          }
          if (data.ENDPOINT_INVENTORY?.date) {
            data.ENDPOINT_INVENTORY?.date.ENDPOINT_INVENTORY?.Bar_graph?.Key.forEach(
              (k: string, i: number) => {
                dispatch(
                  updateChartData({
                    index: i,
                    label: k,
                    dataPoint:
                      data.ENDPOINT_INVENTORY?.date.ENDPOINT_INVENTORY
                        ?.Bar_graph?.data[i] || 0,
                  })
                );
              }
            );
          }

          if (data.Key_feature_adoption_rate_of_Ap?.date) {
            const graph =
              data.Key_feature_adoption_rate_of_Ap?.date
                .Key_feature_adoption_rate_of_Ap?.graph;
            graph?.Key.forEach((k: string, i: number) => {
              dispatch(
                updateDataProp({
                  attr: `kFARAp.key[${i}]`,
                  value: k,
                })
              );
            });
            graph?.data.forEach((d: any, i: number) => {
              dispatch(
                updateDataProp({
                  attr: `kFARAp.data[${i}].label`,
                  value: graph.data[i].label,
                })
              );
              dispatch(
                updateDataProp({
                  attr: `kFARAp.data[${i}].backgroundColor`,
                  value: graph.data[i].backgroundColor,
                })
              );
              graph.data[i].data.forEach((dv: any, j: number) => {
                dispatch(
                  updateDataProp({
                    attr: `kFARAp.data[${i}].data[${j}]`,
                    value: Number(dv) || 0,
                  })
                );
              });
            });
          }

          if (data.Key_feature_adoption_rate_of_Cw?.date) {
            const graph =
              data.Key_feature_adoption_rate_of_Cw?.date
                .Key_feature_adoption_rate_of_Cw?.graph;
            graph?.Key.forEach((k: string, i: number) => {
              dispatch(
                updateDataProp({
                  attr: `kFARWl.key[${i}]`,
                  value: k,
                })
              );
            });
            graph?.data.forEach((d: any, i: number) => {
              dispatch(
                updateDataProp({
                  attr: `kFARWl.data[${i}].label`,
                  value: graph.data[i].label,
                })
              );
              dispatch(
                updateDataProp({
                  attr: `kFARWl.data[${i}].backgroundColor`,
                  value: graph.data[i].backgroundColor,
                })
              );
              graph.data[i].data.forEach((dv: any, j: number) => {
                dispatch(
                  updateDataProp({
                    attr: `kFARWl.data[${i}].data[${j}]`,
                    value: Number(dv) || 0,
                  })
                );
              });
            });
          }

          if (data.Key_feature_adoption_rate_of_Ds?.date) {
            const graph =
              data.Key_feature_adoption_rate_of_Ds?.date
                .Key_feature_adoption_rate_of_Ds?.graph;
            graph?.Key.forEach((k: string, i: number) => {
              dispatch(
                updateDataProp({
                  attr: `kFARDs.key[${i}]`,
                  value: k,
                })
              );
            });
            graph?.data.forEach((d: any, i: number) => {
              dispatch(
                updateDataProp({
                  attr: `kFARDs.data[${i}].label`,
                  value: graph.data[i].label,
                })
              );
              dispatch(
                updateDataProp({
                  attr: `kFARDs.data[${i}].backgroundColor`,
                  value: graph.data[i].backgroundColor,
                })
              );
              graph.data[i].data.forEach((dv: any, j: number) => {
                dispatch(
                  updateDataProp({
                    attr: `kFARDs.data[${i}].data[${j}]`,
                    value: Number(dv) || 0,
                  })
                );
              });
            });
          }
        }
        if(responseData?.commonData) {
          const chart = responseData.commonData.threat_intel_summary.ioc_chart ?? { ip: 0, url: 0, domain: 0, hash: 0, sender_email: 0}
          dispatch(updateMatchSummaryData({
            iocMatched: matchSummary.iocMatched,
            iocSweeped: [chart.ip, chart.url, chart.domain, chart.hash, chart.sender_email],
            labels: matchSummary.labels
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

  const loadReporters = useCallback(async () => {
    if (!selectReporterShown) return;
    try {
      const res = await axiosApi.get(
        `/assignments/${reportState.assignment?._id}/suggest-reporters`
      );
      setReporters(res.data);
    } catch (e) {}
  }, [selectReporterShown]);

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
        submittedTo: selectedReporter,
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

  const onSaveReport = () => {
    if (!reportState.assignment?.sTo && reportState.canSubmitReport && reportState.status == 1) {
      setSelectReporterShown(true);
    } else {
      saveReport();
    }
  };

  const allPageContents = useMemo(() => {
    return [
      {
        id: "first-page",
        title: "First Page",
      },
      {
        id: "table-of-contents",
        title: "Table of Contents",
      },
      ...tableOfContents.slice(0, 7),
      {
        id: 'closed-incidents',
        title: "Closed Incidents summary"
      },
      ...tableOfContents.slice(7)
    ];
  }, [tableOfContents]);

  useEffect(() => {
    getElasticData();
  }, [getElasticData]);

  useEffect(() => {
    loadReporters();
  }, [loadReporters]);

  const scrollToIndex = (index: number) => {
    const id = allPageContents[index]?.id;
    const element = document.getElementById(id);

    element?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };

  useEffect(() => {
    scrollToIndex(parseInt(selectedPage));
    sliderRef.current?.slickGoTo(parseInt(selectedPage));
  }, [allPageContents, selectedPage]);

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
    afterChange: (index: number) => {
      setSelectedPage("" + index);
    },
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
            onClick={onSaveReport}
          >
            <MdSave className="mr-2" />{" "}
            {reportState.status === 0 ? "Save" : "Submit"} report
          </button>
        ) : null}
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
                    <div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button>Page {parseInt(selectedPage) + 1}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 max-h-96">
                          <DropdownMenuLabel>Pages</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup
                            value={selectedPage}
                            onValueChange={(v) => {
                              setSelectedPage(v);
                            }}
                          >
                            {allPageContents.map((tc, i) => {
                              return (
                                <DropdownMenuRadioItem value={"" + i} key={i}>
                                  {tc.title}
                                </DropdownMenuRadioItem>
                              );
                            })}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
                      <ThreatIntelSummaryForm />
                    </div>
                    <div>
                      <TisForm />
                    </div>
                    <div>
                      <ISSeverityForm />
                    </div>
                    <div>
                      <ISStatusForm />
                    </div>
                    <div>
                      <ISPriorityForm />
                    </div>
                    <div>
                      <ISCategoryForm />
                    </div>
                    <div>
                      <CisForm />
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
              <FirstPage data={reportData.WEEKLY_REPORT} client={client} />

              {/* Table of contents */}
              <TableOfContents />

              {/* Executive summary */}
              {reportData?.EXECUTIVE_SUMMARY && tableOfContents[0].visible && (
                <ExecutiveSummary data={reportData.EXECUTIVE_SUMMARY} />
              )}

              {/* Threat intel summary */}
              {reportData?.THREAT_INTEL_SUMMARY && (
                <ThreatIntelSummary data={reportData.THREAT_INTEL_SUMMARY} />
              )}

              {/* closed incidents summary */}
              <ClosedIncidentsSummary />

              {/* Pending incidents summary */}
              {reportData?.PENDING_INCIDENTS_SUMMARY &&
                tableOfContents[7].visible && (
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
                <EndpointInventory data={reportData.ENDPOINT_INVENTORY} />
              )}

              {/* Key feature apex one */}
              {reportData?.Key_feature_adoption_rate_of_Ap &&
                tableOfContents[11].visible && <KeyFeatureApex />}

              {/* Key feature workload */}
              {reportData?.Key_feature_adoption_rate_of_Cw &&
                tableOfContents[12].visible && <KeyFeatureWorkLoad />}

              {/* Key feature deep security */}
              {reportData?.Key_feature_adoption_rate_of_Ds &&
                tableOfContents[13]?.visible && <KeyFeatureDeepSecurity />}
            </div>
          </div>
        </div>
      )}

      <Dialog
        open={selectReporterShown}
        onOpenChange={(open) => setSelectReporterShown(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select reporter</DialogTitle>
          </DialogHeader>
          <Label htmlFor="reporter">Reporter</Label>
          <SelectInput
            id="reporter"
            value={selectedReporter}
            onChange={(e) => {
              setSelectedReporter(e.target.value);
            }}
          >
            <option value="" disabled>
              None
            </option>
            {reporters.map((r: any) => {
              return (
                <option value={r._id} key={r._id}>
                  {r.fullname}
                </option>
              );
            })}
          </SelectInput>
          <DialogFooter>
            <Button
              onClick={() => {
                setSelectReporterShown(false);
                saveReport();
              }}
              disabled={!selectedReporter}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default withAuth(Dashboard);
