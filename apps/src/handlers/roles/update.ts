import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import Joi from "joi";
import { apiResponse, apiErrorResponse } from "../../shared/utils/ApiResponse";
import { MESSAGE_DATA_NOT_EXIST, MESSAGE_DATA_UPDATED, MESSAGE_INVALID_PARAMETER } from "../../shared/helpers/constant";
import RolesRepository from "../../shared/repositories/mysql/RolesRepository";
import BadRequestException from "../../shared/exceptions/BadRequestException";
import NotFoundException from "../../shared/exceptions/NotFoundException";
import Roles from "../../shared/entities/Roles";
import { validateInput } from "../../shared/helpers";

const repository = new RolesRepository;

const validator = async <I>(input: I): Promise<I> => {
  const schema = Joi.object({
    name: Joi.string().label("Name").max(100).empty(),
    description: Joi.string().label("Description").max(255).optional().empty().allow("").allow(null),
  });

  return await validateInput(input, schema);
};

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const id = event.pathParameters?.id;
    const body = await validator(JSON.parse(event.body!));

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
