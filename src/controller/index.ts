import express, { Request, Response } from "express";
import {
  AccountInfo,
  LoginInfo,
  PermissionType,
  TokenInfo,
} from "../types/auth";
import { FindAccount } from "../service/auth.service";
import jsend from "../service/jsend";
import {
  validationToken,
  createToken,
  decodeToken,
} from "../service/token.service";
import AccountModel from "../model/account.model";
import ScriptModel from "../model/script.model";
import bcrypt from "bcrypt";
import { CreateScriptInfo, EditScriptInfo } from "../types/script";

const router = express.Router();

router.get("/", async (req, res) => {
  res.send("<h1>Hello World!<h1/>");
});

router.post("/login", async (req: Request, res: Response) => {
  const { id, password } = req.body as LoginInfo;
  if (!id || !password)
    return res.status(400).json(jsend.ERROR(".ID or Password not match"));
  const account = (await FindAccount(id, password)) as AccountModel;
  if (!account)
    return res.status(400).json(jsend.ERROR("ID or Password not match"));
  const accessToken = createToken({
    index: account.index,
    id: account.id,
    ip: req.ip,
    expiresIn: "3h",
    issuer: "gachon",
    type: "user",
  });
  return res
    .status(200)
    .json(
      jsend.SUCCESS(
        "Logged in. Send the token together on request.",
        accessToken
      )
    );
});

router.post("/sign", async (req: Request, res: Response) => {
  const { id, password, username } = req.body as AccountInfo;
  const regPass = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,64}$/;
  if (!regPass.test(password))
    return res
      .status(200)
      .json(
        jsend.ERROR(
          "Password rule is not correct. (includes alphabet and special characters between 8 and 64)"
        )
      );
  const [account, created] = await AccountModel.findOrCreate({
    where: { id },
    defaults: {
      id,
      password: bcrypt.hashSync(password, 12),
      username,
      permission: PermissionType.USER,
    },
  });
  return created
    ? res.status(200).json(jsend.SUCCESS("created account" + account))
    : res.status(400).json(jsend.ERROR("Already has account"));
});

router.get("/script/search", async (req: Request, res: Response) => {
  const { token, index } = req.query;
  if (!token)
    return res
      .status(400)
      .json(jsend.ERROR("Token value not passed to query string."));

  if (!validationToken(token as string))
    return res.status(400).json(jsend.ERROR("This token is invalid"));

  const { id } = decodeToken(token as string) as TokenInfo;

  if (index) {
    // when have index paramers
    const result = (await ScriptModel.findOne({
      where: { id, index },
    })) as ScriptModel;
    return result
      ? res.status(200).json(jsend.SUCCESS("found script", result))
      : res
          .status(400)
          .json(jsend.ERROR("No scripts were found for that index."));
  }

  const result = await ScriptModel.findAll({ where: { id } }).catch(() => {
    return [];
  });

  return res.status(200).json(jsend.SUCCESS("found scripts", result));
});

router.post("/script/create", async (req: Request, res: Response) => {
  const { token, data, title, speed } = req.body as CreateScriptInfo;
  if (!token || !data || !title || !speed)
    return res
      .status(400)
      .json(jsend.ERROR("Delivered an incorrect payload value."));
  if (!validationToken(token))
    return res.status(400).json(jsend.ERROR("invaild token"));
  const { id } = decodeToken(token) as TokenInfo;
  const result = await ScriptModel.create({ id, data, title, speed });
  return res.status(200).json(jsend.SUCCESS("create script", result));
});

router.put("/script/edit", async (req: Request, res: Response) => {
  const { token, data, index } = req.body as EditScriptInfo;
  if (!token || !data || !index)
    return res
      .status(400)
      .json(jsend.ERROR("Delivered an incorrect payload value."));
  if (!validationToken(token))
    return res.status(400).json(jsend.ERROR("invaild token"));
  const { id } = decodeToken(token) as TokenInfo;
  const result = await ScriptModel.update({ data }, { where: { index, id } });
  return Number(result) != 0
    ? res.status(200).json(jsend.SUCCESS("update script", data))
    : res.status(400).json(jsend.ERROR("failed update script"));
});

router.delete("/script/delete", async (req: Request, res: Response) => {
  const { token, index } = req.query;
  if (!token)
    return res
      .status(400)
      .json(jsend.ERROR("Token value not passed to query string."));

  if (!validationToken(token as string))
    return res.status(400).json(jsend.ERROR("This token is invalid"));

  if (index) {
    // when have index paramers
    const result = await ScriptModel.destroy({ where: { index } });
    return result
      ? res.status(200).json(jsend.SUCCESS("delete script", result))
      : res
          .status(400)
          .json(jsend.ERROR("No scripts were found for that index."));
  }
  return res
    .status(400)
    .json(jsend.ERROR("The index of the script to be deleted was not found."));
});

export default router;
