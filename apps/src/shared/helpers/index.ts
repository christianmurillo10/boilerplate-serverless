import { Schema } from "joi";
import { GenericObject } from "../utils/Types";

export const validateInput = async <I>(input: I, schema: Schema): Promise<I> => {
  const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };

  /** Filter unvalued input */
  input = input ?
    Object.assign({}, ...Object.entries(input).map(([key, value]) => {
      const newValue = value === "" || value === "null" || value === undefined ? null : value;
      return { [key]: newValue };
    }))
    : undefined;

  return await schema.validateAsync(input, options);
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