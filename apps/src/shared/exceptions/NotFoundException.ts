import ErrorException from "./ErrorException";

class NotFoundException extends ErrorException {
  statusCode = 404;
  message = "404 Resource is not found!";
};

export default NotFoundException;