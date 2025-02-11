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
          <Col>
            <ReportTitleSmall>Top 03 Sender and Receipts</ReportTitleSmall>
            <div>Top 3 Senders -</div>
            {data['Email Summary']['Top 03 Sender and Receipts']['Top 3 Senders'].length ? (
              data['Email Summary']['Top 03 Sender and Receipts']['Top 3 Senders'].map((s, i) => {
                return <div key={i}>{s}</div>
              })
            ) : '-'}
            <div>Top 3 Receipts -</div>
            {data['Email Summary']['Top 03 Sender and Receipts']['Top 3 Receipts'].length ? (
              data['Email Summary']['Top 03 Sender and Receipts']['Top 3 Receipts'].map((s, i) => {
                return <div key={i}>{s}</div>
              })
            ) : '-'}
          </Col>
        </Row>
        <div>
          <ReportTitleSmall>Threat Type</ReportTitleSmall>
          <HorizontalBarChart data={[
            {
              data: Object.values(data['Email Summary']['Threat Type'])
            }
          ]} labels={Object.keys(data['Email Summary']['Threat Type'])} />
        </div>
      </div>
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
        <div>
          <ReportTitleSmall>Top 03 Endpoints</ReportTitleSmall>
          <Row className="flex-nowrap">
            <Col>
              <div>
                <div>File Cleaned/Spyware</div>
                {data['Detection Summary from A1']['Top 03 Endpoints']['File Cleaned/Spyware'].map((d, i) => {
                  return <div key={i}>{d}</div>
                })}
              </div>
            </Col>
            <Col>
              <div>
                <div>File Cleaned/Malware</div>
                {data['Detection Summary from A1']['Top 03 Endpoints']['File Cleaned/Malware'].map((d, i) => {
                  return <div key={i}>{d}</div>
                })}
              </div>
            </Col>
            <Col>
              <div>
                <div>File Qurantined(Malware)</div>
                {data['Detection Summary from A1']['Top 03 Endpoints']['File Qurantined(Malware)'].map((d, i) => {
                  return <div key={i}>{d}</div>
                })}
              </div>
            </Col>
            <Col>
              <div>
                <div>File Deleted</div>
                {data['Detection Summary from A1']['Top 03 Endpoints']['File Deleted'].map((d, i) => {
                  return <div key={i}>{d}</div>
                })}
              </div>
            </Col>
            <Col>
              <div>
                <div>C & C Connection Blocked</div>
                {data['Detection Summary from A1']['Top 03 Endpoints']['C & C Connection Blocked'].map((d, i) => {
                  return <div key={i}>{d}</div>
                })}
              </div>
            </Col>
            <Col>
              <div>
                <div>Intrusion Attempts Blocked</div>
                {data['Detection Summary from A1']['Top 03 Endpoints']['Intrusion Attempts Blocked'].map((d, i) => {
                  return <div key={i}>{d}</div>
                })}
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div>
        <ReportTitle>Detailed Summary</ReportTitle>
        <div>
          <div>Total incidents: {data['Detailed Summary']['Total No of Incidents']['Total Incidents']}</div>
          <div>Month/Year: {data['Detailed Summary']['Total No of Incidents']['Month & Year']}</div>
        </div>
        <Row className="flex-nowrap">
          <Col>
            <div style={{ maxWidth: 650 }}>
              <DonutChart data={[data['Detailed Summary']['Risk Index']['Score']]} labels={['Risk Index']} />
              <div>{data['Detailed Summary']['Risk Index']['Description']}</div>
            </div>
          </Col>
          <Col>
            <div>No of Highly Exploitable Unique CVEs: {data['Detailed Summary']['No of Highly Exploitable Unique CVEs']}</div>
            <div className="mb-2">No of Incidents Closed without acknowledgement: {data['Detailed Summary']['No of Incidents Closed without acknowledgement']}</div>
            Top incidents: -
            <div>
              {data['Detailed Summary']['Top incidents'].map((incidents, i) => {
                return (
                  <div className="mb-2" key={i}>
                    {Object.entries(incidents).map(([key, v]) => {
                      return <div key={key}>{key}: {v}</div>
                    })}
                  </div>
                )
              })}
            </div>
          </Col>
        </Row>
      </div>
      <div>
        <ReportTitle>Executive Summary</ReportTitle>
        <Row className="flex-nowrap">
          {Object.entries(data['Executive Summary']).map(([group, vArr]) => {
            return (
              <Col key={group}>
                <ReportTitleSmall>{group}</ReportTitleSmall>
                {vArr.map((v, i) => {
                  return <ObjectProperties data={v} key={i} />
                })}
              </Col>
            )
          })}
        </Row>
      </div>
      <div>
        <ReportTitle>Vulnerability Assessment Report</ReportTitle>
        <Row className="flex-nowrap">
          {Object.entries(data['Vulnerability Assessment Report']).map(([group, v]) => {
            return (
              <Col key={group}>
                <ReportTitleSmall>{group}</ReportTitleSmall>
                <ObjectProperties data={v} />
              </Col>
            )
          })}
        </Row>
      </div>
      <div>
        <ReportTitle>Critical High Incidents Summary</ReportTitle>
        <Row className="flex-nowrap">
          {Object.entries(data['Critical High Incidents Summary']['Critical/High Incidents Summary']).map(([group, v]) => {
            return (
              <Col key={group}>
                <ReportTitleSmall>{group}</ReportTitleSmall>
                <ObjectProperties data={v} />
              </Col>
            )
          })}
        </Row>
      </div>
      <div>
        <ReportTitle>System Configuration Report</ReportTitle>
        <ObjectProperties data={data['System Configuration Report']['System Configuration Report']} />
      </div>
      <Row className="flex-nowrap">
        <Col>
          <div>
            <ReportTitle>Agent Version Summary</ReportTitle>
            <AgentVisionSummaryGraph data={data['Agent Version Summary']['All Agents Version Summary']} />
          </div>
        </Col>
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
      </Row>
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
      <Row className="flex-nowrap">
        <Col>
          <ReportTitle>Pending Incidents Summary</ReportTitle>
        </Col>
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
      <div>
        <ReportTitle>Key Feature Adoption Rate of C1</ReportTitle>
        <AdaptionRateGraph data={data['Key Feature Adoption Rate of C1']['Key Feature Adoption Rate of C1']} />
      </div>
      <Row className="flex-nowrap">
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
      </Row>
      <div>
        <ReportTitle>Product Assessment Report</ReportTitle>
        <Row className="flex-nowrap">
          <Col>
            <ReportTitleSmall>TM Products Summary</ReportTitleSmall>
            {data['Product Assessment Report']['TM Products Summary'].map(summary => {
              return (
                <div key={summary['TM Product']}>{summary['TM Product']}: {summary['Connection Status']}</div>
              )
            })}
          </Col>
          <Col>
            <ReportTitleSmall>Third Party Products Summary</ReportTitleSmall>
          </Col>
        </Row>
      </div>
      <Row className="flex-nowrap">
        <Col>
          <ReportTitle>Account Compromise Events</ReportTitle>
        </Col>
        <Col>
          <ReportTitle>Endpoint Feature Compliance</ReportTitle>
          <HorizontalBarChart data={[
            {
              data: Object.values(data['Endpoint Feature Compliance']['Endpoint Feature Compliance'])
            }
          ]} labels={Object.keys(data['Endpoint Feature Compliance']['Endpoint Feature Compliance'])} />
        </Col>
      </Row>
      <div>
        <ReportTitle>Component Versions</ReportTitle>
        <Row className="flex-nowrap">
          <Col>
            <ReportTitleSmall>WorkLoad Protection</ReportTitleSmall>
            <HorizontalBarChart data={[
              {
                data: Object.values(data['Component Versions']['WorkLoad Protection'])
              }
            ]} labels={Object.keys(data['Component Versions']['WorkLoad Protection'])} />
          </Col>
          <Col>
            <ReportTitleSmall>Standard Endpoint Protection</ReportTitleSmall>
            <HorizontalBarChart data={[
              {
                data: Object.values(data['Component Versions']['Standard Endpoint Protection'])
              }
            ]} labels={Object.keys(data['Component Versions']['Standard Endpoint Protection'])} />
          </Col>
        </Row>
      </div>
      <Row className="flex-nowrap">
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
        <Col>
          <ReportTitle>Key Feature Adoption Rate of A1</ReportTitle>
          <div>
            <AdaptionRateGraph data={data['Key Feature Adoption Rate of A1']['Key Feature Adoption Rate of A1']} />
          </div>
        </Col>
      </Row>
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
    </div>
  )
}