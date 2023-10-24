import {
  MESSAGE_ERROR_SERVER,
  MESSAGE_ERROR_BAD_REQUEST,
  MESSAGE_ERROR_UNAUTHORIZED,
  MESSAGE_ERROR_FORBIDDEN,
  MESSAGE_ERROR_NOT_FOUND,
  MESSAGE_ERROR_CONFLICT,
  ERROR_ON_SERVER
} from "../helpers/constant";

interface ErrorExceptionInterface {
  status_code: number;
  message: string;
  errors: string[];
};

class ErrorException extends Error implements ErrorExceptionInterface {
  status_code = 500;
  message = MESSAGE_ERROR_SERVER;
  errors = [ERROR_ON_SERVER];

  constructor(status_code?: number, errors?: string[]) {
    super();
    switch (status_code) {
      case 400:
        this.message = MESSAGE_ERROR_BAD_REQUEST;
        break;
      case 401:
        this.message = MESSAGE_ERROR_UNAUTHORIZED;
        break;
      case 403:
        this.message = MESSAGE_ERROR_FORBIDDEN;
        break;
      case 404:
        this.message = MESSAGE_ERROR_NOT_FOUND;
        break;
      case 409:
        this.message = MESSAGE_ERROR_CONFLICT;
        break;
      default:
        this.message = this.message;
    };

    this.status_code = status_code || this.status_code;
    this.errors = errors || this.errors;
  };
};

export default ErrorException;
