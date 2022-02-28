require("dotenv").config();
import express from "express";
import config from "config";

const app = express();

const port = config.get("port");

app.listen(port, () => {
  console.log(`Hello World at ${port}`);
});
