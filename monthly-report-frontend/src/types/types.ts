export type RsnType = {
    key: string,
    data: string[];
}

export type FirstPageType = {
    doc_title: string;
    client_name: string;
    date: string;
    customer_name: string;
}

export type TOCItem = {
    title: string;
    page_no: string;
    link: string;
}

export type POSItem = {
    incident_name: string;
    priority: string;
    no_of_occurrence: string;
    severity: string;
}

export type POSItemWithIndex = {
    index: number,
    data: POSItem
}

export type TableOfContentsType = {
    index: number,
    data: TOCItem;
}

export type NestedObject<T> = { [key: string]: T | NestedObject<T> }

export type VulnerabilityAssessmentReportType = {
    id: string,
    internal_assets: {
        vulnerable_endpoint: number,
        highly_exploitable_cve: number,
        devices_with_windows_legacy: number,
        average_unpatched_time: number,
        mttp: number,
        highly_exploitable_unique_cve: number
    },
    internet_facing_assets: {
        unique_cve: number,
        vulnerable_host: number,
        cve_density: number
    },
    notes: RecommendationNote[]
}

export type SystemConfigurationReportType = {
    id: string,
    accounts_with_weak_auth: number,
    account_attack_surface_risk: number,
    accounts_with_excessive_privilege: number,
    legacy_auth_logon_activity: number,
    unexpected_internet_facing_serve_port: {
        service_port: number,
        affected_ip: number
    },
    host_with_insecure_connection: {
        insecure_connection: number,
        total: number

    },
    notes: RecommendationNote[]
}

export type RiskEvenItem = {
    risk_event: string,
    data_source: string,
    asset: string,
    event_risk: string
}

export type AccountCompromiseEventsType = {
    id: string,
    risk_event_table: RiskEvenItem[],
    rsn: RsnType
}

export type AboutSubData = {
    title: string,
    desc: string
}

export type AboutReportData = {
    title: string,
    desc: string,
    sub?: AboutSubData[]
}

export type AboutChartData = {
    data: number[],
    label: string[],
    backgroundColor: string[],
}

export type AboutChart = {
    type: string,
    datasets: AboutChartData[],
}

export type AboutThisReport = {
    id: string,
    date: string,
    data: AboutReportData[],
    chart: AboutChart
}

export type ESSubData = {
    title: string,
    desc: string,
}

export type ESReportData = {
    title: string,
    desc: string,
    sub?: ESSubData[]
}

export type ExecutiveSummary = {
    id: string,
    date: string,
    data: ESReportData[]
}

export type DSDataset = {
    data: number[],
    backgroundColor: string[]
}

export type DSRiskIndexChart = {
    type: string,
    label: string,
    datasets: DSDataset[]
}

export type DSTopIncident = {
    incident_name: string,
    priority_impact: string,
    data_source: string
}

export type DetailedSummary = {
    id: string,
    no_of_incidents: string,
    date: string,
    risk_index_chart: DSRiskIndexChart,
    highly_exploitable: string,
    incidents_closed: string,
    top_incidents: DSTopIncident[],
    license_consumption: boolean,
    data_consumption: boolean
}

export type RSN = {
    key: string,
    data: string[],
}

export type TISDataset = {
    label: string,
    data: number[],
    backgroundColor: string,
}

export type TISIOCChart = {
    type: string,
    key: string[],
    datasets: TISDataset[],
}

export type TISIOCMatchDetail = {
    advisory_name: string,
    ioc_type: string,
    detail: string,
    endpoint_name: string,
}

export type TISInvestigationSummary = {
    incident_no: string,
    incident_overview: string,
    findings: string,
    action_taken: string,
}

export type TISIOCInvestigation = {
    advisory_name: string,
    about_advisory: string,
    investigation_summary: TISInvestigationSummary,
}

export type TISThreatIntelSummary = {
    id: string,
    ioc_chart: TISIOCChart,
    ioc_match_details: {
        data: TISIOCMatchDetail[],
    };
    ioc_investigation: {
        data: TISIOCInvestigation[],
    };
    rsn: RSN,
}

export type DSAOTableEntry = {
    name?: string,
    file_cleaned?: string,
    file_quarantined?: string,
    file_deleted?: string,
    connection_endpoint?: { endpoint: string, blocked: number },
    attempts_blocked?: { endpoint: string, blocked: number },
}

export type EmailThreatType = {
    malicious_files: number,
    malicious_urls: number,
    phishing: number,
    spoofing: number,
    suspicious_objects: number,
    blocked_objects: number,
}

export type ACERiskEvent = {
    risk_event: string,
    data_source: string,
    asset: string,
    event_risk: string,
}

export type SLOTableType = {
    priority: string,
    description: string,
    response_time: string
}

export type DSAOTableType = {
    name: string,
    file_cleaned: string,
    file_quarantined: string,
    file_deleted: string
}

export type TMProductSummary = {
    tm_product: string,
    connection_status: string,
    identifier: string,
}

export type IntegrationSummary = {
    product: string,
    status: string,
    product_quantity_sow: number,
    id_log_status: string,
    data_consumption: string,
}

export type AVSChartData = {
    type: string,
    key: string[],
    datasets: {
        data: number[],
        backgroundColor: string[],
        label?: string,
    }[];
}

export type AgentVersionsSummary = {
    id: string,
    agent_version_chart: AVSChartData,
    server_workload_protection_chart: AVSChartData,
    standard_endpoint_protection_chart: AVSChartData,
}

export type RiskIndicatorType = {
    type: string;
    value: "Low" | "High" | "Medium";
    risk_name: string;
}

export type RecommendationNote = {
    key: string;
    data: string[];
}