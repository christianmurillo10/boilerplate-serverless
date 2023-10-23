import { v4 as uuidv4 } from "uuid";
import { GenericObject } from "../utils/Types";

export type TableName =
  "roles" |
  "users" |
  "customers" |
  "rbac_modules" |
  "rbac_role_based_access" |
  "audit_trails";

export type Action = "CREATE" | "UPDATE" | "DELETE" | "DELETE_MANY" | "CHANGE_PASSWORD";

export interface AuditTrailsInterface {
  id?: string;
  created_at: Date;
  table_name: TableName;
  action: Action;
  record_id: string;
  old_values: GenericObject;
  new_values: GenericObject;
  user_agent?: string | null;
  host?: string | null;
  ip_address?: string | null;
  created_user_id: string;
};

class AuditTrails implements AuditTrailsInterface {
  id?: string = uuidv4();
  created_at: Date = new Date();
  table_name: TableName = "audit_trails";
  action: Action = "CREATE";
  record_id: string = "";
  old_values: GenericObject = {};
  new_values: GenericObject = {};
  user_agent?: string | null;
  host?: string | null;
  ip_address?: string | null;
  created_user_id: string = "";

  constructor(props: AuditTrailsInterface) {
    Object.assign(this, props);
  };
};

export default AuditTrails;
