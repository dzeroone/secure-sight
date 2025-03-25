import express, { Request, Response } from 'express'
import axios from 'axios';
import { ELASTIC_INDICES, ROLES } from '../constant';
import { auth } from '../utils/auth-util';
import assignmentController from '../controllers/assignment.controller';
const router = express.Router();

const esUrl = process.env.ELASTIC_BASE || "http://localhost:9200";
const eUrl = `${esUrl}/_cat/indices?v&pretty=true`

router.post("/data/", async (req, res) => {
  try {
    let response;
    const test = req.body.test;
    switch (test) {
      case "filtering":
        response = await axios.post(`${esUrl}/${req.body.index}/_search?size=10000`, {
          query: {
            bool: {
              filter: {
                terms: {
                  accountID: req.body.id,
                }
              }
            }
          }
        });
        break;
      default:
        response = await axios.get(`${esUrl}/${req.body.index}/_search?size=10000`);
        break;
    }
    res.json(response.data);

  } catch (error) {
    res.json(error);
  }

});

router.post("/data/search",
  auth,
  async (req, res) => {
    try {
      const dataToSend: any = {
        isLastReporter: false
      }
      if (req.user?.role == ROLES.LEVEL2 || req.user?.role == ROLES.LEVEL1) {
        const assessment = await assignmentController.getAssignmentByIndexForReporter(req.body.index, req.user._id)
        if (!assessment) {
          const err = new Error()
          err.message = "Assignment not found"
          throw err
        }
        // check if he assgined this report to anyother
        const assignmentAsAssginee = await assignmentController.getAssignmentByIndexForAssignee(req.body.index, req.user._id)
        if (!assignmentAsAssginee)
          dataToSend.isLastReporter = true
      }
      // alu
      // const response = [
      //   {
      //     "_index": "january_2025_pfm_report",
      //     "_type": "_doc",
      //     "_id": "DGCgz5QBYrGf0uY4u3ut",
      //     "_score": 1,
      //     "_ignored": ["Detailed Summary.Risk Index.Description.keyword"],
      //     "_source": {
      //       "Email Summary": {
      //         "Email_Status": {
      //           "Email Status": {
      //             "Quarantined": 20,
      //             "Deleted": 30
      //           },
      //           "chart_type": "horizontal_bar",
      //           "label": "Status",
      //           "background_color": "rgb(255,130,0)"
      //         },
      //         "Top 03 Sender and Receipts": {
      //           "Top 3 Senders": [],
      //           "Top 3 Receipts": []
      //         },
      //         "Threat Type": {
      //           "Malicious Files": 10,
      //           "Malicious URLs": 20,
      //           "Phishing": 30,
      //           "Spoofing": 40,
      //           "Suspicious Object": 50,
      //           "Blocked Object": 60
      //         }
      //       },
      //       "Overall Incidents Summary": {
      //         "Status Summary": {
      //           "Incidents Closed with Resolution": 0,
      //           "Incidents Closed without Acknowledgement": 0,
      //           "Pending Incidents with SOC Team": 0
      //         },
      //         "Overall Incidents Summary": {
      //           "P1": {
      //             "Incidents Closed with Resolution": 0,
      //             "Incidents Closed without Acknowledgement": 0,
      //             "Pending Incidents with SOC Team": 0
      //           },
      //           "P2": {
      //             "Incidents Closed with Resolution": 0,
      //             "Incidents Closed without Acknowledgement": 0,
      //             "Pending Incidents with SOC Team": 0
      //           },
      //           "P3": {
      //             "Incidents Closed with Resolution": 0,
      //             "Incidents Closed without Acknowledgement": 0,
      //             "Pending Incidents with SOC Team": 0
      //           },
      //           "P4": {
      //             "Incidents Closed with Resolution": 0,
      //             "Incidents Closed without Acknowledgement": 0,
      //             "Pending Incidents with SOC Team": 0
      //           }
      //         },
      //         "chart_type": "horizontal_bar",
      //         "label": "No of Incidents",
      //         "background_color": "rgb(255,130,0)"
      //       },
      //       "Detection Summary from A1": {
      //         "Detection Summary form Apex One": {
      //           "Virus/Malware & Spyware/Grayware": {
      //             "File Cleaned (Virus/Malware + Spyware/Grayware)": 10,
      //             "File Quarantine (Virus / Malware)": 30,
      //             "Restart Action Required (Virus / Malware)": 20,
      //             "File Deleted (Virus / Malware)": 40,
      //             "chart_type": "horizontal_bar",
      //             "label": "No of Detections",
      //             "background_color": "rgb(255,130,0)"
      //           },
      //           "C & C Connections & Intrusion attempts Blocked": {
      //             "Total C & C Connections Blocked": 10,
      //             "Total Intrusion Attempts Blocked": 20,
      //             "chart_type": "horizontal_bar",
      //             "label": "No of Blocked",
      //             "background_color": "rgb(255,130,0)"
      //           }
      //         },
      //         "Top 03 Endpoints": {
      //           "File Cleaned/Spyware": ["NA", "NA", "NA"],
      //           "File Cleaned/Malware": ["NA", "NA", "NA"],
      //           "File Qurantined(Malware)": ["NA", "NA", "NA"],
      //           "File Deleted": ["NA", "NA", "NA"],
      //           "C & C Connection Blocked": ["NA", "NA", "NA"],
      //           "Intrusion Attempts Blocked": ["NA", "NA", "NA"]
      //         }
      //       },
      //       "Detailed Summary": {
      //         "Total No of Incidents": {
      //           "Total Incidents": 317,
      //           "Month & Year": "1/2025"
      //         },
      //         "Risk Index": {
      //           "Score": 47,
      //           "Description": "The Risk Index is a comprehensive score based on the dynamic assessment of risk factors inclusive of exposure, attack risk, and security configurations risk. You can take company-wide remediation steps and preventive measures to lower the company-wide risk index over time.",
      //           "chart_type": "doughnut",
      //           "background_color": ["rgb(67,71,216)", "rgb(195,195,198)"]
      //         },
      //         "No of Highly Exploitable Unique CVEs": 1662,
      //         "No of Incidents Closed without acknowledgement": 0,
      //         "Top incidents": [
      //           {
      //             "Incident Names with no of Occurrence": "Multiple Failed Logons via Windows Event - 239",
      //             "Priority - Impact": "P4 - Low",
      //             "Data Source": "SAE"
      //           },
      //           {
      //             "Incident Names with no of Occurrence": "Attempt of Disabling Antivirus Software - 12",
      //             "Priority - Impact": "P3 - Medium",
      //             "Data Source": "SAE"
      //           },
      //           {
      //             "Incident Names with no of Occurrence": "Windows Logon Failed Attempt from Private IP - 8",
      //             "Priority - Impact": "P4 - Low",
      //             "Data Source": "SAE"
      //           },
      //           {
      //             "Incident Names with no of Occurrence": "Hacking Tool Detection - Blocked - 7",
      //             "Priority - Impact": "P4 - Low",
      //             "Data Source": "SAE"
      //           },
      //           {
      //             "Incident Names with no of Occurrence": "[Heuristic Attribute] Possible Remote Services Behavior - 6",
      //             "Priority - Impact": "P4 - Low",
      //             "Data Source": "SAE"
      //           },
      //           {
      //             "No of Incidents": 272
      //           }
      //         ]
      //       },
      //       "Executive Summary": {
      //         "Incident Overview by SOC Team": [
      //           {
      //             "No of Incidents": 239,
      //             "Name of Incident": "Multiple Failed Logons via Windows Event",
      //             "Description": "Detects multiple occurrence of failed logons via Windows Event"
      //           },
      //           {
      //             "No of Incidents": 12,
      //             "Name of Incident": "Attempt of Disabling Antivirus Software",
      //             "Description": "An attempt to disable antivirus software was detected."
      //           },
      //           {
      //             "No of Incidents": 8,
      //             "Name of Incident": "Windows Logon Failed Attempt from Private IP",
      //             "Description": "Detects windows events with logon attempt failure which might indicate brute force attempt."
      //           },
      //           {
      //             "No of Incidents": 7,
      //             "Name of Incident": "Hacking Tool Detection - Blocked",
      //             "Description": "A hacking tool, which is generally used for cracking computer and network security or by system administrators to test security, was detected and blocked on an endpoint."
      //           },
      //           {
      //             "No of Incidents": 6,
      //             "Name of Incident": "[Heuristic Attribute] Possible Remote Services Behavior",
      //             "Description": "Detects possible Remote Services behavior technique."
      //           }
      //         ],
      //         "Action Performed by SOC Team": [
      //           {
      //             "No of Incidents": 239,
      //             "Name of Incident": "Multiple Failed Logons via Windows Event",
      //             "Action Performed": ""
      //           },
      //           {
      //             "No of Incidents": 12,
      //             "Name of Incident": "Attempt of Disabling Antivirus Software",
      //             "Action Performed": ""
      //           },
      //           {
      //             "No of Incidents": 8,
      //             "Name of Incident": "Windows Logon Failed Attempt from Private IP",
      //             "Action Performed": ""
      //           },
      //           {
      //             "No of Incidents": 7,
      //             "Name of Incident": "Hacking Tool Detection - Blocked",
      //             "Action Performed": ""
      //           },
      //           {
      //             "No of Incidents": 6,
      //             "Name of Incident": "[Heuristic Attribute] Possible Remote Services Behavior",
      //             "Action Performed": ""
      //           }
      //         ],
      //         "Recommendations by SOC Team": [
      //           {
      //             "No of Incidents": 239,
      //             "Name of Incident": "Multiple Failed Logons via Windows Event",
      //             "Recommendations": ""
      //           },
      //           {
      //             "No of Incidents": 12,
      //             "Name of Incident": "Attempt of Disabling Antivirus Software",
      //             "Recommendations": ""
      //           },
      //           {
      //             "No of Incidents": 8,
      //             "Name of Incident": "Windows Logon Failed Attempt from Private IP",
      //             "Recommendations": ""
      //           },
      //           {
      //             "No of Incidents": 7,
      //             "Name of Incident": "Hacking Tool Detection - Blocked",
      //             "Recommendations": ""
      //           },
      //           {
      //             "No of Incidents": 6,
      //             "Name of Incident": "[Heuristic Attribute] Possible Remote Services Behavior",
      //             "Recommendations": ""
      //           }
      //         ]
      //       },
      //       "Vulnerability Assessment Report": {
      //         "Internal Assets": {
      //           "Vulnerable Endpoint Percentage": "75",
      //           "Highly-Exploitable CVE Density": "34",
      //           "Devices with Legacy Windows Systems": "88",
      //           "Average Unpatched Time": "29",
      //           "Mean Time to Patch (MTTP)": "18",
      //           "Highly-Exploitable Unique CVEs": "1662"
      //         }
      //       },
      //       "Critical High Incidents Summary": {
      //         "Critical/High Incidents Summary": []
      //       },
      //       "System Configuration Report": {
      //         "System Configuration Report": {
      //           "Accounts with Weak Authentication": "331",
      //           "Accounts that Increase Attack Surface Risk": "644",
      //           "Accounts with Excessive Privilege": "1",
      //           "Hosts with Insecure Connection Issues": "6"
      //         }
      //       },
      //       "Agent Version Summary": {
      //         "All Agents Version Summary": {
      //           "Total (Endpoint + Server)": 2046,
      //           "Latest Version (Endpoint + Server)": 16,
      //           "Older Version (Endpoint + Server)": 2004,
      //           "End-of-Life version (Endpoint + Server)": 26
      //         },
      //         "chart_type": "pie",
      //         "label": [
      //           " Total (Workload + Apex)",
      //           " Latest version (Workload + Apex) as a Service",
      //           " Outdated version (Workload + Apex) as a Service"
      //         ],
      //         "background_color": [
      //           "rgb(255,130,0)",
      //           "rgb(255,204,148)",
      //           "rgb(255,162,64)"
      //         ]
      //       },
      //       "SLO Summary": {
      //         "SLO Summary": {
      //           "Total No of Incidents Closed": 10,
      //           "SLO Met": 20,
      //           "SLO Not Met": 30
      //         },
      //         "chart_type": "horizontal_bar",
      //         "label": "No of Incidents",
      //         "background_color": "rgb(255,130,0)"
      //       },
      //       "SIEM Incidents Summary": {
      //         "SIEM Incidents Summary": {
      //           "P1": {
      //             "Incidents Closed with Resolution": 0,
      //             "Incidents Closed without Acknowledgement": 0,
      //             "Pending Incidents with SOC Team": 0
      //           },
      //           "P2": {
      //             "Incidents Closed with Resolution": 0,
      //             "Incidents Closed without Acknowledgement": 0,
      //             "Pending Incidents with SOC Team": 0
      //           },
      //           "P3": {
      //             "Incidents Closed with Resolution": 0,
      //             "Incidents Closed without Acknowledgement": 0,
      //             "Pending Incidents with SOC Team": 0
      //           },
      //           "P4": {
      //             "Incidents Closed with Resolution": 0,
      //             "Incidents Closed without Acknowledgement": 0,
      //             "Pending Incidents with SOC Team": 0
      //           }
      //         }
      //       },
      //       "Pending Incidents Summary": {
      //         "Pending Incidents Summary": []
      //       },
      //       "Risk Matrics": {
      //         "Last Three Month Risk Score": {
      //           "November": "NA",
      //           "December": 36,
      //           "January": "47"
      //         },
      //         "chart_type": "doughnut",
      //         "background_color": ["rgb(67,71,216)", "rgb(195,195,198)"]
      //       },
      //       "Key Feature Adoption Rate of C1": {
      //         "Key Feature Adoption Rate of C1": [
      //           {
      //             "Feature Name": "Intrusion Prevention System (IPS)",
      //             "Total": "0",
      //             "Count": "0",
      //             "Rate": "NA"
      //           },
      //           {
      //             "Feature Name": "Anti-malware",
      //             "Total": "0",
      //             "Count": "0",
      //             "Rate": "NA"
      //           },
      //           {
      //             "Feature Name": "Web Reputation",
      //             "Total": "0",
      //             "Count": "0",
      //             "Rate": "NA"
      //           },
      //           {
      //             "Feature Name": "Behavior Monitoring",
      //             "Total": "0",
      //             "Count": "0",
      //             "Rate": "NA"
      //           },
      //           {
      //             "Feature Name": "Predictive Machine Learning",
      //             "Total": "0",
      //             "Count": "0",
      //             "Rate": "NA"
      //           },
      //           {
      //             "Feature Name": "Smart Feedback",
      //             "Total": "0",
      //             "Count": "0",
      //             "Rate": "NA"
      //           },
      //           {
      //             "Feature Name": "Firewall",
      //             "Total": "0",
      //             "Count": "0",
      //             "Rate": "NA"
      //           },
      //           {
      //             "Feature Name": "Agent Self-Protection",
      //             "Total": "0",
      //             "Count": "0",
      //             "Rate": "NA"
      //           },
      //           {
      //             "Feature Name": "File Integrity Monitoring (FIM)",
      //             "Total": "0",
      //             "Count": "0",
      //             "Rate": "NA"
      //           },
      //           {
      //             "Feature Name": "Log Inspection",
      //             "Total": "0",
      //             "Count": "0",
      //             "Rate": "NA"
      //           },
      //           {
      //             "Feature Name": "Device Control",
      //             "Total": "NA",
      //             "Count": "NA",
      //             "Rate": "NA"
      //           },
      //           {
      //             "Feature Name": "Application Control",
      //             "Total": "0",
      //             "Count": "0",
      //             "Rate": "NA"
      //           }
      //         ],
      //         "chart_type": "horizontal_bar",
      //         "label": ["Total", "Count", "Rate"],
      //         "background_color": [
      //           "rgb(255,130,0)",
      //           "rgb(251,214,92)",
      //           "rgb(9,12,155)"
      //         ]
      //       },
      //       "Top Risk Device": {
      //         "Top Risk Device": [
      //           {
      //             "Device Name": "weur-dt-mail-v1",
      //             "Risk Score": 83
      //           },
      //           {
      //             "Device Name": "CLEARQAWUS2DOCDISTRO",
      //             "Risk Score": 83
      //           },
      //           {
      //             "Device Name": "weur-ua-wsi-v1",
      //             "Risk Score": 80
      //           },
      //           {
      //             "Device Name": "weur-dt-ez-v1",
      //             "Risk Score": 80
      //           },
      //           {
      //             "Device Name": "linux-agent12",
      //             "Risk Score": 79
      //           },
      //           {
      //             "Device Name": "linux-agent3",
      //             "Risk Score": 79
      //           },
      //           {
      //             "Device Name": "linux-agent16",
      //             "Risk Score": 79
      //           },
      //           {
      //             "Device Name": "mum-qa-ctma-v1",
      //             "Risk Score": 79
      //           },
      //           {
      //             "Device Name": "linux-agent5",
      //             "Risk Score": 79
      //           },
      //           {
      //             "Device Name": "linux-agent11",
      //             "Risk Score": 79
      //           }
      //         ],
      //         "chart_type": "horizontal_bar",
      //         "background_color": "rgb(255,130,0)"
      //       },
      //       "Top Risk Users": {
      //         "Top Risk Users": [],
      //         "chart_type": "horizontal_bar",
      //         "background_color": "rgb(255,130,0)"
      //       },
      //       "Product Assessment Report": {
      //         "TM Products Summary": [
      //           {
      //             "TM Product": "Vision One",
      //             "Connection Status": "Connected"
      //           },
      //           {
      //             "TM Product": "Cloud One",
      //             "Connection Status": "Not Connected"
      //           },
      //           {
      //             "TM Product": "Apex Central",
      //             "Connection Status": ""
      //           },
      //           {
      //             "TM Product": "Cloud App security",
      //             "Connection Status": ""
      //           }
      //         ],
      //         "Third Party Products Summary": []
      //       },
      //       "Account Compromise Events": {
      //         "Account Compromise Events": []
      //       },
      //       "Endpoint Feature Compliance": {
      //         "Endpoint Feature Compliance": {
      //           "XDR Endpoint Sensor Not Enabled": 7,
      //           "Vulnerability Protection not Enabled": 15,
      //           "XDR Endpoint Sensor, Vulnerability Protection Enabled": 22
      //         },
      //         "chart_type": "hroizontal_bar",
      //         "background_color": "rgb(255,130,0)"
      //       },
      //       "Component Versions": {
      //         "WorkLoad Protection": {
      //           "Older": 4,
      //           "Latest": 4,
      //           "End of Life": 0
      //         },
      //         "Standard Endpoint Protection": {
      //           "Older": 35,
      //           "Latest": 22,
      //           "End of Life": 0
      //         }
      //       },
      //       "V1 Workbench Incidents Summary": {
      //         "V1 Workbench Incidents Summary": {
      //           "P1": {
      //             "Incidents Closed with Resolution": 0,
      //             "Incidents Closed without Acknowledgement": 0,
      //             "Pending Incidents from Customer": 0,
      //             "Pending Incidents with SOC Team": 0
      //           },
      //           "P2": {
      //             "Incidents Closed with Resolution": 0,
      //             "Incidents Closed without Acknowledgement": 0,
      //             "Pending Incidents from Customer": 0,
      //             "Pending Incidents with SOC Team": 0
      //           },
      //           "P3": {
      //             "Incidents Closed with Resolution": 0,
      //             "Incidents Closed without Acknowledgement": 0,
      //             "Pending Incidents from Customer": 5,
      //             "Pending Incidents with SOC Team": 1
      //           },
      //           "P4": {
      //             "Incidents Closed with Resolution": 0,
      //             "Incidents Closed without Acknowledgement": 0,
      //             "Pending Incidents from Customer": 6,
      //             "Pending Incidents with SOC Team": 1
      //           }
      //         }
      //       },
      //       "Key Feature Adoption Rate of A1": {
      //         "Key Feature Adoption Rate of A1": [
      //           {
      //             "Feature Name": "Vulnerability Protection",
      //             "Total": 26,
      //             "Count": 23,
      //             "Rate": 88.5
      //           },
      //           {
      //             "Feature Name": "Anti-Malware Scans",
      //             "Total": 23,
      //             "Count": 22,
      //             "Rate": 95.7
      //           },
      //           {
      //             "Feature Name": "Web Reputation",
      //             "Total": 17,
      //             "Count": 16,
      //             "Rate": 94.1
      //           },
      //           {
      //             "Feature Name": "Behavior Monitoring",
      //             "Total": 18,
      //             "Count": 16,
      //             "Rate": 88.9
      //           },
      //           {
      //             "Feature Name": "Predictive Machine Learning",
      //             "Total": 17,
      //             "Count": 16,
      //             "Rate": 94.1
      //           },
      //           {
      //             "Feature Name": "Smart Feedback",
      //             "Total": 17,
      //             "Count": 15,
      //             "Rate": 88.2
      //           },
      //           {
      //             "Feature Name": "Firewall",
      //             "Total": 18,
      //             "Count": 0,
      //             "Rate": 0
      //           },
      //           {
      //             "Feature Name": "Suspicious Connection Service",
      //             "Total": 26,
      //             "Count": 23,
      //             "Rate": 88.5
      //           },
      //           {
      //             "Feature Name": "Device Control",
      //             "Total": 21,
      //             "Count": 3,
      //             "Rate": 14.3
      //           },
      //           {
      //             "Feature Name": "Application Control",
      //             "Total": 18,
      //             "Count": 16,
      //             "Rate": 88.9
      //           }
      //         ],
      //         "chart_type": "horizontal_bar",
      //         "label": ["Total", "Count", "Rate"],
      //         "background_color": [
      //           "rgb(255,130,0)",
      //           "rgb(251,214,92)",
      //           "rgb(9,12,155)"
      //         ]
      //       },
      //       "Top Vulnerability Detected": {
      //         "Top Vulnerabilities Detected": [
      //           {
      //             "CVE": "CVE-2024-9680",
      //             "CVE impact score": 9.8
      //           },
      //           {
      //             "CVE": "CVE-2023-4863",
      //             "CVE impact score": 8.8
      //           },
      //           {
      //             "CVE": "CVE-2023-5217",
      //             "CVE impact score": 8.8
      //           },
      //           {
      //             "CVE": "CVE-2024-49039",
      //             "CVE impact score": 8.8
      //           },
      //           {
      //             "CVE": "CVE-2024-43573",
      //             "CVE impact score": 8.1
      //           },
      //           {
      //             "CVE": "CVE-2024-49138",
      //             "CVE impact score": 7.8
      //           },
      //           {
      //             "CVE": "CVE-2023-38831",
      //             "CVE impact score": 7.8
      //           },
      //           {
      //             "CVE": "CVE-2024-43572",
      //             "CVE impact score": 7.8
      //           },
      //           {
      //             "CVE": "CVE-2023-44487",
      //             "CVE impact score": 7.5
      //           },
      //           {
      //             "CVE": "CVE-2024-43451",
      //             "CVE impact score": 6.5
      //           }
      //         ],
      //         "chart_type": "horizontal_bar",
      //         "label": ["CVE impact scort", "Imapact scope"],
      //         "background_color": ["rgb(255,130,0)", "rgb(251,214,92)"]
      //       }
      //     }
      //   }
      //   // {
      //   //   "_index": "pfm_27_january_report",
      //   //   _source: { "TABLE_OF_CONTENTS": { "date": { "TABLE_OF_CONTENTS": [{ "title": "Executive Summary", "page_no": 1 }, { "title": "Threat Intel Summary", "page_no": 3 }, { "title": "Indicators of Compromise (IOC) Match Summary", "page_no": 3 }, { "title": "Incident Summary by Severity", "page_no": 4 }, { "title": "Incident Summary by Status", "page_no": 4 }, { "title": "Incidents Summary by Priority", "page_no": 5 }, { "title": "Top 10 Incidents Summary by Category", "page_no": 5 }, { "title": "Pending Incident Summary", "page_no": 6 }, { "title": "SLO Summary", "page_no": 7 }, { "title": "Endpoint Inventory", "page_no": 8 }, { "title": "Connected Products and License Information", "page_no": 8 }, { "title": "Key feature adoption rate of Apex One", "page_no": 9 }, { "title": "Key feature adoption rate of Cloud One Workload Security", "page_no": 10 }], "blank": 1 } }, "SLO_SUMMARY": { "date": { "SLO_SUMMARY": { "graph": { "Key": ["Total Closed Incidents", "SLO Met", "SLO Not Met"], "data": [18, 16, 2], "label": "Case volume", "backgroundColor": "#ff8200", "chart_type": "vertical_bar" }, "SLO_Details": [{ "Priority": 1, "Description": "Incidents that have a severe impact on customer operations. This event is a concern, such as attack formations or potential breaches.", "Response_Time": "" }, { "Priority": 2, "Description": "Incidents that have a significant impact, or the potential to have a severe impact, on operations.", "Response_Time": "" }, { "Priority": 3, "Description": "Incidents that have a minimal impact with the potential for escalation if not contained, causing significant impact on operations.", "Response_Time": "" }, { "Priority": 4, "Description": "Incidents that do not have a direct impact on customer operations but violate the customer security baseline.", "Response_Time": "" }] }, "blank": 0 } }, "PENDING_INCIDENTS_SUMMARY": { "date": { "PENDING_INCIDENTS_SUMMARY": { "T_P_Incidents": "1", "P_I_F_Customer": "", "P_Incidents_from_SOC": "1", "Pie_chart": { "data": ["1", "", "1"], "backgroundColor": ["#ff8200", "#ffa950", "#ffd9b2"], "label": ["Total Pending Incidents", "Pending Incidents from Customer", "Pending Incidents from SOC Team"], "chart_type": "doughnut" }, "R_S_N_P_I_S": { "key": "notes", "data": [] } }, "blank": 0 } }, "Key_feature_adoption_rate_of_Cw": { "date": { "Key_feature_adoption_rate_of_Cw": { "graph": { "Key": ["-", "Anti-malware Scans", "Web Reputation", "Behavior Monitoring", "Predictive Machine Learning", "Smart Feedback", "Firewall", "Suspicious Connection Service"], "data": [{ "label": "Total", "data": ["0", "0", "0", "0", "0", "0", ""], "backgroundColor": "#ff8200" }, { "label": "Count", "data": ["0", "0", "0", "0", "0", "0", ""], "backgroundColor": "#696969" }], "chart_type": "horizontal_bar" }, "R_S_N_key_cl": { "key": "summary", "data": [] } }, "blank": 0, "title": "Cw" } }, "ENDPOINT_INVENTORY": { "date": { "ENDPOINT_INVENTORY": { "Bar_graph": { "Key": ["XDR feature enabled", "XDR feature not enabled", "Action Required"], "data": ["", "", "2"], "label": "Info", "backgroundColor": "#ff8200", "chart_type": "vertical_bar" }, "R_S_N_E_V": { "key": "recommendation", "data": [] }, "CP_and_LI": { "License_Information": [{ "Status": "", "Product": "TM Cloud One" }, { "Status": "", "Product": "TM Vision One" }, { "Status": "", "Product": "TM Deep Security" }], "Products_Connected": [{ "Status": "Not Connected", "Product": "TM Cloud One" }, { "Status": "Connected", "Product": "TM Vision One" }, { "Status": "", "Product": "TM Deep Security" }] } }, "blank": 0 } }, "THREAT_INTEL_SUMMARY": { "date": { "THREAT_INTEL_SUMMARY": { "Indicators_of_Compromise_IOC": { "Key": ["IP", "URL", "Hash", "Domain", "Email"], "data": [{ "label": "IOC Sweeped", "data": [], "backgroundColor": "#e67700" }, { "label": "IOC Matched", "data": [], "backgroundColor": "#696969" }], "chart_type": "vertical_bar" }, "R_S_N_Ioc": { "key": "notes", "data": [] }, "Matched_IOCs_Detailed_Summary": [], "Incident_Summary_by_Severity": { "data": [0, 0, 2, 17], "label": ["Critical", "High", "Medium", "Low"], "backgroundColor": ["#ff8200", "#ffa950", "#ffd9b2", "#ffc0cb"], "chart_type": "doughnut" }, "R_S_N_ISBS": { "key": "notes", "data": [] }, "Incident_Summary_by_status": { "data": [18, 0], "label": ["Closed Incidents", "Pending Incidents"], "backgroundColor": ["#ff8200", "#ffa950"], "chart_type": "doughnut" }, "R_S_N_ISB_Status": { "key": "summary", "data": [] }, "Incidents_Summary_by_Priority": { "Key": ["P1", "P2", "P3", "P4"], "data": [{ "label": "Closed", "data": [0, 0, 1, 17], "backgroundColor": "#ffcd9a" }, { "label": "Pending from SOC", "data": [0, 0, 0, 0], "backgroundColor": "#ffc0cb" }, { "label": "Pending from Customer", "data": [], "backgroundColor": "#ffa07a" }], "chart_type": "vertical_bar" }, "R_S_N_ISBP": { "key": "recommendation", "data": [] }, "T10IS_by_Category": { "Key": ["Suspicious Multiple Failed Logons via Windows Event", "[Heuristic Attribute] Possible Remote Services Behavior", "Windows Logon Failed Attempt from Private IP", "Network Sniffing", "Possible Disabling of Antivirus Software"], "data": [{ "label": "Closed", "data": [7, 5, 4, 1, 1], "backgroundColor": "#ffd9b2" }, { "label": "Pending from SOC", "data": [0, 0, 0, 0, 0], "backgroundColor": "#ffa950" }, { "label": "Pending from Customer", "data": [], "backgroundColor": "#ffa950" }], "chart_type": "horizontal_bar" }, "R_S_N_T10IS": { "key": "notes", "data": [] } }, "blank": 0 } }, "WEEKLY_REPORT": { "client_name": "PFM", "start_date": "2025-01-20T00:00:00", "end_date": "2025-01-27T00:00:00", "blank": 0 }, "EXECUTIVE_SUMMARY": { "date": { "EXECUTIVE_SUMMARY": { "total_incidents": { "total_incidents": "19", "start_date": "2025-01-20", "end_date": "2025-01-27" }, "risk_index": { "chart": { "data": [49, 51], "backgroundColor": ["rgb(255, 130, 0)", "rgb(105, 105, 105)"], "label": [], "chart_type": "doughnut" } }, "highly_exploitable": 1521, "Incident_Closed": 18, "Highest_incidient": 7, "Highest_incidient_date": "2025-01-20", "top_incident": { "no_incidents": 5, "table": [{ "incident_name": "Multiple Failed Logons via Windows Event - 7", "source": "SAE" }, { "incident_name": "[Heuristic Attribute] Possible Remote Services Behavior - 5", "source": "SAE" }, { "incident_name": "Windows Logon Failed Attempt from Private IP - 4", "source": "SAE" }, { "incident_name": "Attempt of Disabling Antivirus Software - 1", "source": "SAE" }, { "incident_name": "Network Sniffing - 1", "source": "SAE" }] }, "agent_life_cycle": { "apex_chart": { "title": "apex_one", "data": [], "backgroundColor": ["rgb(255, 130, 0)", "rgb(105, 105, 105)", "rgb(90, 90, 0)"], "label": ["Latest Version", "Older Version", "End of Life"], "chart_type": "pie" }, "workload_chart": { "title": "workload_security", "data": [], "backgroundColor": ["rgb(255, 130, 0)", "rgb(105, 105, 105)", "rgb(90, 90, 0)"], "label": ["Latest Version", "Older Version", "End of Life"], "chart_type": "pie" }, "R_S_N": { "key": "summary", "data": [] } }, "top_endpoint": { "no_endpoint": 0, "top_incident_table": [], "action": "" }, "endpoint_protection": { "data": [12, 12], "label": [], "key": "Agents Deployed" }, "endpoint_sensor": { "data": [9, 9], "label": [], "key": "Sensors Enabled" }, "R_S_N": { "key": "summary", "data": [] } }, "blank": 0 } }, "Key_feature_adoption_rate_of_Ap": { "date": { "Key_feature_adoption_rate_of_Ap": { "graph": { "Key": ["-", "Anti-malware Scans", "Web Reputation", "Behavior Monitoring", "Predictive Machine Learning", "Smart Feedback", "Firewall", "Suspicious Connection Service"], "data": [{ "label": "Total", "data": ["12", "10", "8", "10", "10", "8", "12"], "backgroundColor": "#ff8200" }, { "label": "Count", "data": ["11", "9", "7", "9", "9", "0", "12"], "backgroundColor": "#696969" }], "chart_type": "horizontal_bar" }, "R_S_N_key_ap": { "key": "summary", "data": [] } }, "blank": 0, "title": "ap" } } }
      //   // }
      // ]
      const test = req.body.test;
      let response = null
      switch (test) {
        case "filtering":
          response = await axios.post(`${esUrl}/${req.body.index}/_search?size=10000`, {
            query: {
              bool: {
                filter: {
                  terms: {
                    accountID: req.body.id,
                  }
                }
              }
            }
          });
          break;
        default:
          response = await axios.get(`${esUrl}/${req.body.index}/_search?size=10000`);
          break;
      }
      dataToSend.data = response
      res.json(dataToSend);

    } catch (error: any) {
      res.status(error.status || 400).json(error);
    }
  }
);

