import { merge } from "lodash";

const ROLES = {
  'admin': "Admin",
  'l1': "Level 1",
  'l2': "Level 2",
  'l3': "Level 3"
}

export const getRoleTitle = (role) => {
  return ROLES[role] || role
}

export const pluralize = (count, noun, suffix = 's') =>
  `${count} ${noun}${count > 1 ? suffix : ''}`;

export const getAssignmentStatusTitle = (status) => {
  switch (status) {
    case -1:
      return 'REASSIGN';
    case 0:
      return 'SUBMITTED';
    case 1:
      return 'PENDING APPROVAL';
    case 2:
      return 'APPROVED';
    default:
      return '';
  }
}

export const getErrorMessage = (e) => {
  if (e?.response?.data?.message) {
    return e.response.data.message
  }
  return e.message
}

export const setDocumentTitle = (title) => {
  document.title = `${title} | Report Automation`;
}

export const isOrgEmail = (email) => {
  return email.substring(email.indexOf('@')+1) == process.env.REACT_APP_ORG_DOMAIN
}

export const loadState = (key) => {
  const strState = localStorage.getItem(key)
  if(!strState) return {}
  return merge(JSON.parse(strState), {
    Updates: {
      fetching: false
    }
  })
}

export const saveState = (key, data) => {
  return localStorage.setItem(key, JSON.stringify(data))
}