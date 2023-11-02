import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { apiResponse, apiErrorResponse } from "../../shared/utils/ApiResponse";
import config from "../../shared/config/server";

export const handler = async (
  _event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    return apiResponse({
      status_code: 200,
      message: `Welcome to ${config.app_name}`
    });
  } catch (err) {
    return apiErrorResponse(err as Error);
  };
};