router.get("/list", async (req, res) => {
  try {
    let response;
    response = await axios.get(`${eUrl}`);
    const CSVToJSON = (csv: any) => {
      const lines = csv.split('\n');
      const keys = lines[0].split(',');
      return lines.slice(1).map((line: any) => {
        return line.split(',').reduce((acc: any, cur: any, i: any) => {
          const toAdd: any = {};
          toAdd[keys[i]] = cur;
          return { ...acc, ...toAdd };
        }, {});
      });
    };

    res.json(response.data);
  } catch (error) {
    res.json(error);
  }
});

router.post("/dataSource", async (req, res) => {
  try {
    // alu
    // return res.send([
    //   'a',
    //   'b'
    // ])
    // end alu
    let response;
    response = await axios.get(`${eUrl}`);

    console.log(response.data)
    const indicesData = response.data;
    const indicesList: string[] = indicesData.split('\n')
      .filter((line: string) => line.trim())
      .map((line: string) => line.split(/\s+/)[2])
      .filter((index: string) => (!index.startsWith('.') && !index.startsWith('read-me') && !index.startsWith('index')));
    res.json(indicesList);
  } catch (error) {
    res.json(error);
  }
});

router.post("/cveSearch", async (req, res) => {
  try {
    let cve = await axios.post(`${esUrl}/${req.body.index1}/_search?size=10000`);
    const cveList = cve.data.hits.hits.map((a: any) => {
      return a['_source']
    })
    var keys: any = [];
    let key
    var results = [];
    for (var i = 0; i < cveList.length; i++) {
      for (key in cveList[i]) {
        if (Array.isArray(cveList[i][key])) {
          if (cveList[i][key].indexOf(req.body.cve) != -1) {
            results.push(cveList[i]);
          }
        }
      }
    }
    (results).map((name) => {
      for (var key in name) {
        keys.push(key);
      }
      return name.keys
    });
    const rule_id = results
    let assignedRuleIds = await axios.post(`${esUrl}/${req.body.index2}/_search?size=10000`, {
      query: {
        bool: {
          filter: {
            terms: {
              assigned_rule_ids: keys,
            }
          }
        }
      }
    });
    let unAssignedRuleIds = await axios.post(`${esUrl}/${req.body.index2}/_search?size=10000`, {
      query: {
        bool: {
          filter: {
            terms: {
              recommended_to_assign_rule_ids: keys,
            }
          }
        }
      }
    });
    const ips = assignedRuleIds.data.hits.hits.concat(unAssignedRuleIds.data.hits.hits)
    const ip = ips.map((a: any) => { return a['_source'].comp_id })
    let computer = await axios.post(`${esUrl}/${req.body.index3}/_search?size=10000`, {
      query: {
        bool: {
          filter: {
            terms: {
              id: ip
            }
          }
        }
      }
    });
    const computers = computer.data.hits.hits
    const data = { rule_id, ips, computers }
    res.json(data);
  } catch (error) {
    res.json(error);
  }
});

