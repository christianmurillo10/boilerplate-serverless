export const rolesSubsets = {
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  name: true,
  description: true
};

export const usersSubsets = {
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  last_login_at: true,
  name: true,
  username: true,
  email: true,
  password: true,
  image_path: true,
  role_id: true,
  is_active: true,
  is_role_based_access: true,
  is_logged: true
};

export const customersSubsets = {
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  verified_at: true,
  last_login_at: true,
  customer_no: true,
  firstname: true,
  middlename: true,
  lastname: true,
  email: true,
  password: true,
  contact_no: true,
  primary_address: true,
  secondary_address: true,
  image_path: true,
  gender_type: true,
  status: true,
  is_active: true,
  is_logged: true
};

export const rbacModulesSubsets = {
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  name: true,
  icon: true,
  path: true,
  order_display: true,
  permissions: true,
  parent_id: true,
  is_section: true,
  is_parent: true
};

export const rbacRoleBasedAccessSubsets = {
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  permissions: true,
  created_user_id: true,
  updated_user_id: true,
  deleted_user_id: true,
  rbac_module_id: true,
  role_id: true,
  user_id: true,
  is_role_based_access: true
};

export const auditTrailsSubsets = {
  id: true,
  created_at: true,
  table_name: true,
  action: true,
  record_id: true,
  old_values: true,
  new_values: true,
  user_agent: true,
  host: true,
  ip_address: true,
  created_user_id: true
};