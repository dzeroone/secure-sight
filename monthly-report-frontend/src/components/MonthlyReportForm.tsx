"use client";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  MobileStepper,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import FirstPageForm from "./monthly-report/forms/FirstPageForm";
import TableOfContentsForm from "./monthly-report/forms/TableOfContentsForm";
import SystemConfigReportForm from "./monthly-report/forms/SystemConfigReportForm";
import VulnAssessmentReportForm from "./monthly-report/forms/VulnAssessmentReportForm";
import PendingIncidentsSummaryForm from "./monthly-report/forms/PendingIncidentsSummaryForm";
import DetailedSummary from "./monthly-report/forms/DetailedSummary";
import AboutThisReportForm from "./monthly-report/forms/AboutThisReport";
import ExecutiveSummaryForm from "./monthly-report/forms/ExecutiveSummaryForm";
import HighIncidentSummaryForm from "./monthly-report/forms/HighIncidentSummaryForm";
import OverallIncidentSummaryForm from "./monthly-report/forms/OverallIncidentSummaryForm";
import SiemIncidentSummaryForm from "./monthly-report/forms/SiemIncidentSummaryForm";
import WorkbenchIncidentSummaryForm from "./monthly-report/forms/WorkbenchIncidentSummaryForm";
import AccountCompromiseEventsForm from "./monthly-report/forms/AccountCompromiseEventsForm";
import RiskMetricsForm from "./monthly-report/forms/RiskMetricsForm";
import ThreatIntelSummaryForm from "./monthly-report/forms/ThreatIntelSummaryForm";
import SLOSummaryForm from "./monthly-report/forms/SLOSummaryForm";
import ApexOneSummaryForm from "./monthly-report/forms/ApexOneSummaryForm";
import { toast } from "react-toastify";
import {
  createMonthlyReport,
  getMonthlyReportPdf,
} from "@@/services/monthly-report";
import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import EmailQuarantineSummaryForm from "./monthly-report/forms/EmailQuarantineSummaryForm";
import TopVulnerabilitiesForm from "./monthly-report/forms/TopVulnerabilitiesForm";
import TopRiskDeviceForm from "./monthly-report/forms/TopRiskDeviceForm";
import TopRiskUsersForm from "./monthly-report/forms/TopRiskUsersForm";
import ProductAssessmentForm from "./monthly-report/forms/ProductAssessmentForm";
import EndpointFeatureForm from "./monthly-report/forms/EndpointFeatureForm";
import KFAApexOneForm from "./monthly-report/forms/KFAApexOneForm";
import KFAWorkloadForm from "./monthly-report/forms/KFAWorkloadForm";
import AgentVersionForm from "./monthly-report/forms/AgentVersionForm";
import KFADeepSecurityForm from "./monthly-report/forms/KFADeepSecurityForm";
import { LoadingButton } from "@mui/lab";
import {
  redirect,
  RedirectType,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { setProcessing } from "@@/lib/features/monthly-report/monthlyPageStateSlice";
import axiosApi from "@@/config/axios";
import { getErrorMessage } from "@@/helper/helper";
const steps = [
  {
    label: "First Page",
    component: <FirstPageForm />,
  },
  {
    label: "Table of Contents",
    component: <TableOfContentsForm />,
  },
  {
    label: "About this report",
    component: <AboutThisReportForm />,
  },
  {
    label: "Executive Summary",
    component: <ExecutiveSummaryForm />,
  },
  {
    label: "Detailed Summary",
    component: <DetailedSummary />,
  },
  {
    label: "Risk Metrics",
    component: <RiskMetricsForm />,
  },
  {
    label: "Threat Intel Summary",
    component: <ThreatIntelSummaryForm />,
  },
  {
    label: "Overall Incidents Summary",
    component: <OverallIncidentSummaryForm />,
  },
  {
    label: "Vision One Workbench Incidents Summary",
    component: <WorkbenchIncidentSummaryForm />,
  },
  {
    label: "Third Party / SIEM Incidents Summary",
    component: <SiemIncidentSummaryForm />,
  },
  {
    label: "High Incidents Summary",
    component: <HighIncidentSummaryForm />,
  },
  {
    label: "Pending Incidents Summary",
    component: <PendingIncidentsSummaryForm />,
  },
  {
    label: "SLO Summary",
    component: <SLOSummaryForm />,
  },
  {
    label: "Detection Summary from Apex One",
    component: <ApexOneSummaryForm />,
  },
  {
    label: "Email Quarantine Summary from CAS",
    component: <EmailQuarantineSummaryForm />,
  },
  {
    label: "Vulnerability Assessment Report",
    component: <VulnAssessmentReportForm />,
  },
  {
    label: "System Configuration Report",
    component: <SystemConfigReportForm />,
  },
  {
    label: "Top Vulnerabilities Detected",
    component: <TopVulnerabilitiesForm />,
  },
  {
    label: "Top Risk Device",
    component: <TopRiskDeviceForm />,
  },
  {
    label: "Top Risk Users",
    component: <TopRiskUsersForm />,
  },
  {
    label: "Account Compromise Events",
    component: <AccountCompromiseEventsForm />,
  },
  {
    label: "Product Assessment Report",
    component: <ProductAssessmentForm />,
  },
  {
    label: "Endpoint Feature Compliance",
    component: <EndpointFeatureForm />,
  },
  {
    label:
      "Key Feature Adoption Rate of Apex one as Service / Std Endpoint Protection",
    component: <KFAApexOneForm />,
  },
  {
    label:
      "Key Feature Adoption Rate of Server & Workload Security / Protection",
    component: <KFAWorkloadForm />,
  },
  {
    label: "Key Feature Adoption Rate of Deep Security",
    component: <KFADeepSecurityForm />,
  },
  {
    label: "Agent Versions Summary",
    component: <AgentVersionForm />,
  },
];
const MonthlyReportForm = () => {
  const data = useAppSelector((state) => state.monthlyReport);
  const pageState = useAppSelector((state) => state.monthlyReportPageState);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get("id");
  const elasticIndex = searchParams.get("index");

  const [activeStep, setActiveStep] = useState(0);

  const [pdfPath, setPdfPath] = useState("");

  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const saveMonthlyReport = async () => {
    try {
      dispatch(setProcessing(true));
      let url = `/monthly-reports`;
      let requestMethod = "POST";
      if (reportId) {
        url = `/monthly-reports/${reportId}`;
        requestMethod = "PATCH";
      }
      const toSubmit: any = {
        report: data,
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
      router.replace(`/dashboard/monthly-report?id=${responseData._id}`);
    } catch (e) {
      console.error(e);
      const msg = getErrorMessage(e);
      alert(msg);
    } finally {
      dispatch(setProcessing(false));
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
      const response = await getMonthlyReportPdf(data);

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
    }
  };

  return (
    <div className="form-wrapper">
      <Grid container spacing={2} justifyContent="flex-end" p={2}>
        {/* <Grid item>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Grid> */}
        <Grid item xs={12} sx={{ position: "sticky", top: 200 }}>
          <Stack
            direction={{ md: "column", lg: "row" }}
            justifyContent="space-between"
            gap={2}
          >
            <LoadingButton
              variant="contained"
              color="success"
              loading={pageState.processing}
              onClick={handleDownloadPdf}
            >
              Generate & Download PDF
            </LoadingButton>
            <LoadingButton
              variant="contained"
              color="info"
              loading={pageState.processing}
              onClick={saveMonthlyReport}
            >
              Save
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
        <MobileStepper
          variant="text"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              Next
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              <KeyboardArrowLeft />
              Back
            </Button>
          }
        />
        <Box sx={{ minHeight: 255, width: "100%" }}>
          {steps[activeStep].component}
        </Box>
        <MobileStepper
          variant="text"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              Next
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              <KeyboardArrowLeft />
              Back
            </Button>
          }
        />
      </Box>
    </div>
  );
};

export default MonthlyReportForm;
