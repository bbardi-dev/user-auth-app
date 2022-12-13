import config from "config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import deserializeUser from "../middleware/deserializeUser";
import router from "../routes";

function createServer() {
  const app = express();

  //Middleware in specific order
  app.use(
    cors({
      origin: config.get("origin"),
      credentials: true,
    })
  );

  app.use(cookieParser());

  app.use(express.json());

  app.use(deserializeUser);

  app.use(router);

  return app;
}

export default createServer;
