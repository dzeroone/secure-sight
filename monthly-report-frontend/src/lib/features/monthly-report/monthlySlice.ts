import { monthlyReportInitialValue } from "@@/data/monthly-report";
import { updateNestedField } from "@@/helper/helper";
import { ACERiskEvent, AVSChartData, AboutChart, AgentVersionsSummary, EmailThreatType, FirstPageType, IntegrationSummary, POSItem, POSItemWithIndex, SLOTableType, SystemConfigurationReportType, TMProductSummary, TOCItem, TableOfContentsType, VulnerabilityAssessmentReportType } from "@@/types/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const monthlyReportSlice = createSlice({
    name: "monthlyReport",
    initialState: monthlyReportInitialValue,
    reducers: {

        updateFromElasticData(state, action: PayloadAction<any>) {
            const data = action.payload;
            const reducers = monthlyReportSlice.caseReducers;
            // detailed summary
            reducers.updateDSField(state, {
                type: '',
                payload: {
                    field: 'no_of_incidents',
                    value: data['Detailed Summary']['Total No of Incidents']['Total Incidents']
                }
            })
            reducers.updateDSField(state, {
                type: '',
                payload: {
                    field: 'date',
                    value: data['Detailed Summary']['Total No of Incidents']['Month & Year']
                }
            })
            reducers.updateDSField(state, {
                type: '',
                payload: {
                    field: 'highly_exploitable',
                    value: data['Detailed Summary']['No of Highly Exploitable Unique CVEs']
                }
            })
            reducers.updateDSField(state, {
                type: '',
                payload: {
                    field: 'incidents_closed',
                    value: data['Detailed Summary']['No of Incidents Closed without acknowledgement']
                }
            })
            reducers.updateDSChartData(state, {
                type: '',
                payload: {
                    index: 0,
                    value: data['Detailed Summary']['Risk Index']['Score']
                }
            });

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
            // -
            // Risk matrix
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
            // -
            // Overall Incidents Summary
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
                    payload: { path: `${priority}.pending_with_soc_team`, value: priorityData['Pending Incidents with SOC Team'] }
                })
            })
            // -
            // Vision One Workbench Incidents Summary
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
                    payload: { path: `${priority}.pending_with_customer.pending_incidents`, value: priorityData['Pending Incidents from Customer'] }
                })
                reducers.updateWISField(state, {
                    type: '',
                    payload: { path: `${priority}.pending_with_soc_team`, value: priorityData['Pending Incidents with SOC Team'] }
                })
            })
            // -
            // Third Party / SIEM Incidents Summary
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
                    payload: { path: `${priority}.pending_with_soc_team`, value: priorityData['Pending Incidents with SOC Team'] }
                })
            })
            // -
            // High Incidents Summary
            // @TODO
            // cannot find data mapping
            // -
            // Pending Incidents Summary
            // @TODO
            // no data found on elastic, so, data format is unknown
            // -

            // SLO Summary
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
            // -

            // Detection Summary from Apex One
            // For Top Endpoints Actions, data format is not understood
            {
                let virusData = data['Detection Summary from A1']['Detection Summary form Apex One']['Virus/Malware & Spyware/Grayware']
                let blockedData = data['Detection Summary from A1']['Detection Summary form Apex One']['C & C Connections & Intrusion attempts Blocked']
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

                let top3 = data['Detection Summary from A1']['Top 03 Endpoints']
                for (let i = state.detection_summary_apex_one.tables.table1.length; i < top3['File Cleaned/Spyware'].length; i++) {
                    reducers.addDSAOTableEntry(state, {
                        type: '',
                        payload: 'table1'
                    })
                }
                for (let i = state.detection_summary_apex_one.tables.table2.length; i < top3['C & C Connection Blocked'].length; i++) {
                    reducers.addDSAOTableEntry(state, {
                        type: '',
                        payload: 'table2'
                    })
                }
                for (let i = 0; i < top3['File Cleaned/Spyware'].length; i++) {
                    reducers.updateDSAOTableEntry(state, {
                        type: '',
                        payload: {
                            table: 'table1',
                            index: i,
                            fieldPath: 'file_cleaned',
                            value: top3['File Cleaned/Malware'][i]
                        }
                    })
                    reducers.updateDSAOTableEntry(state, {
                        type: '',
                        payload: {
                            table: 'table1',
                            index: i,
                            fieldPath: 'file_quarantined',
                            value: top3['File Qurantined(Malware)'][i]
                        }
                    })
                    reducers.updateDSAOTableEntry(state, {
                        type: '',
                        payload: {
                            table: 'table1',
                            index: i,
                            fieldPath: 'file_deleted',
                            value: top3['File Deleted'][i]
                        }
                    })
                }
                for (let i = 0; i < top3['C & C Connection Blocked'].length; i++) {
                    reducers.updateDSAOTableEntry(state, {
                        type: '',
                        payload: {
                            table: 'table2',
                            index: i,
                            fieldPath: 'connection_endpoint.endpoint',
                            value: top3['C & C Connection Blocked'][i]
                        }
                    })
                    reducers.updateDSAOTableEntry(state, {
                        type: '',
                        payload: {
                            table: 'table2',
                            index: i,
                            fieldPath: 'attempts_blocked.endpoint',
                            value: top3['Intrusion Attempts Blocked'][i]
                        }
                    })
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
                const emailStatus = data['Email Summary']['Email_Status']['Email Status']
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

                const top3SenderAndReceipts = data['Email Summary']['Top 03 Sender and Receipts']
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

                const threatData = data['Email Summary']['Threat Type']

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
            // -

            // Vulnerability Assessment Report
            {
                const vulnerabilityData = data['Vulnerability Assessment Report']['Internal Assets']
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
            // -

            // System Configuration Report
            {
                const configReportData = data['System Configuration Report']['System Configuration Report']
                const dataMap = new Map([
                    ['Accounts with Weak Authentication', 'accounts_with_weak_auth'],
                    ['Accounts that Increase Attack Surface Risk', 'account_attack_surface_risk'],
                    ['Accounts with Excessive Privilege', 'accounts_with_excessive_privilege'],
                    ['Hosts with Insecure Connection Issues', 'legacy_auth_logon_activity']
                ])
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
            // -

            // Top Vulnerabilities Detected
            {
                const topVData = data['Top Vulnerability Detected']['Top Vulnerabilities Detected']
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
            // -

            // Top Risk Device
            {
                const topVData = data['Top Risk Device']['Top Risk Device']
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
            // -

            // Top Risk Users Chart
            {
                const topVData = data['Top Risk Users']['Top Risk Users']
                for (let i = state.top_risk_users.risk_score_chart.key.length; i < topVData.length; i++) {
                    reducers.addTRUChartBar(state);
                }

                topVData.forEach((vData: any, index: number) => {
                    reducers.updateTRUChartKey(state, {
                        type: '',
                        payload: {
                            index,
                            value: vData['Device Name']
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
            // -

            // Account Compromise Events
            // @TODO no data format found in the elastic, so data format is unknown
            {
                const topVData = data['Account Compromise Events']['Account Compromise Events']
                for (let i = state.account_compromise_events.risk_event_table.length; i < topVData.length; i++) {
                    reducers.addACERiskEvent(state);
                }

                // @TODO
            }
            // -

            // Product Assessment Report
            // @TODO Third Party Products Summary is empty in elastic so data format is unknown
            {
                const topVData = data['Product Assessment Report']['TM Products Summary']
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

                const thirdPartyData = data['Product Assessment Report']['Third Party Products Summary']
                // @TODO
            }
            // -

            // Endpoint Feature Compliance
            {
                const configReportData = data['Endpoint Feature Compliance']['Endpoint Feature Compliance']
                const dataMap = new Map([
                    ['XDR Endpoint Sensor Not Enabled', 'XDR Endpoint Sensor Not Enabled'],
                    ['Vulnerability Protection not Enabled', 'Vulnerability Protection not Enabled'],
                    ['XDR Endpoint Sensor, Vulnerability Protection Enabled', 'XDR Endpoint Sensor, Vulnerability Protection Enabled'],
                ])
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
            // -

            // Key Feature Adoption Rate of Apex one as Service / Std Endpoint Protection
            {
                const eData = data['Key Feature Adoption Rate of A1']['Key Feature Adoption Rate of A1']
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
            // -

            // Key Feature Adoption Rate of Server & Workload Security / Protection
            {
                const eData = data['Key Feature Adoption Rate of C1']['Key Feature Adoption Rate of C1']
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
            // -

            // Key Feature Adoption Rate of Deep Security
            // @TODO No data found in elastic
            // -

            // Agent Versions Summary
            // @TODO i am showing outdated = older version + end-of-life version
            {
                const eData = data['Agent Version Summary']['All Agents Version Summary']
                reducers.updateAVSChartData(state, {
                    type: '',
                    payload: {
                        chart: "agent_version_chart",
                        datasetIndex: 0,
                        index: 0,
                        value: eData['Total (Endpoint + Server)']
                    }
                })
                reducers.updateAVSChartData(state, {
                    type: '',
                    payload: {
                        chart: "agent_version_chart",
                        datasetIndex: 0,
                        index: 1,
                        value: eData['Older Version (Endpoint + Server)'] + eData['End-of-Life version (Endpoint + Server)']
                    }
                })
                reducers.updateAVSChartData(state, {
                    type: '',
                    payload: {
                        chart: "agent_version_chart",
                        datasetIndex: 0,
                        index: 2,
                        value: eData['Latest Version (Endpoint + Server)']
                    }
                })

                const wData = data['Component Versions']['WorkLoad Protection']
                reducers.updateAVSChartData(state, {
                    type: '',
                    payload: {
                        chart: "server_workload_protection_chart",
                        datasetIndex: 0,
                        index: 0,
                        value: wData['Older'] + wData['End of Life']
                    }
                })
                reducers.updateAVSChartData(state, {
                    type: '',
                    payload: {
                        chart: "server_workload_protection_chart",
                        datasetIndex: 0,
                        index: 1,
                        value: wData['Latest']
                    }
                })
                reducers.updateAVSChartData(state, {
                    type: '',
                    payload: {
                        chart: "server_workload_protection_chart",
                        datasetIndex: 0,
                        index: 2,
                        value: wData['Older'] + wData['Latest'] + wData['End of Life']
                    }
                })

                const sData = data['Component Versions']['Standard Endpoint Protection']
                reducers.updateAVSChartData(state, {
                    type: '',
                    payload: {
                        chart: "standard_endpoint_protection_chart",
                        datasetIndex: 0,
                        index: 0,
                        value: sData['Older'] + sData['End of Life']
                    }
                })
                reducers.updateAVSChartData(state, {
                    type: '',
                    payload: {
                        chart: "standard_endpoint_protection_chart",
                        datasetIndex: 0,
                        index: 1,
                        value: sData['Latest']
                    }
                })
                reducers.updateAVSChartData(state, {
                    type: '',
                    payload: {
                        chart: "standard_endpoint_protection_chart",
                        datasetIndex: 0,
                        index: 2,
                        value: sData['Older'] + sData['Latest'] + sData['End of Life']
                    }
                })
            }
            // -
        },

        // First page
        firstPage: (state, action: PayloadAction<FirstPageType>) => {
            state.monthly_report = action.payload
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
        updateRMSRSN: (state, action: PayloadAction<{ index: number; value: string }>) => {
            const { index, value } = action.payload;
            state.risk_metrics.rsn.data[index] = value;
        },
        addRMSRSN: (state) => {
            state.risk_metrics.rsn.data.push('');
        },
        removeRMSRSN: (state, action: PayloadAction<number>) => {
            state.risk_metrics.rsn.data.splice(action.payload, 1);
        },
        updateRMSRSNKey: (state, action: PayloadAction<string>) => {
            state.risk_metrics.rsn.key = action.payload;
        },

        //Threat Inter Summary
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
        updateTISRSN: (state, action: PayloadAction<{ index: number; value: string }>) => {
            const { index, value } = action.payload;
            state.threat_intel_summary.rsn.data[index] = value;
        },
        addTISRSN: (state) => {
            state.threat_intel_summary.rsn.data.push('');
        },
        removeTISRSN: (state, action: PayloadAction<number>) => {
            state.threat_intel_summary.rsn.data.splice(action.payload, 1);
        },
        updateTISRSNKey: (state, action: PayloadAction<string>) => {
            state.threat_intel_summary.rsn.key = action.payload;
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
                    file_quarantined: '',
                    file_deleted: '',
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
        addEQSRSN: (state) => {
            state.email_quarantine_summary_cas.rsn.data.push('');
        },
        updateEQSRSN: (state, action: PayloadAction<{ index: number; value: string }>) => {
            const { index, value } = action.payload;
            state.email_quarantine_summary_cas.rsn.data[index] = value;
        },
        removeEQSRSN: (state, action: PayloadAction<number>) => {
            state.email_quarantine_summary_cas.rsn.data.splice(action.payload, 1);
        },
        updateEQSRSNKey: (state, action: PayloadAction<string>) => {
            state.email_quarantine_summary_cas.rsn.key = action.payload;
        },

        // top vulnerabilities detected
        updateTVDChartKey: (state, action: PayloadAction<{ index: number; value: string }>) => {
            state.top_vulnerabilities_detected.impact_chart.key[action.payload.index] = action.payload.value;
        },
        updateTVDChartData: (state, action: PayloadAction<{ datasetIndex: number; index: number; value: number }>) => {
            state.top_vulnerabilities_detected.impact_chart.datasets[action.payload.datasetIndex].data[action.payload.index] = action.payload.value;
        },
        updateTVDChartColor: (state, action: PayloadAction<{ datasetIndex: number; color: string }>) => {
            state.top_vulnerabilities_detected.impact_chart.datasets[action.payload.datasetIndex].backgroundColor = action.payload.color;
        },
        addTVDRSN: (state) => {
            state.top_vulnerabilities_detected.rsn.data.push('');
        },
        updateTVDRSN: (state, action: PayloadAction<{ index: number; value: string }>) => {
            const { index, value } = action.payload;
            state.top_vulnerabilities_detected.rsn.data[index] = value;
        },
        removeTVDRSN: (state, action: PayloadAction<number>) => {
            state.top_vulnerabilities_detected.rsn.data.splice(action.payload, 1);
        },
        updateTVDRSNKey: (state, action: PayloadAction<string>) => {
            state.top_vulnerabilities_detected.rsn.key = action.payload;
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
        addTRDRSN: (state) => {
            state.top_risk_device.rsn.data.push('');
        },
        updateTRDRSN: (state, action: PayloadAction<{ index: number; value: string }>) => {
            const { index, value } = action.payload;
            state.top_risk_device.rsn.data[index] = value;
        },
        removeTRDRSN: (state, action: PayloadAction<number>) => {
            state.top_risk_device.rsn.data.splice(action.payload, 1);
        },
        updateTRDRSNKey: (state, action: PayloadAction<string>) => {
            state.top_risk_device.rsn.key = action.payload;
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
        addTRURSN: (state) => {
            state.top_risk_users.rsn.data.push('');
        },
        updateTRURSN: (state, action: PayloadAction<{ index: number; value: string }>) => {
            const { index, value } = action.payload;
            state.top_risk_users.rsn.data[index] = value;
        },
        removeTRURSN: (state, action: PayloadAction<number>) => {
            state.top_risk_users.rsn.data.splice(action.payload, 1);
        },
        updateTRURSNKey: (state, action: PayloadAction<string>) => {
            state.top_risk_users.rsn.key = action.payload;
        },
        updateTRUvisibility: (state, action: PayloadAction<boolean>) => {
            state.top_risk_users.visible = action.payload;
        },

        // account compromise events
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
        addACERSN: (state) => {
            state.account_compromise_events.rsn.data.push('');
        },
        updateACERSN: (state, action: PayloadAction<{ index: number; value: string }>) => {
            const { index, value } = action.payload;
            state.account_compromise_events.rsn.data[index] = value;
        },
        removeACERSN: (state, action: PayloadAction<number>) => {
            state.account_compromise_events.rsn.data.splice(action.payload, 1);
        },
        updateACERSNKey: (state, action: PayloadAction<string>) => {
            state.account_compromise_events.rsn.key = action.payload;
        },

        // product assessment report
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
        addEPFRSN: (state) => {
            state.endpoint_feature_compliance.rsn.data.push('');
        },
        updateEPFRSN: (state, action: PayloadAction<{ index: number; value: string }>) => {
            const { index, value } = action.payload;
            state.endpoint_feature_compliance.rsn.data[index] = value;
        },
        removeEPFRSN: (state, action: PayloadAction<number>) => {
            state.endpoint_feature_compliance.rsn.data.splice(action.payload, 1);
        },
        updateEPFRSNKey: (state, action: PayloadAction<string>) => {
            state.endpoint_feature_compliance.rsn.key = action.payload;
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
        addKFAAPEXRSN: (state) => {
            state.key_feature_adoption_apex_one.rsn.data.push('');
        },
        updateKFAAPEXRSN: (state, action: PayloadAction<{ index: number; value: string }>) => {
            state.key_feature_adoption_apex_one.rsn.data[action.payload.index] = action.payload.value;
        },
        removeKFAAPEXRSN: (state, action: PayloadAction<number>) => {
            state.key_feature_adoption_apex_one.rsn.data.splice(action.payload, 1);
        },
        updateKFAAPEXRSNKey: (state, action: PayloadAction<string>) => {
            state.key_feature_adoption_apex_one.rsn.key = action.payload;
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
        addKFAWLSRSN: (state) => {
            state.key_feature_adoption_server_workload.rsn.data.push('');
        },
        updateKFAWLSRSN: (
            state,
            action: PayloadAction<{ index: number; value: string }>
        ) => {
            const { index, value } = action.payload;
            state.key_feature_adoption_server_workload.rsn.data[index] = value;
        },
        removeKFAWLSRSN: (state, action: PayloadAction<number>) => {
            state.key_feature_adoption_server_workload.rsn.data.splice(
                action.payload,
                1
            );
        },
        updateKFAWLSRSNKey: (state, action: PayloadAction<string>) => {
            state.key_feature_adoption_server_workload.rsn.key = action.payload;
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
        addKFADPRSN: (state) => {
            state.key_feature_adoption_deep_security.rsn.data.push('');
        },
        updateKFADPRSN: (state, action: PayloadAction<{ index: number; value: string }>) => {
            const { index, value } = action.payload;
            state.key_feature_adoption_deep_security.rsn.data[index] = value;
        },
        removeKFADPRSN: (state, action: PayloadAction<number>) => {
            state.key_feature_adoption_deep_security.rsn.data.splice(action.payload, 1);
        },
        updateKFADPRSNKey: (state, action: PayloadAction<string>) => {
            state.key_feature_adoption_deep_security.rsn.key = action.payload;
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
        addAVSRSN: (state) => {
            state.agent_versions_summary.rsn.data.push('');
        },
        updateAVSRSN: (state, action: PayloadAction<{ index: number; value: string }>) => {
            const { index, value } = action.payload;
            state.agent_versions_summary.rsn.data[index] = value;
        },
        removeAVSRSN: (state, action: PayloadAction<number>) => {
            state.agent_versions_summary.rsn.data.splice(action.payload, 1);
        },
        updateAVSRSNKey: (state, action: PayloadAction<string>) => {
            state.agent_versions_summary.rsn.key = action.payload;
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



        // Vulnerability assessment report


        vulnerabilityAssessmentReport(state, action: PayloadAction<VulnerabilityAssessmentReportType>) {
            state.vulnerability_assessment_report = action.payload
        },
        addVARRSN: (state) => {
            state.vulnerability_assessment_report.rsn.data.push('');
        },
        updateVARRSN: (state, action: PayloadAction<{ index: number; value: string }>) => {
            const { index, value } = action.payload;
            state.vulnerability_assessment_report.rsn.data[index] = value;
        },
        removeVARRSN: (state, action: PayloadAction<number>) => {
            state.vulnerability_assessment_report.rsn.data.splice(action.payload, 1);
        },
        updateVARRSNKey: (state, action: PayloadAction<string>) => {
            state.vulnerability_assessment_report.rsn.key = action.payload;
        },

        // System configuration report
        systemConfigurationReport(state, action: PayloadAction<SystemConfigurationReportType>) {
            state.system_configuration_report = action.payload
        },
        addSCRRSN: (state) => {
            state.system_configuration_report.rsn.data.push('');
        },
        updateSCRRSN: (state, action: PayloadAction<{ index: number; value: string }>) => {
            const { index, value } = action.payload;
            state.system_configuration_report.rsn.data[index] = value;
        },
        removeSCRRSN: (state, action: PayloadAction<number>) => {
            state.system_configuration_report.rsn.data.splice(action.payload, 1);
        },
        updateSCRRSNKey: (state, action: PayloadAction<string>) => {
            state.system_configuration_report.rsn.key = action.payload;
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
    updateFromElasticData,
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
    updateRMSRSN,
    addRMSRSN,
    removeRMSRSN,
    updateRMSRSNKey,
    // Threat intel summary
    updateTISIOCMatchDetail,
    addTISIOCMatchDetail,
    removeTISIOCMatchDetail,
    updateTISIOCInvestigation,
    updateTISInvestigationSummary,
    addTISIOCInvestigation,
    removeTISIOCInvestigation,
    updateTISRSN,
    addTISRSN,
    removeTISRSN,
    updateTISRSNKey,
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
    addEQSRSN,
    updateEQSRSN,
    removeEQSRSN,
    updateEQSRSNKey,
    // vulnerability assessment
    vulnerabilityAssessmentReport,
    addVARRSN,
    updateVARRSN,
    removeVARRSN,
    updateVARRSNKey,
    // system configuration
    systemConfigurationReport,
    addSCRRSN,
    updateSCRRSN,
    removeSCRRSN,
    updateSCRRSNKey,
    // top vulnerabilities detected
    updateTVDChartKey,
    updateTVDChartData,
    updateTVDChartColor,
    addTVDRSN,
    updateTVDRSN,
    removeTVDRSN,
    updateTVDRSNKey,
    addTVDChartBar,
    removeTVDChartBar,
    // top risk device
    updateTRDChartKey,
    updateTRDChartData,
    updateTRDChartColor,
    addTRDChartBar,
    removeTRDChartBar,
    addTRDRSN,
    updateTRDRSN,
    removeTRDRSN,
    updateTRDRSNKey,
    updateTRDvisibility,
    // top risk users
    updateTRUChartKey,
    updateTRUChartData,
    updateTRUChartColor,
    addTRUChartBar,
    removeTRUChartBar,
    addTRURSN,
    updateTRURSN,
    removeTRURSN,
    updateTRURSNKey,
    updateTRUvisibility,
    // account compromise events
    updateACERiskEvent,
    addACERiskEvent,
    removeACERiskEvent,
    addACERSN,
    updateACERSN,
    removeACERSN,
    updateACERSNKey,
    // product assessment summary
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
    addEPFRSN,
    updateEPFRSN,
    removeEPFRSN,
    updateEPFRSNKey,
    // Key feature adoption rate apex one
    updateKFAAPEXChartKey,
    updateKFAAPEXChartData,
    updateKFAAPEXChartColor,
    addKFAAPEXRSN,
    updateKFAAPEXRSN,
    removeKFAAPEXRSN,
    updateKFAAPEXRSNKey,
    updateKFAAPEXvisibility,
    addKFAAPEXChartBar,
    removeKFAAPEXChartBar,
    // key feature adoption work load security
    addKFAWLSRSN,
    removeKFAWLSRSN,
    updateKFAWLSChartColor,
    updateKFAWLSChartData,
    updateKFAWLSChartKey,
    updateKFAWLSRSN,
    updateKFAWLSRSNKey,
    updateKFWLSvisibility,
    addBar,
    removeBar,
    // key feature adoption deep security
    updateKFADPvisibility,
    updateKFADPChartKey,
    updateKFADPChartData,
    updateKFADPChartColor,
    addKFADPRSN,
    updateKFADPRSN,
    removeKFADPRSN,
    updateKFADPRSNKey,
    addKFADPChartBar,
    removeKFADPChartBar,
    // agent version summary
    updateAVSChartKey,
    updateAVSChartData,
    updateAVSChartColor,
    addAVSRSN,
    updateAVSRSN,
    removeAVSRSN,
    updateAVSRSNKey,
    updateAVSSCvisibility,
    updateAVSWPCCvisibility,
    updateAVSSEPCvisibility,

    pendingIncidentsSummary,
    updatePendingIncidentsSummary,
    removePendingIncidentsSummary,

} = monthlyReportSlice.actions;

export const selectMonthlyReport = (state: any) => state.monthlyReport;

export default monthlyReportSlice.reducer;