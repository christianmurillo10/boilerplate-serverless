import { MESSAGE_ERROR_SERVER } from "../helpers/constant";

class ErrorException extends Error {
  statusCode = 500;
  errors: string[] = [];
  message = MESSAGE_ERROR_SERVER;

  constructor(errors: string[], message?: string, statusCode?: number) {
    super();

    this.statusCode = statusCode || this.statusCode;
    this.message = message || this.message;
    this.errors = errors || this.errors;
  };
};

export default ErrorException;