import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ISessionRequest } from '../utils/types';
import { unauthorizedError } from '../utils/errors';

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

export default (req: ISessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return unauthorizedError('Необходима авторизация');
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-secret-key');
  } catch (err) {
    return unauthorizedError('Проблемы с токеном');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
