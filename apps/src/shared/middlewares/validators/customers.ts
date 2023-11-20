import Joi from "joi";
import { validateInput } from "../../helpers";
import { Query } from "../../utils/Types";
import { CUSTOMER_STATUS_APPROVED, CUSTOMER_STATUS_DECLINED, CUSTOMER_STATUS_PENDING, GENDER_FEMALE, GENDER_MALE, GENDER_OTHER } from "../../helpers/constant";

export const create = async <I>(input: I): Promise<I> => {
  const schema = Joi.object({
    firstname: Joi.string().label("Firstname").max(100).required(),
    middlename: Joi.string().label("Middlename").max(100).allow("").allow(null),
    lastname: Joi.string().label("Lastname").max(100).required(),
    email: Joi.string().label("Email").max(100).email().required(),
    password: Joi.string().label("Password").max(100).required(),
    contact_no: Joi.string().label("Contact No.").max(100).required(),
    primary_address: Joi.string().label("Primary Address").max(255).required(),
    secondary_address: Joi.string().label("Secondary Address").max(255).allow("").allow(null),
    gender_type: Joi.string().label("Gender")
      .valid(GENDER_MALE, GENDER_FEMALE, GENDER_OTHER)
      .allow("").allow(null),
    status: Joi.string().label("Status")
      .valid(CUSTOMER_STATUS_APPROVED, CUSTOMER_STATUS_PENDING, CUSTOMER_STATUS_DECLINED)
      .allow("").allow(null),
    is_active: Joi.boolean().label("Active?"),
    verified_at: Joi.date().label("Date Verified")
      .when("status", {
        is: CUSTOMER_STATUS_APPROVED,
        then: Joi.required(),
        otherwise: Joi.allow("").allow(null)
      }),
  });

  return await validateInput(input, schema);
};

export const update = async <I>(input: I): Promise<I> => {
  const schema = Joi.object({
    firstname: Joi.string().label("Firstname").max(100).empty(),
    middlename: Joi.string().label("Middlename").max(100).empty().allow("").allow(null),
    lastname: Joi.string().label("Lastname").max(100).empty(),
    email: Joi.string().label("Email").max(100).email().empty(),
    contact_no: Joi.string().label("Contact No.").max(100).empty(),
    primary_address: Joi.string().label("Primary Address").max(255).empty(),
    secondary_address: Joi.string().label("Secondary Address").max(255).empty().allow("").allow(null),
    gender_type: Joi.string().label("Gender")
      .valid(GENDER_MALE, GENDER_FEMALE, GENDER_OTHER)
      .empty().allow("").allow(null),
    status: Joi.string().label("Status")
      .valid(CUSTOMER_STATUS_APPROVED, CUSTOMER_STATUS_PENDING, CUSTOMER_STATUS_DECLINED)
      .empty().allow("").allow(null),
    is_active: Joi.boolean().label("Active?").empty(),
    verified_at: Joi.date().label("Date Verified").empty()
      .when("status", {
        is: CUSTOMER_STATUS_APPROVED,
        then: Joi.required(),
        otherwise: Joi.allow("").allow(null)
      }),
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
      verified_at: Joi.date().label("Date Verified").empty(),
      firstname: Joi.string().label("Firstname").max(100).empty(),
      middlename: Joi.string().label("Middlename").max(100).empty(),
      lastname: Joi.string().label("Lastname").max(100).empty(),
      email: Joi.string().label("Email").max(100).empty(),
      contact_no: Joi.string().label("Contact No.").max(100).empty(),
      primary_address: Joi.string().label("Primary Address").max(255).empty(),
      secondary_address: Joi.string().label("Secondary Address").max(255).empty(),
      gender_type: Joi.string().label("Gender")
        .valid(GENDER_MALE, GENDER_FEMALE, GENDER_OTHER)
        .empty(),
      status: Joi.string().label("Status")
        .valid(CUSTOMER_STATUS_APPROVED, CUSTOMER_STATUS_PENDING, CUSTOMER_STATUS_DECLINED)
        .empty(),
      is_active: Joi.boolean().label("Active?").empty(),
    }).label("Filters").empty(),
    sorting: Joi.object({
      created_at: Joi.string().label("Date Created").valid("asc", "desc").empty(),
      updated_at: Joi.string().label("Last Modified").valid("asc", "desc").empty(),
      firstname: Joi.string().label("Firstname").valid("asc", "desc").empty(),
      middlename: Joi.string().label("Middlename").valid("asc", "desc").empty(),
      lastname: Joi.string().label("Lastname").valid("asc", "desc").empty(),
      email: Joi.string().label("Email").valid("asc", "desc").empty(),
      gender_type: Joi.string().label("Gender").valid("asc", "desc").empty(),
      status: Joi.string().label("Status").valid("asc", "desc").empty()
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

export const register = async <I>(input: I): Promise<I> => {
  const schema = Joi.object({
    firstname: Joi.string().label("Firstname").max(100).required(),
    middlename: Joi.string().label("Middlename").max(100).allow("").allow(null),
    lastname: Joi.string().label("Lastname").max(100).required(),
    email: Joi.string().label("Email").max(100).email().required(),
    password: Joi.string().label("Password").max(100).required(),
    contact_no: Joi.string().label("Contact No.").max(100).required(),
    primary_address: Joi.string().label("Primary Address").max(255).required(),
  });

  return await validateInput(input, schema);
};