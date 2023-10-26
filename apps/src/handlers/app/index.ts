import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { apiResponse, apiErorrResponse } from "../../shared/utils/ApiResponse";
import config from "../../shared/config/server";

export const handler = async (
  _event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    return apiResponse({
      status_code: 200,
      message: `Welcome to ${config.app_name}`
    });
  } catch (err) {
    return apiErorrResponse(err as Error);
  };
};
