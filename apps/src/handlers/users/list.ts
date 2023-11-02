import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Joi from "joi";
import { apiResponse, apiErrorResponse } from "../../shared/utils/ApiResponse";
import { MESSAGE_DATA_FIND_ALL, MESSAGE_DATA_NOT_FOUND } from "../../shared/helpers/constant";
import UsersRepository from "../../shared/repositories/mysql/UsersRepository";
import { validateInput } from "../../shared/helpers";
import { Query } from "../../shared/utils/Types";

const repository = new UsersRepository;

const validator = async (input: Query): Promise<Query> => {
  input?.filters ? input.filters = JSON.parse(<string><unknown>input.filters) : undefined;
  input?.sorting ? input.sorting = JSON.parse(<string><unknown>input.sorting) : undefined;

  const schema = Joi.object({
    filters: Joi.object({
      created_at: Joi.date().label("Date Created").empty(),
      updated_at: Joi.date().label("Last Modified").empty(),
      name: Joi.string().label("Name").max(100).empty(),
      email: Joi.string().label("Email").max(100).empty(),
      username: Joi.string().label("Username").empty(),
      role_id: Joi.number().label("Role").empty(),
      is_active: Joi.boolean().label("Active?").empty(),
    }).label("Filters").empty(),
    sorting: Joi.object({
      created_at: Joi.string().label("Date Created").valid("asc", "desc").empty(),
      updated_at: Joi.string().label("Last Modified").valid("asc", "desc").empty(),
      name: Joi.string().label("Name").valid("asc", "desc").empty(),
      email: Joi.string().label("Email").valid("asc", "desc").empty(),
      username: Joi.string().label("Username").valid("asc", "desc").empty()
    }).label("Sorting").empty(),
    offset: Joi.number().label("Offset").empty(),
    limit: Joi.number().label("Limit").empty(),
  });

  return await validateInput(input, schema);
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    let message = MESSAGE_DATA_FIND_ALL;
    const query = await validator(event.queryStringParameters as Query);
    const record = await repository.findAll({
      query,
      include: ["roles"],
      exclude: ["deleted_at", "password"]
    });
    const record_count = record.length;
    const all_record_count = await repository.count({ query });

    if (record.length < 1) {
      message = MESSAGE_DATA_NOT_FOUND;
    };

    return apiResponse({
      status_code: 200,
      message: message,
      result: {
        all_data_count: all_record_count,
        data_count: record_count,
        data: record
      }
    });
  } catch (err) {
    return apiErrorResponse(err as Error);
  };
};
