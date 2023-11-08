import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Joi from "joi";
import { apiResponse, apiErrorResponse } from "../../../shared/utils/ApiResponse";
import { MESSAGE_DATA_LOG_IN, MESSAGE_DATA_NOT_EXIST, MESSAGE_DATA_INVALID_PASSWORD } from "../../../shared/helpers/constant";
import UsersRepository from "../../../shared/repositories/mysql/UsersRepository";
import NotFoundException from "../../../shared/exceptions/NotFoundException";
import BadRequestException from "../../../shared/exceptions/BadRequestException";
import { validateInput } from "../../../shared/helpers";
import { comparePassword } from "../../../shared/utils/Bcrypt";
import Jwt from "../../../shared/entities/Jwt";

const repository = new UsersRepository;

const validator = async <I>(input: I): Promise<I> => {
  const schema = Joi.object({
    username_or_email: Joi.string().label("Username/Email").required(),
    password: Joi.string().label("Password").required(),
  });

  return await validateInput(input, schema);
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = await validator(JSON.parse(event.body as string));
    const record = await repository.findByUsernameOrEmail({
      username: body.username_or_email,
      email: body.username_or_email,
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    const validatePassword = comparePassword(body.password, record.password as string);

    if (!validatePassword) {
      throw new BadRequestException([MESSAGE_DATA_INVALID_PASSWORD]);
    };

    await repository.update({
      id: record.id!,
      params: {
        ...record,
        is_logged: false,
        last_login_at: new Date()
      }
    });

    // Generate token
    const date = new Date();
    const expDay = 30;
    const jwt = new Jwt({
      id: record.id!,
      client: "USER",
      scope: "user:login",
      sub: record.email,
      exp: date.setDate(date.getDate() + expDay) / 1000,
      iat: Date.now() / 1000,
    });
    const token = jwt.encodeToken();

    return apiResponse({
      status_code: 200,
      message: MESSAGE_DATA_LOG_IN,
      result: token
    });
  } catch (err) {
    return apiErrorResponse(err as Error);
  };
};
