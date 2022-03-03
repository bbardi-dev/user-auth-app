require("dotenv").config();
import express from "express";
import config from "config";
import connectToDb from "./utils/connectToDb";
import router from "./routes";

const app = express();

app.use(express.json());
app.use(router);

const port = config.get("port");

app.listen(port, () => {
  console.log(`Hello World at ${port}`);

  connectToDb();
});
