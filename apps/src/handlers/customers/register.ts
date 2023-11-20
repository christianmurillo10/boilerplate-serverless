import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import _ from "lodash";
import { apiResponse, apiErrorResponse } from "../../shared/utils/ApiResponse";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST } from "../../shared/helpers/constant";
import CustomersRepository from "../../shared/repositories/mysql/CustomersRepository";
import ConflictException from "../../shared/exceptions/ConflictException";
import Customers from "../../shared/entities/Customers";
import { register as validator } from "../../shared/middlewares/validators/customers";

const repository = new CustomersRepository;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = await validator(JSON.parse(event.body as string));
    const record = await repository.findByEmail({
      email: body.email
    });

    if (record) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const data = new Customers(body);
    const result = await repository.create({
      params: data,
      exclude: ["deleted_at", "password"]
    });

    return apiResponse({
      status_code: 201,
      message: MESSAGE_DATA_CREATED,
      result: result
    });
  } catch (err) {
    return apiErrorResponse(err as Error);
  };
};
