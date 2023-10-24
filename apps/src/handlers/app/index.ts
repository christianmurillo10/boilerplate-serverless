import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import ApiResponse from "../../shared/utils/ApiResponse";
import config from "../../shared/config/server";

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(
        new ApiResponse({
          status_code: 200,
          message: `Welcome to ${config.app_name}`
        })
      ),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Server error, please contact administrator",
      }),
    };
  }
};
