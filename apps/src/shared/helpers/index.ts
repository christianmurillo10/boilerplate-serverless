import ErrorException from "../utils/ErrorException";
import { GenericObject } from "../utils/Types";

export const validateRequest = (data: object, schema: any): GenericObject => {
  const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };

  /** Filter unvalued data */
  data = Object.assign({}, ...Object.entries(data).map(([key, value]) => {
    const newValue = value === "" || value === "null" || value === undefined ? null : value;
    return { [key]: newValue };
  }));

  const { error, value } = schema.validate(data, options);

  if (error) {
    let errors: string[] = [];
    error.details.map((x: Error) => errors.push(x.message));
    throw new ErrorException(400, errors);
  };

  return value;
};

export const parseQueryFilters = <T>(data: T): GenericObject => {
  return data
    ? Object.assign({}, ...Object.entries(data)
      .map(([key, value]) => {
        const dateFields = [
          "created_at",
          "updated_at",
          "deleted_at",
          "last_login_at",
          "verified_at"
        ];

        if (dateFields.includes(key)) {
          const dateTime = new Date(value as Date);
          const dateTimeAfter = new Date(new Date(dateTime).setDate(dateTime.getDate() + 1));
          return {
            [key]: {
              gte: dateTime.toISOString(),
              lt: dateTimeAfter.toISOString()
            }
          };
        };

        if (typeof value === "string") {
          return { [key]: { contains: value } };
        };

        return { [key]: value };
      }))
    : undefined;
};

export const generateNonce = (): string => {
  return Math.floor(Math.random() * Date.now()).toString(16);
};

export const setSelectExclude = (val: string[]): GenericObject => {
  return val ? val.reduce((acc, item) => ({ ...acc, [item]: false }), {}) : {};
};