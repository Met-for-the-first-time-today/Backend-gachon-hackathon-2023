import express from "express";
import controller from "./controller";
import { createServer } from "http";
import bodyParser from "body-parser";
import sequelize from "./config/sequelize";
import { PORT } from "./config/dotenv";

const app = express();

sequelize.sync({ alter: true });
app.use(bodyParser.json());
app.use(controller);

const server = createServer(app);
server.listen(PORT);
