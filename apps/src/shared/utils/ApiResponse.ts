import { APIGatewayProxyResultV2 } from "aws-lambda";
import { ValidationError } from "joi";
import config from "../config/server";
import BadRequestException from "../exceptions/BadRequestException";
import ErrorException from "../exceptions/ErrorException";

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
  let statusCode = 500;
  let message = "Internal server error! Please contact system administrator.";
  let errors = [e.message];
  let result = e.stack;

  if (e instanceof ValidationError) {
    e = new BadRequestException(e.details.map((_) => _.message));
  };

  if (e instanceof ErrorException) {
    statusCode = e.statusCode;
    message = e.message;
    errors = e.errors;
  };

  return apiResponse({
    status_code: statusCode,
    status: "error",
    message: message,
    errors: errors,
    result: result,
  });
};