import ErrorException from "./ErrorException";
import { MESSAGE_ERROR_BAD_REQUEST } from "../helpers/constant";

class BadRequestException extends ErrorException {
  statusCode = 400;
  message = MESSAGE_ERROR_BAD_REQUEST;
};

export default BadRequestException;