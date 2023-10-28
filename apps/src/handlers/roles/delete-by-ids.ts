import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import Joi from "joi";
import { apiResponse, apiErrorResponse } from "../../shared/utils/ApiResponse";
import { MESSAGE_DATA_DELETED } from "../../shared/helpers/constant";
import RolesRepository from "../../shared/repositories/mysql/RolesRepository";
import { validateInput } from "../../shared/helpers";

const repository = new RolesRepository;

const validator = async <I>(input: I): Promise<I> => {
  const schema = Joi.object({
    ids: Joi.array()
      .items(Joi.number())
      .min(1)
      .label("IDs")
      .required(),
  });

  return await validateInput(input, schema);
};

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const body = await validator(JSON.parse(event.body!));
    await repository.softDeleteMany({ ids: body.ids });

    return apiResponse({
      status_code: 200,
      message: MESSAGE_DATA_DELETED
    });
  } catch (err) {
    return apiErrorResponse(err as Error);
  };
};
