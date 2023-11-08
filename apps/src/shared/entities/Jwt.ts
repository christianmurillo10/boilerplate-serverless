import jwt from "jsonwebtoken";
import config from "../config/jwt";

interface JwtInterface {
  id: number | string;
  client: JwtClient;
  scope: string;
  sub: string;
  exp: number;
  iat: number;
  aud?: string;
}

type JwtClient =
  | "USER"
  | "CUSTOMER";

class Jwt implements JwtInterface {
  id: number | string = "";
  client: JwtClient = "USER";
  scope: string = "";
  sub: string = "";
  exp: number = 0;
  iat: number = Date.now();
  aud?: string = config.audience;

  constructor(props: JwtInterface) {
    Object.assign(this, props);
  };

  encodeToken = () => jwt.sign(
    {
      id: this.id,
      client: this.client,
      scope: this.scope,
      sub: this.sub,
      exp: this.exp,
      iat: this.iat,
      aud: this.aud,
    },
    config.secret
  );

  static decodeToken = (token: string): Jwt => jwt.verify(token, config.secret) as unknown as Jwt;
}

export default Jwt;
