import { Permissions } from "../utils/Types";

export interface RbacModulesInterface {
  id?: number;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
  name: string;
  icon?: string | null;
  path?: string | null;
  order_display?: number | null;
  permissions?: Permissions[] | any;
  parent_id?: number | null;
  is_section: boolean;
  is_parent: boolean;
};

class RbacModules implements RbacModulesInterface {
  id?: number;
  created_at: Date = new Date();
  updated_at?: Date = new Date();
  deleted_at?: Date | null;
  name: string = "";
  icon?: string | null;
  path?: string | null;
  order_display?: number | null;
  permissions?: Permissions[] = [];
  parent_id?: number | null;
  is_section: boolean = false;
  is_parent: boolean = false;

  constructor(props: RbacModulesInterface) {
    Object.assign(this, props);
  };
};

export default RbacModules;
