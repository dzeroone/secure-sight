"use client";
import axiosApi from "@@/config/axios";
import { REPORT_AUDIT_STATUS, REPORT_STATUS, ROLE_NAMES, ROLES } from "@@/constants";
import { getErrorMessage } from "@@/helper/helper";
import {
  setProcessing,
  setStatus,
} from "@@/lib/features/monthly-report/monthlyPageStateSlice";
import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import { useAuth } from "@@/providers/AuthProvider";
import {
  createMonthlyReport,
  getMonthlyReportPdf,
} from "@@/services/monthly-report";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  PictureAsPdf,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  MobileStepper,
  Modal,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import AboutThisReportForm from "./monthly-report/forms/AboutThisReport";
import AccountCompromiseEventsForm from "./monthly-report/forms/AccountCompromiseEventsForm";
import AgentVersionForm from "./monthly-report/forms/AgentVersionForm";
import ApexOneSummaryForm from "./monthly-report/forms/ApexOneSummaryForm";
import DetailedSummary from "./monthly-report/forms/DetailedSummary";
import EmailQuarantineSummaryForm from "./monthly-report/forms/EmailQuarantineSummaryForm";
import EndpointFeatureForm from "./monthly-report/forms/EndpointFeatureForm";
import ExecutiveSummaryForm from "./monthly-report/forms/ExecutiveSummaryForm";
import FirstPageForm from "./monthly-report/forms/FirstPageForm";
import HighIncidentSummaryForm from "./monthly-report/forms/HighIncidentSummaryForm";
import KFAApexOneForm from "./monthly-report/forms/KFAApexOneForm";
import KFADeepSecurityForm from "./monthly-report/forms/KFADeepSecurityForm";
import KFAWorkloadForm from "./monthly-report/forms/KFAWorkloadForm";
import OverallIncidentSummaryForm from "./monthly-report/forms/OverallIncidentSummaryForm";
import PendingIncidentsSummaryForm from "./monthly-report/forms/PendingIncidentsSummaryForm";
import ProductAssessmentForm from "./monthly-report/forms/ProductAssessmentForm";
import RiskMetricsForm from "./monthly-report/forms/RiskMetricsForm";
import SiemIncidentSummaryForm from "./monthly-report/forms/SiemIncidentSummaryForm";
import SLOSummaryForm from "./monthly-report/forms/SLOSummaryForm";
import SystemConfigReportForm from "./monthly-report/forms/SystemConfigReportForm";
import TableOfContentsForm from "./monthly-report/forms/TableOfContentsForm";
import ThreatIntelSummaryForm from "./monthly-report/forms/ThreatIntelSummaryForm";
import TopRiskDeviceForm from "./monthly-report/forms/TopRiskDeviceForm";
import TopRiskUsersForm from "./monthly-report/forms/TopRiskUsersForm";
import TopVulnerabilitiesForm from "./monthly-report/forms/TopVulnerabilitiesForm";
import VulnAssessmentReportForm from "./monthly-report/forms/VulnAssessmentReportForm";
import WorkbenchIncidentSummaryForm from "./monthly-report/forms/WorkbenchIncidentSummaryForm";
import MonthlyFormStepper from "./MonthlyFormStepper";
const steps = [
  {
    id: "first_page",
    label: "First Page",
    component: <FirstPageForm />,
  },
  {
    id: "table_of_contents",
    label: "Table of Contents",
    component: <TableOfContentsForm />,
  },
  {
    id: "about_this_report",
    label: "About this report",
    component: <AboutThisReportForm />,
  },
  {
    id: "executive_summary",
    label: "Executive Summary",
    component: <ExecutiveSummaryForm />,
  },
  {
    id: "detailed_summary",
    label: "Detailed Summary",
    component: <DetailedSummary />,
  },
  {
    id: "risk_metrics",
    label: "Risk Metrics",
    component: <RiskMetricsForm />,
  },
  {
    id: "threat_intel_summary",
    label: "Threat Intel Summary",
    component: <ThreatIntelSummaryForm />,
  },
  {
    id: "incidents_summary",
    label: "Overall Incidents Summary",
    component: <OverallIncidentSummaryForm />,
  },
  {
    id: "workbench_incidents_summary",
    label: "Vision One Workbench Incidents Summary",
    component: <WorkbenchIncidentSummaryForm />,
  },
  {
    id: "third_party_siem_incidents_summary",
    label: "Third Party / SIEM Incidents Summary",
    component: <SiemIncidentSummaryForm />,
  },
  {
    id: "high_incidents_summary",
    label: "High Incidents Summary",
    component: <HighIncidentSummaryForm />,
  },
  {
    id: "waiting_incidents_summary",
    label: "Pending Incidents Summary",
    component: <PendingIncidentsSummaryForm />,
  },
  {
    id: "slo_summary",
    label: "SLO Summary",
    component: <SLOSummaryForm />,
  },
  {
    id: "detection_summary_from_apex_one",
    label: "Detection Summary from Apex One",
    component: <ApexOneSummaryForm />,
  },
  {
    id: "email_quarantine_summary_from_cas",
    label: "Email Quarantine Summary from CAS",
    component: <EmailQuarantineSummaryForm />,
  },
  {
    id: "vulnerability_assessment_report",
    label: "Vulnerability Assessment Report",
    component: <VulnAssessmentReportForm />,
  },
  {
    id: "system_configuration_report",
    label: "System Configuration Report",
    component: <SystemConfigReportForm />,
  },
  {
    id: "top_vulnerabilities_detected",
    label: "Top Vulnerabilities Detected",
    component: <TopVulnerabilitiesForm />,
  },
  {
    id: "top_risk_devices",
    label: "Top Risk Device",
    component: <TopRiskDeviceForm />,
  },
  {
    id: "top_risk_users",
    label: "Top Risk Users",
    component: <TopRiskUsersForm />,
  },
  {
    id: "account_compromise_events",
    label: "Account Compromise Events",
    component: <AccountCompromiseEventsForm />,
  },
  {
    id: "product_assessment_report",
    label: "Product Assessment Report",
    component: <ProductAssessmentForm />,
  },
  {
    id: "endpoint_feature_compliance",
    label: "Endpoint Feature Compliance",
    component: <EndpointFeatureForm />,
  },
  {
    id: "key_feature_adoption_apex_one",
    label:
      "Key Feature Adoption Rate of Apex one as Service / Std Endpoint Protection",
    component: <KFAApexOneForm />,
  },
  {
    id: "key_feature_adoption_server_workload",
    label:
      "Key Feature Adoption Rate of Server & Workload Security / Protection",
    component: <KFAWorkloadForm />,
  },
  {
    id: "key_feature_adoption_deep_security",
    label: "Key Feature Adoption Rate of Deep Security",
    component: <KFADeepSecurityForm />,
  },
  {
    id: "agent_versions_summary",
    label: "Agent Versions Summary",
    component: <AgentVersionForm />,
  }
];
const MonthlyReportForm = () => {
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const data = useAppSelector((state) => state.monthlyReport);
  const pageState = useAppSelector((state) => state.monthlyReportPageState);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get("id");
  const elasticIndex = searchParams.get("index");
  const { currentUser } = useAuth();

  const [activeStep, setActiveStep] = useState(0);

  const [pdfPath, setPdfPath] = useState("");

  const [selectReporterShown, setSelectReporterShown] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('')

  const [reporters, setReporters] = useState<any[]>([]);
  const [selectedReporter, setSelectedReporter] = useState("");

  const maxSteps = steps.length;

  const levels = useMemo(() => {
    if(currentUser?.role == ROLES.LEVEL1) {
      setSelectedLevel(ROLES.LEVEL3)
      return [ROLES.LEVEL3, ROLES.LEVEL2]
    }
    if(currentUser?.role == ROLES.LEVEL2) {
      setSelectedLevel(ROLES.LEVEL3)
      return [ROLES.LEVEL3]
    }
    setSelectedLevel('')
    return []
  }, [currentUser?.role])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const loadReporters = useCallback(async () => {
    if (!selectedLevel || !pageState.assignment?._id) return;
    try {
      setSelectedReporter('');
      const res = await axiosApi.get(
        `/assignments/${pageState.assignment?._id}/suggest-reporters?level=${selectedLevel}`
      );
      setReporters(res.data);
    } catch (e) {}
  }, [selectedLevel, pageState.assignment?._id]);

  const saveMonthlyReport = async () => {
    try {
      dispatch(setProcessing(true));
      let url = `/assignment-reports/monthly`;
      let requestMethod = "POST";
      if (reportId) {
        url = `/assignment-reports/monthly/${reportId}`;
        requestMethod = "PATCH";
      }
      const toSubmit: any = {
        report: data,
        status: pageState.status,
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
        router.replace(`/dashboard/monthly-report?id=${responseData._id}`);
      } else {
        setTimeout(() => {
          location.reload();
        }, 2000)
      }
    } catch (e) {
      console.error(e);
      const msg = getErrorMessage(e);
      enqueueSnackbar(msg, {
        variant: "error",
      });
    } finally {
      dispatch(setProcessing(false));
    }
  };

  const onSaveMonthlyReport = () => {
    if (
      // !pageState.assignment?.sTo &&
      pageState.canSubmitReport &&
      pageState.status == 1
    ) {
      setSelectReporterShown(true);
    } else {
      saveMonthlyReport();
    }
  };

  // save pdf
  const handleSave = async () => {
    try {
      const result = await createMonthlyReport(data);
      if (result) {
        toast.success("Monthly report saved successfully");
        return;
      }
      toast.error("Failed to save monthly report");
      return;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // print/download pdf

  const handleDownloadPdf = async () => {
    // try {
    //   const response = await getMonthlyReportPdf(data);
    //   setPdfPath(response.filePath);
    // } catch (error: any) {
    //   toast.error(error.message);
    // }
    try {
      setGeneratingPdf(true);
      const response = await getMonthlyReportPdf(
        pageState.auditStatus == REPORT_AUDIT_STATUS.APPROVED
          ? { id: reportId }
          : data
      );

      if (typeof window !== "undefined") {
        const blob = new Blob([response], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "generated.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      const msg = getErrorMessage(error);
      enqueueSnackbar(msg, {
        variant: "error",
      });
    } finally {
      setGeneratingPdf(false);
    }
  };

  useEffect(() => {
    if (steps[activeStep]?.id) {
      // console.log(
      //   steps[activeStep].id,
      //   document.getElementById(steps[activeStep]?.id)
      // );
      document.getElementById(steps[activeStep]?.id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }, [activeStep]);

  useEffect(() => {
    loadReporters();
  }, [loadReporters]);

  return (
    <div className="form-wrapper">
      <Grid container spacing={2} justifyContent="flex-end" p={2}>
        {/* <Grid item>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Grid> */}
        <Grid item xs={12} sx={{ position: "sticky", top: 200 }}>
          {pageState.auditStatus == REPORT_AUDIT_STATUS.AUDIT ? (
            <Alert severity="warning" sx={{ mb: 1 }}>
              Needs auditing
            </Alert>
          ) : null}
          {pageState.auditStatus == REPORT_AUDIT_STATUS.APPROVED ? (
            <Alert severity="success" sx={{ mb: 1 }}>
              This report is accepted
            </Alert>
          ) : null}
          <Stack
            direction={{ md: "column", lg: "row" }}
            justifyContent="space-between"
            gap={2}
          >
            <LoadingButton
              variant="contained"
              color="success"
              loading={pageState.processing || generatingPdf}
              onClick={handleDownloadPdf}
            >
              <PictureAsPdf />
            </LoadingButton>
            {pageState.canSubmitReport ? (
              <FormControl fullWidth size="small">
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status-select"
                  label="Status"
                  value={pageState.status}
                  onChange={(e) => {
                    dispatch(setStatus(e.target.value as number));
                  }}
                >
                  <MenuItem value={0}>Draft</MenuItem>
                  <MenuItem value={1}>Submit for review</MenuItem>
                </Select>
              </FormControl>
            ) : null}
            <LoadingButton
              variant="contained"
              color="info"
              disabled={
                pageState.auditStatus === REPORT_AUDIT_STATUS.APPROVED ||
                (pageState.reporterId == currentUser?.id &&
                  (REPORT_STATUS.SUBMIT == pageState.statusFromServer ||
                    [
                      REPORT_AUDIT_STATUS.APPROVED,
                      REPORT_AUDIT_STATUS.PENDING,
                    ].includes(pageState.auditStatus)))
              }
              loading={pageState.processing}
              onClick={onSaveMonthlyReport}
            >
              {pageState.canSubmitReport && pageState.status == 1 ? "Submit" : "Save"}
            </LoadingButton>
          </Stack>
        </Grid>
        {pdfPath && (
          <Grid container item xs={12} justifyContent="flex-end">
            <Button variant="text" color="success">
              <a href={pdfPath} target="_blank">
                Generate & Download PDF
              </a>
            </Button>
          </Grid>
        )}
      </Grid>
      <Box sx={{ flexGrow: 1 }}>
        <Paper
          square
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            height: 50,
            pl: 2,
            bgcolor: "background.default",
          }}
        >
          <Typography>{steps[activeStep].label}</Typography>
        </Paper>
        <MonthlyFormStepper
          activeStep={activeStep}
          totalStep={steps.length}
          handleBack={handleBack}
          handleNext={handleNext}
          onChangeStep={(e) => {
            setActiveStep(Number(e.target.value));
          }}
        />
        <Box sx={{ minHeight: 255, width: "100%" }}>
          {steps[activeStep].component}
        </Box>
        <MonthlyFormStepper
          activeStep={activeStep}
          totalStep={steps.length}
          handleBack={handleBack}
          handleNext={handleNext}
          onChangeStep={(e) => {
            setActiveStep(Number(e.target.value));
          }}
        />
        <Dialog
          open={selectReporterShown}
          onClose={() => setSelectReporterShown(false)}
        >
          <DialogTitle>Select reporter</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="reporter-level">Level</InputLabel>
              <Select
                labelId="reporter-level"
                id="reporter-level-input"
                value={selectedLevel}
                label="Level"
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                }}
              >
                <MenuItem value="" disabled>
                  None
                </MenuItem>
                {levels.map((l: any) => {
                  return (
                    <MenuItem value={l} key={l}>
                      {ROLE_NAMES[l]}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="reporter-label">Reporter</InputLabel>
              <Select
                labelId="reporter-label"
                id="reporter"
                value={selectedReporter}
                label="Reporter"
                onChange={(e) => {
                  setSelectedReporter(e.target.value);
                }}
              >
                <MenuItem value="" disabled>
                  None
                </MenuItem>
                {reporters.map((r: any) => {
                  return (
                    <MenuItem value={r._id} key={r._id}>
                      {r.fullname}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setSelectReporterShown(false);
                saveMonthlyReport();
              }}
              disabled={!selectedReporter}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
};

export default MonthlyReportForm;
