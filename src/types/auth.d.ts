export const enum PermissionType {
  USER = "user",
  ADMIN = "admin",
}

export type AccountInfo = {
  id: string;
  password: string;
  username: string;
};

export type LoginInfo = {
  id: string;
  password: string;
};

export type TokenInfo = {
  index: number;
  id: string;
  ip: string;
  expiresIn: string;
  issuer: string;
  type: string;
};
