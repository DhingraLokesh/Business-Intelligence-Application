import Joi from 'joi';
import { objectId } from './custom.validation.js';

const  updateUser = {
    body: Joi.object().keys({
      name: Joi.string().required(),
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