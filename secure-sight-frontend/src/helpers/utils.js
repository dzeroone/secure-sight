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
      return 'REAUDIT';
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
  document.title = `${title} | Eventus Reporting`;
}