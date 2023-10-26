class ErrorException extends Error {
  statusCode = 500;
  errors: string[] = [];
  message = "Application Error! Please contact the administrator.";

  constructor(errors: string[], message?: string, statusCode?: number) {
    super();

    this.statusCode = statusCode || this.statusCode;
    this.message = message || this.message;
    this.errors = errors || this.errors;
  };
};

export default ErrorException;