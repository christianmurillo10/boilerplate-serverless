import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { apiResponse, apiErrorResponse } from "../../../shared/utils/ApiResponse";
import { MESSAGE_DATA_FIND_ALL, MESSAGE_DATA_NOT_FOUND } from "../../../shared/helpers/constant";
import CustomersRepository from "../../../shared/repositories/mysql/CustomersRepository";
import authenticate from "../../../shared/middlewares/authenticate";
import { report as validator } from "../../../shared/middlewares/validators/customers";

const repository = new CustomersRepository;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    await authenticate(event);

    let message = MESSAGE_DATA_FIND_ALL;
    const query = await validator(event.queryStringParameters!);
    const record = await repository.findAllBetweenCreatedAt({
      date_from: query.date_from as string,
      date_to: query.date_to as string,
      exclude: ["deleted_at", "password"]
    });

    if (record.length < 1) {
      message = MESSAGE_DATA_NOT_FOUND;
    };

    return apiResponse({
      status_code: 200,
      message: message,
      result: record
    });
  } catch (err) {
    return apiErrorResponse(err as Error);
  };
};
