const ROLES = {
  'admin': "Admin",
  'l1': "Level 1",
  'l2': "Level 2",
  'l3': "Level 3"
}

export const getRoleTitle = (role) => {
  return ROLES[role] || role
}