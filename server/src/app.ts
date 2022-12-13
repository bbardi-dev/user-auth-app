require("dotenv").config();
import config from "config";
import connectToDb from "./utils/connectToDb";
import createServer from "./utils/createServer";

const app = createServer();

const port = config.get("port");

app.listen(port, () => {
  // "/"
  console.log(`Hello World at ${port}`);

  connectToDb();
});
