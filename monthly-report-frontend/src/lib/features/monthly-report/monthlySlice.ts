import { monthlyReportInitialValue } from "@@/data/monthly-report";
import { updateNestedField } from "@@/helper/helper";
import { ACERiskEvent, AVSChartData, AboutChart, AgentVersionsSummary, DeepSecurity, EmailThreatType, FirstPageType, IntegrationSummary, POSItem, POSItemWithIndex, SLOTableType, SystemConfigurationReportType, TMProductSummary, TOCItem, TableOfContentsType, VulnerabilityAssessmentReportType } from "@@/types/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import _set from 'lodash/set';
import _get from 'lodash/get';

export const monthlyReportSlice = createSlice({
    name: "monthlyReport",
    initialState: monthlyReportInitialValue,
    reducers: {
        resetMonthlyReportState(_, action: PayloadAction<typeof monthlyReportInitialValue | null>) {
            const defaultValues = JSON.parse(JSON.stringify(monthlyReportInitialValue))
            return {
                ...defaultValues,
                ...action.payload
            }
        },
        updateFromElasticData(state, action: PayloadAction<any>) {
            const data = action.payload;
            const reducers = monthlyReportSlice.caseReducers;

            // Executive Summary
            {
                if (data['Executive Summary']?.['Incident Overview by SOC Team']) {
                    let values = data['Executive Summary']?.['Incident Overview by SOC Team']
                    for (let i = 0, l = values.length; i < l; i++) {
                        reducers.updateESSubField(state, {
                            type: '',
                            payload: {
                                index: 0,
                                subIndex: i,
                                field: "title",
                                value: values[i]?.['Name of Incident']
                            }
                        })
                        reducers.updateESSubField(state, {
                            type: '',
                            payload: {
                                index: 0,
                                subIndex: i,
                                field: "desc",
                                value: values[i]?.['Description']
                            }
                        })
                    }
                }
                if (data['Executive Summary']?.['Action Performed by SOC Team']) {
                    let values = data['Executive Summary']?.['Action Performed by SOC Team']
                    for (let i = 0, l = values.length; i < l; i++) {
                        reducers.updateESSubField(state, {
                            type: '',
                            payload: {
                                index: 1,
                                subIndex: i,
                                field: "title",
                                value: values[i]?.['Name of Incident']
                            }
                        })
                        reducers.updateESSubField(state, {
                            type: '',
                            payload: {
                                index: 1,
                                subIndex: i,
                                field: "desc",
                                value: values[i]?.['Action Performed']
                            }
                        })
                    }
                }
                if (data['Executive Summary']?.['Recommendations by SOC Team']) {
                    let values = data['Executive Summary']?.['Recommendations by SOC Team']
                    for (let i = 0, l = values.length; i < l; i++) {
                        reducers.updateESSubField(state, {
                            type: '',
                            payload: {
                                index: 2,
                                subIndex: i,
                                field: "title",
                                value: values[i]?.['Name of Incident']
                            }
                        })
                        reducers.updateESSubField(state, {
                            type: '',
                            payload: {
                                index: 2,
                                subIndex: i,
                                field: "desc",
                                value: values[i]?.['Recommendations']
                            }
                        })
                    }
                }
            }

            // detailed summary
            if (data['Detailed Summary']?.['Total No of Incidents']?.['Total Incidents'])
                reducers.updateDSField(state, {
                    type: '',
                    payload: {
                        field: 'no_of_incidents',
                        value: data['Detailed Summary']['Total No of Incidents']['Total Incidents']
                    }
                })

            if (data['Detailed Summary']?.['Total No of Incidents']?.['Month & Year'])
                reducers.updateDSField(state, {
                    type: '',
                    payload: {
                        field: 'date',
                        value: data['Detailed Summary']['Total No of Incidents']['Month & Year']
                    }
                })

            if (data['Detailed Summary']?.['No of Highly Exploitable Unique CVEs'])
                reducers.updateDSField(state, {
                    type: '',
                    payload: {
                        field: 'highly_exploitable',
                        value: data['Detailed Summary']['No of Highly Exploitable Unique CVEs']
                    }
                })

            if (data['Detailed Summary']?.['No of Incidents Closed without acknowledgement'])
                reducers.updateDSField(state, {
                    type: '',
                    payload: {
                        field: 'incidents_closed',
                        value: data['Detailed Summary']['No of Incidents Closed without acknowledgement']
                    }
                })
            if (data['Detailed Summary']?.['Risk Index']?.['Score'])
                reducers.updateDSChartData(state, {
                    type: '',
                    payload: {
                        index: 0,
                        value: data['Detailed Summary']['Risk Index']['Score']
                    }
                });

            if (data['Detailed Summary']?.['Top incidents']) {
                const incidents = data['Detailed Summary']['Top incidents']
                for (let i = state.detailed_summary.top_incidents.length; i < incidents.length - 1; i++) {
                    reducers.addDSTopIncident(state);
                }
                for (let i = 0; i < incidents.length - 1; i++) {
                    reducers.updateDSTopIncidentField(state, {
                        type: '',
                        payload: {
                            index: i,
                            field: 'incident_name',
                            value: incidents[i]['Incident Names with no of Occurrence']
                        }
                    });
                    reducers.updateDSTopIncidentField(state, {
                        type: '',
                        payload: {
                            index: i,
                            field: 'priority_impact',
                            value: incidents[i]['Priority - Impact']
                        }
                    });
                    reducers.updateDSTopIncidentField(state, {
                        type: '',
                        payload: {
                            index: i,
                            field: 'data_source',
                            value: incidents[i]['Data Source']
                        }
                    });
                }
            }
            // -
            // Risk matrix
            if (data['Risk Matrics']?.['Last Three Month Risk Score']) {
                Object.entries(data['Risk Matrics']['Last Three Month Risk Score']).forEach(([month, score], index) => {
                    reducers.updateLastRiskScoreChart(state, {
                        type: '',
                        payload: {
                            index,
                            field: 'month',
                            value: month
                        }
                    })
                    reducers.updateLastRiskScoreChart(state, {
                        type: '',
                        payload: {
                            index,
                            field: 'data',
                            value: [Number(score) || 0]
                        }
                    })
                })
            }

            // Threat intel summary
            {
                if (data['THREAT_INTEL_SUMMARY']?.['IOC Match Details'] && Array.isArray(data['THREAT_INTEL_SUMMARY']?.['IOC Match Details'])) {
                    const iocMatchDetails = data['THREAT_INTEL_SUMMARY']['IOC Match Details']
                    for (let i = state.threat_intel_summary.ioc_match_details.data.length, l = iocMatchDetails.length; i < l; i++) {
                        reducers.addTISIOCMatchDetail(state)
                    }
                    iocMatchDetails.forEach((matchedData, i) => {
                        reducers.updateTISIOCMatchDetail(state, {
                            type: '',
                            payload: {
                                field: 'advisory_name',
                                index: i,
                                value: matchedData['Advisory Name']
                            }
                        })
                        reducers.updateTISIOCMatchDetail(state, {
                            type: '',
                            payload: {
                                field: 'ioc_type',
                                index: i,
                                value: matchedData['Matched IOC type']
                            }
                        })
                        reducers.updateTISIOCMatchDetail(state, {
                            type: '',
                            payload: {
                                field: 'detail',
                                index: i,
                                value: matchedData['Matched IOC Details']
                            }
                        })
                        reducers.updateTISIOCMatchDetail(state, {
                            type: '',
                            payload: {
                                field: 'endpoint_name',
                                index: i,
                                value: matchedData['Endpoint Name/Email']
                            }
                        })
                    })
                }
            }

            // -
            // Overall Incidents Summary
            if (data['Overall Incidents Summary']?.['Status Summary']) {
                Object.entries(data['Overall Incidents Summary']['Status Summary']).forEach(([incident, score]) => {
                    const index = state.overall_incident_summary.incidents_chart.key.indexOf(incident)
                    const newDatasets = [...state.overall_incident_summary.incidents_chart.datasets];
                    newDatasets[0] = {
                        ...newDatasets[0],
                        data: newDatasets[0].data.map((d, i) => (i === index ? score as number : d)),
                    };
                    reducers.updateOISChart(state, {
                        type: '',
                        payload: newDatasets
                    });
                })
            }

            if (data['Overall Incidents Summary']?.['Overall Incidents Summary']) {
                Object.entries(data['Overall Incidents Summary']['Overall Incidents Summary']).forEach(([priority, pData]) => {
                    priority = priority.toLowerCase()
                    const priorityData: any = pData
                    reducers.updateOISField(state, {
                        type: '',
                        payload: { path: `${priority}.closed_with_resolution`, value: priorityData['Incidents Closed with Resolution'] }
                    })
                    reducers.updateOISField(state, {
                        type: '',
                        payload: { path: `${priority}.closed_without_resolution`, value: priorityData['Incidents Closed without Acknowledgement'] }
                    })
                    reducers.updateOISField(state, {
                        type: '',
                        payload: { path: `${priority}.pending_with_customer.pending_incidents`, value: priorityData['Pending Incidents'] || 0 }
                    })
                    reducers.updateOISField(state, {
                        type: '',
                        payload: { path: `${priority}.pending_with_soc_team`, value: priorityData['Pending Incidents with SOC Team'] || 0 }
                    })
                    reducers.updateOISField(state, {
                        type: '',
                        payload: { path: `${priority}.total_incidents`, value: priorityData['Total Incidents'] }
                    })
                })
            }
            // -
            // Vision One Workbench Incidents Summary
            if (data['V1 Workbench Incidents Summary']?.['V1 Workbench Incidents Summary'])
                Object.entries(data['V1 Workbench Incidents Summary']['V1 Workbench Incidents Summary']).forEach(([priority, pData]) => {
                    priority = priority.toLowerCase()
                    const priorityData: any = pData
                    reducers.updateWISField(state, {
                        type: '',
                        payload: { path: `${priority}.closed_with_resolution`, value: priorityData['Incidents Closed with Resolution'] }
                    })
                    reducers.updateWISField(state, {
                        type: '',
                        payload: { path: `${priority}.closed_without_resolution`, value: priorityData['Incidents Closed without Acknowledgement'] }
                    })
                    reducers.updateWISField(state, {
                        type: '',
                        payload: { path: `${priority}.pending_with_customer.pending_incidents`, value: priorityData['Pending Incidents'] || 0 }
                    })
                    reducers.updateWISField(state, {
                        type: '',
                        payload: { path: `${priority}.pending_with_soc_team`, value: priorityData['Pending Incidents with SOC Team'] || 0 }
                    })

                    reducers.updateWISField(state, {
                        type: '',
                        payload: { path: `${priority}.total_incidents`, value: priorityData['Total Incidents'] || 0 }
                    })
                })
            // -
            // Third Party / SIEM Incidents Summary
            if (data['SIEM Incidents Summary']?.['SIEM Incidents Summary'])
                Object.entries(data['SIEM Incidents Summary']['SIEM Incidents Summary']).forEach(([priority, pData]) => {
                    priority = priority.toLowerCase()
                    const priorityData: any = pData
                    reducers.updateSIEMField(state, {
                        type: '',
                        payload: { path: `${priority}.closed_with_resolution`, value: priorityData['Incidents Closed with Resolution'] }
                    })
                    reducers.updateSIEMField(state, {
                        type: '',
                        payload: { path: `${priority}.closed_without_resolution`, value: priorityData['Incidents Closed without Acknowledgement'] }
                    })
                    reducers.updateSIEMField(state, {
                        type: '',
                        payload: { path: `${priority}.pending_with_customer.pending_incidents`, value: priorityData['Pending Incidents'] || 0 }
                    })
                    reducers.updateSIEMField(state, {
                        type: '',
                        payload: { path: `${priority}.pending_with_soc_team`, value: priorityData['Pending Incidents with SOC Team'] || 0 }
                    })
                    reducers.updateSIEMField(state, {
                        type: '',
                        payload: { path: `${priority}.total_incidents`, value: priorityData['Total Incidents'] || 0 }
                    })
                })
            // -
            // High Incidents Summary
            if (data['Critical High Incidents Summary']?.['Critical/High Incidents Summary']) {
                let values = data['Critical High Incidents Summary']?.['Critical/High Incidents Summary']
                if (values.length > state.high_incident_summary.data.length) {
                    for (let i = state.high_incident_summary.data.length; i < values.length; i++) {
                        reducers.addHISIncident(state)
                    }
                }
                values.forEach((hIncident: any, index: number) => {
                    reducers.updateHISIncident(state, {
                        type: '',
                        payload: {
                            index,
                            field: 'priority',
                            value: hIncident['Impact-Priority'] || ""
                        }
                    })
                    reducers.updateHISIncident(state, {
                        type: '',
                        payload: {
                            index,
                            field: 'incident_title',
                            value: hIncident['Incident Title'] || ""
                        }
                    })
                    reducers.updateHISIncident(state, {
                        type: '',
                        payload: {
                            index,
                            field: 'findings.action_performed',
                            value: hIncident['Findings and Actions Performed'] || ""
                        }
                    })
                })
            }

            // -
            // Pending Incidents Summary
            if (data['Pending Incidents Summary']?.['Pending Incidents Summary']) {
                let values = data['Pending Incidents Summary']?.['Pending Incidents Summary']
                if (values.length > state.pending_incident_summary.data.length) {
                    reducers.pendingIncidentsSummary(state, {
                        type: "",
                        payload: {
                            incident_name: "",
                            priority: "",
                            no_of_occurrence: "",
                            severity: "",
                        }
                    })
                }
                values.forEach((incident: any, index: number) => {
                    reducers.updatePendingIncidentsSummary(state, {
                        type: '',
                        payload: {
                            index: index,
                            data: {
                                incident_name: incident["Incident Name"] || "",
                                priority: incident["Priority"] || "",
                                severity: incident["Impact"] || "",
                                no_of_occurrence: incident['No of Occurance'] || 0
                            },
                        }
                    })
                })
            }
            // -

            // SLO Summary
            if (data['SLO Summary']?.['SLO Summary']) {
                const indexMapping = new Map([
                    ["Total No of Incidents Closed", "Total Closed Incidents"],
                    ["SLO Met", "SLO Met"],
                    ["SLO Not Met", "SLO not Met"],
                ])
                Object.entries(data['SLO Summary']['SLO Summary']).forEach(([key, score]) => {
                    const sIndex = indexMapping.get(key)
                    if (!sIndex) return
                    const index = state.slo_summary.slo_chart.key.indexOf(sIndex)
                    reducers.updateSLOChartData(state, {
                        type: '',
                        payload: {
                            index,
                            value: Number(score) || 0
                        }
                    })
                })
            }
            // -

            // Detection Summary from Apex One
            // For Top Endpoints Actions, data format is not understood
            {
                const virusData = data['Detection Summary from A1']?.['Detection Summary form Apex One']?.['Virus/Malware & Spyware/Grayware']
                if (virusData) {
                    reducers.updateDSAOChart(state, {
                        type: '',
                        payload: {
                            chart: 'detection_chart',
                            index: 0,
                            value: virusData['File Cleaned (Virus/Malware + Spyware/Grayware)']
                        }
                    })
                    reducers.updateDSAOChart(state, {
                        type: '',
                        payload: {
                            chart: 'detection_chart',
                            index: 1,
                            value: virusData['File Quarantine (Virus / Malware)']
                        }
                    })
                    reducers.updateDSAOChart(state, {
                        type: '',
                        payload: {
                            chart: 'detection_chart',
                            index: 2,
                            value: virusData['Restart Action Required (Virus / Malware)']
                        }
                    })
                    reducers.updateDSAOChart(state, {
                        type: '',
                        payload: {
                            chart: 'detection_chart',
                            index: 3,
                            value: virusData['File Deleted (Virus / Malware)']
                        }
                    })
                }

                const blockedData = data['Detection Summary from A1']?.['Detection Summary form Apex One']?.['C & C Connections & Intrusion attempts Blocked']
                if (blockedData) {
                    reducers.updateDSAOChart(state, {
                        type: '',
                        payload: {
                            chart: 'attempts_blocked_chart',
                            index: 0,
                            value: blockedData['Total C & C Connections Blocked']
                        }
                    })
                    reducers.updateDSAOChart(state, {
                        type: '',
                        payload: {
                            chart: 'attempts_blocked_chart',
                            index: 1,
                            value: blockedData['Total Intrusion Attempts Blocked']
                        }
                    })
                }

                const top3 = data['Detection Summary from A1']?.['Top 03 Endpoints']
                if (top3) {
                    const fcsEntries = Object.entries(top3['File Cleaned/Spyware Object'])
                    const fqmEntries = Object.entries(top3['File Qurantined(Malware) Object'])
                    const fdEntries = Object.entries(top3['File Deleted Object'])

                    for (let i = state.detection_summary_apex_one.tables.table1.length; i < fcsEntries.length; i++) {
                        reducers.addDSAOTableEntry(state, {
                            type: '',
                            payload: 'table1'
                        })
                    }

                    const cccbEntries = Object.entries(top3['C & C Connection Blocked Object'])
                    const iabEntries = Object.entries(top3['Intrusion Attempts Blocked Object'])
                    for (let i = state.detection_summary_apex_one.tables.table2.length; i < cccbEntries.length; i++) {
                        reducers.addDSAOTableEntry(state, {
                            type: '',
                            payload: 'table2'
                        })
                    }
                    for (let i = 0; i < fcsEntries.length; i++) {
                        reducers.updateDSAOTableEntry(state, {
                            type: '',
                            payload: {
                                table: 'table1',
                                index: i,
                                fieldPath: 'file_cleaned',
                                value: fcsEntries[i]?.[0]
                            }
                        })
                        reducers.updateDSAOTableEntry(state, {
                            type: '',
                            payload: {
                                table: 'table1',
                                index: i,
                                fieldPath: 'fc_v',
                                value: fcsEntries[i]?.[1]
                            }
                        })
                        reducers.updateDSAOTableEntry(state, {
                            type: '',
                            payload: {
                                table: 'table1',
                                index: i,
                                fieldPath: 'file_quarantined',
                                value: fqmEntries[i]?.[0]
                            }
                        })
                        reducers.updateDSAOTableEntry(state, {
                            type: '',
                            payload: {
                                table: 'table1',
                                index: i,
                                fieldPath: 'fq_v',
                                value: fqmEntries[i]?.[1]
                            }
                        })
                        reducers.updateDSAOTableEntry(state, {
                            type: '',
                            payload: {
                                table: 'table1',
                                index: i,
                                fieldPath: 'file_deleted',
                                value: fdEntries[i]?.[0]
                            }
                        })
                        reducers.updateDSAOTableEntry(state, {
                            type: '',
                            payload: {
                                table: 'table1',
                                index: i,
                                fieldPath: 'fd_v',
                                value: fdEntries[i]?.[1]
                            }
                        })
                    }
                    for (let i = 0; i < cccbEntries.length; i++) {
                        reducers.updateDSAOTableEntry(state, {
                            type: '',
                            payload: {
                                table: 'table2',
                                index: i,
                                fieldPath: 'connection_endpoint.endpoint',
                                value: cccbEntries[i]?.[0]
                            }
                        })
                        reducers.updateDSAOTableEntry(state, {
                            type: '',
                            payload: {
                                table: 'table2',
                                index: i,
                                fieldPath: 'connection_endpoint.blocked',
                                value: cccbEntries[i]?.[1]
                            }
                        })
                        reducers.updateDSAOTableEntry(state, {
                            type: '',
                            payload: {
                                table: 'table2',
                                index: i,
                                fieldPath: 'attempts_blocked.endpoint',
                                value: iabEntries[i]?.[0]
                            }
                        })
                        reducers.updateDSAOTableEntry(state, {
                            type: '',
                            payload: {
                                table: 'table2',
                                index: i,
                                fieldPath: 'attempts_blocked.blocked',
                                value: iabEntries[i]?.[1]
                            }
                        })
                    }
                }
            }
            // -

            // Email Quarantine Summary from CAS
            {
                const dataMap = new Map([
                    ['Quarantined', 'Quarantined'],
                    ['Deleted', 'Delete Success'],
                    ['Malicious Files', 'malicious_files'],
                    ['Malicious URLs', 'malicious_urls'],
                    ['Phishing', 'phishing'],
                    ['Spoofing', 'spoofing'],
                    ['Suspicious Object', 'suspicious_objects'],
                    ['Blocked Object', 'blocked_objects']
                ])
                const emailStatus = data['Email Summary']?.['Email_Status']?.['Email Status']
                if (emailStatus) {
                    Object.entries(emailStatus).forEach(([key, value]) => {
                        const stateKey = dataMap.get(key)
                        if (!stateKey) return;
                        let index = state.email_quarantine_summary_cas.status_chart.key.indexOf(stateKey)
                        reducers.updateEQSChartData(state, {
                            type: '',
                            payload: {
                                index,
                                value: emailStatus[key]
                            }
                        })
                    })
                }

                const top3SenderAndReceipts = data['Email Summary']?.['Top 03 Sender and Receipts']
                if (top3SenderAndReceipts) {
                    reducers.updateEQSSenderReceipts(state, {
                        type: '',
                        payload: {
                            field: 'sender',
                            value: top3SenderAndReceipts['Top 3 Senders'].join('\n'),
                        }
                    })
                    reducers.updateEQSSenderReceipts(state, {
                        type: '',
                        payload: {
                            field: 'receipt',
                            value: top3SenderAndReceipts['Top 3 Receipts'].join('\n'),
                        }
                    })
                }

                const threatData = data['Email Summary']?.['Threat Type']
                if (threatData) {
                    Object.entries(threatData).forEach(([key, value]) => {
                        const stateKey = dataMap.get(key)
                        if (!stateKey) return;
                        reducers.updateEQSThreatType(state, {
                            type: '',
                            payload: {
                                field: stateKey as keyof EmailThreatType,
                                value: Number(value) || 0
                            }
                        })
                    })
                }
            }
            // -

            // Vulnerability Assessment Report
            {
                const vulnerabilityData = data['Vulnerability Assessment Report']?.['Internal Assets']
                const dataMap = new Map([
                    ['Vulnerable Endpoint Percentage', 'internal_assets.vulnerable_endpoint'],
                    ['Highly-Exploitable CVE Density', 'internal_assets.highly_exploitable_cve'],
                    ['Devices with Legacy Windows Systems', 'internal_assets.devices_with_windows_legacy'],
                    ['Average Unpatched Time', 'internal_assets.average_unpatched_time'],
                    ['Mean Time to Patch (MTTP)', 'internal_assets.mttp'],
                    ['Highly-Exploitable Unique CVEs', 'internal_assets.highly_exploitable_unique_cve'],
                    // ['', 'internet_facing_assets.unique_cve'],
                    // ['', 'internet_facing_assets.vulnerable_host'],
                    // ['', 'internet_facing_assets.cve_density']
                ])
                if (vulnerabilityData) {
                    Object.entries(vulnerabilityData).forEach(([key, score]) => {
                        const stateKey = dataMap.get(key)
                        if (!stateKey) return

                        const updatedData = updateNestedField(
                            state.vulnerability_assessment_report,
                            stateKey,
                            Number(score) || 0
                        );
                        reducers.vulnerabilityAssessmentReport(state, {
                            type: '',
                            payload: updatedData
                        });
                    })
                }
            }
            // -

            // System Configuration Report
            {
                const configReportData = data['System Configuration Report']?.['System Configuration Report']
                const dataMap = new Map([
                    ['Accounts with Weak Authentication', 'accounts_with_weak_auth'],
                    ['Accounts that Increase Attack Surface Risk', 'account_attack_surface_risk'],
                    ['Accounts with Excessive Privilege', 'accounts_with_excessive_privilege'],
                    ['Legacy Authentication Protocol with Log On Activity', 'legacy_auth_logon_activity'],
                    ['Unexpected Internet-Facing Service Port Count', 'unexpected_internet_facing_serve_port.service_port'],
                    ['Unexpected Internet-Facing Public IP Count', 'unexpected_internet_facing_serve_port.affected_ip'],
                    ['Hosts with Insecure Host Count', 'host_with_insecure_connection.insecure_connection'],
                    ['Hosts with Insecure Connection Issues', 'legacy_auth_logon_activity']
                ])
                if (configReportData) {
                    Object.entries(configReportData).forEach(([key, score]) => {
                        const stateKey = dataMap.get(key)
                        if (!stateKey) return

                        const updatedData = updateNestedField(
                            state.system_configuration_report,
                            stateKey,
                            Number(score) || 0
                        );
                        reducers.systemConfigurationReport(state, {
                            type: '',
                            payload: updatedData
                        });
                    })
                }
            }
            // -

            // Top Vulnerabilities Detected
            {
                const topVData = data['Top Vulnerability Detected']?.['Top Vulnerabilities Detected']
                reducers.updateTVDChartLabel(state, {
                    type: '',
                    payload: {
                        datasetIndex: 0,
                        value: 'CVSS Score'
                    }
                })
                if (topVData) {
                    for (let i = state.top_vulnerabilities_detected.impact_chart.key.length; i < topVData.length; i++) {
                        reducers.addTVDChartBar(state);
                    }

                    topVData.forEach((vData: any, index: number) => {
                        reducers.updateTVDChartKey(state, {
                            type: '',
                            payload: {
                                index,
                                value: vData['CVE']
                            }
                        })
                        reducers.updateTVDChartData(state, {
                            type: '',
                            payload: {
                                datasetIndex: 0,
                                index,
                                value: Number(vData['CVE impact score']) || 0
                            }
                        })
                    })
                }
            }
            // -

            // Top Risk Device
            {
                const topVData = data['Top Risk Device']?.['Top Risk Device']
                if (topVData) {
                    for (let i = state.top_risk_device.risk_score_chart.key.length; i < topVData.length; i++) {
                        reducers.addTRDChartBar(state);
                    }

                    topVData.forEach((vData: any, index: number) => {
                        reducers.updateTRDChartKey(state, {
                            type: '',
                            payload: {
                                index,
                                value: vData['Device Name']
                            }
                        })
                        reducers.updateTRDChartData(state, {
                            type: '',
                            payload: {
                                index,
                                value: Number(vData['Risk Score']) || 0
                            }
                        })
                    })
                }
            }
            // -

            // Top Risk Users Chart
            {
                const topVData = data['Top Risk Users']?.['Top Risk Users']
                if (topVData) {
                    for (let i = state.top_risk_users.risk_score_chart.key.length; i < topVData.length; i++) {
                        reducers.addTRUChartBar(state);
                    }

                    topVData.forEach((vData: any, index: number) => {
                        reducers.updateTRUChartKey(state, {
                            type: '',
                            payload: {
                                index,
                                value: vData['User Name']
                            }
                        })
                        reducers.updateTRUChartData(state, {
                            type: '',
                            payload: {
                                index,
                                value: Number(vData['Risk Score']) || 0
                            }
                        })
                    })
                }
            }
            // -

            // Account Compromise Events
            // @TODO no data format found in the elastic, so data format is unknown
            {
                const topVData = data['Account Compromise Events']?.['Account Compromise Events']
                if (topVData) {
                    for (let i = state.account_compromise_events.risk_event_table.length; i < topVData.length; i++) {
                        reducers.addACERiskEvent(state);
                    }

                    topVData.forEach((eData: any, i: number) => {
                        reducers.updateACERiskEvent(state, {
                            type: "",
                            payload: {
                                index: i,
                                field: "asset",
                                value: eData["Asset"]
                            }
                        })
                        reducers.updateACERiskEvent(state, {
                            type: "",
                            payload: {
                                index: i,
                                field: "data_source",
                                value: eData["Data Source"]
                            }
                        })
                        reducers.updateACERiskEvent(state, {
                            type: "",
                            payload: {
                                index: i,
                                field: "event_risk",
                                value: eData["Event Risk"]
                            }
                        })
                        reducers.updateACERiskEvent(state, {
                            type: "",
                            payload: {
                                index: i,
                                field: "risk_event",
                                value: eData["Risk Event"]
                            }
                        })
                    })
                }

                // @TODO
            }
            // -

            // Product Assessment Report
            // @TODO Third Party Products Summary is empty in elastic so data format is unknown
            {
                const topVData = data['Product Assessment Report']?.['TM Products Summary']
                if (topVData) {
                    for (let i = state.product_assessment_report.tm_products_summary.length; i < topVData.length; i++) {
                        reducers.addPARTMProduct(state);
                    }

                    topVData.forEach((vData: any, index: number) => {
                        reducers.updatePARTMProduct(state, {
                            type: '',
                            payload: {
                                index,
                                field: 'tm_product',
                                value: vData['TM Product']
                            }
                        })
                        reducers.updatePARTMProduct(state, {
                            type: '',
                            payload: {
                                index,
                                field: 'connection_status',
                                value: vData['Connection Status']
                            }
                        })
                    })
                }

                // const thirdPartyData = data['Product Assessment Report']['Third Party Products Summary']
                // @TODO
            }
            // -

            // Endpoint Feature Compliance
            {
                const configReportData = data['Endpoint Feature Compliance']?.['Endpoint Feature Compliance']
                const dataMap = new Map([
                    ['XDR Endpoint Sensor Not Enabled', 'XDR Endpoint Sensor Not Enabled'],
                    ['Vulnerability Protection not Enabled', 'Vulnerability Protection not Enabled'],
                    ['XDR Endpoint Sensor, Vulnerability Protection Enabled', 'XDR Endpoint Sensor, Vulnerability Protection Enabled'],
                ])
                if (configReportData) {
                    Object.entries(configReportData).forEach(([key, score]) => {
                        const stateKey = dataMap.get(key)
                        if (!stateKey) return

                        const index = state.endpoint_feature_compliance.compliance_chart.key.indexOf(stateKey);
                        reducers.updateEPFChartData(state, {
                            type: '',
                            payload: {
                                index,
                                value: Number(score) || 0
                            }
                        });
                    })
                }
            }
            // -

            // Key Feature Adoption Rate of Apex one as Service / Std Endpoint Protection
            {
                const eData = data['Key Feature Adoption Rate of A1']?.['Key Feature Adoption Rate of A1']
                if (eData) {
                    for (let i = state.key_feature_adoption_apex_one.apex_one_chart.key.length; i < eData.length; i++) {
                        reducers.addKFAAPEXChartBar(state);
                    }

                    eData.forEach((vData: any, index: number) => {
                        reducers.updateKFAAPEXChartKey(state, {
                            type: '',
                            payload: {
                                index,
                                value: vData['Feature Name']
                            }
                        })
                        reducers.updateKFAAPEXChartData(state, {
                            type: '',
                            payload: {
                                datasetIndex: 0,
                                index,
                                value: Number(vData['Total']) || 0
                            }
                        })
                        reducers.updateKFAAPEXChartData(state, {
                            type: '',
                            payload: {
                                datasetIndex: 1,
                                index,
                                value: Number(vData['Count']) || 0
                            }
                        })
                    })
                }
            }
            // -

            // Key Feature Adoption Rate of Server & Workload Security / Protection
            {
                const eData = data['Key Feature Adoption Rate of C1']?.['Key Feature Adoption Rate of C1']
                if (eData) {
                    for (let i = state.key_feature_adoption_server_workload.workload_security_chart.key.length; i < eData.length; i++) {
                        reducers.addBar(state);
                    }

                    eData.forEach((vData: any, index: number) => {
                        reducers.updateKFAWLSChartKey(state, {
                            type: '',
                            payload: {
                                index,
                                value: vData['Feature Name']
                            }
                        })
                        reducers.updateKFAWLSChartData(state, {
                            type: '',
                            payload: {
                                datasetIndex: 0,
                                index,
                                value: Number(vData['Total']) || 0
                            }
                        })
                        reducers.updateKFAWLSChartData(state, {
                            type: '',
                            payload: {
                                datasetIndex: 1,
                                index,
                                value: Number(vData['Count']) || 0
                            }
                        })
                    })
                }
            }
            // -

            // Key Feature Adoption Rate of Deep Security
            // @TODO No data found in elastic
            // -

            // Agent Versions Summary
            // @TODO i am showing outdated = older version + end-of-life version
            {
                const eData = data['Agent Version Summary']?.['All Agents Version Summary']
                if (eData) {
                    reducers.updateAVSChartData(state, {
                        type: '',
                        payload: {
                            chart: "agent_version_chart",
                            datasetIndex: 0,
                            index: 5,
                            value: eData['Total (Endpoint + Server)']
                        }
                    })
                    reducers.updateAVSChartData(state, {
                        type: '',
                        payload: {
                            chart: "agent_version_chart",
                            datasetIndex: 0,
                            index: 4,
                            value: eData['Latest Version (Endpoint + Server)']
                        }
                    })
                    reducers.updateAVSChartData(state, {
                        type: '',
                        payload: {
                            chart: "agent_version_chart",
                            datasetIndex: 0,
                            index: 3,
                            value: eData['Older Version (Endpoint + Server)']
                        }
                    })
                    reducers.updateAVSChartData(state, {
                        type: '',
                        payload: {
                            chart: "agent_version_chart",
                            datasetIndex: 0,
                            index: 1,
                            value: eData['End-of-Life version (Endpoint + Server)']
                        }
                    })
                }

                const wData = data['Component Versions']?.['WorkLoad Protection']
                if (wData) {
                    reducers.updateAVSChartData(state, {
                        type: '',
                        payload: {
                            chart: "server_workload_protection_chart",
                            datasetIndex: 0,
                            index: 5,
                            value: wData['Older'] + wData['Latest'] + wData['End of Life']
                        }
                    })
                    reducers.updateAVSChartData(state, {
                        type: '',
                        payload: {
                            chart: "server_workload_protection_chart",
                            datasetIndex: 0,
                            index: 4,
                            value: wData['Latest']
                        }
                    })
                    reducers.updateAVSChartData(state, {
                        type: '',
                        payload: {
                            chart: "server_workload_protection_chart",
                            datasetIndex: 0,
                            index: 3,
                            value: wData['Older']
                        }
                    })

                    reducers.updateAVSChartData(state, {
                        type: '',
                        payload: {
                            chart: "server_workload_protection_chart",
                            datasetIndex: 0,
                            index: 1,
                            value: wData['End of Life']
                        }
                    })
                }

                const sData = data['Component Versions']?.['Standard Endpoint Protection']
                if (sData) {
                    reducers.updateAVSChartData(state, {
                        type: '',
                        payload: {
                            chart: "standard_endpoint_protection_chart",
                            datasetIndex: 0,
                            index: 5,
                            value: sData['Older'] + sData['Latest'] + sData['End of Life']
                        }
                    })
                    reducers.updateAVSChartData(state, {
                        type: '',
                        payload: {
                            chart: "standard_endpoint_protection_chart",
                            datasetIndex: 0,
                            index: 4,
                            value: sData['Latest']
                        }
                    })
                    reducers.updateAVSChartData(state, {
                        type: '',
                        payload: {
                            chart: "standard_endpoint_protection_chart",
                            datasetIndex: 0,
                            index: 3,
                            value: sData['Older']
                        }
                    })
                    reducers.updateAVSChartData(state, {
                        type: '',
                        payload: {
                            chart: "standard_endpoint_protection_chart",
                            datasetIndex: 0,
                            index: 1,
                            value: sData['End of Life']
                        }
                    })
                }

            }
            // -
        },
        setCommonData(state, action: PayloadAction<any>) {
            if (Array.isArray(action.payload?.tg_cyber_cri) && action.payload.tg_cyber_cri.length) {
                state.about_this_report.data[0].sub = action.payload.tg_cyber_cri
            }
            if (Array.isArray(action.payload?.tg_vul) && action.payload.tg_vul.length) {
                state.about_this_report.data[1].sub = action.payload.tg_vul
            }
            if (Array.isArray(action.payload?.tg_mal) && action.payload.tg_mal.length) {
                state.about_this_report.data[2].sub = action.payload.tg_mal
            }
            if (Array.isArray(action.payload?.tg_mitre) && action.payload.tg_mitre.length) {
                state.about_this_report.data[3].sub = action.payload.tg_mitre
            }

            if (action.payload?.threat_intel_summary) {
                state.threat_intel_summary.total_ioc_sweep = action.payload?.threat_intel_summary.total_ioc_sweep
            }

            if (action.payload?.threat_intel_summary?.advisory_chart) {
                state.threat_intel_summary.count_of_advisory_chart.datasets[0].data = [
                    action.payload.threat_intel_summary.advisory_chart.ioc,
                    action.payload.threat_intel_summary.advisory_chart.advisories
                ]
            }

            if (action.payload?.threat_intel_summary?.ioc_chart) {
                state.threat_intel_summary.ioc_chart.datasets[0].data = [
                    action.payload.threat_intel_summary.ioc_chart.ip,
                    action.payload.threat_intel_summary.ioc_chart.url,
                    action.payload.threat_intel_summary.ioc_chart.domain,
                    action.payload.threat_intel_summary.ioc_chart.hash,
                    action.payload.threat_intel_summary.ioc_chart.sender_email
                ]
            }
        },
        updateReportProp(state, action: PayloadAction<{ attr: string, value: any }>) {
            _set(state, action.payload.attr, action.payload.value)
        },
        removeReportPropArr(state, action: PayloadAction<{ attr: string, index: number }>) {
            const vArr = _get(state, action.payload.attr)
            if (Array.isArray(vArr)) {
                vArr.splice(action.payload.index, 1)
            }
        },
        // First page
        firstPage: (state, action: PayloadAction<FirstPageType>) => {
            state.monthly_report = action.payload
            state.overall_incident_summary.incidents_chart.key[2] = `Pending Incidents with ${state.monthly_report.customer_name}`
            state.overall_incident_summary.p1.pending_with_customer.customer_name = state.monthly_report.customer_name
            state.overall_incident_summary.p2.pending_with_customer.customer_name = state.monthly_report.customer_name
            state.overall_incident_summary.p3.pending_with_customer.customer_name = state.monthly_report.customer_name
            state.overall_incident_summary.p4.pending_with_customer.customer_name = state.monthly_report.customer_name

            state.workbench_incident_summary.p1.pending_with_customer.customer_name = state.monthly_report.customer_name
            state.workbench_incident_summary.p2.pending_with_customer.customer_name = state.monthly_report.customer_name
            state.workbench_incident_summary.p3.pending_with_customer.customer_name = state.monthly_report.customer_name
            state.workbench_incident_summary.p4.pending_with_customer.customer_name = state.monthly_report.customer_name

            state.siem_incident_summary.p1.pending_with_customer.customer_name = state.monthly_report.customer_name
            state.siem_incident_summary.p2.pending_with_customer.customer_name = state.monthly_report.customer_name
            state.siem_incident_summary.p3.pending_with_customer.customer_name = state.monthly_report.customer_name
            state.siem_incident_summary.p4.pending_with_customer.customer_name = state.monthly_report.customer_name
        },

        // Table of content
        tableOfContents: (state, action: PayloadAction<TOCItem>) => {
            state.table_of_contents.data.push(action.payload)
        },
        updateTableOfContents(state, action: PayloadAction<TableOfContentsType>) {
            state.table_of_contents.data[action.payload.index] = action.payload.data;
        },
        removeTableOfContents(state, action: PayloadAction<number>) {
            state.table_of_contents.data.splice(action.payload, 1);
        },

        // About this report
        updateAboutField: (state, action: PayloadAction<{ path: (string | number)[]; value: any }>) => {
            let current = state.about_this_report as any;
            for (let i = 0; i < action.payload.path.length - 1; i++) {
                current = current[action.payload.path[i]];
            }
            current[action.payload.path[action.payload.path.length - 1]] = action.payload.value;
        },
        updateAboutChart: (state, action: PayloadAction<AboutChart>) => {
            state.about_this_report.chart = action.payload;
        },
        // Executive Summary
        updateESField: (
            state,
            action: PayloadAction<{ field: string; value: string }>
        ) => {
            const { field, value } = action.payload;
            (state.executive_summary as any)[field] = value; // Ensure state paths match your component's expectations
        },
        updateESDataField: (
            state,
            action: PayloadAction<{ index: number; field: string; value: string }>
        ) => {
            const { index, field, value } = action.payload;
            if (state.executive_summary.data[index]) {
                (state.executive_summary.data[index] as any)[field] = value;
            }
        },
        updateESSubField: (
            state,
            action: PayloadAction<{
                index: number;
                subIndex: number;
                field: string;
                value: string;
            }>
        ) => {
            const { index, subIndex, field, value } = action.payload;
            if (state.executive_summary.data[index] && state.executive_summary.data[index].sub) {
                (state.executive_summary.data[index].sub![subIndex] as any)[field] = value;
            }
        },

        // detailed summary
        updateDSField: (state, action: PayloadAction<{ field: string; value: string }>) => {
            const { field, value } = action.payload;
            (state.detailed_summary as any)[field] = value;
        },
        updateDSTopIncidentField: (state, action: PayloadAction<{ index: number; field: string; value: string }>) => {
            const { index, field, value } = action.payload;
            (state.detailed_summary.top_incidents[index] as any)[field] = value;
        },
        addDSTopIncident: (state) => {
            state.detailed_summary.top_incidents.push({
                incident_name: '',
                priority_impact: '',
                data_source: ''
            });
        },
        removeDSTopIncident: (state, action: PayloadAction<number>) => {
            state.detailed_summary.top_incidents.splice(action.payload, 1);
        },
        updateDSCheckboxField: (state, action: PayloadAction<{ field: string; value: boolean }>) => {
            const { field, value } = action.payload;
            (state.detailed_summary as any)[field] = value;
        },
        updateDSChartData: (state, action: PayloadAction<{ index: number; value: number }>) => {
            const { index, value } = action.payload;
            state.detailed_summary.risk_index_chart.datasets[0].data[0] = value;
            state.detailed_summary.risk_index_chart.datasets[0].data[1] = 100 - value;
        },
        updateDSChartColor: (state, action: PayloadAction<{ index: number; color: string }>) => {
            const { index, color } = action.payload;
            state.detailed_summary.risk_index_chart.datasets[0].backgroundColor[index] = color;
        },
        updateDSChartText: (state, action: PayloadAction<string>) => {
            state.detailed_summary.risk_index_text = action.payload;
        },

        updateLicenseAndDc: (state, action: PayloadAction<{ field: 'license_consumption_text' | 'data_consumption_text'; value: string }>) => {
            const { field, value } = action.payload;
            state.detailed_summary[field] = value;
        },
        // risk metrics
        updateRMDate(state, action: PayloadAction<string>) {
            state.risk_metrics.date = action.payload;
        },
        updateLastRiskScoreChart(
            state,
            action: PayloadAction<{ index: number; field: string; value: any }>
        ) {
            const { index, field, value } = action.payload;
            if (field === "data") {
                state.risk_metrics.last_risk_score.charts[index].datasets[0].data[0] = value[0];
                state.risk_metrics.last_risk_score.charts[index].datasets[0].data[1] = 100 - value[0];
            } else if (field === "month") {
                state.risk_metrics.last_risk_score.charts[index].month = value;
            } else if (field === "backgroundColor") {
                state.risk_metrics.last_risk_score.charts[index].datasets[0].backgroundColor = value;
            }
        },
        updateTopRiskIndicator(
            state,
            action: PayloadAction<{ index: number; field: string; value: any }>
        ) {
            const { index, field, value } = action.payload;
            if (field === "risk_name") {
                state.risk_metrics.top_risk_incidents.indicators[index].risk_name = value;
            } else if (field === "value") {
                state.risk_metrics.top_risk_incidents.indicators[index].value = value;
            }
        },
        toggleTopRiskVisibility(state, action: PayloadAction<boolean>) {
            state.risk_metrics.top_risk_incidents.visible = action.payload;
        },
        //Threat Intel Summary
        updateTISIOCSweep(state, action: PayloadAction<number>) {
            state.threat_intel_summary.total_ioc_sweep = action.payload
        },
        updateTISIOCMatchDetail: (state, action: PayloadAction<{ index: number; field: string; value: string }>) => {
            const { index, field, value } = action.payload;
            (state.threat_intel_summary.ioc_match_details.data[index] as any)[field] = value;
        },
        addTISIOCMatchDetail: (state) => {
            state.threat_intel_summary.ioc_match_details.data.push({
                advisory_name: '',
                ioc_type: '',
                detail: '',
                endpoint_name: ''
            });
        },
        removeTISIOCMatchDetail: (state, action: PayloadAction<number>) => {
            state.threat_intel_summary.ioc_match_details.data.splice(action.payload, 1);
        },
        updateTISIOCInvestigation: (state, action: PayloadAction<{ index: number; field: string; value: string }>) => {
            const { index, field, value } = action.payload;
            (state.threat_intel_summary.ioc_investigation.data[index] as any)[field] = value;
        },
        updateTISInvestigationSummary: (state, action: PayloadAction<{ index: number; field: string; value: string }>) => {
            const { index, field, value } = action.payload;
            (state.threat_intel_summary.ioc_investigation.data[index].investigation_summary as any)[field] = value;
        },
        addTISIOCInvestigation: (state) => {
            state.threat_intel_summary.ioc_investigation.data.push({
                advisory_name: '',
                about_advisory: '',
                investigation_summary: {
                    incident_no: '',
                    incident_overview: '',
                    findings: '',
                    action_taken: ''
                }
            });
        },
        removeTISIOCInvestigation: (state, action: PayloadAction<number>) => {
            state.threat_intel_summary.ioc_investigation.data.splice(action.payload, 1);
        },
        updateTISChartData: (state, action: PayloadAction<{ datasetIndex: number; dataIndex: number; value: number }>) => {
            const { datasetIndex, dataIndex, value } = action.payload;
            state.threat_intel_summary.ioc_chart.datasets[datasetIndex].data[dataIndex] = value;
        },
        updateTISChartColor: (state, action: PayloadAction<{ datasetIndex: number; color: string }>) => {
            const { datasetIndex, color } = action.payload;
            state.threat_intel_summary.ioc_chart.datasets[datasetIndex].backgroundColor = color;
        },
        updateTISAdvisoryChartData: (state, action: PayloadAction<{ datasetIndex: number; dataIndex: number; value: number }>) => {
            const { datasetIndex, dataIndex, value } = action.payload;
            state.threat_intel_summary.count_of_advisory_chart.datasets[datasetIndex].data[dataIndex] = value;
        },
        updateTISAdvisoryChartColor: (state, action: PayloadAction<{ datasetIndex: number; color: string }>) => {
            const { datasetIndex, color } = action.payload;
            state.threat_intel_summary.count_of_advisory_chart.datasets[datasetIndex].backgroundColor = color;
        },

        // Overall incident summary
        updateOISField: (
            state,
            action: PayloadAction<{ path: string; value: string | number }>
        ) => {
            const { path, value } = action.payload;
            const keys = path.split('.');
            let current = state.overall_incident_summary as any;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
        },
        updateOISChart: (state, action: PayloadAction<any[]>) => {
            state.overall_incident_summary.incidents_chart = {
                ...state.overall_incident_summary.incidents_chart,
                datasets: action.payload
            };
        },

        //workbench incident summary
        updateWISField: (
            state,
            action: PayloadAction<{ path: string; value: string | number }>
        ) => {
            const { path, value } = action.payload;
            const keys = path.split('.');
            let current = state.workbench_incident_summary as any;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
        },
        updateWISvisibility: (state, action: PayloadAction<boolean>) => { state.workbench_incident_summary.visible = action.payload; },

        // SIEM incidents summary

        updateSIEMField: (
            state,
            action: PayloadAction<{ path: string; value: string | number }>
        ) => {
            const { path, value } = action.payload;
            const keys = path.split('.');
            let current = state.siem_incident_summary as any;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
        },
        updateSIEMvisibility: (state, action: PayloadAction<boolean>) => { state.siem_incident_summary.visible = action.payload; },

        // high incidents summary

        addHISIncident: (state) => {
            state.high_incident_summary.data.push({
                priority: "",
                incident_title: "",
                findings: {
                    overview: "",
                    endpoint_host_name: "",
                    detected_by: "",
                    action_performed: "",
                },
            });
        },
        removeHISIncident: (state, action: PayloadAction<number>) => {
            state.high_incident_summary.data.splice(action.payload, 1);
        },
        updateHISIncident: (
            state,
            action: PayloadAction<{ index: number; field: string; value: string }>
        ) => {
            const { index, field, value } = action.payload;
            const keys = field.split(".");
            let current: any = state.high_incident_summary.data[index];
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
        },

        // slo summary

        addSLOEntry: (state) => {
            state.slo_summary.slo_table.push({
                priority: '',
                description: '',
                response_time: '',
            });
        },
        removeSLOEntry: (state, action: PayloadAction<number>) => {
            state.slo_summary.slo_table.splice(action.payload, 1);
        },
        updateSLOEntry: (
            state,
            action: PayloadAction<{ index: number; field: keyof SLOTableType; value: string }>
        ) => {
            const { index, field, value } = action.payload;
            state.slo_summary.slo_table[index][field] = value;
        },
        updateSLOChartKey: (
            state,
            action: PayloadAction<{ index: number; value: string }>
        ) => {
            const { index, value } = action.payload;
            state.slo_summary.slo_chart.key[index] = value;
        },
        updateSLOChartData: (
            state,
            action: PayloadAction<{ index: number; value: number }>
        ) => {
            const { index, value } = action.payload;
            state.slo_summary.slo_chart.datasets[0].data[index] = value;
        },
        updateSLOChartColor: (
            state,
            action: PayloadAction<string>
        ) => {
            state.slo_summary.slo_chart.datasets[0].backgroundColor = action.payload;
        },

        // detection summary form apex one
        updateDSAOVisibility: (state, action: PayloadAction<boolean>) => {
            state.detection_summary_apex_one.visible = action.payload
        },
        updateDSAOTableEntry: (
            state,
            action: PayloadAction<{ table: 'table1' | 'table2'; index: number; fieldPath: string; value: any }>
        ) => {
            const { table, index, fieldPath, value } = action.payload;
            if (!fieldPath) return;

            const fields = fieldPath.split('.');
            let current: any = state.detection_summary_apex_one.tables[table][index]

            for (let i = 0; i < fields.length - 1; i++) {
                current = current[fields[i]];
            }

            current[fields[fields.length - 1]] = value;
        },
        addDSAOTableEntry: (
            state,
            action: PayloadAction<'table1' | 'table2'>
        ) => {
            if (action.payload === 'table1') {
                state.detection_summary_apex_one.tables.table1.push({
                    file_cleaned: '',
                    fc_v: 0,
                    file_quarantined: '',
                    fq_v: 0,
                    file_deleted: '',
                    fd_v: 0
                });
            } else if (action.payload === 'table2') {
                state.detection_summary_apex_one.tables.table2.push({
                    connection_endpoint: { endpoint: '', blocked: 0 },
                    attempts_blocked: { endpoint: '', blocked: 0 },
                });
            }
        },
        removeDSAOTableEntry: (
            state,
            action: PayloadAction<{ table: 'table1' | 'table2'; index: number }>
        ) => {
            state.detection_summary_apex_one.tables[action.payload.table].splice(action.payload.index, 1);
        },
        updateDSAOChartLabel: (
            state,
            action: PayloadAction<{ chart: 'detection_chart' | 'attempts_blocked_chart'; index: number; label: string }>
        ) => {
            state.detection_summary_apex_one[action.payload.chart].key[action.payload.index] = action.payload.label;
        },
        updateDSAOChart: (
            state,
            action: PayloadAction<{ chart: 'detection_chart' | 'attempts_blocked_chart'; index: number; value: number }>
        ) => {
            state.detection_summary_apex_one[action.payload.chart].datasets[0].data[action.payload.index] = action.payload.value;
        },
        updateDSAOChartColor: (
            state,
            action: PayloadAction<{ chart: 'detection_chart' | 'attempts_blocked_chart'; color: string }>
        ) => {
            state.detection_summary_apex_one[action.payload.chart].datasets[0].backgroundColor = action.payload.color;
        },


        // Email quarantine summary
        updateEQSVisibility: (state, action: PayloadAction<boolean>) => {
            state.email_quarantine_summary_cas.visible = action.payload;
        },
        updateEQSChartData: (state, action: PayloadAction<{ index: number; value: number }>) => {
            state.email_quarantine_summary_cas.status_chart.datasets[0].data[action.payload.index] = action.payload.value;
        },
        updateEQSChartColor: (state, action: PayloadAction<string>) => {
            state.email_quarantine_summary_cas.status_chart.datasets[0].backgroundColor = action.payload;
        },
        updateEQSSenderReceipts: (state, action: PayloadAction<{ field: 'sender' | 'receipt'; value: string }>) => {
            state.email_quarantine_summary_cas.sender_receipts[action.payload.field] = action.payload.value;
        },
        updateEQSThreatType: (state, action: PayloadAction<{ field: keyof EmailThreatType; value: number }>) => {
            state.email_quarantine_summary_cas.threat_type[action.payload.field] = action.payload.value;
        },
        // top vulnerabilities detected
        updateTVDChartKey: (state, action: PayloadAction<{ index: number; value: string }>) => {
            state.top_vulnerabilities_detected.impact_chart.key[action.payload.index] = action.payload.value;
        },
        updateTVDChartLabel: (state, action: PayloadAction<{ datasetIndex: number; value: string }>) => {
            state.top_vulnerabilities_detected.impact_chart.datasets[action.payload.datasetIndex].label = action.payload.value;
        },
        updateTVDChartData: (state, action: PayloadAction<{ datasetIndex: number; index: number; value: number }>) => {
            state.top_vulnerabilities_detected.impact_chart.datasets[action.payload.datasetIndex].data[action.payload.index] = action.payload.value;
        },
        updateTVDChartColor: (state, action: PayloadAction<{ datasetIndex: number; color: string }>) => {
            state.top_vulnerabilities_detected.impact_chart.datasets[action.payload.datasetIndex].backgroundColor = action.payload.color;
        },
        addTVDChartBar: (state) => {
            state.top_vulnerabilities_detected.impact_chart.key.push('');
            state.top_vulnerabilities_detected.impact_chart.datasets.forEach((dataset) => {
                dataset.data.push(0);
            });
        },
        removeTVDChartBar: (state, action: PayloadAction<number>) => {
            state.top_vulnerabilities_detected.impact_chart.key.splice(action.payload, 1);
            state.top_vulnerabilities_detected.impact_chart.datasets.forEach((dataset) => {
                dataset.data.splice(action.payload, 1);
            });
        },

        // top risk device
        updateTRDChartKey: (state, action: PayloadAction<{ index: number; value: string }>) => {
            state.top_risk_device.risk_score_chart.key[action.payload.index] = action.payload.value;
        },
        updateTRDChartData: (state, action: PayloadAction<{ index: number; value: number }>) => {
            state.top_risk_device.risk_score_chart.datasets[0].data[action.payload.index] = action.payload.value;
        },
        updateTRDChartColor: (state, action: PayloadAction<string>) => {
            state.top_risk_device.risk_score_chart.datasets[0].backgroundColor = action.payload;
        },
        addTRDChartBar: (state) => {
            // Add new empty key and risk score (default values)
            state.top_risk_device.risk_score_chart.key.push('');
            state.top_risk_device.risk_score_chart.datasets[0].data.push(0);
        },
        removeTRDChartBar: (state, action: PayloadAction<number>) => {
            // Remove key and corresponding data entry
            state.top_risk_device.risk_score_chart.key.splice(action.payload, 1);
            state.top_risk_device.risk_score_chart.datasets[0].data.splice(action.payload, 1);
        },
        updateTRDvisibility: (state, action: PayloadAction<boolean>) => {
            state.top_risk_device.visible = action.payload;
        },
        // top risk users
        updateTRUChartKey: (state, action: PayloadAction<{ index: number; value: string }>) => {
            state.top_risk_users.risk_score_chart.key[action.payload.index] = action.payload.value;
        },
        updateTRUChartData: (state, action: PayloadAction<{ index: number; value: number }>) => {
            state.top_risk_users.risk_score_chart.datasets[0].data[action.payload.index] = action.payload.value;
        },
        updateTRUChartColor: (state, action: PayloadAction<string>) => {
            state.top_risk_users.risk_score_chart.datasets[0].backgroundColor = action.payload;
        },
        addTRUChartBar: (state) => {
            state.top_risk_users.risk_score_chart.key.push('New Device');
            state.top_risk_users.risk_score_chart.datasets[0].data.push(0);
        },
        removeTRUChartBar: (state, action: PayloadAction<number>) => {
            state.top_risk_users.risk_score_chart.key.splice(action.payload, 1);
            state.top_risk_users.risk_score_chart.datasets[0].data.splice(action.payload, 1);
        },
        updateTRUvisibility: (state, action: PayloadAction<boolean>) => {
            state.top_risk_users.visible = action.payload;
        },

        // account compromise events
        updateACERiskVisibility(state, action: PayloadAction<boolean>) {
            state.account_compromise_events.visible = action.payload
        },
        updateACERiskEvent: (state, action: PayloadAction<{ index: number; field: keyof ACERiskEvent; value: string }>) => {
            const { index, field, value } = action.payload;
            state.account_compromise_events.risk_event_table[index][field] = value;
        },
        addACERiskEvent: (state) => {
            state.account_compromise_events.risk_event_table.push({
                risk_event: "",
                data_source: "",
                asset: "",
                event_risk: ""
            });
        },
        removeACERiskEvent: (state, action: PayloadAction<number>) => {
            state.account_compromise_events.risk_event_table.splice(action.payload, 1);
        },
        // product assessment report
        populatePARTMProduct(state, action: PayloadAction<TMProductSummary[]>) {
            const reducers = monthlyReportSlice.caseReducers;
            for (let i = state.product_assessment_report.tm_products_summary.length, l = action.payload.length; i < l; i++) {
                reducers.addPARTMProduct(state)
            }
            action.payload.forEach((tmp: any, i: number) => {
                reducers.updatePARTMProduct(state, {
                    type: "",
                    payload: { index: i, field: 'tm_product', value: tmp['tm_product'] }
                });
                reducers.updatePARTMProduct(state, {
                    type: "",
                    payload: { index: i, field: 'connection_status', value: tmp['connection_status'] }
                });
                reducers.updatePARTMProduct(state, {
                    type: "",
                    payload: { index: i, field: 'identifier', value: tmp['identifier'] }
                });
            })
        },
        updatePARTMProduct: (
            state,
            action: PayloadAction<{ index: number; field: keyof TMProductSummary; value: string }>
        ) => {
            const { index, field, value } = action.payload;
            state.product_assessment_report.tm_products_summary[index][field] = value;
        },
        addPARTMProduct: (state) => {
            state.product_assessment_report.tm_products_summary.push({
                tm_product: "",
                connection_status: "",
                identifier: ""
            });
        },
        removePARTMProduct: (state, action: PayloadAction<number>) => {
            state.product_assessment_report.tm_products_summary.splice(action.payload, 1);
        },
        updatePARIntegration: (
            state,
            action: PayloadAction<{ index: number; field: keyof IntegrationSummary; value: string | number }>
        ) => {
            const { index, field, value } = action.payload;
            (state.product_assessment_report.integration_summary[index][field] as typeof value) = value;
        },
        addPARIntegration: (state) => {
            state.product_assessment_report.integration_summary.push({
                product: "",
                status: "",
                product_quantity_sow: 0,
                id_log_status: "",
                data_consumption: ""
            });
        },
        removePARIntegration: (state, action: PayloadAction<number>) => {
            state.product_assessment_report.integration_summary.splice(action.payload, 1);
        },


        // endpoint feature
        updateEPFChartKey: (state, action: PayloadAction<{ index: number; value: string }>) => {
            state.endpoint_feature_compliance.compliance_chart.key[action.payload.index] = action.payload.value;
        },
        updateEPFChartData: (state, action: PayloadAction<{ index: number; value: number }>) => {
            state.endpoint_feature_compliance.compliance_chart.datasets[0].data[action.payload.index] = action.payload.value;
        },
        updateEPFChartColor: (state, action: PayloadAction<string>) => {
            state.endpoint_feature_compliance.compliance_chart.datasets[0].backgroundColor = action.payload;
        },



        // key feature adoption rate apex one
        updateKFAAPEXChartKey: (state, action: PayloadAction<{ index: number; value: string }>) => {
            state.key_feature_adoption_apex_one.apex_one_chart.key[action.payload.index] = action.payload.value;
        },
        updateKFAAPEXChartData: (state, action: PayloadAction<{ datasetIndex: number; index: number; value: number }>) => {
            state.key_feature_adoption_apex_one.apex_one_chart.datasets[action.payload.datasetIndex].data[action.payload.index] = action.payload.value;
        },
        updateKFAAPEXChartColor: (state, action: PayloadAction<{ datasetIndex: number; color: string }>) => {
            state.key_feature_adoption_apex_one.apex_one_chart.datasets[action.payload.datasetIndex].backgroundColor = action.payload.color;
        },
        updateKFAAPEXvisibility: (state, action: PayloadAction<boolean>) => {
            state.key_feature_adoption_apex_one.visible = action.payload;
        },
        addKFAAPEXChartBar: (state) => {
            state.key_feature_adoption_apex_one.apex_one_chart.key.push("");
            state.key_feature_adoption_apex_one.apex_one_chart.datasets[0].data.push(0); // Add to Total dataset
            state.key_feature_adoption_apex_one.apex_one_chart.datasets[1].data.push(0); // Add to Count dataset
        },
        removeKFAAPEXChartBar: (state, action: PayloadAction<number>) => {
            state.key_feature_adoption_apex_one.apex_one_chart.key.splice(action.payload, 1);
            state.key_feature_adoption_apex_one.apex_one_chart.datasets[0].data.splice(action.payload, 1); // Remove from Total dataset
            state.key_feature_adoption_apex_one.apex_one_chart.datasets[1].data.splice(action.payload, 1); // Remove from Count dataset
        },


        // key feature adoption work load security
        updateKFAWLSChartKey: (
            state,
            action: PayloadAction<{ index: number; value: string }>
        ) => {
            state.key_feature_adoption_server_workload.workload_security_chart.key[
                action.payload.index
            ] = action.payload.value;
        },
        updateKFAWLSChartData: (
            state,
            action: PayloadAction<{ datasetIndex: number; index: number; value: number }>
        ) => {
            state.key_feature_adoption_server_workload.workload_security_chart.datasets[
                action.payload.datasetIndex
            ].data[action.payload.index] = action.payload.value;
        },
        updateKFAWLSChartColor: (
            state,
            action: PayloadAction<{ datasetIndex: number; color: string }>
        ) => {
            state.key_feature_adoption_server_workload.workload_security_chart.datasets[
                action.payload.datasetIndex
            ].backgroundColor = action.payload.color;
        },
        updateKFWLSvisibility: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.key_feature_adoption_server_workload.visible = action.payload;
        },

        // New reducers for dynamically adding/removing bars
        addBar: (state) => {
            state.key_feature_adoption_server_workload.workload_security_chart.key.push("");
            state.key_feature_adoption_server_workload.workload_security_chart.datasets[0].data.push(0); // For 'Total'
            state.key_feature_adoption_server_workload.workload_security_chart.datasets[1].data.push(0); // For 'Count'
        },
        removeBar: (state, action: PayloadAction<number>) => {
            const index = action.payload;
            state.key_feature_adoption_server_workload.workload_security_chart.key.splice(
                index,
                1
            );
            state.key_feature_adoption_server_workload.workload_security_chart.datasets[0].data.splice(
                index,
                1
            );
            state.key_feature_adoption_server_workload.workload_security_chart.datasets[1].data.splice(
                index,
                1
            );
        },
        // key feature adoption deep security
        updateKFADPvisibility: (state, action: PayloadAction<boolean>) => {
            state.key_feature_adoption_deep_security.visible = action.payload;
        },
        updateKFADPChartKey: (state, action: PayloadAction<{ index: number; value: string }>) => {
            state.key_feature_adoption_deep_security.deep_security_chart.key[action.payload.index] = action.payload.value;
        },
        updateKFADPChartData: (state, action: PayloadAction<{ datasetIndex: number; index: number; value: number }>) => {
            state.key_feature_adoption_deep_security.deep_security_chart.datasets[action.payload.datasetIndex].data[action.payload.index] = action.payload.value;
        },
        updateKFADPChartColor: (state, action: PayloadAction<{ datasetIndex: number; color: string }>) => {
            state.key_feature_adoption_deep_security.deep_security_chart.datasets[action.payload.datasetIndex].backgroundColor = action.payload.color;
        },
        addKFADPChartBar: (state) => {
            state.key_feature_adoption_deep_security.deep_security_chart.key.push('');
            state.key_feature_adoption_deep_security.deep_security_chart.datasets[0].data.push(6552); // Default Total value
            state.key_feature_adoption_deep_security.deep_security_chart.datasets[1].data.push(0); // Default Count value
        },
        removeKFADPChartBar: (state, action: PayloadAction<number>) => {
            state.key_feature_adoption_deep_security.deep_security_chart.key.splice(action.payload, 1);
            state.key_feature_adoption_deep_security.deep_security_chart.datasets[0].data.splice(action.payload, 1); // Remove from Total
            state.key_feature_adoption_deep_security.deep_security_chart.datasets[1].data.splice(action.payload, 1); // Remove from Count
        },



        // Agent version summary
        updateAVSChartKey: (state, action: PayloadAction<{ chart: keyof AgentVersionsSummary; index: number; value: string }>) => {
            const { chart, index, value } = action.payload;
            const chartData = state.agent_versions_summary[chart] as AVSChartData;
            if ('key' in chartData) {
                chartData.key[index] = value;
            } else {
                throw new Error(`Selected chart does not have a key property.`);
            }
        },
        updateAVSChartData: (state, action: PayloadAction<{ chart: keyof AgentVersionsSummary; datasetIndex: number; index: number; value: number }>) => {
            const { chart, datasetIndex, index, value } = action.payload;
            const chartData = state.agent_versions_summary[chart] as AVSChartData;

            // Check if the datasets property exists on the chartData
            if ('datasets' in chartData) {
                chartData.datasets[datasetIndex].data[index] = value;
            } else {
                throw new Error(`Selected chart does not have a datasets property.`);
            }
        },
        updateAVSChartColor: (state, action: PayloadAction<{ chart: keyof AgentVersionsSummary; datasetIndex: number; color: string }>) => {
            const { chart, datasetIndex, color } = action.payload;
            // state.agent_versions_summary[action.payload.chart].datasets[action.payload.datasetIndex].backgroundColor = action.payload.color;
            const chartData = state.agent_versions_summary[chart] as AVSChartData;
            if ('datasets' in chartData) {
                chartData.datasets[0].backgroundColor[datasetIndex] = color;
            } else {
                throw new Error(`Selected chart does not have a datasets property.`);
            }
        },
        updateAVSSCvisibility: (state, action: PayloadAction<boolean>) => {
            state.agent_versions_summary.agent_version_chart.visible = action.payload;
        },
        updateAVSWPCCvisibility: (state, action: PayloadAction<boolean>) => {
            state.agent_versions_summary.server_workload_protection_chart.visible = action.payload;
        },
        updateAVSSEPCvisibility: (state, action: PayloadAction<boolean>) => {
            state.agent_versions_summary.standard_endpoint_protection_chart.visible = action.payload;
        },

        // Deep security
        updateDPSChartKey: (state, action: PayloadAction<{ chart: keyof DeepSecurity; index: number; value: string }>) => {
            const { chart, index, value } = action.payload;
            const chartData = state.deep_security[chart];
            if ('key' in chartData) {
                chartData.key[index] = value;
            } else {
                throw new Error(`Selected chart does not have a key property.`);
            }
        },
        updateDPSChartData: (state, action: PayloadAction<{ chart: keyof DeepSecurity; datasetIndex: number; index: number; value: number }>) => {
            const { chart, datasetIndex, index, value } = action.payload;
            const chartData = state.deep_security[chart];

            // Check if the datasets property exists on the chartData
            if ('datasets' in chartData) {
                chartData.datasets[datasetIndex].data[index] = value;
            } else {
                throw new Error(`Selected chart does not have a datasets property.`);
            }
        },
        updateDPSChartColor: (state, action: PayloadAction<{ chart: keyof DeepSecurity; datasetIndex: number; color: string }>) => {
            const { chart, datasetIndex, color } = action.payload;
            // state.agent_versions_summary[action.payload.chart].datasets[action.payload.datasetIndex].backgroundColor = action.payload.color;
            const chartData = state.deep_security[chart];
            if ('datasets' in chartData) {
                chartData.datasets[datasetIndex].backgroundColor = color;
            } else {
                throw new Error(`Selected chart does not have a datasets property.`);
            }
        },
        updateDPSWPCCvisibility: (state, action: PayloadAction<boolean>) => {
            state.deep_security.server_workload_protection_chart.visible = action.payload;
        },



        // Vulnerability assessment report


        vulnerabilityAssessmentReport(state, action: PayloadAction<VulnerabilityAssessmentReportType>) {
            state.vulnerability_assessment_report = action.payload
        },

        // System configuration report
        systemConfigurationReport(state, action: PayloadAction<SystemConfigurationReportType>) {
            state.system_configuration_report = action.payload
        },

        // _____________
        pendingIncidentsSummary: (state, action: PayloadAction<POSItem>) => {
            state.pending_incident_summary.data.push(action.payload)
        },
        updatePendingIncidentsSummary(state, action: PayloadAction<POSItemWithIndex>) {
            state.pending_incident_summary.data[action.payload.index] = action.payload.data;
        },
        removePendingIncidentsSummary(state, action: PayloadAction<number>) {
            state.pending_incident_summary.data.splice(action.payload, 1);
        },

    }
});


