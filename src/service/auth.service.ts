import AccountModel from "../model/account.model";
import bcrypt from "bcrypt";

export const FindAccount = async (id: string, password: string) => {
  const account = await AccountModel.findOne({ where: { id } });
  if (!account) return;
  if (!bcrypt.compareSync(password, account.dataValues.password)) return;
  return account.dataValues;
};
