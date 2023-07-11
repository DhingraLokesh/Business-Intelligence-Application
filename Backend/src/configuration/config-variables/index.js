import dotenv from "dotenv";
import path from "path";
import Joi from "joi";
import url from "url";

dotenv.config({
  path: path.join(
    path.dirname(url.fileURLToPath(import.meta.url)),
    "../../../.env"
  ),
});

const envVarsSchema = Joi.object()
  .keys({
    PORT: Joi.number().default(5000),
    NODE_ENV: Joi.string().default("development"),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env:envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL,
  },
};

export default config;
