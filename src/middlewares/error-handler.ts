import { Request, Response, NextFunction } from 'express';
import { INTERNAL_SERVER_ERROR } from '../utils/constants';
import { IError } from '../utils/types';

export default (err: IError, req: Request, res: Response, next: NextFunction): void => {
// если у ошибки нет статуса, выставляем 500
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
    // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
};
