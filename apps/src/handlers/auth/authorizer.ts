import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
  APIGatewayTokenAuthorizerHandler,
} from "aws-lambda";
import Jwt from "../../shared/entities/Jwt";

export const handler: APIGatewayTokenAuthorizerHandler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  const methodArn = event.methodArn;
  const token = event.authorizationToken.split(" ")[1];
  const decodedToken = Jwt.decodeToken(token);
  let permission = "Deny";

  if (decodedToken) {
    permission = "Allow";
  };

  const statement = {
    Action: "execute-api:Invoke",
    Effect: permission,
    Resource: methodArn,
  };

  const policy = {
    principalId: "user",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [statement],
    },
    context: decodedToken
      ? {
        id: decodedToken.id,
        client: decodedToken.client,
        scope: decodedToken.scope,
        sub: decodedToken.sub,
        exp: decodedToken.exp,
        iat: decodedToken.iat,
        aud: decodedToken.aud,
      }
      : undefined,
  };
  return policy;
};