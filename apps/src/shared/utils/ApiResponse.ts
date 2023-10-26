import { APIGatewayProxyResultV2 } from "aws-lambda";
import { ValidationError } from "joi";
import config from "../config/server";
import BadRequestException from "../exceptions/BadRequestException";

type ApiResponseInput = {
  service?: string,
  version?: string,
  status_code: number,
  status?: string,
  message?: string,
  errors?: string[],
  result?: unknown,
};

export const apiResponse = (input: ApiResponseInput): APIGatewayProxyResultV2 => ({
  statusCode: input.status_code,
  headers: {
    "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT, PATCH, DELETE",
    Allow: "GET, OPTIONS, POST, PUT, PATCH, DELETE",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    service: config.app_name,
    version: config.version,
    status_code: input.status_code,
    status: input.status ?? "success",
    message: input.message,
    errors: input.errors ?? undefined,
    result: input.result ?? undefined
  }),
  isBase64Encoded: false
});

export const apiErorrResponse = (e: Error): APIGatewayProxyResultV2 => {
  if (e instanceof ValidationError) {
    e = new BadRequestException(e.details.map((_) => _.message));
  };

  return apiResponse({
    status_code: 500,
    message: "Internal server error! Please contact system administrator.",
    errors: [e.message],
    result: e.stack,
  });
};