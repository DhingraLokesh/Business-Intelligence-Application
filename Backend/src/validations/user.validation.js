import Joi from "joi";
import { objectId } from "./custom.validation.js";

// validation for req.body for updating user
const updateUser = {
  body: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string(),
    username: Joi.string().min(3).max(15),
    address: Joi.string(),
    about: Joi.string(),
    city: Joi.string(),
    country: Joi.string(),
    pinCode: Joi.string(),
  }),
};

// validation for req.params for getting user by id
const getAnyUserById = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

// validation for req.query for getting user by email
const getUserByEmail = {
  query: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }),
  }),
};
export { updateUser, getAnyUserById, getUserByEmail };
