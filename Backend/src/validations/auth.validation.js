import Joi from "joi";

// validation for req.body for register request
const register = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).max(20).required(),
    username: Joi.string().min(3).max(15).required(),
  }),
};

// validation for req.body for login request
const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export { register, login };
