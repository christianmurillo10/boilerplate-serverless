import config from "../../config/server";
import { GenericObject, GenericArray } from "./Types";

interface ApiResponseInterface {
  service: string;
  version: string;
  status_code: number;
  status: string;
  message: string;
  errors?: string[];
  result: GenericObject | GenericArray;
};

export default class ApiResponse implements ApiResponseInterface {
  service = config.app_name;
  version = config.version;
  status_code = 200;
  status = "success";
  message = "Api Response";
  errors: string[] = [];
  result: GenericObject | GenericArray = [];

  constructor(init?: Partial<ApiResponse>) {
    Object.assign(this, init);
  };
};