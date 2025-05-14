import { APIGatewayProxyEvent } from "aws-lambda";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import { MESSAGE_DATA_NOT_LOGGED } from "../helpers/constant";

const authenticate = async (event: APIGatewayProxyEvent): Promise<unknown> => {
  if (!event.requestContext.authorizer) {
    throw new UnauthorizedException([MESSAGE_DATA_NOT_LOGGED]);
  };

  return event.requestContext.authorizer;
};

export default authenticate;