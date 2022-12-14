import { NextFunction, Request, Response } from 'express';
import { notFoundError } from '../utils/errors';
import UserModel from '../models/user';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  UserModel.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  UserModel.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw notFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

// реализуем функцию создания пользователя
export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  UserModel.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  UserModel.findByIdAndUpdate(
    userId,
    req.body,
    { new: true, runValidators: true },
  )
  // отклоняет обещание запроса, если ни один документ не соответствует условиям запроса
    .orFail(() => notFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  UserModel.findByIdAndUpdate(
    userId,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => notFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch(next);
};
