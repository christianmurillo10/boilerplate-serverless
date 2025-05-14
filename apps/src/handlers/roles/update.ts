import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { apiResponse, apiErrorResponse } from "../../shared/utils/ApiResponse";
import { MESSAGE_DATA_NOT_EXIST, MESSAGE_DATA_UPDATED, MESSAGE_INVALID_PARAMETER } from "../../shared/helpers/constant";
import RolesRepository from "../../shared/repositories/mysql/RolesRepository";
import BadRequestException from "../../shared/exceptions/BadRequestException";
import NotFoundException from "../../shared/exceptions/NotFoundException";
import Roles from "../../shared/entities/Roles";
import authenticate from "../../shared/middlewares/authenticate";
import { update as validator } from "../../shared/middlewares/validators/roles";

const repository = new RolesRepository;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    await authenticate(event);

    const id = event.pathParameters?.id;
    const body = await validator(JSON.parse(event.body as string));

    if (id === ":id") {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    };

    const record = await repository.findById({
      id: Number(id),
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    const oldData = new Roles(record);
    const result = await repository.update({
      id: Number(id),
      params: {
        ...oldData,
        ...body,
      },
      exclude: ["deleted_at"]
    });

    return apiResponse({
      status_code: 200,
      message: MESSAGE_DATA_UPDATED,
      result: result
    });
  } catch (err) {
    return apiErrorResponse(err as Error);
  };
};
