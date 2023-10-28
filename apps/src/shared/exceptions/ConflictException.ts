import ErrorException from "./ErrorException";
import { MESSAGE_ERROR_CONFLICT } from "../helpers/constant";

class ConflictException extends ErrorException {
  statusCode = 409;
  message = MESSAGE_ERROR_CONFLICT;
};

export default ConflictException;