export const {
    resetMonthlyReportState,
    updateFromElasticData,
    setCommonData,
    updateReportProp,
    removeReportPropArr,
    firstPage,
    // table of content
    tableOfContents,
    updateTableOfContents,
    removeTableOfContents,
    // about this report
    updateAboutField,
    // updateAboutDataField,
    updateAboutChart,
    // Executive Summary
    updateESField,
    updateESDataField,
    updateESSubField,
    // Detailed Summary
    updateDSField,
    updateDSTopIncidentField,
    addDSTopIncident,
    removeDSTopIncident,
    updateDSCheckboxField,
    updateDSChartData,
    updateDSChartColor,
    updateDSChartText,
    updateLicenseAndDc,
    // Risk metrics
    updateRMDate,
    updateLastRiskScoreChart,
    updateTopRiskIndicator,
    toggleTopRiskVisibility,
    // Threat intel summary
    updateTISIOCSweep,
    updateTISIOCMatchDetail,
    addTISIOCMatchDetail,
    removeTISIOCMatchDetail,
    updateTISIOCInvestigation,
    updateTISInvestigationSummary,
    addTISIOCInvestigation,
    removeTISIOCInvestigation,
    updateTISChartData,
    updateTISChartColor,
    updateTISAdvisoryChartData,
    updateTISAdvisoryChartColor,
    // overall incident summary
    updateOISField,
    updateOISChart,
    //workbench incident summary
    updateWISField,
    updateWISvisibility,
    //SIEM incidents summary
    updateSIEMField,
    updateSIEMvisibility,
    // high incident summary
    addHISIncident,
    removeHISIncident,
    updateHISIncident,
    // SLO summary
    addSLOEntry,
    removeSLOEntry,
    updateSLOEntry,
    updateSLOChartKey,
    updateSLOChartData,
    updateSLOChartColor,
    // detections summary from apex one
    updateDSAOVisibility,
    updateDSAOTableEntry,
    addDSAOTableEntry,
    removeDSAOTableEntry,
    updateDSAOChartLabel,
    updateDSAOChart,
    updateDSAOChartColor,
    // email quarantine summary
    updateEQSVisibility,
    updateEQSChartData,
    updateEQSChartColor,
    updateEQSSenderReceipts,
    updateEQSThreatType,
    // vulnerability assessment
    vulnerabilityAssessmentReport,
    // system configuration
    systemConfigurationReport,
    // top vulnerabilities detected
    updateTVDChartKey,
    updateTVDChartData,
    updateTVDChartColor,
    addTVDChartBar,
    removeTVDChartBar,
    // top risk device
    updateTRDChartKey,
    updateTRDChartData,
    updateTRDChartColor,
    addTRDChartBar,
    removeTRDChartBar,
    updateTRDvisibility,
    // top risk users
    updateTRUChartKey,
    updateTRUChartData,
    updateTRUChartColor,
    addTRUChartBar,
    removeTRUChartBar,
    updateTRUvisibility,
    // account compromise events
    updateACERiskVisibility,
    updateACERiskEvent,
    addACERiskEvent,
    removeACERiskEvent,
    // product assessment summary
    populatePARTMProduct,
    updatePARTMProduct,
    addPARTMProduct,
    removePARTMProduct,
    updatePARIntegration,
    addPARIntegration,
    removePARIntegration,
    // endpoin fetaure
    updateEPFChartKey,
    updateEPFChartData,
    updateEPFChartColor,
    // Key feature adoption rate apex one
    updateKFAAPEXChartKey,
    updateKFAAPEXChartData,
    updateKFAAPEXChartColor,
    updateKFAAPEXvisibility,
    addKFAAPEXChartBar,
    removeKFAAPEXChartBar,
    // key feature adoption work load security
    updateKFAWLSChartColor,
    updateKFAWLSChartData,
    updateKFAWLSChartKey,
    updateKFWLSvisibility,
    addBar,
    removeBar,
    // key feature adoption deep security
    updateKFADPvisibility,
    updateKFADPChartKey,
    updateKFADPChartData,
    updateKFADPChartColor,
    addKFADPChartBar,
    removeKFADPChartBar,
    // agent version summary
    updateAVSChartKey,
    updateAVSChartData,
    updateAVSChartColor,
    updateAVSSCvisibility,
    updateAVSWPCCvisibility,
    updateAVSSEPCvisibility,

    // deep security
    updateDPSChartKey,
    updateDPSChartData,
    updateDPSChartColor,
    updateDPSWPCCvisibility,

    pendingIncidentsSummary,
    updatePendingIncidentsSummary,
    removePendingIncidentsSummary,

} = monthlyReportSlice.actions;

export const selectMonthlyReport = (state: any) => state.monthlyReport;

export default monthlyReportSlice.reducer;