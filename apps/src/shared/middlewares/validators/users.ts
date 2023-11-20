import Joi from "joi";
import { validateInput } from "../../helpers";
import { Query } from "../../utils/Types";

const usernameChecker = /^(?=[a-zA-Z0-9._]{1,30}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

export const create = async <I>(input: I): Promise<I> => {
  const schema = Joi.object({
    name: Joi.string().label("Name").max(100).required(),
    email: Joi.string().label("Email").max(100).email().required(),
    username: Joi.string().label("Username").min(6).max(30).regex(usernameChecker).required(),
    password: Joi.string().label("Password").max(100).required(),
    role_id: Joi.number().label("Role").required(),
    is_active: Joi.boolean().label("Active?"),
  });

  return await validateInput(input, schema);
};

export const update = async <I>(input: I): Promise<I> => {
  const schema = Joi.object({
    name: Joi.string().label("Name").max(100).empty(),
    email: Joi.string().label("Email").max(100).email().empty(),
    username: Joi.string().label("Username").min(6).max(30).regex(usernameChecker).empty(),
    role_id: Joi.number().label("Role").empty(),
    is_active: Joi.boolean().label("Active?").empty(),
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
      email: Joi.string().label("Email").max(100).empty(),
      username: Joi.string().label("Username").empty(),
      role_id: Joi.number().label("Role").empty(),
      is_active: Joi.boolean().label("Active?").empty(),
    }).label("Filters").empty(),
    sorting: Joi.object({
      created_at: Joi.string().label("Date Created").valid("asc", "desc").empty(),
      updated_at: Joi.string().label("Last Modified").valid("asc", "desc").empty(),
      name: Joi.string().label("Name").valid("asc", "desc").empty(),
      email: Joi.string().label("Email").valid("asc", "desc").empty(),
      username: Joi.string().label("Username").valid("asc", "desc").empty()
    }).label("Sorting").empty(),
    offset: Joi.number().label("Offset").empty(),
    limit: Joi.number().label("Limit").empty(),
  });

  return await validateInput(input, schema);
};

export const deleteByIds = async <I>(input: I): Promise<I> => {
  const schema = Joi.object({
    ids: Joi.array()
      .items(Joi.string())
      .min(1)
      .label("Ids")
      .required(),
  });

  return await validateInput(input, schema);
};

export const report = async <I>(input: I): Promise<I> => {
  const schema = Joi.object({
    date_from: Joi.date().label("Date From"),
    date_to: Joi.date().label("Date To"),
  }).and("date_from", "date_to").required();

  return await validateInput(input, schema);
};

export const changePassword = async <I>(input: I): Promise<I> => {
  const schema = Joi.object({
    old_password: Joi.string().label("Old Password").max(100).required(),
    new_password: Joi.string().label("New Password").max(100).required(),
  });

  return await validateInput(input, schema);
};