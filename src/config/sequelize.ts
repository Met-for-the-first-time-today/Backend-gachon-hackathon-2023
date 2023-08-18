import { Sequelize } from "sequelize-typescript";
import path from "path";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../../database.db"),
  models: [path.join(__dirname, "../model")],
});

export default sequelize;
