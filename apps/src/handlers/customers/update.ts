import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Joi from "joi";
import _ from "lodash";
import multipart from "lambda-multipart-parser";
import { apiResponse, apiErrorResponse } from "../../shared/utils/ApiResponse";
import { CUSTOMER_STATUS_APPROVED, CUSTOMER_STATUS_DECLINED, CUSTOMER_STATUS_PENDING, GENDER_FEMALE, GENDER_MALE, GENDER_OTHER, MESSAGE_DATA_NOT_EXIST, MESSAGE_DATA_UPDATED, MESSAGE_INVALID_PARAMETER } from "../../shared/helpers/constant";
import CustomersRepository from "../../shared/repositories/mysql/CustomersRepository";
import BadRequestException from "../../shared/exceptions/BadRequestException";
import NotFoundException from "../../shared/exceptions/NotFoundException";
import Customers from "../../shared/entities/Customers";
import { validateInput } from "../../shared/helpers";
import { setUploadPath, uploadFile } from "../../shared/helpers/upload";

const repository = new CustomersRepository;

const validator = async <I>(input: I): Promise<I> => {
  const schema = Joi.object({
    firstname: Joi.string().label("Firstname").max(100).empty(),
    middlename: Joi.string().label("Middlename").max(100).empty().allow("").allow(null),
    lastname: Joi.string().label("Lastname").max(100).empty(),
    email: Joi.string().label("Email").max(100).email().empty(),
    contact_no: Joi.string().label("Contact No.").max(100).empty(),
    primary_address: Joi.string().label("Primary Address").max(255).empty(),
    secondary_address: Joi.string().label("Secondary Address").max(255).empty().allow("").allow(null),
    gender_type: Joi.string().label("Gender")
      .valid(GENDER_MALE, GENDER_FEMALE, GENDER_OTHER)
      .empty().allow("").allow(null),
    status: Joi.string().label("Status")
      .valid(CUSTOMER_STATUS_APPROVED, CUSTOMER_STATUS_PENDING, CUSTOMER_STATUS_DECLINED)
      .empty().allow("").allow(null),
    is_active: Joi.boolean().label("Active?").empty(),
    verified_at: Joi.date().label("Date Verified").empty()
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
    const id = event.pathParameters?.id;
    const { files, ...res } = await multipart.parse(event);
    const body = await validator(res) as any;
    const file = files[0];

    if (id === ":id") {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    };

    const record = await repository.findById({ id: id as string });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    const oldData = new Customers(record);
    const result = await repository.update({
      id: id as string,
      params: {
        ...oldData,
        ...body,
        image_path: setUploadPath(file, repository.imagePath) || oldData.image_path || ""
      },
      include: ["roles"],
      exclude: ["deleted_at", "password"]
    });

    if (!_.isUndefined(file) && result.image_path) {
      uploadFile(result.image_path, file);
    };

    return apiResponse({
      status_code: 200,
      message: MESSAGE_DATA_UPDATED,
      result: result
    });
  } catch (err) {
    return apiErrorResponse(err as Error);
  };
};
