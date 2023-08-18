import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/dotenv";
import { TokenInfo } from "../types/auth";

export const createToken = ({
  index,
  id,
  ip,
  expiresIn,
  issuer,
  type,
}: TokenInfo) => {
  return jwt.sign({ index, id, ip, type }, SECRET_KEY, { expiresIn, issuer });
};

export const validationToken = (token: string): boolean => {
  try {
    return jwt.verify(token, SECRET_KEY) ? true : false;
  } catch (err) {
    return false;
  }
};

export const decodeToken = (token: string) => jwt.decode(token);
