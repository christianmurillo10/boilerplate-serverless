import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { apiResponse, apiErrorResponse } from "../../shared/utils/ApiResponse";
import { MESSAGE_DATA_DELETED, MESSAGE_DATA_NOT_EXIST, MESSAGE_INVALID_PARAMETER } from "../../shared/helpers/constant";
import RolesRepository from "../../shared/repositories/mysql/RolesRepository";
import BadRequestException from "../../shared/exceptions/BadRequestException";
import NotFoundException from "../../shared/exceptions/NotFoundException";

const repository = new RolesRepository;

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const id = event.pathParameters?.id;

    if (id === ":id") {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    };

    const record = await repository.findById({
      id: Number(id),
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    const result = await repository.softDelete({ id: Number(id) });

    return apiResponse({
      status_code: 200,
      message: MESSAGE_DATA_DELETED,
      result: result
    });
  } catch (err) {
    return apiErrorResponse(err as Error);
  };
};
