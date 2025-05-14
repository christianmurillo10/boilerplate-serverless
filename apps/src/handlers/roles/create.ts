import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { apiResponse, apiErrorResponse } from "../../shared/utils/ApiResponse";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST } from "../../shared/helpers/constant";
import RolesRepository from "../../shared/repositories/mysql/RolesRepository";
import ConflictException from "../../shared/exceptions/ConflictException";
import Roles from "../../shared/entities/Roles";
import authenticate from "../../shared/middlewares/authenticate";
import { create as validator } from "../../shared/middlewares/validators/roles";

const repository = new RolesRepository;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    await authenticate(event);

    const body = await validator(JSON.parse(event.body as string));
    const record = await repository.findByName({
      name: body.name,
    });

    if (record) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const data = new Roles(body);
    const result = await repository.create({
      params: data,
      exclude: ["deleted_at"]
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
