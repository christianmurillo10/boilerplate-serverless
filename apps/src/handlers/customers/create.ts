import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Joi from "joi";
import _ from "lodash";
import multipart from "lambda-multipart-parser";
import { apiResponse, apiErrorResponse } from "../../shared/utils/ApiResponse";
import { CUSTOMER_STATUS_APPROVED, CUSTOMER_STATUS_DECLINED, CUSTOMER_STATUS_PENDING, GENDER_FEMALE, GENDER_MALE, GENDER_OTHER, MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST } from "../../shared/helpers/constant";
import CustomersRepository from "../../shared/repositories/mysql/CustomersRepository";
import ConflictException from "../../shared/exceptions/ConflictException";
import Customers from "../../shared/entities/Customers";
import { validateInput } from "../../shared/helpers";
import { setUploadPath, uploadFile } from "../../shared/helpers/upload";

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
    secondary_address: Joi.string().label("Secondary Address").max(255).allow("").allow(null),
    gender_type: Joi.string().label("Gender")
      .valid(GENDER_MALE, GENDER_FEMALE, GENDER_OTHER)
      .allow("").allow(null),
    status: Joi.string().label("Status")
      .valid(CUSTOMER_STATUS_APPROVED, CUSTOMER_STATUS_PENDING, CUSTOMER_STATUS_DECLINED)
      .allow("").allow(null),
    is_active: Joi.boolean().label("Active?"),
    verified_at: Joi.date().label("Date Verified")
      .when("status", {
        is: CUSTOMER_STATUS_APPROVED,
        then: Joi.required(),
        otherwise: Joi.allow("").allow(null)
      }),
  });

  return await validateInput(input, schema);
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { files, ...res } = await multipart.parse(event);
    const body = await validator(res) as any;
    const file = files[0];
    const record = await repository.findByEmail({
      email: body.email
    });

    if (record) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const data = new Customers({
      ...body,
      image_path: setUploadPath(file, repository.imagePath)
    });
    const result = await repository.create({
      params: data,
      exclude: ["deleted_at", "password"]
    });

    if (!_.isUndefined(file) && result.image_path) {
      uploadFile(result.image_path, file);
    };

    return apiResponse({
      status_code: 201,
      message: MESSAGE_DATA_CREATED,
      result: result
    });
  } catch (err) {
    return apiErrorResponse(err as Error);
  };
};
