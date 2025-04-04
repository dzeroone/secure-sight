export const monthlyReportInitialValue = {
    "monthly_report": {
        "doc_title": "",
        "client_name": "",
        "date": "",
        "customer_name": "",
    },
    "table_of_contents": {
        "data": [
            {
                "title": "About this report",
                "page_no": "3",
                "link": "about_this_report"
            },
            {
                "title": "Executive Summary",
                "page_no": "5",
                "link": "executive_summary"
            },
            {
                "title": "Detailed Summary",
                "page_no": "7",
                "link": "detailed_summary"
            },
            {
                "title": "Risk Metrics",
                "page_no": "8",
                "link": "risk_metrics"
            },
            {
                "title": "Threat Intel Summary",
                "page_no": "9",
                "link": "threat_intel_summary"
            },
            {
                "title": "Incidents Summary",
                "page_no": "10",
                "link": "incidents_summary"
            },
            {
                "title": "Workbench Incidents Summary",
                "page_no": "11",
                "link": "workbench_incidents_summary"
            },
            {
                "title": "Third-party/SIEM Incidents Summary",
                "page_no": "12",
                "link": "third_party_siem_incidents_summary"
            },
            {
                "title": "High Incidents Summary",
                "page_no": "13",
                "link": "high_incidents_summary"
            },
            {
                "title": "Pending Incidents Summary",
                "page_no": "14",
                "link": "waiting_incidents_summary"
            },
            {
                "title": "SLO Summary",
                "page_no": "15",
                "link": "slo_summary"
            },
            {
                "title": "Detection Summary from Apex One",
                "page_no": "16",
                "link": "detection_summary_from_apex_one"
            },
            {
                "title": "Email Quarantine Summary from CAS",
                "page_no": "17",
                "link": "email_quarantine_summary_from_cas"
            },
            {
                "title": "Vulnerability Assessment Report",
                "page_no": "18",
                "link": "vulnerability_assessment_report"
            },
            {
                "title": "System Configuration Report",
                "page_no": "19",
                "link": "system_configuration_report"
            },
            {
                "title": "Top Vulnerabilities Detected",
                "page_no": "20",
                "link": "top_vulnerabilities_detected"
            },
            {
                "title": "Top Risk Devices",
                "page_no": "21",
                "link": "top_risk_devices"
            },
            {
                "title": "Top Risk Users",
                "page_no": "22",
                "link": "top_risk_users"
            },
            {
                "title": "Account Compromise events",
                "page_no": "23",
                "link": "account_compromise_report"
            },
            {
                "title": "Product Assessment Report",
                "page_no": "24",
                "link": "product_assessment_report"
            },
            {
                "title": "Endpoint Feature Compliance",
                "page_no": "25",
                "link": "endpoint_feature_compliance"
            },
            {
                "title": "Key Feature Adoption Rate of STD. Endpoint Protection",
                "page_no": "26",
                "link": "key_feature_adoption_rate_of_std_endpoint_protection"
            },
            {
                "title": "Key Feature Adoption Rate of Server & Workload Security",
                "page_no": "27",
                "link": "key_feature_adoption_rate_of_server_workload_security"
            },
            {
                "title": "Key Feature Adoption Rate of Deep Security",
                "page_no": "28",
                "link": "key_feature_adoption_rate_of_deep_security"
            },
            {
                "title": "Agent Versions Summary",
                "page_no": "29",
                "link": "agent_versions_summary"
            }
        ]
    },
    "about_this_report": {
        "id": "about_this_report",
        "date": "",
        "data": [
            {
                "title": "Top Global Cyber Criminals",
                "desc": "Cyber criminals operate in the shadows, exploiting vulnerabilities and causing significant harm. Their actions range from data breaches to financial theft, and their motivations can be political, financial, or simply for the thrill.",
                "sub": [
                    {
                        "title": "01. ETHERSEC TEAM CYBER",
                        "desc": "The hacktivist group ETHERSEC TEAM CYBER is active on Telegram channel hxxps://t[.]me/ETHERSECTEAM CYBER from January 6, 2024."
                    },
                    {
                        "title": "02. Lulz Security Agency",
                        "desc": "“Lulz Security Agency” is a pro-Indonesian hacktivists group that emerged in August 2023."
                    },
                    {
                        "title": "03. Indonesia anonymous",
                        "desc": "Indonesia Anonymous is a hacktivist group from Indonesia, which engages in cyberactivism and hacking activities. It has been active since September 18, 2023 on their Telegram channel named @ackedindonesi."
                    },
                    {
                        "title": "04. NoName057(16)",
                        "desc": "NONAME057(16) also known as DDOSIA is a pro-Russian hacktivist group mostly known for DDOS attacks. It appeared in July 2022."
                    },
                    {
                        "title": "05. DarkStormTeam",
                        "desc": "DarkStorm Team is a relatively new hacktivist group that appeared in August 2023. During the period of its activity, the group attacked mainly Israel, which makes it similar to groups from Bangladesh and Cambodia."
                    }
                ]
            },
            {
                "title": "Top Global Vulnerabilities",
                "desc": "Vulnerabilities in software and systems can have wide-reaching consequences, potentially compromising the security and functionality of affected platforms. Here's a brief overview of the first vulnerability:",
                "sub": [
                    {
                        "title": "01. CVE-2024-3094",
                        "desc": "Malicious code was discovered in the upstream tarballs of xz, starting with version 5.6.0. Through a series of complex obfuscations, the liblzma build process extracts a prebuilt object file from a disguised test file existing in the source code, which is then used to modify specific functions in the liblzma code."
                    },
                    {
                        "title": "02. CVE-2024-23225",
                        "desc": "A memory corruption issue was addressed with improved validation. This issue is fixed in iOS 16.7.6 and iPadOS 16.7.6, iOS 17.4 and iPadOS 17.4. An attacker with arbitrary kernel read and write capability may be able to bypass kernel memory protections."
                    },
                    {
                        "title": "03. CVE-2024-2182",
                        "desc": "A flaw was found in the Open Virtual Network. In OVN clusters where BFD is used between hypervisors for high availability, an attacker can inject specially crafted BFD packets from inside unprivileged workloads."
                    },
                    {
                        "title": "04. CVE-2024-23263",
                        "desc": "This issue is fixed in tvOS 17.4, macOS Sonoma 14.4, visionOS 1.1, iOS 17.4 and iPadOS 17.4, watchOS 10.4, iOS 16.7.6 and iPadOS 16.7.6, Safari 17.4."
                    },
                    {
                        "title": "05. CVE-2024-28180",
                        "desc": "A vulnerability has been found in go-jose up to 2.6.2/3.0.2/4.0.0 and classified as problematic. Affected by this vulnerability is some unknown processing of the component JWE Handler."
                    }
                ]
            },
            {
                "title": "Top Global Malware",
                "desc": "Malware, short for malicious software, is designed to harm, exploit, or threaten devices, networks, services, and computer programs. They can range from viruses and worms to Trojans and spyware.",
                "sub": [
                    {
                        "title": "01. Inter",
                        "desc": "Credit card sniffer put up on sale by threat actor 'Sochi' in December 2018."
                    },
                    {
                        "title": "02. Ramnit",
                        "desc": "Spotted in 2010 as a self-replicating worm, Ramnit has evolved significantly after its developers decided to morph it into a banking Trojan. In 2011, the malware grabbed on-the-fly data theft capabilities and web injections borrowed from Zeus’ leaked source code."
                    },
                    {
                        "title": "03. Coinminer",
                        "desc": "Coin Miner is a malware type that uses the hardware elements of the victim’s PC to mine cryptocurrencies. Most often, crooks who control such coin miner virus (Monero (XMR) or (Litecoin an example), as they are the easiest for mining."
                    },
                    {
                        "title": "04. CVE-2021-44228 exploitation: Log4j",
                        "desc": "On 10/12/2021 0-day RCE vulnerability in log4j Apache's library was found."
                    },
                    {
                        "title": "05. AnyDesk",
                        "desc": "AnyDesk is a closed source remote desktop application distributed by AnyDesk Software GmbH."
                    }
                ]
            },
            {
                "title": "Top Global MITRE ATT&CK Techniques",
                "desc": "MITRE ATT&CK is a globally-accessible knowledge base of adversary tactics and techniques based on real-world observations. It's used to understand and classify an adversary's actions.",
                "sub": [
                    {
                        "title": "01. Data Encrypted for Impact (T1486)",
                        "desc": "Adversaries may encrypt data on target systems or on large numbers of systems in a network to interrupt availability to system and network resources."
                    },
                    {
                        "title": "02. Endpoint Denial of Service (T1499)",
                        "desc": "A tactic where adversaries aim to exhaust system resources, causing unavailability or reducing the efficacy of targeted resources."
                    },
                    {
                        "title": "03. Malicious File (T1204.002)",
                        "desc": "An adversary may rely upon a user opening a malicious file in order to gain execution. Users may be subjected to social engineering to get them to open a file that will lead to code execution."
                    },
                    {
                        "title": "04. System Information Discovery (T1082)",
                        "desc": "An adversary may attempt to get detailed information about the hardware, installed software, and architecture."
                    },
                    {
                        "title": "05. Scheduled Task (T1053.005)",
                        "desc": "Adversaries may abuse the Windows Task Scheduler to perform task scheduling for initial or recurring execution of malicious code."
                    }
                ]
            },
            {
                "title": "Cyber Threats",
                "desc": "It provides a detailed overview of detected malicious activities and their associated risks within the organization.To enhance security against attacks from top global industries, focus on robust access controls and authentication mechanisms, like multi- factor authentication(MFA). Regularly update and patch software to address vulnerabilities, employ network segmentation to isolate critical systems, and establish continuous monitoring for rapid threat detection and response.By acting on the provided remediation policies and continuing to monitor attack intensity, the organization can strengthen its overall security posture and reduce exposure to potential breaches."
            }
        ],
        "chart": {
            "type": "bar",
            "datasets": [{
                "data": [
                    0,
                    0,
                    0
                ],
                "label": [
                    "Suspicious Mail Forwarding Rule",
                    "Data Destruction",
                    "Data Encrypted for Impac"
                ],
                "backgroundColor": [
                    "rgb(255, 130, 0)",
                    "rgb(255, 176, 93)",
                    "rgb(255, 218, 178)"
                ]
            }]
        }
    },
    "executive_summary": {
        "id": "executive_summary",
        "date": "",
        "data": [
            {
                "title": "Incidents Overview by SOC Team",
                "desc": "",
                "sub": [
                    {
                        "title": "Possible Spear Phishing Attack via Link",
                        "desc": "A suspicious URL associated with phishing attacks was detected in an email message. The SOC team identified various URLs and shared the detailed investigation for the same."
                    },
                    {
                        "title": "Hacking Tool Detection – Blocked",
                        "desc": "A hacking tool, used for cracking computer and network security or by system administrators to test security, was detected and blocked on an endpoint. The SOC team identified various malware detections and shared all the information regarding the incidents with the required action."
                    },
                    {
                        "title": "Suspicious File Creation in Uncommon Folder",
                        "desc": "Identified file creation in uncommon folder which is usually leveraged by adversary to drop malicious payload. The SOC team shared all the relevant information related to the cases for the action needed to be taken."
                    },
                    {
                        "title": "Targeted Attack Detection: Removal of Access to Common Administrative or Troubleshooting Tools",
                        "desc": "This behavior often indicates malicious intent or unauthorized system modification attempts. SOC team observed it was detected by analyzing the behavior of the process and shared all the information regarding the incidents for the required action."
                    },
                    {
                        "title": "Possible Spear Phishing Attack on High-profile User via Link",
                        "desc": "A suspicious URL associated with phishing attacks was detected in an email message sent to a high-profile user. The SOC team identified the sender emails and shared all the information regarding the incidents for the required action."
                    }
                ]
            },
            {
                "title": "Action Performed by SOC Team",
                "desc": "",
                "sub": [
                    {
                        "title": "Possible Spear Phishing Attack via Link",
                        "desc": "While investigating, the SOC team identified various URLs: [hxxps]:[/][/]wwwyoutube[.]com[/]watch?v=a7YQ5DEho1w, [hxxps]:[/][/]docs[.]google[.]com[/]forms[/]d[/]e[/]1FAIpQLScdOeUQR7wPm1WiV4oJOVBFOsLgmrbu22bRNBDPbJN0cBdZPw[/]viewform, http:[/][/]surl[.]li[/]jwktc*, http:[/][/]www[.]kotharimed[.]com. The SOC team shared the detailed investigation for the same."
                    },
                    {
                        "title": "Hacking Tool Detection – Blocked",
                        "desc": "While investigating, the SOC team identified various malware detections: HackTool[.]Win32[.]NeatDM[.]A, HackTool[.]Win32[.]MIMIKATZ[.]CNFK, HKTL_AMMYADMN, HackTool[.]Win64[.]PassView[.]C. The SOC team shared all the information regarding the incidents with the required action."
                    },
                    {
                        "title": "Suspicious File Creation in Uncommon Folder",
                        "desc": "The alert indicates that various suspicious files were created in an unusual location on the endpoint. The SOC team has shared all the relevant information related to the cases for action need to be taken."
                    },
                    {
                        "title": "Targeted Attack Detection: Removal of Access to Common Administrative or Troubleshooting Tools",
                        "desc": "The alert was triggered because someone or something disabled access to Task Manager, which is a common tool used for troubleshooting and managing tasks on a computer. SOC team observed that it was detected by analyzing the behavior of the process SmartClientSvc[.]exe, which was launched by another program called services.exe. The SOC team shared all the information regarding the incidents for the required action."
                    },
                    {
                        "title": "Possible Spear Phishing Attack on High-profile User via Link",
                        "desc": "While investigating, the SOC team identified the Sender: prathama_ghosal@XXX[.]com, dxlulevu@gmail[.]com, suketukothari@XXXX[.]com. The SOC team shared all the information regarding the incidents for the required action."
                    }
                ]
            },
            {
                "title": "Recommendations by SOC Team",
                "desc": "",
                "sub": [
                    {
                        "title": "Possible Spear Phishing Attack via Link",
                        "desc": "Preventing spear phishing attacks via links involves several strategies such as verifying the link without clicking, employing web proxies or web gateways, and ensuring regular updates and patches to mitigate the risks associated with clicking on suspicious links."
                    },
                    {
                        "title": "Hacking Tool Detection – Blocked",
                        "desc": "Implement access controls and strong authentication methods to prevent unauthorized access to sensitive systems. This includes deploying robust authentication mechanisms and continuously monitoring for any unauthorized access attempts."
                    },
                    {
                        "title": "Suspicious File Creation in Uncommon Folder",
                        "desc": "Implement file monitoring solutions to detect and alert on suspicious file activities in real-time. Regularly review and update security policies to restrict access to critical folders and files, thereby reducing the risk of unauthorized file creation and potential malware deployment."
                    },
                    {
                        "title": "Targeted Attack Detection: Removal of Access to Common Administrative or Troubleshooting Tools",
                        "desc": "Review and tighten access controls to common administrative and troubleshooting tools. Limit access to privileged accounts, regularly audit permissions, and implement multi-factor authentication (MFA) for accessing critical systems and applications to add an extra layer of security against targeted attacks."
                    },
                    {
                        "title": "Possible Spear Phishing Attack on High-profile User via Link",
                        "desc": "Preventing spear phishing attacks via links involves strategies like verifying the link without clicking, employing web proxies or web gateways, and ensuring regular updates and patches. These measures help mitigate the risks associated with clicking on suspicious links sent to high-profile users."
                    }
                ]
            },
            {
                "title": "Conclusion",
                "desc": "The MXDR SOCaaS provided comprehensive monitoring and incident response throughout the month of Month 202X. It has effectively mitigated various security incidents, safeguarding the organization's digital assets and infrastructure. The observations and recommendations in this report underline the importance of maintaining a proactive and adaptive cybersecurity strategy. For a detailed account of security incidents, resolutions, and performance metrics, please refer to the full MXDR SOCaaS monthly report for Month202X"
            }
        ]
    },
    "detailed_summary": {
        "id": "detailed_summary",
        "no_of_incidents": "0 Incidents",
        "date": "",
        "risk_index_chart": {
            "type": "doughnut",
            "label": "",
            "datasets": [
                {
                    "data": [
                        0,
                        100
                    ],
                    "backgroundColor": ["rgb(67, 71, 216)", "rgb(195, 195, 198)"]
                }
            ]
        },
        "risk_index_text": "The Risk Index is a comprehensive score based on the dynamic assessment of risk factors inclusive of exposure, attack risk, and security configurations risk.",
        "highly_exploitable": "",
        "incidents_closed": "",
        "top_incidents": [
            {
                "incident_name": "",
                "priority_impact": "",
                "data_source": ""
            }
        ],
        "license_consumption": true,
        "data_consumption": true,
        "license_consumption_text": "",
        "data_consumption_text": ""
    },
    "risk_metrics": {
        "id": "risk_metrics",
        "date": "",
        "last_risk_score": {
            "no_of_months": 3,
            "visible": true,
            "charts": [
                {
                    "type": "doughnut",
                    "month": "",
                    "datasets": [
                        {
                            "data": [
                                0,
                                100
                            ],
                            "backgroundColor": [
                                "rgb(67, 71, 216)",
                                "rgb(195, 195, 198)"
                            ]
                        }
                    ]
                },
                {
                    "type": "doughnut",
                    "month": "",
                    "datasets": [
                        {
                            "data": [
                                0,
                                100
                            ],
                            "backgroundColor": [
                                "rgb(67, 71, 216)",
                                "rgb(195, 195, 198)"
                            ]
                        }
                    ]
                },
                {
                    "type": "doughnut",
                    "month": "",
                    "datasets": [
                        {
                            "data": [
                                0,
                                100
                            ],
                            "backgroundColor": [
                                "rgb(67, 71, 216)",
                                "rgb(195, 195, 198)"
                            ]
                        }
                    ]
                }
            ]
        },
        "top_risk_incidents": {
            "visible": true,
            "indicators": [
                {
                    "type": "indicator",
                    "value": "Low",
                    "risk_name": ""
                },
                {
                    "type": "indicator",
                    "value": "Low",
                    "risk_name": ""
                },
                {
                    "type": "indicator",
                    "value": "Low",
                    "risk_name": ""
                }
            ]
        },
        "rsn": {
            "key": "",
            "data": [""]
        }
    },
    "threat_intel_summary": {
        "id": "threat_intel_summary",
        total_ioc_sweep: 0,
        "count_of_advisory_chart": {
            "type": "grouped_horizontal_bar",
            "key": [
                "IOC-Based Advisors (Ransomware/APT/Malware)",
                "Vulnerability Advisories"
            ],
            "datasets": [
                {
                    "label": "Count of Advisory",
                    "data": [
                        0,
                        0,
                    ],
                    "backgroundColor": "rgb(255, 130, 0)"
                },
            ]
        },
        "ioc_chart": {
            "type": "grouped_horizontal_bar",
            "key": [
                "IP",
                "URL",
                "DOMAIN",
                "HASH",
                "Sender Mail"
            ],
            "datasets": [
                {
                    "label": "No of Total IOCs",
                    "data": [
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "backgroundColor": "rgb(255, 130, 0)"
                },
                {
                    "label": "No of Matched IOCs",
                    "data": [
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "backgroundColor": "rgb(255, 176, 93)"
                }
            ]
        },
        "ioc_match_details": {
            "data": [
                {
                    "advisory_name": "",
                    "ioc_type": "",
                    "detail": "",
                    "endpoint_name": ""
                }
            ]
        },
        "ioc_investigation": {
            "data": [
                {
                    "advisory_name": "",
                    "about_advisory": "",
                    "investigation_summary": {
                        "incident_no": "",
                        "incident_overview": "",
                        "findings": "",
                        "action_taken": ""
                    }
                }
            ]
        },
        "rsn": {
            "key": "",
            "data": [""]
        }
    },
    "overall_incident_summary": {
        "id": "incidents_summary",
        "incidents_chart": {
            "type": "horizontal_bar",
            "key": [
                "Incidents Closed with Resolution",
                "Incidents Closed without Acknowledgement",
                "Pending Incidents with Customer",
                "Pending Incidents with SOC Team"
            ],
            "datasets": [
                {
                    "label": "No of Incidents",
                    "data": [
                        0,
                        0,
                        0,
                        0
                    ],
                    "backgroundColor": "rgb(255, 130, 0)"
                }
            ]
        },
        "p1": {
            "total_incidents": 0,
            "closed_with_resolution": 0,
            "closed_without_resolution": 0,
            "pending_with_customer": {
                "customer_name": "",
                "pending_incidents": 0
            },
            "pending_with_soc_team": 0
        },
        "p2": {
            "total_incidents": 0,
            "closed_with_resolution": 0,
            "closed_without_resolution": 0,
            "pending_with_customer": {
                "customer_name": "",
                "pending_incidents": 0
            },
            "pending_with_soc_team": 0
        },
        "p3": {
            "total_incidents": 0,
            "closed_with_resolution": 0,
            "closed_without_resolution": 0,
            "pending_with_customer": {
                "customer_name": "",
                "pending_incidents": 0
            },
            "pending_with_soc_team": 0
        },
        "p4": {
            "total_incidents": 0,
            "closed_with_resolution": 0,
            "closed_without_resolution": 0,
            "pending_with_customer": {
                "customer_name": "",
                "pending_incidents": 0
            },
            "pending_with_soc_team": 0
        }
    },
    "workbench_incident_summary": {
        "visible": true,
        "id": "workbench_incidents_summary",
        "p1": {
            "total_incidents": 0,
            "closed_with_resolution": 0,
            "closed_without_resolution": 0,
            "pending_with_customer": {
                "customer_name": "",
                "pending_incidents": 0
            },
            "pending_with_soc_team": 0
        },
        "p2": {
            "total_incidents": 0,
            "closed_with_resolution": 0,
            "closed_without_resolution": 0,
            "pending_with_customer": {
                "customer_name": "",
                "pending_incidents": 0
            },
            "pending_with_soc_team": 0
        },
        "p3": {
            "total_incidents": 0,
            "closed_with_resolution": 0,
            "closed_without_resolution": 0,
            "pending_with_customer": {
                "customer_name": "",
                "pending_incidents": 0
            },
            "pending_with_soc_team": 0
        },
        "p4": {
            "total_incidents": null,
            "closed_with_resolution": 0,
            "closed_without_resolution": 0,
            "pending_with_customer": {
                "customer_name": "",
                "pending_incidents": 0
            },
            "pending_with_soc_team": 0
        }
    },
    "siem_incident_summary": {
        "visible": true,
        "id": "third_party_siem_incidents_summary",
        "p1": {
            "total_incidents": 0,
            "closed_with_resolution": 0,
            "closed_without_resolution": 0,
            "pending_with_customer": {
                "customer_name": "",
                "pending_incidents": 0
            },
            "pending_with_soc_team": 0
        },
        "p2": {
            "total_incidents": 0,
            "closed_with_resolution": 0,
            "closed_without_resolution": 0,
            "pending_with_customer": {
                "customer_name": "",
                "pending_incidents": 0
            },
            "pending_with_soc_team": 0
        },
        "p3": {
            "total_incidents": 0,
            "closed_with_resolution": 0,
            "closed_without_resolution": 0,
            "pending_with_customer": {
                "customer_name": "",
                "pending_incidents": 0
            },
            "pending_with_soc_team": 0
        },
        "p4": {
            "total_incidents": 0,
            "closed_with_resolution": 0,
            "closed_without_resolution": 0,
            "pending_with_customer": {
                "customer_name": "",
                "pending_incidents": 0
            },
            "pending_with_soc_team": 0
        }
    },
    "high_incident_summary": {
        "id": "high_incidents_summary",
        "title": "High Incidents Summary",
        "data": [
            {
                "priority": "",
                "incident_title": "",
                "findings": {
                    "overview": "",
                    "endpoint_host_name": "",
                    "detected_by": "",
                    "action_performed": ""
                }
            },
        ]
    },
    "pending_incident_summary": {
        "id": "waiting_incidents_summary",
        "data": [
            {
                "incident_name": "",
                "priority": "",
                "no_of_occurrence": "",
                "severity": ""
            }
        ]
    },
    "slo_summary": {
        "id": "slo_summary",
        "slo_chart": {
            "type": "horizontal_bar",
            "key": [
                "Total Closed Incidents",
                "SLO Met",
                "SLO not Met"
            ],
            "datasets": [
                {
                    "label": "No of Incidents",
                    "data": [
                        0,
                        0,
                        0
                    ],
                    "backgroundColor": "rgb(255, 130, 0)"
                }
            ]
        },
        "slo_table": [
            {
                "priority": "P1",
                "description": "Incidents that have a severe impact on customer operations. This event is a concern, such as attack formations or potential breaches",
                "response_time": "01 Hour"
            },
            {
                "priority": "P2",
                "description": "Incidents that have a significant impact, or the potential to have a severe impact, on operations.",
                "response_time": "04 Hours"
            },
            {
                "priority": "P3",
                "description": "Incidents that have a minimal impact with the potential for escalate if not contained causing significant impact on operations.",
                "response_time": "24 Hours"
            },
            {
                "priority": "P4",
                "description": "Incidents that do not have direct impact on Customer operations but violates Customer security Baseline.",
                "response_time": "48 Hours"
            }
        ]
    },
    "detection_summary_apex_one": {
        "id": "detection_summary_from_apex_one",
        "detection_chart": {
            "type": "horizontal_bar",
            "key": [
                "File Cleaned (Virus/Malware + Spyware/Grayware)",
                "File Quarantine (Virus / Malware)",
                "Restart Action Required (Virus / Malware)",
                "File Deleted (Virus / Malware)"
            ],
            "datasets": [
                {
                    "label": "No of Detections",
                    "data": [
                        0,
                        0,
                        0,
                        0
                    ],
                    "backgroundColor": "rgb(255, 130, 0)"
                }
            ]
        },
        "attempts_blocked_chart": {
            "type": "horizontal_bar",
            "key": [
                "Total C & C connections Blocked",
                "Total Intrusion attempts Blocked"
            ],
            "datasets": [
                {
                    "label": "No of Blocked",
                    "data": [
                        0,
                        0
                    ],
                    "backgroundColor": "rgb(255, 130, 0)"
                }
            ]
        },
        "tables": {
            "table1": [
                {
                    "file_cleaned": "",
                    "file_quarantined": "",
                    "file_deleted": ""
                },
            ],
            "table2": [
                {
                    "connection_endpoint": {
                        "endpoint": "",
                        "blocked": 0
                    },
                    "attempts_blocked": {
                        "endpoint": "",
                        "blocked": 0
                    }
                },
            ]
        }
    },
    "email_quarantine_summary_cas": {
        "id": "email_quarantine_summary_from_cas",
        "visible": true,
        "status_chart": {
            "type": "herizontal_bar",
            "key": [
                "Quarantined",
                "Delete Success"
            ],
            "datasets": [
                {
                    "label": "Status",
                    "data": [
                        0,
                        0
                    ],
                    "backgroundColor": "rgb(255, 130, 0)"
                }
            ]
        },
        "sender_receipts": {
            "sender": "",
            "receipt": ""
        },
        "threat_type": {
            "malicious_files": 0,
            "malicious_urls": 0,
            "phishing": 0,
            "spoofing": 0,
            "suspicious_objects": 0,
            "blocked_objects": 0
        },
        "rsn": {
            "key": "",
            "data": [""]
        }
    },
    "vulnerability_assessment_report": {
        "id": "vulnerability_assessment_report",
        "internal_assets": {
            "vulnerable_endpoint": 0,
            "highly_exploitable_cve": 0,
            "devices_with_windows_legacy": 0,
            "average_unpatched_time": 0,
            "mttp": 0,
            "highly_exploitable_unique_cve": 0
        },
        "internet_facing_assets": {
            "unique_cve": 0,
            "vulnerable_host": 0,
            "cve_density": 0
        },
        "rsn": {
            "key": "",
            "data": [""]
        }
    },
    "system_configuration_report": {
        "id": "system_configuration_report",
        "accounts_with_weak_auth": 0,
        "account_attack_surface_risk": 0,
        "accounts_with_excessive_privilege": 0,
        "legacy_auth_logon_activity": 0,
        "unexpected_internet_facing_serve_port": {
            "service_port": 0,
            "affected_ip": 0
        },
        "host_with_insecure_connection": {
            "insecure_connection": 0,
            "total": 0
        },
        "rsn": {
            "key": "",
            "data": [""]
        }
    },
    "top_vulnerabilities_detected": {
        "id": "top_vulnerabilities_detected",
        "impact_chart": {
            "type": "grouped_horizontal_bar",
            "key": [
                "CVE-2021-44228",
            ],
            "datasets": [
                {
                    "label": "CVE impact score",
                    "data": [
                        0,
                    ],
                    "backgroundColor": "rgb(255, 130, 0)"
                },
                {
                    "label": "Impact scope",
                    "data": [
                        0,
                    ],
                    "backgroundColor": "rgb(251, 214, 92)"
                }
            ]
        },
        "rsn": {
            "key": "",
            "data": [""]
        }
    },
    "top_risk_device": {
        "id": "top_risk_devices",
        "visible": true,
        "risk_score_chart": {
            "type": "horizontal_bar",
            "key": [
                "matoda_XX",
            ],
            "datasets": [
                {
                    "label": "Latest risk score",
                    "data": [
                        0,
                    ],
                    "backgroundColor": "rgb(255, 130, 0)"
                }
            ]
        },
        "rsn": {
            "key": "",
            "data": [""]
        }
    },
    "top_risk_users": {
        "id": "top_risk_users",
        "visible": true,
        "risk_score_chart": {
            "type": "horizontal_bar",
            "key": [
                "ASHWIN XXXXX",
            ],
            "datasets": [
                {
                    "label": "Latest risk score",
                    "data": [
                        0,
                    ],
                    "backgroundColor": "rgb(255, 130, 0)"
                }
            ]
        },
        "rsn": {
            "key": "",
            "data": [""]
        }
    },
    "account_compromise_events": {
        "id": "account_compromise_events",
        "risk_event_table": [
            {
                "risk_event": "",
                "data_source": "",
                "asset": "",
                "event_risk": ""
            },
        ],
        "rsn": {
            "key": "",
            "data": [""]
        }
    },
    "product_assessment_report": {
        "id": "product_assessment_report",
        "tm_products_summary": [
            {
                "tm_product": "",
                "connection_status": "",
                "identifier": ""
            }
        ],
        "integration_summary": [
            {
                "product": "",
                "status": "",
                "product_quantity_sow": 0,
                "id_log_status": "",
                "data_consumption": ""
            }
        ]
    },
    "endpoint_feature_compliance": {
        "id": "endpoint_feature_compliance",
        "compliance_chart": {
            "type": "horizontal_bar",
            "key": [
                "XDR Endpoint Sensor Not Enabled",
                "Vulnerability Protection not Enabled",
                "XDR Endpoint Sensor, Vulnerability Protection Enabled"
            ],
            "datasets": [
                {
                    "label": "",
                    "data": [
                        0,
                        0,
                        0
                    ],
                    "backgroundColor": "rgb(255, 130, 0)"
                }
            ]
        },
        "rsn": {
            "key": "",
            "data": [""]
        }
    },
    "key_feature_adoption_apex_one": {
        "id": "key_feature_adoption_apex_one",
        "visible": true,
        "apex_one_chart": {
            "type": "grouped_horizontal_bar",
            "key": [
                "Vulnerability Protection",
            ],
            "datasets": [
                {
                    "label": "Total",
                    "data": [
                        6552,
                    ],
                    "backgroundColor": "rgb(255, 130, 0)"
                },
                {
                    "label": "Count",
                    "data": [
                        0,
                    ],
                    "backgroundColor": "rgb(255, 204, 148)"
                }
            ]
        },
        "rsn": {
            "key": "",
            "data": [""]
        }
    },
    "key_feature_adoption_server_workload": {
        "id": "key_feature_adoption_server_workload",
        "visible": true,
        "workload_security_chart": {
            "type": "grouped_horizontal_bar",
            "key": [
                "Anti-malware",
            ],
            "datasets": [
                {
                    "label": "Total",
                    "data": [
                        0,
                    ],
                    "backgroundColor": "rgb(255, 130, 0)"
                },
                {
                    "label": "Count",
                    "data": [
                        0,
                    ],
                    "backgroundColor": "rgb(255, 204, 148)"
                }
            ]
        },
        "rsn": {
            "key": "",
            "data": [""]
        }
    },
    "key_feature_adoption_deep_security": {
        "id": "key_feature_adoption_apex_one",
        "visible": true,
        "deep_security_chart": {
            "type": "grouped_horizontal_bar",
            "key": [
                "Vulnerability Protection",
            ],
            "datasets": [
                {
                    "label": "Total endpoints",
                    "data": [
                        6552,
                    ],
                    "backgroundColor": "rgb(255, 130, 0)"
                },
                {
                    "label": "Feature enabled",
                    "data": [
                        0,
                    ],
                    "backgroundColor": "rgb(255, 204, 148)"
                }
            ]
        },
        "rsn": {
            "key": "",
            "data": [""]
        }
    },
    "agent_versions_summary": {
        "id": "agent_versions_summary",
        "agent_version_chart": {
            "visible": true,
            "type": "pie",
            "key": [
                "OS not supported (Server + Endpoint)",
                "Agent End of Life (Server + Endpoint)",
                "OS and agent incompatible (Server + Endpoint)",
                "Older supported version (Server + Endpoint)",
                "Up-to-date version (Server + Endpoint)",
                "All versions (Server + Endpoint)",
            ],
            "datasets": [
                {
                    "data": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "backgroundColor": [
                        "rgb(255, 247, 231)",
                        "rgb(250, 219, 187)",
                        "rgb(250, 203, 153)",
                        "rgb(252, 174, 90)",
                        "rgb(250, 143, 29)",
                        "rgb(255, 130, 0)",
                    ]
                }
            ]
        },
        "server_workload_protection_chart": {
            "visible": true,
            "title": "Server & Workload Protection",
            "type": "horizontal_bar",
            "key": [
                "OS not supported",
                "Agent end-of-life",
                "OS and agent incompatible",
                "Older supported version",
                "Up-to-date version",
                "All versions",
            ],
            "datasets": [
                {
                    "label": "",
                    "data": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "backgroundColor": "rgb(255, 130, 0)"
                }
            ]
        },
        "standard_endpoint_protection_chart": {
            "visible": true,
            "title": "Standard Endpoint Protection",
            "type": "horizontal_bar",
            "key": [
                "OS not supported",
                "Agent end-of-life",
                "OS and agent incompatible",
                "Older supported version",
                "Up-to-date version",
                "All versions",
            ],
            "datasets": [
                {
                    "label": "",
                    "data": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "backgroundColor": "rgb(255, 130, 0)"
                }
            ]
        },
        "rsn": {
            "key": "",
            "data": [""]
        }
    }
}