import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { apiResponse, apiErrorResponse } from "../../shared/utils/ApiResponse";
import { MESSAGE_DATA_FIND_ALL, MESSAGE_DATA_NOT_FOUND } from "../../shared/helpers/constant";
import RolesRepository from "../../shared/repositories/mysql/RolesRepository";

const repository = new RolesRepository;

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    let message = MESSAGE_DATA_FIND_ALL;
    const query = event.queryStringParameters;
    const record = await repository.findAll({
      query,
      include: ["business_entities"],
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
