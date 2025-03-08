import path from "path"

export const COLLECTIONS = {
    USERS: "users",
    CUSTOMERS: "customers",
    TENANT: "tenant",
    CONNECTOR: "connector",
    DASHBOARD: "dashboard",
    REPORT: "report",
    USERCONNECTOR: "userconnector",
    SCHEDULER: 'scheduler',
    LICENSE: 'license',
    CONNECTOR_CONFIG: 'connectorconfig'
}

export const AUTH = {
    USER_EXIST: "User Already Exist",
    INVALID_PASSWORD: "Invalid password!",
    WARNING_1: "Invalid Password!",
    WARNING_2: "Email not found!"
}

export const ROLES = {
    ROLE1: "master_admin",
    ROLE2: "tenant_admin",
    ROLE3: "user",
    ADMIN: "admin",
    LEVEL1: "l1",
    LEVEL2: "l2",
    LEVEL3: "l3",
}

export const MASTER_ADMIN_DB = "secure-sight"

export const ELASTIC_INDICES = {
    MONTHLY_REPORT_FORM: 'monthly-report-form',
    WEEKLY_REPORT_FORM: 'weekly-report-form',
}

export const DIRS = {
    CONNECTOR_UPLOAD_DIR: path.resolve(
        process.cwd(),
        `../secure-sight-scheduler/server`,
    )
}