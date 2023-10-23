import jwt from "jsonwebtoken";
import config from "../../config/jwt";
import ErrorException from "./ErrorException";
import { MESSAGE_DATA_TOKEN_EXPIRED } from "../helpers/constant";

type AuthData = {
  id: string,
  last_login_at: string,
  name: string,
  username: string,
  email: string,
  image_path: string,
  business_entity_id: number | null,
  role_id: number,
  is_role_based_access: number
};

type JwtParams = {
  id: string,
  type: string,
  expiresIn: string,
  data: object
};

export type JWT = {
  id: string,
  type: string,
  data: AuthData,
  iat: number,
  exp: number
};

export const generateToken = (params: JwtParams): string => {
  const expiresIn = params.expiresIn || "1d";
  const accountData = params.data || null;
  const data = { id: params.id, type: params.type, data: accountData };
  const expiration = { expiresIn };
  return jwt.sign(data, config.secret, expiration);
};

export const verifyToken = (token: string): JWT => {
  try {
    return <JWT>jwt.verify(token, config.secret);
  } catch (error) {
    throw new ErrorException(401, [MESSAGE_DATA_TOKEN_EXPIRED]);
  };
};