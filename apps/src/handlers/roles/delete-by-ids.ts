import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { apiResponse, apiErrorResponse } from "../../shared/utils/ApiResponse";
import { MESSAGE_DATA_DELETED } from "../../shared/helpers/constant";
import RolesRepository from "../../shared/repositories/mysql/RolesRepository";
import authenticate from "../../shared/middlewares/authenticate";
import { deleteByIds as validator } from "../../shared/middlewares/validators/roles";

const repository = new RolesRepository;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    await authenticate(event);

    const body = await validator(JSON.parse(event.body as string));
    await repository.softDeleteMany({ ids: body.ids });

    return apiResponse({
      status_code: 200,
      message: MESSAGE_DATA_DELETED
    });
  } catch (err) {
    return apiErrorResponse(err as Error);
  };
};
