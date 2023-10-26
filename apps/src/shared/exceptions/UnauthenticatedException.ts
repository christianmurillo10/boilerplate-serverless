import ErrorException from "./ErrorException";

class UnauthenticatedException extends ErrorException {
  statusCode = 401;
  message = "Authentication is required for this resource! Please login to continue.";
};

export default UnauthenticatedException;