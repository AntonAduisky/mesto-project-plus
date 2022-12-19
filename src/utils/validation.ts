import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { celebrate, Joi } from 'celebrate';
import { URL_REGEXP } from './constants';
import { notFoundError } from './errors';

export const cardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(20),
    link: Joi.string().uri().pattern(URL_REGEXP),
  })
  // опция разрешения неизвестных заголовков
    .unknown(true),
});

export const idValidation = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (Types.ObjectId.isValid(id)) {
    throw notFoundError('Некорректный ID');
  }
  next();
};

export const userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().uri().pattern(URL_REGEXP),
  }),
});

export const avatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().pattern(URL_REGEXP),
  }),
});

export const signupValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(URL_REGEXP).message('Ссылка некорректна'),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

export const signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});
