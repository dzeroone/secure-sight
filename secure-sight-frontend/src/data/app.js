export const ROLES = {
  ADMIN: 'admin',
  LEVEL3: 'l3',
  LEVEL2: 'l2',
  LEVEL1: 'l1',
}

export const ROLE_NAMES = Object.fromEntries(Object.entries(ROLES).map(([k, v]) => [v, k]))

export const REPORT_AUDIT_STATUS = {
  AUDIT: -1,
  SUBMITTED: 0,
  PENDING: 1,
  APPROVED: 2
}