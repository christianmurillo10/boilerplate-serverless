import { Permissions } from "../utils/Types";

export interface RbacRoleBasedAccessInterface {
  id?: number;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
  permissions?: Permissions[] | any;
  created_user_id: string;
  updated_user_id?: string | null;
  deleted_user_id?: string | null;
  rbac_module_id: number;
  role_id?: number | null;
  user_id?: string | null;
  is_role_based_access: boolean;
};

class RbacRoleBasedAccess implements RbacRoleBasedAccessInterface {
  id?: number;
  created_at: Date = new Date();
  updated_at?: Date = new Date();
  deleted_at?: Date | null;
  permissions?: Permissions[] = [];
  created_user_id!: string;
  updated_user_id?: string | null;
  deleted_user_id?: string | null;
  rbac_module_id!: number;
  role_id?: number | null;
  user_id?: string | null;
  is_role_based_access: boolean = true;

  constructor(props: RbacRoleBasedAccessInterface) {
    Object.assign(this, props);
  };
};

export default RbacRoleBasedAccess;
