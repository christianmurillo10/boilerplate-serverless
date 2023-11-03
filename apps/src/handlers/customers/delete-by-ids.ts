import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Joi from "joi";
import { apiResponse, apiErrorResponse } from "../../shared/utils/ApiResponse";
import { MESSAGE_DATA_DELETED } from "../../shared/helpers/constant";
import CustomersRepository from "../../shared/repositories/mysql/CustomersRepository";
import { validateInput } from "../../shared/helpers";

const repository = new CustomersRepository;

const validator = async <I>(input: I): Promise<I> => {
  const schema = Joi.object({
    ids: Joi.array()
      .items(Joi.string())
      .min(1)
      .label("Ids")
      .required(),
  });

  return await validateInput(input, schema);
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
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
