"use client";
import MonthlyReportForm from "@@/components/MonthlyReportForm";
import AboutReport from "@@/components/monthly-report/AboutReport";
import AccountCompromiseEvents from "@@/components/monthly-report/AccountCompromiseEvents";
import AgentVersionSummary from "@@/components/monthly-report/AgentVersionSummary";
import ApexOneSummary from "@@/components/monthly-report/ApexOneSummary";
import DetailedSummary from "@@/components/monthly-report/DetailedSummary";
import EmailQuarantineSummary from "@@/components/monthly-report/EmailQuarantineSummary";
import EndpointFeatureCompliance from "@@/components/monthly-report/EndpointFeatureCompliance";
import ExecutiveSummary from "@@/components/monthly-report/ExecutiveSummary";
import FirstPage from "@@/components/monthly-report/FirstPage";
import HighIncidentsSummary from "@@/components/monthly-report/HighIncidentsSummary";
import KFAApexOne from "@@/components/monthly-report/KFAApexOne";
import KFADeepSecurity from "@@/components/monthly-report/KFADeepSecurity";
import KFAWorkloadSecurity from "@@/components/monthly-report/KFAWorkloadSecurity";
import OverallIncidentsSummary from "@@/components/monthly-report/OverallIncidentsSummary";
import PendingIncidentsSummary from "@@/components/monthly-report/PendingIncidentsSummary";
import ProductAssessmentReport from "@@/components/monthly-report/ProductAssessmentReport";
import RiskMetrics from "@@/components/monthly-report/RiskMetrics";
import SIEMIncidentsSummary from "@@/components/monthly-report/SIEMIncidentsSummary";
import SLOSummary from "@@/components/monthly-report/SLOSummary";
import SystemConfigurationReport from "@@/components/monthly-report/SystemConfigurationReport";
import TableOfContents from "@@/components/monthly-report/TableOfContents";
import { ThreatIntelSummary } from "@@/components/monthly-report/ThreatIntelSummary";
import TopRiskDevice from "@@/components/monthly-report/TopRiskDevice";
import TopRiskUsers from "@@/components/monthly-report/TopRiskUsers";
import TopVulnerabilitiesDetected from "@@/components/monthly-report/TopVulnerabilitiesDetected";
import VulnerabilityAssessmentReport from "@@/components/monthly-report/VulnerabilityAssessmentReport";
import WorkbenchIncidentsSummary from "@@/components/monthly-report/WorkbenchIncidentsSummary";
import axiosApi from "@@/config/axios";
import { getErrorMessage } from "@@/helper/helper";
import {
  setIsLastReporter,
  setAuditStatus,
  setProcessing,
  setReporterId,
  setStatus,
  setStatusFromServer,
} from "@@/lib/features/monthly-report/monthlyPageStateSlice";
import {
  resetMonthlyReportState,
  updateFromElasticData,
} from "@@/lib/features/monthly-report/monthlySlice";
import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import { Box, Grid } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

