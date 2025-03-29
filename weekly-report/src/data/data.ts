export const data = {
    "success": true,
    "message": "Successful",
    "data": {
        "value": {
            "WEEKLY_REPORT": {
                "client_name": "Client_Name",
                "start_date": "2023-09-10",
                "end_date": "2023-05-10"
            },
            "TABLE_OF_CONTENTS": [
                {
                    "title": "hello",
                    "page_no": 2.0
                },
                {
                    "title": "hello",
                    "page_no": 2.0
                }
            ],
            "EXECUTIVE_SUMMARY": {
                "total_incidents": {
                    "total_incidents": 106,
                    "start_date": "2023-10-09",
                    "end_date": "2023-10-15"
                },
                "risk_index": {
                    "chart": {
                        "data": [
                            61,
                            100 - 61
                        ],
                        "backgroundColor": ["rgb(255, 130, 0)", "rgb(105, 105, 105)"],
                        "label": []
                    }
                },
                "no_highly_exploitable": 992,
                "top_incident": {
                    "no_incidents": 5,
                    "table": [
                        {
                            "incident_name": "Possible Spear Phishing Attack via Link",
                            "source": "TM Email Sensor"
                        },
                        {
                            "incident_name": "Spear Phishing Email with Known Phishing Behaviors ",
                            "source": "TM Email Sensor"
                        },
                        {
                            "incident_name": "Suspicious Mailbox Rule Forwards All Email to an Untrusted External location",
                            "source": "Azure AD"
                        },
                        {
                            "incident_name": "Possible CVE-2021-44228 Apache Remote Code Execution Vulnerability",
                            "source": "Trend C1 Workload Securit"
                        },
                        {
                            "incident_name": "Unknown Threat Detection via Predictive Machine Learning ",
                            "source": "Trend C1 Workload Security"
                        }
                    ]
                },
                "agent_life_cycle": {
                    "apex_chart": {
                        "data": [
                            31,
                            425,
                            1069
                        ],
                        "backgroundColor": ["rgb(255, 130, 0)", "rgb(105, 105, 105)"],
                        "label": [
                            "Latest Version",
                            "Older Version",
                            "End of Life"
                        ]
                    },
                    "workload_chart": {
                        "data": [
                            687,
                            29
                        ],
                        "label": [
                            "Latest Version",
                            "Older Version"
                        ]
                    }
                },
                "top_endpoint": {
                    "no_endpoint": 5,
                    "top_incident_table": [
                        {
                            "endpoint_name": "XYZDTUN90479(192.168.2.126)",
                            "no_of_detections": "5139 Medium"
                        },
                        {
                            "endpoint_name": "ECHR0-PC1(172.30.116.171)",
                            "no_of_detections": "4598 Medium"
                        },
                        {
                            "endpoint_name": "ESOFO-20013595(192.168.0.105)",
                            "no_of_detections": "4466 Medium"
                        },
                        {
                            "endpoint_name": "XNAUSAMB2(192.168.23.139)",
                            "no_of_detections": "2132 Medium"
                        },
                        {
                            "endpoint_name": "DTRIM2950(10.1.132.11)",
                            "no_of_detections": "1668 Medium"
                        }
                    ],
                    "action": "The SOC team is actively developing and testing observed attack methods on the specified endpoint, while also prioritizing their efforts to respond to and communicate with the client."
                },
                "endpoint_protection": {
                    "data": [
                        13490,
                        14700
                    ],
                    "lable": []
                },
                "endpoint_sensor": {
                    "data": [
                        12010,
                        14770
                    ],
                    "lable": []
                },
                "R_S_N": {
                    "notes": [
                        "s",
                        "s"
                    ]
                }
            },
            "THREAT_INTEL_SUMMARY": {
                "Indicators_of_Compromise_IOC": {
                    "Key": [
                        "IP",
                        "URL",
                        "Hash",
                        "Domain",
                        "Email"
                    ],
                    "data": [
                        {
                            "label": "IOC Sweeped",
                            "data": [
                                164,
                                94,
                                503,
                                113,
                                2
                            ],
                            "backgroundColor": "#e67700",
                        },
                        {
                            "label": "IOC Matched",
                            "data": [
                                2,
                                0,
                                0,
                                0,
                                0
                            ],
                            "backgroundColor": "#696969",
                        }
                    ]
                },
                "R_S_N_Ioc": {
                    "notes": [
                        "During the Manual Sweeping of threat advisory Updated Royal Ransomware, we found matched IOCs in the form of Ips.",
                        "We recommend you to kindly block the matched IPs at your perimeter or gateway."
                    ]
                },
                "Matched_IOCs_Detailed_Summary": [
                    {
                        "Sr_No": 1,
                        "Advisory_Name": "Updated Royal Ransomware",
                        "M_IOC_Type": "IP",
                        "M_IOC_Detail": "23[.]216[.]147[.]64, 23[.]216[.]147[.]76",
                        "No_of_End/Email": 8
                    },
                    {
                        "Sr_No": 2,
                        "Advisory_Name": "Updated Royal Ransomware",
                        "M_IOC_Type": "IP",
                        "M_IOC_Detail": "23[.]216[.]147[.]64, 23[.]216[.]147[.]76",
                        "No_of_End/Email": 8
                    }
                ],
                "Incident_Summary_by_Severity": {
                    "data": [
                        0,
                        3,
                        20,
                        83
                    ],
                    "label": [
                        "Critical",
                        "High",
                        "Medium",
                        "Low"
                    ],
                    "backgroundColor": ["#ffcd9a", "#ffc0cb", "#ffa07a", "#ff8200"]
                },
                "R_S_N_ISBS": {
                    "notes": [
                        "An incident summary by severity is categorizes and describes cybersecurity incidents based on their level of impact and potential harm. ",
                        "Her 03 High Severity cases are there so we recommend you to take remediation steps to decrease it."
                    ]
                },
                "Incident_Summary_by_status": {
                    "data": [
                        27,
                        79
                    ],
                    "label": [
                        "Closed Incidents",
                        "Pending Incidents"
                    ],
                    "backgroundColor": ["#ff8200", "#ffcd9a", "#ffc0cb", "#ffa07a"]
                },
                "R_S_N_ISB_Status": {
                    "recommendation": [
                        "An incident summary by status in cybersecurity provides an overview of the current state or stage of various security incidents within an organization.",
                        "Kindly update the status for the 79 pending incidents."
                    ]
                },
                "Incidents_Summary_by_Priority": {
                    "Key": [
                        "P1",
                        "P2",
                        "P3",
                        "P4"
                    ],
                    "data": [
                        {
                            "label": "Closed",
                            "data": [
                                0,
                                2,
                                12,
                                13
                            ],
                            "backgroundColor": "#ffcd9a"
                        },
                        {
                            "label": "Pending from SOC",
                            "data": [
                                0,
                                0,
                                0,
                                0
                            ],
                            "backgroundColor": "#ffc0cb"
                        },
                        {
                            "label": "Pending from Customer",
                            "data": [
                                0,
                                0,
                                0,
                                0
                            ],
                            "backgroundColor": "#ffa07a"
                        }
                    ]
                },
                "R_S_N_ISBP": {
                    "R_S_N_ISBP": [
                        "An incident summary by status in cybersecurity provides an overview of the current state or stage of various security incidents within an organization.",
                        "Kindly update the status for the 79 pending incidents."
                    ]
                },
                "T10IS_by_Category": {
                    "Key": ["Possible Spear Phishing Attack via Link", "Spear Phishing Email with known Phishing Behaviours", "Suspicious Mailbox Rule Forwards All Email to an Untrusted External Location"],
                    "data": [
                        {
                            "label": "Closed",
                            "data": [21, 9, 76],
                            "backgroundColor": "#ffd9b2"
                        },
                        {
                            "label": "Pending from SOC",
                            "data": [23, 89, 54],
                            "backgroundColor": "#ffa950"
                        },
                        {
                            "label": "Pending from SOC",
                            "data": [2, 9, 87],
                            "backgroundColor": "#ff8200"
                        },
                    ]
                },
                "R_S_N_T10IS": {
                    "recommendation": [
                        "An incident summary by Category is used to classify and arrange cybersecurity incidents according to classifications.",
                        "Kindly respond us on alert name Possible Spear Phishing Attack via Link and kindly don’t click on any random link."
                    ]
                }
            },
            "PENDING_INCIDENTS_SUMMARY": {
                "T_P_Incidents": 79.0,
                "P_I_F_Customer": 78.0,
                "P_Incidents_from_SOC": 1.0,
                "Pie_chart": {
                    "label": [
                        "Total Pending Incidents",
                        "Pending Incidents from Customer",
                        "Pending Incidents from SOC Team"
                    ],
                    "backgroundColor": ["#ff8200", "#ffa950", "#ffd9b2"],
                    "data": [
                        79,
                        78,
                        1
                    ]
                },
                "R_S_N_P_I_S": {
                    "recommendation": [
                        "Kindly Respond on the incidents pending from your side and for remaining one TM Team is working on it."
                    ]
                }
            },
            "SLO_SUMMARY": {
                "graph": {
                    "Key": [
                        "Total Closed Incidents",
                        "SLO Met",
                        "SLO Not Met"
                    ],
                    "data": [
                        27,
                        27,
                        0
                    ],
                    "label": "Case volume",
                    "backgroundColor": "#ff8200"
                },
                "SLO_Details": [
                    {
                        "Priority": 1,
                        "Description": "Incidents that have a severe impact on customer operations. This event is a concern, such as attack formations or potential breaches",
                        "Response_Time": "01 Hour"
                    },
                    {
                        "Priority": 2,
                        "Description": "Incidents that have a significant impact, or the potential to have a severe impact, on operations.",
                        "Response_Time": "04 Hours"
                    },
                    {
                        "Priority": 3,
                        "Description": "Incidents that have a minimal impact with the potential for escalate if not contained causing significant impact on operations.",
                        "Response_Time": "24 Hours"
                    },
                    {
                        "Priority": 4,
                        "Description": "Incidents that do not have direct impact on Customer operations but violates Customer security Baseline.",
                        "Response_Time": "48 Hours"
                    }
                ]
            },
            "ENDPOINT_INVENTORY": {
                "Bar_graph": {
                    "Key": [
                        "XDR feature enabled",
                        "XDR feature not enabled",
                        "Action Required"
                    ],
                    "data": [
                        11261,
                        65,
                        37
                    ],
                    "label": "info",
                    "backgroundColor": "#ff8200"
                },
                "R_S_N_E_V": {
                    "recommendation": [
                        "Kindly perform required action and enable XDR Sensor to decrease attack risk and secure the digital assets.",
                    ]
                },
                "CP_and_LI": {
                    "License_Information": [
                        {
                            "Status": "Normal",
                            "Product": "Trend Micro Cloud One – Workload Security"
                        },
                        {
                            "Status": "Normal",
                            "Product": "Trend Micro Apex One™ as a Service"
                        },
                        {
                            "Status": "Normal",
                            "Product": "Trend Vision One XDR Add-on: Cloud App Security"
                        }
                    ],
                    "Products_Connected": [
                        {
                            "Status": "Connected",
                            "Product": "Trend Micro Apex One as a Service"
                        },
                        {
                            "Status": "Connected",
                            "Product": "Trend Micro Cloud App Security"
                        },
                        {
                            "Status": "Connected",
                            "Product": "Trend Micro Cloud One"
                        }
                    ]
                }
            },
            "Key_feature_adoption_rate_of_Cl": {
                "graph": {
                    "Key": [
                        "Total Closed Incidents",
                        "SLO Met",
                        "SLO Not Met"
                    ],
                    "data": [
                        {
                            "label": "Total",
                            "data": [
                                27,
                                27,
                                123
                            ],
                            "backgroundColor": "#ff8200"
                        },
                        {
                            "label": "Count",
                            "data": [
                                26,
                                28,
                                120
                            ],
                            "backgroundColor": "#696969"
                        },
                    ],
                },
                "R_S_N_key_cl": {
                    "recommendation": [
                        "Kindly enable the agent self protection features 190 servers from cloud one workload security to prevent the threat."
                    ]
                }
            },
            "Key_feature_adoption_rate_of_Ap": {
                "graph": {
                    "Key": [
                        "Anti-malware Scans",
                        "Web Reputation",
                        "Behavior Monitoring",
                        "Predictive Machine Learning",
                        "Smart Feedback",
                        "Firewall",
                        "Suspicious Connection Service"
                    ],
                    "data": [
                        {
                            "label": "Total",
                            "data": [
                                12777,
                                12777,
                                12591,
                                12777,
                                12777,
                                12591,
                                12591
                            ],
                            "backgroundColor": "#ff8200"
                        },
                        {
                            "label": "Count",
                            "data": [
                                12132,
                                12130,
                                11955,
                                12132,
                                12132,
                                11955,
                                11955
                            ],
                            "backgroundColor": "#696969"
                        }
                    ]
                },
                "R_S_N_key_ap": {
                    "recommendation": [
                        "Kindly enable the remaining features in apex one to protect the endpoints in network infrastructure."
                    ]
                }
            }
        }
    }
}

export const REPORT_STATUS = {
    DRAFT: 0,
    SUBMIT: 1,
}

export const REPORT_AUDIT_STATUS = {
    AUDIT: -1,
    SUBMITTED: 0,
    PENDING: 1,
    APPROVED: 2,
}

export const REPORT_STATUS_LABEL: any = {
    "0": "DRAFT",
    "1": "SUBMITTED",
}

export const REPORT_AUDIT_STATUS_LABEL: any = {
    "-1": "NEEDS CORRECTION",
    "0": "PENDING APPROVAL",
    "1": "PENDING APPROVAL",
    "2": "APPROVED",
}