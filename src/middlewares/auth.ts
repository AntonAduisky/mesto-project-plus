import { Request, Response, NextFunction } from 'express';

export default ((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '63975e5b74a954b6c77dda0a', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  // next без аргумента для того, чтобы продолжить обработку запроса после выполнения мидлвара
  next();
});
