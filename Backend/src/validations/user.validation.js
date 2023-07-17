import Joi from 'joi';
import { objectId } from './custom.validation.js';

const  updateUser = {
    body: Joi.object().keys({
      firstName: Joi.string(),
      lastName: Joi.string(),
      email: Joi.string(),
      username: Joi.string(),
      address: Joi.string(),
      about: Joi.string(),
      city: Joi.string(),
      country: Joi.string(),
      pinCode: Joi.string(),
    }),
  };
const getAnyUserById = {
  params : Joi.object().keys({
    userId : Joi.string().custom(objectId).required(),
  })
}

const getUserByEmail = {
  query : Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }),
  })
}
export { updateUser, getAnyUserById, getUserByEmail };