router.delete("/index", async (req, res) => {
  try {
    let data = await axios.post(`${esUrl}/${req.body.index}/_delete_by_query`, {
      query: {
        match: {
          _index: req.body.index
        }
      }
    });
    res.json(data.data);

  } catch (error) {
    res.json(error);
  }
});

router.get('/monthly-report-form', async (req, res) => {
  const page = Number(req.query.page) || 1
  try {
    const result = await axios.get(`${esUrl}/${ELASTIC_INDICES.MONTHLY_REPORT_FORM}/_search`, {
      data: {
        from: (page - 1) * 20,
        size: 20,
        query: req.query.search ? {
          multi_match: {
            query: req.query.search,
            fields: ["monthly_report.doc_title", "monthly_report.client_name", "monthly_report.customer_name", "monthly_report.date"],
          },
        } : undefined,
        _source: ["savedAt", "monthly_report"],
        sort: [
          { "savedAt": { "order": "desc", "format": "strict_date_optional_time_nanos" } }
        ]
      }
    });
    res.json({
      count: result.data.hits.total.value,
      data: result.data.hits.hits
    });

  } catch (e: any) {
    // console.log(e.response.data)
    res.status(400).json(e);
  }
})

router.post('/monthly-report-form',
  auth,
  async (req, res) => {
    try {
      const result = await axios.post(`${esUrl}/${ELASTIC_INDICES.MONTHLY_REPORT_FORM}/_doc`, {
        savedAt: new Date().toISOString(),
        ...req.body
      });
      res.json(result.data);

    } catch (e: any) {
      console.log(e.response)
      res.status(400).json(e);
    }
  }
)

