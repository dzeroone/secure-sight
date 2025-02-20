import { Col, Row } from "reactstrap";
import ObjectProperties from "./ObjectProperties";
import AgentVisionSummaryGraph from "./report-graphs/AgentVisionSummaryGraph";
import HorizontalBarChart from "./report-graphs/HorizontalBarChart";
import GroupHorizontalBarChart from "./report-graphs/GroupHorizontalBarChart";
import DonutChart from "./report-graphs/DonutChart";
import AdaptionRateGraph from "./report-graphs/AdaptionRateGraph";
import ReportTitle from "./ReportTitle";
import ReportTitleSmall from "./ReportTitleSmall";
import _ from "lodash";

export default function MonthlyReportGraphs({ data }) {
  return (
    <div className="d-flex flex-column gap-4">
      { (data['Email Summary']?.['Email_Status']?.['Email Status']) ? (
        <div>
          <ReportTitle>Email Summary</ReportTitle>
          <Row className="flex-nowrap">
            <Col>
              <ReportTitleSmall>Email status</ReportTitleSmall>
              <HorizontalBarChart data={[
                {
                  data: Object.values(data['Email Summary']['Email_Status']['Email Status'])
                }
              ]} labels={Object.keys(data['Email Summary']['Email_Status']['Email Status'])} />
            </Col>
          </Row>
          {(data['Email Summary']?.['Threat Type']) ? (
          <div>
            <ReportTitleSmall>Threat Type</ReportTitleSmall>
            <HorizontalBarChart data={[
              {
                data: Object.values(data['Email Summary']['Threat Type'])
              }
            ]} labels={Object.keys(data['Email Summary']['Threat Type'])} />
          </div>
          ) : null }
        </div>
      ) : null}
      {(data['Overall Incidents Summary']) ? (
        <div>
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
        </div>
      ) : null}
      {(data['Detection Summary from A1']?.['Detection Summary form Apex One']) ? (
        <div>
          <ReportTitle>Detection summary from A1</ReportTitle>
          <Row className="flex-nowrap">
            <Col>
              <ReportTitleSmall>Virus/Malware & Spyware/Grayware</ReportTitleSmall>
              <HorizontalBarChart data={[
                {
                  data: Object.entries(data['Detection Summary from A1']['Detection Summary form Apex One']['Virus/Malware & Spyware/Grayware']).filter(([key]) => ['chart_type', 'label', 'background_color'].includes(key) == false).map(([_, v]) => v)
                }
              ]} labels={Object.keys(data['Detection Summary from A1']['Detection Summary form Apex One']['Virus/Malware & Spyware/Grayware']).filter((key) => ['chart_type', 'label', 'background_color'].includes(key) == false)} />
            </Col>
            <Col>
              <ReportTitleSmall>C & C Connections & Intrusion attempts Blocked</ReportTitleSmall>
              <HorizontalBarChart data={[
                {
                  data: Object.entries(data['Detection Summary from A1']['Detection Summary form Apex One']['C & C Connections & Intrusion attempts Blocked']).filter(([key]) => ['chart_type', 'label', 'background_color'].includes(key) == false).map(([_, v]) => v)
                }
              ]} labels={Object.keys(data['Detection Summary from A1']['Detection Summary form Apex One']['C & C Connections & Intrusion attempts Blocked']).filter((key) => ['chart_type', 'label', 'background_color'].includes(key) == false)} />
            </Col>
          </Row>
        </div>
      ) : null}
      {(data['Detailed Summary']?.['Risk Index']) ? (
        <div>
          <ReportTitle>Detailed Summary</ReportTitle>
          <Row className="flex-nowrap">
            <Col>
              <DonutChart
                data={[data['Detailed Summary']['Risk Index']['Score'], 100 - data['Detailed Summary']['Risk Index']['Score']]}
                labels={['Risk Index', 'rest']}
                colors={['rgb(67,71,216)', 'rgb(195,195,198)']}
              />
            </Col>
          </Row>
        </div>
      ) : null}
      {(data['Agent Version Summary']?.['All Agents Version Summary'] || data['SLO Summary']?.['SLO Summary']) ? (
        <Row className="flex-nowrap">
          {(data['Agent Version Summary']?.['All Agents Version Summary']) ? (
            <Col>
              <div>
                <ReportTitle>Agent Version Summary</ReportTitle>
                <AgentVisionSummaryGraph data={data['Agent Version Summary']['All Agents Version Summary']} />
              </div>
            </Col>
          ) : null}
          {(data['SLO Summary']?.['SLO Summary']) ? (
            <Col>
              <div>
                <ReportTitle>SLO Summary</ReportTitle>
                <HorizontalBarChart data={[{
                  data: [
                    data['SLO Summary']['SLO Summary']['Total No of Incidents Closed'],
                    data['SLO Summary']['SLO Summary']['SLO Met'],
                    data['SLO Summary']['SLO Summary']['Total No of Incidents Closed'],
                  ]
                }]} labels={[
                  'Total No of Incidents Closed',
                  'SLO Met',
                  'SLO Not Met'
                ]} />
              </div>
            </Col>
          ) : null}
        </Row>
      ) : null}
      {(data['SIEM Incidents Summary']?.['SIEM Incidents Summary']) ? (
        <div>
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
        </div>
      ) : null}
      {(data['Risk Matrics']?.['Last Three Month Risk Score']) ? (
        <Row className="flex-nowrap">
          {/* <Col>
            <ReportTitle>Pending Incidents Summary</ReportTitle>
          </Col> */}
          <Col>
            <ReportTitle>Risk Matrics</ReportTitle>
            <div>
              <DonutChart
                data={Object.values(data['Risk Matrics']['Last Three Month Risk Score']).map(v => Number(v) || 0)}
                labels={Object.keys(data['Risk Matrics']['Last Three Month Risk Score'])}
              />
            </div>
          </Col>
        </Row>
      ) : null}
      {(data['Key Feature Adoption Rate of C1']?.['Key Feature Adoption Rate of C1']) ? (
        <div>
          <ReportTitle>Key Feature Adoption Rate of C1</ReportTitle>
          <AdaptionRateGraph data={data['Key Feature Adoption Rate of C1']['Key Feature Adoption Rate of C1']} />
        </div>
      ) : null}
      {(data['Top Risk Device']?.['Top Risk Device'] || data['Top Risk Users']?.['Top Risk Users']) ? (
      <Row className="flex-nowrap">
        {(data['Top Risk Device']?.['Top Risk Device']) ? (
          <Col>
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
          <Col>
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
      </Row>
      ) : null}
      {(data['Endpoint Feature Compliance']?.['Endpoint Feature Compliance']) ? (
        <Row className="flex-nowrap">
          <Col>
            <ReportTitle>Endpoint Feature Compliance</ReportTitle>
            <HorizontalBarChart data={[
              {
                data: Object.values(data['Endpoint Feature Compliance']['Endpoint Feature Compliance'])
              }
            ]} labels={Object.keys(data['Endpoint Feature Compliance']['Endpoint Feature Compliance'])} />
          </Col>
        </Row>
      ) : null}
      {(data['Component Versions']?.['WorkLoad Protection'] || data['Component Versions']?.['Standard Endpoint Protection']) ? (
        <div>
          <ReportTitle>Component Versions</ReportTitle>
          <Row className="flex-nowrap">
            {(data['Component Versions']?.['WorkLoad Protection']) ? (
            <Col>
              <ReportTitleSmall>WorkLoad Protection</ReportTitleSmall>
              <HorizontalBarChart data={[
                {
                  data: Object.values(data['Component Versions']['WorkLoad Protection'])
                }
              ]} labels={Object.keys(data['Component Versions']['WorkLoad Protection'])} />
            </Col>
            ) : null}
            {(data['Component Versions']?.['Standard Endpoint Protection']) ? (
              <Col>
                <ReportTitleSmall>Standard Endpoint Protection</ReportTitleSmall>
                <HorizontalBarChart data={[
                  {
                    data: Object.values(data['Component Versions']['Standard Endpoint Protection'])
                  }
                ]} labels={Object.keys(data['Component Versions']['Standard Endpoint Protection'])} />
              </Col>
            ) : null}
          </Row>
        </div>
      ) : null}
      {(data['V1 Workbench Incidents Summary']?.['V1 Workbench Incidents Summary'] || data['Key Feature Adoption Rate of A1']?.['Key Feature Adoption Rate of A1']) ? (
        <Row className="flex-nowrap">
          {(data['V1 Workbench Incidents Summary']?.['V1 Workbench Incidents Summary']) ? (
            <Col>
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
          {(data['Key Feature Adoption Rate of A1']?.['Key Feature Adoption Rate of A1']) ? (
          <Col>
            <ReportTitle>Key Feature Adoption Rate of A1</ReportTitle>
            <div>
              <AdaptionRateGraph data={data['Key Feature Adoption Rate of A1']['Key Feature Adoption Rate of A1']} />
            </div>
          </Col>
          ): null}
        </Row>
      ) : null}
      {(data['Top Vulnerability Detected']?.['Top Vulnerabilities Detected']) ? (
        <div>
          <ReportTitle>Top Vulnerability Detected</ReportTitle>
          <div>
            <HorizontalBarChart data={[
              {
                name: 'CVE impact score',
                data: data['Top Vulnerability Detected']['Top Vulnerabilities Detected'].map(d => d['CVE impact score'])
              }
            ]} labels={data['Top Vulnerability Detected']['Top Vulnerabilities Detected'].map(d => d['CVE'])} />
          </div>
        </div>
      ) : null}
    </div>
  )
}