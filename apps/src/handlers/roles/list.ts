import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { apiResponse, apiErrorResponse } from "../../shared/utils/ApiResponse";
import { MESSAGE_DATA_FIND_ALL, MESSAGE_DATA_NOT_FOUND } from "../../shared/helpers/constant";
import RolesRepository from "../../shared/repositories/mysql/RolesRepository";
import { Query } from "../../shared/utils/Types";
import authenticate from "../../shared/middlewares/authenticate";
import { list as validator } from "../../shared/middlewares/validators/roles";

const repository = new RolesRepository;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    await authenticate(event);

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