router.get('/monthly-report-form/:id', async (req, res) => {
  try {
    const result = await axios.get(`${esUrl}/${ELASTIC_INDICES.MONTHLY_REPORT_FORM}/_doc/${req.params.id}`, {
      params: {
        _source_excludes: 'savedAt'
      }
    });
    res.json(result.data);
  } catch (e: any) {
    console.log(e.response.data)
    res.status(404).json(e);
  }
})

router.patch('/monthly-report-form/:id', async (req, res) => {
  try {
    const result = await axios.post(`${esUrl}/${ELASTIC_INDICES.MONTHLY_REPORT_FORM}/_update/${req.params.id}`, {
      "doc": {
        savedAt: new Date().toISOString(),
        ...req.body
      }
    });
    res.json(result.data);

  } catch (e) {
    res.status(400).json(e);
  }
})

router.delete('/monthly-report-form/:id', async (req, res) => {
  try {
    const result = await axios.delete(`${esUrl}/${ELASTIC_INDICES.MONTHLY_REPORT_FORM}/_doc/${req.params.id}`);
    res.json(result.data);
  } catch (e: any) {
    console.log(e.response.data)
    res.status(404).json(e);
  }
})

// weekly report
router.get('/weekly-report-form', async (req, res) => {
  const page = Number(req.query.page) || 1
  try {
    const result = await axios.get(`${esUrl}/${ELASTIC_INDICES.WEEKLY_REPORT_FORM}/_search`, {
      data: {
        from: (page - 1) * 20,
        size: 20,
        query: req.query.search ? {
          multi_match: {
            query: req.query.search,
            fields: ["formData.client.clientName", "WEEKLY_REPORT.start_date", "WEEKLY_REPORT.end_date"],
          },
        } : undefined,
        _source: ["savedAt", "formData.client.clientName", "reportData.WEEKLY_REPORT.start_date", "reportData.WEEKLY_REPORT.end_date"],
        sort: [
          { "savedAt": { "order": "desc", "format": "strict_date_optional_time_nanos" } }
        ]
      }
    });
    res.json({
      count: result.data.hits.total.value,
      data: result.data.hits.hits
    });

  } catch (e: any) {
    // console.log(e.response.data, e.response.data.error)
    res.status(400).json(e);
  }
})

