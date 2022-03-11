require("dotenv").config();
import express from "express";
import config from "config";
import connectToDb from "./utils/connectToDb";
import router from "./routes";

const app = express();

//Middleware in specific order
app.use(express.json());
//router as global middleware from routes/index
app.use(router);

const port = config.get("port");

app.listen(port, () => {
  // "/"
  console.log(`Hello World at ${port}`);

  connectToDb();
});
