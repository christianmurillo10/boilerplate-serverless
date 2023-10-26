import ErrorException from "./ErrorException";

class UnauthorizedException extends ErrorException {
  statusCode = 403;
  message = "Unauthorized request! Please check your permission.";
};

export default UnauthorizedException;