const MonthlyReportPage = () => {
  const report = useAppSelector((state) => state.monthlyReport);
  const dispatch = useAppDispatch();

  const searchParams = useSearchParams();
  const elasticIndex = searchParams.get("index");
  const reportId = searchParams.get("id");

  const confirm = useConfirm();
  const router = useRouter();
  const pathname = usePathname();

  const getElasticData = useCallback(async () => {
    try {
      if (reportId) {
        dispatch(setProcessing(true));

        const res = await axiosApi.get(
          `/assignment-reports/monthly/${reportId}`,
          {
            responseType: "json",
          }
        );
        const responseData = res.data;
        dispatch(resetMonthlyReportState(responseData.data));
        dispatch(setStatusFromServer(responseData.status));
        dispatch(setStatus(responseData.status));
        dispatch(setAuditStatus(responseData.auditStatus));
        dispatch(setReporterId(responseData.reporterId));
      } else if (elasticIndex) {
        dispatch(setProcessing(true));
        let payload = {
          index: elasticIndex,
          column: [],
        };
        const res = await axiosApi.post(`/elastic/data/search`, payload, {
          responseType: "json",
        });

        const responseData = res.data;
        if (responseData && responseData.data.length > 0) {
          const data = responseData.data[0]._source;

          dispatch(updateFromElasticData(data));
          dispatch(setIsLastReporter(responseData.isLastReporter || false));
        }
      } else {
        dispatch(resetMonthlyReportState(null));
        dispatch(setStatusFromServer(0));
        dispatch(setStatus(0));
        dispatch(setAuditStatus(-999));
        dispatch(setIsLastReporter(false));
      }
    } catch (e: any) {
      const msg = getErrorMessage(e);
      confirm({
        title: "Error",
        description: msg,
      }).then((_) => {
        router.replace(pathname);
      });
      // const errorMessage = await res.text();
      // throw new Error(errorMessage);
    } finally {
      dispatch(setProcessing(false));
    }
  }, [elasticIndex, reportId, dispatch]);

  useEffect(() => {
    getElasticData();
  }, [getElasticData]);

  return (
    <Grid container xs={12} spacing={5}>
      <Grid item xs={3.5}>
        <MonthlyReportForm />
      </Grid>
      <Grid item xs={8.5} style={{ borderLeft: "1px solid #ccc" }}>
        <Grid item xs={12}>
          <Box className="report">
            {/* First page */}
            {report?.monthly_report && <FirstPage />}

            {/* Table of contents */}
            {report?.table_of_contents && <TableOfContents />}

            {/* About this report */}
            {report?.about_this_report && <AboutReport />}

            {/* Executive Summary */}
            {report?.executive_summary && <ExecutiveSummary />}

            {/* Detailed Summary */}
            {report?.detailed_summary && <DetailedSummary />}

            {/* Risk metrics */}
            {report?.risk_metrics && <RiskMetrics />}

            {/* threat intel summary */}
            {report?.threat_intel_summary && <ThreatIntelSummary />}

            {/* Overall incidents summary */}
            {report?.overall_incident_summary && <OverallIncidentsSummary />}

            {/* Workbench incidents summary */}
            {report?.workbench_incident_summary.visible && (
              <WorkbenchIncidentsSummary />
            )}

            {/* SIEM incidents summary */}
            {report?.siem_incident_summary.visible && <SIEMIncidentsSummary />}

            {/* High incidents summary */}
            {report?.high_incident_summary.data.length > 0 && (
              <HighIncidentsSummary />
            )}

            {/* Pending incidents summary */}
            {report.pending_incident_summary.data.length > 0 && (
              <PendingIncidentsSummary />
            )}

            {/* SLO summary */}
            {report?.slo_summary && <SLOSummary />}

            {/* Apex One summary */}
            {report?.detection_summary_apex_one && <ApexOneSummary />}

            {/* Email quarantine summary */}
            {report.email_quarantine_summary_cas.visible && (
              <EmailQuarantineSummary />
            )}

            {/* Vulnerability assessment report */}
            {report.vulnerability_assessment_report && (
              <VulnerabilityAssessmentReport />
            )}

            {/* System configuration report */}
            {report.system_configuration_report && (
              <SystemConfigurationReport />
            )}

            {/* Top vulnerabilities detected */}
            {report.top_vulnerabilities_detected && (
              <TopVulnerabilitiesDetected />
            )}

            {/* Top risk device */}
            {report.top_risk_device.visible && <TopRiskDevice />}

            {/* Top risk users */}
            {report.top_risk_users.visible && <TopRiskUsers />}

            {/* Account compromise events */}
            {report.account_compromise_events && <AccountCompromiseEvents />}

            {/* Product assessment report */}
            {report.product_assessment_report && <ProductAssessmentReport />}

            {/* Endpoint feature compliance */}
            {report.endpoint_feature_compliance && (
              <EndpointFeatureCompliance />
            )}

            {/* KFA Apex one */}
            {report.key_feature_adoption_apex_one.visible && <KFAApexOne />}

            {/* KFA Workload Security */}
            {report.key_feature_adoption_server_workload.visible && (
              <KFAWorkloadSecurity />
            )}

            {/* KFA Deep Security */}
            {report.key_feature_adoption_deep_security.visible && (
              <KFADeepSecurity />
            )}

            {/* Agent version summary */}
            {report.agent_versions_summary && <AgentVersionSummary />}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MonthlyReportPage;
