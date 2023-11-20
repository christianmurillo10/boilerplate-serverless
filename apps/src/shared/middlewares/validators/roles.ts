import Joi from "joi";
import { validateInput } from "../../helpers";
import { Query } from "../../utils/Types";

export const create = async <I>(input: I): Promise<I> => {
  const schema = Joi.object({
    name: Joi.string().label("Name").max(100).required(),
    description: Joi.string().label("Description").max(255).optional().allow("").allow(null),
  });

  return await validateInput(input, schema);
};

export const update = async <I>(input: I): Promise<I> => {
  const schema = Joi.object({
    name: Joi.string().label("Name").max(100).empty(),
    description: Joi.string().label("Description").max(255).optional().empty().allow("").allow(null),
  });

  return await validateInput(input, schema);
};

export const list = async (input: Query): Promise<Query> => {
  input?.filters ? input.filters = JSON.parse(<string><unknown>input.filters) : undefined;
  input?.sorting ? input.sorting = JSON.parse(<string><unknown>input.sorting) : undefined;

  const schema = Joi.object({
    filters: Joi.object({
      created_at: Joi.date().label("Date Created").empty(),
      updated_at: Joi.date().label("Last Modified").empty(),
      name: Joi.string().label("Name").max(100).empty(),
      description: Joi.string().label("Description").max(255).empty(),
    }).label("Filters").empty(),
    sorting: Joi.object({
      created_at: Joi.string().label("Date Created").valid("asc", "desc").empty(),
      updated_at: Joi.string().label("Last Modified").valid("asc", "desc").empty(),
      name: Joi.string().label("Name").valid("asc", "desc").empty()
    }).label("Sorting").empty(),
    offset: Joi.number().label("Offset").empty(),
    limit: Joi.number().label("Limit").empty(),
  });

  return await validateInput(input, schema);
};

export const deleteByIds = async <I>(input: I): Promise<I> => {
  const schema = Joi.object({
    ids: Joi.array()
      .items(Joi.number())
      .min(1)
      .label("Ids")
      .required(),
  });

  return await validateInput(input, schema);
};