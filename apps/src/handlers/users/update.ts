import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import _ from "lodash";
import multipart from "lambda-multipart-parser";
import { apiResponse, apiErrorResponse } from "../../shared/utils/ApiResponse";
import { MESSAGE_DATA_NOT_EXIST, MESSAGE_DATA_UPDATED, MESSAGE_INVALID_PARAMETER } from "../../shared/helpers/constant";
import UsersRepository from "../../shared/repositories/mysql/UsersRepository";
import BadRequestException from "../../shared/exceptions/BadRequestException";
import NotFoundException from "../../shared/exceptions/NotFoundException";
import Users from "../../shared/entities/Users";
import authenticate from "../../shared/middlewares/authenticate";
import { update as validator } from "../../shared/middlewares/validators/users";
import { setUploadPath, uploadFile } from "../../shared/helpers/upload";

const repository = new UsersRepository;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    await authenticate(event);

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

    const oldData = new Users(record);
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
