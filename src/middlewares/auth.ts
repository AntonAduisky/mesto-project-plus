import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ISessionRequest } from '../utils/types';
import { unauthorizedError } from '../utils/errors';

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

export default (req: ISessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const { JWT_SECRET = 'super-secret-key' } = process.env;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return unauthorizedError('Необходима авторизация');
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return unauthorizedError('Проблемы с токеном');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
