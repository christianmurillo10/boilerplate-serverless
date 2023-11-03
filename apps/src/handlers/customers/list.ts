import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Joi from "joi";
import { apiResponse, apiErrorResponse } from "../../shared/utils/ApiResponse";
import { CUSTOMER_STATUS_APPROVED, CUSTOMER_STATUS_DECLINED, CUSTOMER_STATUS_PENDING, GENDER_FEMALE, GENDER_MALE, GENDER_OTHER, MESSAGE_DATA_FIND_ALL, MESSAGE_DATA_NOT_FOUND } from "../../shared/helpers/constant";
import CustomersRepository from "../../shared/repositories/mysql/CustomersRepository";
import { validateInput } from "../../shared/helpers";
import { Query } from "../../shared/utils/Types";

const repository = new CustomersRepository;

const validator = async (input: Query): Promise<Query> => {
  input?.filters ? input.filters = JSON.parse(<string><unknown>input.filters) : undefined;
  input?.sorting ? input.sorting = JSON.parse(<string><unknown>input.sorting) : undefined;

  const schema = Joi.object({
    filters: Joi.object({
      created_at: Joi.date().label("Date Created").empty(),
      updated_at: Joi.date().label("Last Modified").empty(),
      verified_at: Joi.date().label("Date Verified").empty(),
      firstname: Joi.string().label("Firstname").max(100).empty(),
      middlename: Joi.string().label("Middlename").max(100).empty(),
      lastname: Joi.string().label("Lastname").max(100).empty(),
      email: Joi.string().label("Email").max(100).empty(),
      contact_no: Joi.string().label("Contact No.").max(100).empty(),
      primary_address: Joi.string().label("Primary Address").max(255).empty(),
      secondary_address: Joi.string().label("Secondary Address").max(255).empty(),
      gender_type: Joi.string().label("Gender")
        .valid(GENDER_MALE, GENDER_FEMALE, GENDER_OTHER)
        .empty(),
      status: Joi.string().label("Status")
        .valid(CUSTOMER_STATUS_APPROVED, CUSTOMER_STATUS_PENDING, CUSTOMER_STATUS_DECLINED)
        .empty(),
      is_active: Joi.boolean().label("Active?").empty(),
    }).label("Filters").empty(),
    sorting: Joi.object({
      created_at: Joi.string().label("Date Created").valid("asc", "desc").empty(),
      updated_at: Joi.string().label("Last Modified").valid("asc", "desc").empty(),
      firstname: Joi.string().label("Firstname").valid("asc", "desc").empty(),
      middlename: Joi.string().label("Middlename").valid("asc", "desc").empty(),
      lastname: Joi.string().label("Lastname").valid("asc", "desc").empty(),
      email: Joi.string().label("Email").valid("asc", "desc").empty(),
      gender_type: Joi.string().label("Gender").valid("asc", "desc").empty(),
      status: Joi.string().label("Status").valid("asc", "desc").empty()
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
