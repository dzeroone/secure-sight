import { Col, Container, Row } from "reactstrap";
import AdaptionRateGraph from "./report-graphs/AdaptionRateGraph";
import AgentVisionSummaryGraph from "./report-graphs/AgentVisionSummaryGraph";
import DonutChart from "./report-graphs/DonutChart";
import GroupHorizontalBarChart from "./report-graphs/GroupHorizontalBarChart";
import HorizontalBarChart from "./report-graphs/HorizontalBarChart";
import ReportTitle from "./ReportTitle";
import ReportTitleSmall from "./ReportTitleSmall";
import VerticleBarChart from "./report-graphs/VerticleBarChart";

export default function WeeklyReportGraphs({ data }) {
  return (
    <Container>
      <Row className="report-container">
        { (data['Email Summary']?.['Email_Status']?.['Email Status']) ? (
          <Col sm={6}>
            <ReportTitleSmall>Email Summary</ReportTitleSmall>
            <HorizontalBarChart data={[
              {
                data: Object.values(data['Email Summary']['Email_Status']['Email Status'])
              }
            ]} labels={Object.keys(data['Email Summary']['Email_Status']['Email Status'])} />
          </Col>
        ) : null }

        {(data['Email Summary']?.['Threat Type']) ? (
          <Col sm={6}>
            <ReportTitleSmall>Threat Type</ReportTitleSmall>
            <HorizontalBarChart data={[
              {
                data: Object.values(data['Email Summary']['Threat Type'])
              }
            ]} labels={Object.keys(data['Email Summary']['Threat Type'])} />
          </Col>
        ) : null }
        {(data['Overall Incidents Summary']) ? (
          <Col sm={6}>
            <ReportTitle>Overall Incidents Summary</ReportTitle>
            <div>
              <GroupHorizontalBarChart data={[{
                name: 'Incidents Closed with Resolution',
                data: [
                  data['Overall Incidents Summary']['Overall Incidents Summary']['P4']['Incidents Closed with Resolution'],
                  data['Overall Incidents Summary']['Overall Incidents Summary']['P3']['Incidents Closed with Resolution'],
                  data['Overall Incidents Summary']['Overall Incidents Summary']['P2']['Incidents Closed with Resolution'],
                  data['Overall Incidents Summary']['Overall Incidents Summary']['P1']['Incidents Closed with Resolution'],
                  data['Overall Incidents Summary']['Status Summary']['Incidents Closed with Resolution']
                ]
              }, {
                name: 'Incidents Closed without Acknowledgement',
                data: [
                  data['Overall Incidents Summary']['Overall Incidents Summary']['P4']['Incidents Closed without Acknowledgement'],
                  data['Overall Incidents Summary']['Overall Incidents Summary']['P3']['Incidents Closed without Acknowledgement'],
                  data['Overall Incidents Summary']['Overall Incidents Summary']['P2']['Incidents Closed without Acknowledgement'],
                  data['Overall Incidents Summary']['Overall Incidents Summary']['P1']['Incidents Closed without Acknowledgement'],
                  data['Overall Incidents Summary']['Status Summary']['Incidents Closed without Acknowledgement'],
                ]
              }, {
                name: 'Pending Incidents with SOC Team',
                data: [
                  data['Overall Incidents Summary']['Overall Incidents Summary']['P4']['Pending Incidents with SOC Team'],
                  data['Overall Incidents Summary']['Overall Incidents Summary']['P3']['Pending Incidents with SOC Team'],
                  data['Overall Incidents Summary']['Overall Incidents Summary']['P2']['Pending Incidents with SOC Team'],
                  data['Overall Incidents Summary']['Overall Incidents Summary']['P1']['Pending Incidents with SOC Team'],
                  data['Overall Incidents Summary']['Status Summary']['Pending Incidents with SOC Team'],
                ]
              }]} labels={['P4', 'P3', 'P2', 'P1', 'Status Summary']} />
            </div>
          </Col>
        ) : null}
        {(data['Detection Summary from A1']?.['Detection Summary form Apex One']) ? (
          <>
            <Col sm={6}>
              <ReportTitle>Detection summary from A1</ReportTitle>
              <ReportTitleSmall>Virus/Malware & Spyware/Grayware</ReportTitleSmall>
              <HorizontalBarChart data={[
                {
                  data: Object.entries(data['Detection Summary from A1']['Detection Summary form Apex One']['Virus/Malware & Spyware/Grayware']).filter(([key]) => ['chart_type', 'label', 'background_color'].includes(key) == false).map(([_, v]) => v)
                }
              ]} labels={Object.keys(data['Detection Summary from A1']['Detection Summary form Apex One']['Virus/Malware & Spyware/Grayware']).filter((key) => ['chart_type', 'label', 'background_color'].includes(key) == false)} />
            </Col>
            <Col sm={6}>
              <ReportTitle>Detection summary from A1</ReportTitle>
              <ReportTitleSmall>C & C Connections & Intrusion attempts Blocked</ReportTitleSmall>
              <HorizontalBarChart data={[
                {
                  data: Object.entries(data['Detection Summary from A1']['Detection Summary form Apex One']['C & C Connections & Intrusion attempts Blocked']).filter(([key]) => ['chart_type', 'label', 'background_color'].includes(key) == false).map(([_, v]) => v)
                }
              ]} labels={Object.keys(data['Detection Summary from A1']['Detection Summary form Apex One']['C & C Connections & Intrusion attempts Blocked']).filter((key) => ['chart_type', 'label', 'background_color'].includes(key) == false)} />
            </Col>
          </>
        ) : null}
        {(data.EXECUTIVE_SUMMARY?.date.EXECUTIVE_SUMMARY.risk_index.chart) ? (
          <Col sm={6}>
            <ReportTitleSmall>Detailed Summary</ReportTitleSmall>
            <DonutChart
              data={data.EXECUTIVE_SUMMARY?.date.EXECUTIVE_SUMMARY.risk_index.chart.data}
              labels={['Risk Index', 'rest']}
              colors={['rgb(67,71,216)', 'rgb(195,195,198)']}
            />
          </Col>
        ) : null}
        {(data.THREAT_INTEL_SUMMARY?.date.THREAT_INTEL_SUMMARY.Incident_Summary_by_Severity) ? (
          <Col sm={6}>
            <ReportTitleSmall>Incidents summary by severity</ReportTitleSmall>
            <DonutChart
              data={data.THREAT_INTEL_SUMMARY?.date.THREAT_INTEL_SUMMARY.Incident_Summary_by_Severity.data}
              labels={data.THREAT_INTEL_SUMMARY?.date.THREAT_INTEL_SUMMARY.Incident_Summary_by_Severity.label}
            />
          </Col>
        ) : null}
        {(data.THREAT_INTEL_SUMMARY?.date.THREAT_INTEL_SUMMARY.Incident_Summary_by_status) ? (
          <Col sm={6}>
            <ReportTitleSmall>Incident Summary by status</ReportTitleSmall>
            <DonutChart
              data={data.THREAT_INTEL_SUMMARY?.date.THREAT_INTEL_SUMMARY.Incident_Summary_by_status.data}
              labels={data.THREAT_INTEL_SUMMARY?.date.THREAT_INTEL_SUMMARY.Incident_Summary_by_status.label}
            />
          </Col>
        ) : null}
        {(data.THREAT_INTEL_SUMMARY?.date.THREAT_INTEL_SUMMARY.T10IS_by_Category) ? (
          <Col sm={6}>
            <div>
              <ReportTitleSmall>Top Incidents Summary by Category</ReportTitleSmall>
              <GroupHorizontalBarChart data={
                data.THREAT_INTEL_SUMMARY?.date.THREAT_INTEL_SUMMARY.T10IS_by_Category.data.map(d => {
                  return {
                    name: d.label,
                    data: d.data
                  }
                })} labels={data.THREAT_INTEL_SUMMARY?.date.THREAT_INTEL_SUMMARY.T10IS_by_Category.Key} />
            </div>
          </Col>
        ) : null}
        {(data['Agent Version Summary']?.['All Agents Version Summary']) ? (
          <Col sm={6}>
            <div>
              <ReportTitle>Agent Version Summary</ReportTitle>
              <AgentVisionSummaryGraph data={data['Agent Version Summary']['All Agents Version Summary']} />
            </div>
          </Col>
        ) : null}
        {(data?.SLO_SUMMARY) ? (
          <Col sm={6}>
            <div>
              <ReportTitleSmall>SLO Summary</ReportTitleSmall>
              <VerticleBarChart data={[{
                data: data?.SLO_SUMMARY.date.SLO_SUMMARY.graph.data
              }]} labels={data?.SLO_SUMMARY.date.SLO_SUMMARY.graph.Key} />
            </div>
          </Col>
        ) : null}
        {(data['SIEM Incidents Summary']?.['SIEM Incidents Summary']) ? (
          <Col sm={6}>
            <ReportTitle>SIEM Incidents Summary</ReportTitle>
            <div>
              <GroupHorizontalBarChart data={[
                {
                  name: 'Incidents Closed with Resolution',
                  data: [
                    data['SIEM Incidents Summary']['SIEM Incidents Summary']['P4']['Incidents Closed with Resolution'],
                    data['SIEM Incidents Summary']['SIEM Incidents Summary']['P3']['Incidents Closed with Resolution'],
                    data['SIEM Incidents Summary']['SIEM Incidents Summary']['P2']['Incidents Closed with Resolution'],
                    data['SIEM Incidents Summary']['SIEM Incidents Summary']['P1']['Incidents Closed with Resolution']
                  ]
                },
                {
                  name: 'Incidents Closed without Acknowledgement',
                  data: [
                    data['SIEM Incidents Summary']['SIEM Incidents Summary']['P4']['Incidents Closed without Acknowledgement'],
                    data['SIEM Incidents Summary']['SIEM Incidents Summary']['P3']['Incidents Closed without Acknowledgement'],
                    data['SIEM Incidents Summary']['SIEM Incidents Summary']['P2']['Incidents Closed without Acknowledgement'],
                    data['SIEM Incidents Summary']['SIEM Incidents Summary']['P1']['Incidents Closed without Acknowledgement']
                  ]
                },
                {
                  name: 'Pending Incidents with SOC Team',
                  data: [
                    data['SIEM Incidents Summary']['SIEM Incidents Summary']['P4']['Pending Incidents with SOC Team'],
                    data['SIEM Incidents Summary']['SIEM Incidents Summary']['P3']['Pending Incidents with SOC Team'],
                    data['SIEM Incidents Summary']['SIEM Incidents Summary']['P2']['Pending Incidents with SOC Team'],
                    data['SIEM Incidents Summary']['SIEM Incidents Summary']['P1']['Pending Incidents with SOC Team']
                  ]
                }
              ]} labels={[
                'P4',
                'P3',
                'P2',
                'P1'
              ]} />
            </div>
          </Col>
        ) : null}
        {(data['Risk Matrics']?.['Last Three Month Risk Score']) ? (
          <Col sm={6}>
            <ReportTitle>Risk Matrics</ReportTitle>
            <div>
              <DonutChart
                data={Object.values(data['Risk Matrics']['Last Three Month Risk Score']).map(v => Number(v) || 0)}
                labels={Object.keys(data['Risk Matrics']['Last Three Month Risk Score'])}
              />
            </div>
          </Col>
        ) : null}
        {(data['Key Feature Adoption Rate of C1']?.['Key Feature Adoption Rate of C1']) ? (
          <Col sm={6}>
            <ReportTitle>Key Feature Adoption Rate of C1</ReportTitle>
            <AdaptionRateGraph data={data['Key Feature Adoption Rate of C1']['Key Feature Adoption Rate of C1']} />
          </Col>
        ) : null}
        {(data['Top Risk Device']?.['Top Risk Device']) ? (
          <Col sm={6}>
            <ReportTitle>Top Risk Device</ReportTitle>
            <HorizontalBarChart
              data={[{
                name: 'Risk Score',
                data: data['Top Risk Device']['Top Risk Device'].map(d => d['Risk Score'])
              }]}
              labels={data['Top Risk Device']['Top Risk Device'].map(d => d['Device Name'])}
            />
          </Col>
        ):null}
        {(data['Top Risk Users']?.['Top Risk Users']) ? (
          <Col sm={6}>
            <ReportTitle>Top Risk Users</ReportTitle>
            <HorizontalBarChart
              data={[{
                name: 'Risk Score',
                data: data['Top Risk Users']['Top Risk Users'].map(d => d['Risk Score'])
              }]}
              labels={data['Top Risk Users']['Top Risk Users'].map(d => d['Device Name'])}
            />
          </Col>
        ): null}
        {(data['Endpoint Feature Compliance']?.['Endpoint Feature Compliance']) ? (
          <Col sm={6}>
            <ReportTitle>Endpoint Feature Compliance</ReportTitle>
            <HorizontalBarChart data={[
              {
                data: Object.values(data['Endpoint Feature Compliance']['Endpoint Feature Compliance'])
              }
            ]} labels={Object.keys(data['Endpoint Feature Compliance']['Endpoint Feature Compliance'])} />
          </Col>
        ) : null}
        
        {(data['Component Versions']?.['WorkLoad Protection']) ? (
          <Col sm={6}>
            <ReportTitle>Component Versions</ReportTitle>
            <ReportTitleSmall>WorkLoad Protection</ReportTitleSmall>
            <HorizontalBarChart data={[
              {
                data: Object.values(data['Component Versions']['WorkLoad Protection'])
              }
            ]} labels={Object.keys(data['Component Versions']['WorkLoad Protection'])} />
          </Col>
        ) : null}
        {(data['Component Versions']?.['Standard Endpoint Protection']) ? (
          <Col sm={6}>
            <ReportTitle>Component Versions</ReportTitle>
            <ReportTitleSmall>Standard Endpoint Protection</ReportTitleSmall>
            <HorizontalBarChart data={[
              {
                data: Object.values(data['Component Versions']['Standard Endpoint Protection'])
              }
            ]} labels={Object.keys(data['Component Versions']['Standard Endpoint Protection'])} />
          </Col>
        ) : null}
        
        {(data['V1 Workbench Incidents Summary']?.['V1 Workbench Incidents Summary']) ? (
          <Col sm={6}>
            <ReportTitle>V1 Workbench Incidents Summary</ReportTitle>
            <div>
              <GroupHorizontalBarChart data={[
                {
                  name: 'Incidents Closed with Resolution',
                  data: [
                    data['V1 Workbench Incidents Summary']['V1 Workbench Incidents Summary']['P4']['Incidents Closed with Resolution'],
                    data['V1 Workbench Incidents Summary']['V1 Workbench Incidents Summary']['P3']['Incidents Closed with Resolution'],
                    data['V1 Workbench Incidents Summary']['V1 Workbench Incidents Summary']['P2']['Incidents Closed with Resolution'],
                    data['V1 Workbench Incidents Summary']['V1 Workbench Incidents Summary']['P1']['Incidents Closed with Resolution']
                  ]
                },
                {
                  name: 'Incidents Closed without Acknowledgement',
                  data: [
                    data['V1 Workbench Incidents Summary']['V1 Workbench Incidents Summary']['P4']['Incidents Closed without Acknowledgement'],
                    data['V1 Workbench Incidents Summary']['V1 Workbench Incidents Summary']['P3']['Incidents Closed without Acknowledgement'],
                    data['V1 Workbench Incidents Summary']['V1 Workbench Incidents Summary']['P2']['Incidents Closed without Acknowledgement'],
                    data['V1 Workbench Incidents Summary']['V1 Workbench Incidents Summary']['P1']['Incidents Closed without Acknowledgement']
                  ]
                },
                {
                  name: 'Pending Incidents from Customer',
                  data: [
                    data['V1 Workbench Incidents Summary']['V1 Workbench Incidents Summary']['P4']['Pending Incidents from Customer'],
                    data['V1 Workbench Incidents Summary']['V1 Workbench Incidents Summary']['P3']['Pending Incidents from Customer'],
                    data['V1 Workbench Incidents Summary']['V1 Workbench Incidents Summary']['P2']['Pending Incidents from Customer'],
                    data['V1 Workbench Incidents Summary']['V1 Workbench Incidents Summary']['P1']['Pending Incidents from Customer']
                  ]
                },
                {
                  name: 'Pending Incidents with SOC Team',
                  data: [
                    data['V1 Workbench Incidents Summary']['V1 Workbench Incidents Summary']['P4']['Pending Incidents with SOC Team'],
                    data['V1 Workbench Incidents Summary']['V1 Workbench Incidents Summary']['P3']['Pending Incidents with SOC Team'],
                    data['V1 Workbench Incidents Summary']['V1 Workbench Incidents Summary']['P2']['Pending Incidents with SOC Team'],
                    data['V1 Workbench Incidents Summary']['V1 Workbench Incidents Summary']['P1']['Pending Incidents with SOC Team']
                  ]
                }
              ]} labels={[
                'P4',
                'P3',
                'P2',
                'P1'
              ]} />
            </div>
          </Col>
        ) : null}
        {(data?.Key_feature_adoption_rate_of_Ap) ? (
          <Col sm={6}>
            <ReportTitleSmall>Key Feature Adoption Rate of Apex one as Service / Std Endpoint Protection</ReportTitleSmall>
            <div>
              <GroupHorizontalBarChart
                data={data?.Key_feature_adoption_rate_of_Ap.date.Key_feature_adoption_rate_of_Ap.graph.data.map(d => {
                  return {
                    name: d.label,
                    data: d.data.map(di => Number(di) || 0)
                  }
                })}
                labels={data?.Key_feature_adoption_rate_of_Ap.date.Key_feature_adoption_rate_of_Ap.graph.Key}
              />
            </div>
          </Col>
        ): null}
        {(data?.Key_feature_adoption_rate_of_Cw) ? (
          <Col sm={6}>
            <ReportTitleSmall>Key feature adoption rate of C1WS / server & workload security / protection</ReportTitleSmall>
            <div>
              <GroupHorizontalBarChart
                data={data?.Key_feature_adoption_rate_of_Cw.date.Key_feature_adoption_rate_of_Cw.graph.data.map(d => {
                  return {
                    name: d.label,
                    data: d.data.map(di => Number(di) || 0)
                  }
                })}
                labels={data?.Key_feature_adoption_rate_of_Cw.date.Key_feature_adoption_rate_of_Cw.graph.Key}
              />
            </div>
          </Col>
        ): null}
        {(data['Top Vulnerability Detected']?.['Top Vulnerabilities Detected']) ? (
          <Col sm={6}>
            <ReportTitle>Top Vulnerability Detected</ReportTitle>
            <div>
              <HorizontalBarChart data={[
                {
                  name: 'CVE impact score',
                  data: data['Top Vulnerability Detected']['Top Vulnerabilities Detected'].map(d => d['CVE impact score'])
                }
              ]} labels={data['Top Vulnerability Detected']['Top Vulnerabilities Detected'].map(d => d['CVE'])} />
            </div>
          </Col>
        ) : null}
      </Row>
    </Container>
  )
}