router.post('/weekly-report-form', async (req, res) => {
  try {
    const result = await axios.post(`${esUrl}/${ELASTIC_INDICES.WEEKLY_REPORT_FORM}/_doc`, {
      savedAt: new Date().toISOString(),
      ...req.body
    });
    res.json(result.data);

  } catch (e: any) {
    console.log(e.response)
    res.status(400).json(e);
  }
})

router.get('/weekly-report-form/:id', async (req, res) => {
  try {
    const result = await axios.get(`${esUrl}/${ELASTIC_INDICES.WEEKLY_REPORT_FORM}/_doc/${req.params.id}`, {
      params: {
        _source_excludes: 'savedAt'
      }
    });
    res.json(result.data);
  } catch (e: any) {
    console.log(e.response.data)
    res.status(404).json(e);
  }
})

router.patch('/weekly-report-form/:id', async (req, res) => {
  try {
    const result = await axios.post(`${esUrl}/${ELASTIC_INDICES.WEEKLY_REPORT_FORM}/_update/${req.params.id}`, {
      "doc": {
        savedAt: new Date().toISOString(),
        ...req.body
      }
    });
    res.json(result.data);

  } catch (e) {
    res.status(400).json(e);
  }
})

router.delete('/weekly-report-form/:id', async (req, res) => {
  try {
    const result = await axios.delete(`${esUrl}/${ELASTIC_INDICES.WEEKLY_REPORT_FORM}/_doc/${req.params.id}`);
    res.json(result.data);
  } catch (e: any) {
    console.log(e.response.data)
    res.status(404).json(e);
  }
})
// - end weekly report

