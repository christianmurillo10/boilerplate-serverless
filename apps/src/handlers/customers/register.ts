import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Joi from "joi";
import _ from "lodash";
import { apiResponse, apiErrorResponse } from "../../shared/utils/ApiResponse";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST } from "../../shared/helpers/constant";
import CustomersRepository from "../../shared/repositories/mysql/CustomersRepository";
import ConflictException from "../../shared/exceptions/ConflictException";
import Customers from "../../shared/entities/Customers";
import { validateInput } from "../../shared/helpers";

const repository = new CustomersRepository;

const validator = async <I>(input: I): Promise<I> => {
  const schema = Joi.object({
    firstname: Joi.string().label("Firstname").max(100).required(),
    middlename: Joi.string().label("Middlename").max(100).allow("").allow(null),
    lastname: Joi.string().label("Lastname").max(100).required(),
    email: Joi.string().label("Email").max(100).email().required(),
    password: Joi.string().label("Password").max(100).required(),
    contact_no: Joi.string().label("Contact No.").max(100).required(),
    primary_address: Joi.string().label("Primary Address").max(255).required(),
  });

  return await validateInput(input, schema);
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = await validator(JSON.parse(event.body as string));
    const record = await repository.findByEmail({
      email: body.email
    });

    if (record) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const data = new Customers(body);
    const result = await repository.create({
      params: data,
      exclude: ["deleted_at", "password"]
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
