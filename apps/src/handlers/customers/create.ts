import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import _ from "lodash";
import multipart from "lambda-multipart-parser";
import { apiResponse, apiErrorResponse } from "../../shared/utils/ApiResponse";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST } from "../../shared/helpers/constant";
import CustomersRepository from "../../shared/repositories/mysql/CustomersRepository";
import ConflictException from "../../shared/exceptions/ConflictException";
import Customers from "../../shared/entities/Customers";
import authenticate from "../../shared/middlewares/authenticate";
import { create as validator } from "../../shared/middlewares/validators/customers";
import { setUploadPath, uploadFile } from "../../shared/helpers/upload";

const repository = new CustomersRepository;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    await authenticate(event);

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
