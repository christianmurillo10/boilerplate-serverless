import { v4 as uuidv4 } from "uuid";

export interface UsersInterface {
  id?: string;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
  last_login_at?: Date | null;
  name: string;
  username: string;
  email: string;
  password?: string | null;
  image_path?: string | null;
  role_id: number;
  is_active: boolean;
  is_role_based_access: boolean;
  is_logged: boolean;
};

class Users implements UsersInterface {
  id?: string = uuidv4();
  created_at: Date = new Date();
  updated_at?: Date = new Date();
  deleted_at?: Date | null;
  last_login_at?: Date | null;
  name: string = "";
  username: string = "";
  email: string = "";
  password?: string | null;
  image_path?: string | null;
  role_id!: number;
  is_active: boolean = true;
  is_role_based_access: boolean = true;
  is_logged: boolean = false;

  constructor(props: UsersInterface) {
    Object.assign(this, props);
  };
};

export default Users;
