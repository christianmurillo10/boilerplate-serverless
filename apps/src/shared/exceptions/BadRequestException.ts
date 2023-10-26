import ErrorException from "./ErrorException";

class BadRequestException extends ErrorException {
  statusCode = 400;
  message = "Bad request! Please check your input.";
};

export default BadRequestException;