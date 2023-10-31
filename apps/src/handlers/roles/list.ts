import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import Joi from "joi";
import { apiResponse, apiErrorResponse } from "../../shared/utils/ApiResponse";
import { MESSAGE_DATA_FIND_ALL, MESSAGE_DATA_NOT_FOUND } from "../../shared/helpers/constant";
import RolesRepository from "../../shared/repositories/mysql/RolesRepository";
import { validateInput } from "../../shared/helpers";
import { Query } from "../../shared/utils/Types";

const repository = new RolesRepository;

const validator = async (input: Query): Promise<Query> => {
  input?.filters ? input.filters = JSON.parse(<string><unknown>input.filters) : undefined;
  input?.sorting ? input.sorting = JSON.parse(<string><unknown>input.sorting) : undefined;

  const schema = Joi.object({
    filters: Joi.object({
      created_at: Joi.date().label("Date Created").empty(),
      updated_at: Joi.date().label("Last Modified").empty(),
      name: Joi.string().label("Name").max(100).empty(),
      description: Joi.string().label("Description").max(255).empty(),
    }).label("Filters").empty(),
    sorting: Joi.object({
      created_at: Joi.string().label("Date Created").valid("asc", "desc").empty(),
      updated_at: Joi.string().label("Last Modified").valid("asc", "desc").empty(),
      name: Joi.string().label("Name").valid("asc", "desc").empty()
    }).label("Sorting").empty(),
    offset: Joi.number().label("Offset").empty(),
    limit: Joi.number().label("Limit").empty(),
  });

  return await validateInput(input, schema);
};

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    let message = MESSAGE_DATA_FIND_ALL;
    const query = await validator(event.queryStringParameters as Query);
    const record = await repository.findAll({
      query,
      exclude: ["deleted_at"]
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