export default router;

// case "sorting":
//   response = await axios.post(`${esUrl}/${req.params.index}/_search`, {
//     sort: {
//       createdAt: "desc",
//     },
//   });
//   break;

// case "matching":
//     response = await axios.post(`${esUrl}/${req.params.index}/_search?size=500`, {
//         query: {
//             match: {
//                 _accountID: req.query.id,
//             },
//         },
//     });
//     break;
// case "multi-matching":
//   response = await axios.post(`${esUrl}/${req.body.index}/_search`, {
//     query: {
//       bool: {
//         must: [
//           {
//             match: {
//               name: "Anastacio Stamm",
//             },
//           },
//           {
//             match: {
//               country: "Samoa",
//             },
//           },
//         ],
//       },
//     },
//   });
//   break;

router.post("/create-index", async (req, res) => {
  try {
    const checkIndexExist = () =>
      new Promise((resolve) => {
        axios
          .get(`${esUrl}/${req.body.index}`)
          .then((_) => {
            resolve(true);
          })
          .catch(() => {
            resolve(false);
          });
      });

    const ifIndexExist = await checkIndexExist();
    if (!ifIndexExist) {
      const esResponse = await axios.put(`${esUrl}/${req.body.index}`, {
        mappings: {
          properties: {
            name: {
              type: "text",
            },
            email: {
              type: "text",
              fields: {
                raw: {
                  type: "keyword",
                },
              },
            },
            country: {
              type: "text",
            },
            age: {
              type: "integer",
            },
            company: {
              type: "text",
            },
            jobRole: {
              type: "text",
            },
            description: {
              type: "text",
            },
            createdAt: {
              type: "date",
              fields: {
                raw: {
                  type: "keyword",
                },
              },
            },
          },
        },
      });
      res.json(esResponse.data);
    } else {
      res.json("Index exist already");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// import express, { Request, Response } from 'express';
// import axios from 'axios';

// const router = express.Router();

// // Elasticsearch configuration
// const esUrl = 'http://localhost:9200/';
// const eUrl = 'http://localhost:9200/_cat/indices?v&pretty=true';

// // Basic Authentication configuration
// const auth = {
//   username: 'elastic',
//   password: 'EP0VJl52'
// };

// // Endpoint to retrieve list of indices
// router.get('/list', async (req: Request, res: Response) => {
//   try {
//     const response = await axios.get(eUrl, { auth });
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error fetching indices:', error);
//     res.status(500).json({ error: 'Failed to fetch indices.' });
//   }
// });

// // Endpoint to fetch indices based on specific conditions
// router.post('/dataSource', async (req: Request, res: Response) => {
//   try {
//     const response = await axios.get(eUrl, { auth });
//     const indicesData = response.data;

//     const indicesList: string[] = indicesData
//       .split('\n')
//       .filter((line: string) => line.trim())
//       .map((line: string) => line.split(/\s+/)[2])
//       .filter(
//         (index: string) =>
//           !index.startsWith('.') &&
//           !index.startsWith('read-me') &&
//           !index.startsWith('index')
//       );

//     res.json(indicesList);
//   } catch (error) {
//     console.error('Error fetching data source:', error);
//     res.status(500).json({ error: 'Failed to fetch data source.' });
//   }
// });

// // Endpoint to search data with filtering
// router.post('/data/', async (req: Request, res: Response) => {
//   try {
//     let response;
//     const test = req.body.test;

//     switch (test) {
//       case 'filtering':
//         response = await axios.post(
//           `${esUrl}/${req.body.index}/_search?size=10000`,
//           {
//             query: {
//               bool: {
//                 filter: {
//                   terms: {
//                     accountID: req.body.id
//                   }
//                 }
//               }
//             }
//           },
//           { auth }
//         );
//         break;
//       default:
//         response = await axios.get(
//           `${esUrl}/${req.body.index}/_search?size=10000`,
//           { auth }
//         );
//         break;
//     }
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error during data fetch:', error);
//     res.status(500).json({ error: 'Failed to fetch data.' });
//   }
// });

// // Endpoint to search specific data
// router.post('/data/search', async (req: Request, res: Response) => {
//   try {
//     let response;
//     const test = req.body.test;

//     switch (test) {
//       case 'filtering':
//         response = await axios.post(
//           `${esUrl}/${req.body.index}/_search?size=10000`,
//           {
//             query: {
//               bool: {
//                 filter: {
//                   terms: {
//                     accountID: req.body.id
//                   }
//                 }
//               }
//             }
//           },
//           { auth }
//         );
//         break;
//       default:
//         response = await axios.get(
//           `${esUrl}/${req.body.index}/_search?size=10000`,
//           { auth }
//         );
//         break;
//     }
//     res.json(response.data.hits.hits);
//   } catch (error) {
//     console.error('Error during search:', error);
//     res.status(500).json({ error: 'Search failed.' });
//   }
// });

// // Endpoint to create an index
// router.post('/create-index', async (req: Request, res: Response) => {
//   try {
//     const checkIndexExist = async () => {
//       try {
//         await axios.get(`${esUrl}/${req.body.index}`, { auth });
//         return true;
//       } catch {
//         return false;
//       }
//     };

//     const ifIndexExist = await checkIndexExist();
//     if (!ifIndexExist) {
//       const esResponse = await axios.put(
//         `${esUrl}/${req.body.index}`,
//         {
//           mappings: {
//             properties: {
//               name: { type: 'text' },
//               email: { type: 'text', fields: { raw: { type: 'keyword' } } },
//               country: { type: 'text' },
//               age: { type: 'integer' },
//               company: { type: 'text' },
//               jobRole: { type: 'text' },
//               description: { type: 'text' },
//               createdAt: { type: 'date', fields: { raw: { type: 'keyword' } } }
//             }
//           }
//         },
//         { auth }
//       );
//       res.json(esResponse.data);
//     } else {
//       res.json('Index already exists');
//     }
//   } catch (error) {
//     console.error('Error creating index:', error);
//     res.status(500).json({ error: 'Failed to create index.' });
//   }
// });

// // Additional endpoint examples (if needed)
// router.delete('/index', async (req: Request, res: Response) => {
//   try {
//     let data = await axios.post(
//       `${esUrl}/${req.body.index}/_delete_by_query`,
//       {
//         query: {
//           match: {
//             _index: req.body.index
//           }
//         }
//       },
//       { auth }
//     );
//     res.json(data.data);
//   } catch (error) {
//     console.error('Error deleting index:', error);
//     res.status(500).json({ error: 'Failed to delete index.' });
//   }
// });

// export default router;
// // import express, { Request, Response } from 'express';
// // import axios from 'axios';

// // const router = express.Router();

// // // Elasticsearch configuration
// // const esUrl = 'http://localhost:9200/';
// // const eUrl = 'http://localhost:9200/_cat/indices?v&pretty=true';

// // // Basic Authentication configuration
// // const auth = {
// //   username: 'elastic',
// //   password: '5GJYxWwr'
// // };

// // // Endpoint to retrieve list of all indices
// // router.get('/list', async (req: Request, res: Response) => {
// //   try {
// //     const response = await axios.get(eUrl, { auth });
// //     const indicesData = response.data;

// //     // Process response to parse index names and other details
// //     const indices = indicesData
// //       .split('\n')
// //       .filter((line: string) => line.trim())
// //       .map((line: string) => {
// //         const [health, status, index, uuid, pri, rep, docsCount, docsDeleted, storeSize, priStoreSize, dataSize] = line.split(/\s+/);
// //         return {
// //           health,
// //           status,
// //           index,
// //           uuid,
// //           pri: Number(pri),
// //           rep: Number(rep),
// //           docsCount: Number(docsCount),
// //           docsDeleted: Number(docsDeleted),
// //           storeSize,
// //           priStoreSize,
// //           dataSize,
// //         };
// //       });

// //     res.json(indices);
// //   } catch (error) {
// //     console.error('Error fetching indices:', error);
// //     res.status(500).json({ error: 'Failed to fetch indices.' });
// //   }
// // });

// // // Endpoint to fetch indices based on specific conditions
// // router.post('/dataSource', async (req: Request, res: Response) => {
// //   try {
// //     const response = await axios.get(eUrl, { auth });
// //     const indicesData = response.data;

// //     const indicesList: string[] = indicesData
// //       .split('\n')
// //       .filter((line: string) => line.trim())
// //       .map((line: string) => line.split(/\s+/)[2])
// //       .filter(
// //         (index: string) =>
// //           !index.startsWith('.') &&
// //           !index.startsWith('read-me') &&
// //           !index.startsWith('index')
// //       );

// //     res.json(indicesList);
// //   } catch (error) {
// //     console.error('Error fetching data source:', error);
// //     res.status(500).json({ error: 'Failed to fetch data source.' });
// //   }
// // });

// // // Endpoint to search data with filtering
// // router.post('/data/', async (req: Request, res: Response) => {
// //   try {
// //     let response;
// //     const test = req.body.test;

// //     switch (test) {
// //       case 'filtering':
// //         response = await axios.post(
// //           `${esUrl}/${req.body.index}/_search?size=10000`,
// //           {
// //             query: {
// //               bool: {
// //                 filter: {
// //                   terms: {
// //                     accountID: req.body.id
// //                   }
// //                 }
// //               }
// //             }
// //           },
// //           { auth }
// //         );
// //         break;
// //       default:
// //         response = await axios.get(
// //           `${esUrl}/${req.body.index}/_search?size=10000`,
// //           { auth }
// //         );
// //         break;
// //     }
// //     res.json(response.data);
// //   } catch (error) {
// //     console.error('Error during data fetch:', error);
// //     res.status(500).json({ error: 'Failed to fetch data.' });
// //   }
// // });

// // // Endpoint to search specific data
// // router.post('/data/search', async (req: Request, res: Response) => {
// //   try {
// //     let response;
// //     const test = req.body.test;

// //     switch (test) {
// //       case 'filtering':
// //         response = await axios.post(
// //           `${esUrl}/${req.body.index}/_search?size=10000`,
// //           {
// //             query: {
// //               bool: {
// //                 filter: {
// //                   terms: {
// //                     accountID: req.body.id
// //                   }
// //                 }
// //               }
// //             }
// //           },
// //           { auth }
// //         );
// //         break;
// //       default:
// //         response = await axios.get(
// //           `${esUrl}/${req.body.index}/_search?size=10000`,
// //           { auth }
// //         );
// //         break;
// //     }
// //     res.json(response.data.hits.hits);
// //   } catch (error) {
// //     console.error('Error during search:', error);
// //     res.status(500).json({ error: 'Search failed.' });
// //   }
// // });

// // // Endpoint to create an index
// // router.post('/create-index', async (req: Request, res: Response) => {
// //   try {
// //     const checkIndexExist = async () => {
// //       try {
// //         await axios.get(`${esUrl}/${req.body.index}`, { auth });
// //         return true;
// //       } catch {
// //         return false;
// //       }
// //     };

// //     const ifIndexExist = await checkIndexExist();
// //     if (!ifIndexExist) {
// //       const esResponse = await axios.put(
// //         `${esUrl}/${req.body.index}`,
// //         {
// //           mappings: {
// //             properties: {
// //               name: { type: 'text' },
// //               email: { type: 'text', fields: { raw: { type: 'keyword' } } },
// //               country: { type: 'text' },
// //               age: { type: 'integer' },
// //               company: { type: 'text' },
// //               jobRole: { type: 'text' },
// //               description: { type: 'text' },
// //               createdAt: { type: 'date', fields: { raw: { type: 'keyword' } } }
// //             }
// //           }
// //         },
// //         { auth }
// //       );
// //       res.json(esResponse.data);
// //     } else {
// //       res.json('Index already exists');
// //     }
// //   } catch (error) {
// //     console.error('Error creating index:', error);
// //     res.status(500).json({ error: 'Failed to create index.' });
// //   }
// // });

// // // Endpoint to delete all documents in an index
// // router.delete('/index', async (req: Request, res: Response) => {
// //   try {
// //     let data = await axios.post(
// //       `${esUrl}/${req.body.index}/_delete_by_query`,
// //       {
// //         query: {
// //           match_all: {}
// //         }
// //       },
// //       { auth }
// //     );
// //     res.json(data.data);
// //   } catch (error) {
// //     console.error('Error deleting index:', error);
// //     res.status(500).json({ error: 'Failed to delete index.' });
// //   }
// // });

// // export default router;
