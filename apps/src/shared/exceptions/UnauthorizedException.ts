import ErrorException from "./ErrorException";
import { MESSAGE_ERROR_UNAUTHORIZED } from "../helpers/constant";

class UnauthorizedException extends ErrorException {
  statusCode = 401;
  message = MESSAGE_ERROR_UNAUTHORIZED;
};

export default UnauthorizedException;