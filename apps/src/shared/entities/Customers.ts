import { v4 as uuidv4 } from "uuid";
import { Gender } from "../utils/Types";

export type CustomerStatus = "APPROVED" | "PENDING" | "DECLINED";

export interface CustomersInterface {
  id?: string;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
  verified_at?: Date | null;
  last_login_at?: Date | null;
  customer_no?: string | null;
  firstname: string;
  middlename?: string | null;
  lastname: string;
  email: string;
  password?: string | null;
  contact_no: string;
  primary_address: string;
  secondary_address?: string | null;
  image_path?: string | null;
  gender_type?: Gender | null;
  status: CustomerStatus;
  is_active: boolean;
  is_logged: boolean;
};

class Customers implements CustomersInterface {
  id?: string = uuidv4();
  created_at: Date = new Date();
  updated_at?: Date = new Date();
  deleted_at?: Date | null;
  verified_at?: Date | null;
  last_login_at?: Date | null;
  customer_no?: string | null;
  firstname: string = "";
  middlename?: string | null;
  lastname: string = "";
  email: string = "";
  password?: string | null;
  contact_no: string = "";
  primary_address: string = "";
  secondary_address?: string | null;
  image_path?: string | null;
  gender_type?: Gender | null;
  status: CustomerStatus = "PENDING";
  is_active: boolean = true;
  is_logged: boolean = false;

  constructor(props: CustomersInterface) {
    Object.assign(this, props);
  };
};

export default Customers;
