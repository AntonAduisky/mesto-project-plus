import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { badRequestError, conflictError, notFoundError } from '../utils/errors';
import UserModel from '../models/user';
import { ISessionRequestAuth } from '../utils/types';

// реализуем функцию создания пользователя
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash: string) => UserModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      data: {
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(badRequestError(err.message));
      }
      if (err.code === 11000) {
        return next(conflictError(err.message));
      }
      return next(err);
    });
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  await UserModel.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  await UserModel.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw notFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(badRequestError(err.message));
      }
      return next(err);
    });
};

export const getCurrentUser = async (
  req: ISessionRequestAuth,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id;

  UserModel.findById(userId)
    .orFail(() => notFoundError('Пользователь не найден'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(notFoundError('Пользователь не найден'));
      }
      if (err.name === 'ValidationError') {
        return next(badRequestError(err.message));
      }
      return next(err);
    });
};

export const updateUser = async (req: ISessionRequestAuth, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  await UserModel.findByIdAndUpdate(
    userId,
    req.body,
    { new: true, runValidators: true },
  )
  // отклоняет обещание запроса, если ни один документ не соответствует условиям запроса
    .orFail(() => notFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

export const updateAvatar = async (req: ISessionRequestAuth, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  await UserModel.findByIdAndUpdate(
    userId,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => notFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const { JWT_SECRET = 'super-secret-key' } = process.env;

  await UserModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
