import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import _ from "lodash";
import multipart from "lambda-multipart-parser";
import { apiResponse, apiErrorResponse } from "../../shared/utils/ApiResponse";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST } from "../../shared/helpers/constant";
import UsersRepository from "../../shared/repositories/mysql/UsersRepository";
import ConflictException from "../../shared/exceptions/ConflictException";
import Users from "../../shared/entities/Users";
import authenticate from "../../shared/middlewares/authenticate";
import { create as validator } from "../../shared/middlewares/validators/users";
import { setUploadPath, uploadFile } from "../../shared/helpers/upload";

const repository = new UsersRepository;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    await authenticate(event);

    const { files, ...res } = await multipart.parse(event);
    const body = await validator(res) as any;
    const file = files[0];
    const record = await repository.findByUsernameOrEmail({
      username: body.username,
      email: body.email
    });

    if (record) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const data = new Users({
      ...body,
      image_path: setUploadPath(file, repository.imagePath)
    });
    const result = await repository.create({
      params: data,
      include: ["roles"],
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
