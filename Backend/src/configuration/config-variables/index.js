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
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.string()
      .required()
      .description("JWT access expiration minutes")
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  hostURL: envVars.HOST_URL,
  mongoose: {
    url: envVars.MONGODB_URL,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
  },
};

export default config;
