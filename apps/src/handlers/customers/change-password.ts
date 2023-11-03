import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Joi from "joi";
import _ from "lodash";
import { apiResponse, apiErrorResponse } from "../../shared/utils/ApiResponse";
import { MESSAGE_DATA_INCORRECT_OLD_PASSWORD, MESSAGE_DATA_NOT_EXIST, MESSAGE_DATA_SAME_NEW_PASSWORD_TO_OLD_PASSWORD, MESSAGE_DATA_PASSWORD_CHANGED, MESSAGE_INVALID_PARAMETER } from "../../shared/helpers/constant";
import CustomersRepository from "../../shared/repositories/mysql/CustomersRepository";
import BadRequestException from "../../shared/exceptions/BadRequestException";
import NotFoundException from "../../shared/exceptions/NotFoundException";
import { validateInput } from "../../shared/helpers";
import { comparePassword } from "../../shared/utils/Bcrypt";

const repository = new CustomersRepository;

const validator = async <I>(input: I): Promise<I> => {
  const schema = Joi.object({
    old_password: Joi.string().label("Old Password").max(100).required(),
    new_password: Joi.string().label("New Password").max(100).required(),
  });

  return await validateInput(input, schema);
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;
    const body = await validator(JSON.parse(event.body as string));

    if (id === ":id") {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    };

    const record = await repository.findById({ id: id as string });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    const compareOldPassword = comparePassword(body.old_password, record.password as string);
    if (!compareOldPassword) {
      throw new BadRequestException([MESSAGE_DATA_INCORRECT_OLD_PASSWORD]);
    };

    const compareNewPassword = comparePassword(body.new_password, record.password as string);
    if (compareNewPassword) {
      throw new BadRequestException([MESSAGE_DATA_SAME_NEW_PASSWORD_TO_OLD_PASSWORD]);
    };

    await repository.changePassword({
      id: id as string,
      new_password: body.new_password
    });

    return apiResponse({
      status_code: 200,
      message: MESSAGE_DATA_PASSWORD_CHANGED
    });
  } catch (err) {
    return apiErrorResponse(err as Error);
  };
};
