import app from "./app.js";
import config from "./configuration/config-variables/index.js";
import { connectMongo } from "./mongo/index.js";

connectMongo();

app.listen(config.port, () => {
  console.log(`Listening to port ${config.port}`, {
    port: config.port,
  });
});
