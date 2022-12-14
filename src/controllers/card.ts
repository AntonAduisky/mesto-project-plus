import { Request, Response, NextFunction } from 'express';
import { badRequestError, forbiddenError, notFoundError } from '../utils/errors';
import CardModel from '../models/card';
import { ISessionRequestAuth } from '../utils/types';
// Контроллеры (controllers) содержат основную логику обработки запроса — как правило,
// набор методов для определённой сущности. Например,
// для пользователя User это методы создания createUser и авторизации signinUser.
// В методах описывают, как обрабатывать переданные данные и какой результат возвращать.

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  await CardModel.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

export const createCard = async (req: ISessionRequestAuth, res: Response, next: NextFunction) => {
  const newCard = {
    ...req.body,
    owner: req.user?._id,
  };
  await CardModel.create(newCard)
    .then((card) => {
      if (!card) {
        // throw генерирует исключение и обработка кода переходит в следующий блок catch
        throw badRequestError('Некорректные данные');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(badRequestError(err.message));
      }
      return next(err);
    });
};

export const deleteCard = async (req: ISessionRequestAuth, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { cardId } = req.params;

  await CardModel.findById(cardId)
    .then((card) => {
      if (!card) {
        throw notFoundError('Карточка не найдена');
      }
      if (card.owner.toString() !== userId) {
        throw forbiddenError('Нельзя удалять чужие карточки');
      }
      return CardModel.findByIdAndDelete(cardId);
    })
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(badRequestError(err.message));
      }
      return next(err);
    });
};

export const addLike = async (req: ISessionRequestAuth, res: Response, next: NextFunction) => {
  await CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        // throw генерирует исключение и обработка кода переходит в следующий блок catch
        return notFoundError('Карточка не найдена');
      }
      res.send({ data: card });
    })
  // next будет вызван с аргументом-ошибкой и запрос перейдёт
  // в обработчик ошибки, но уже со статусом и сообщением
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(badRequestError(err.message));
      }
      return next(err);
    });
};

export const removeLike = async (req: ISessionRequestAuth, res: Response, next: NextFunction) => {
  await CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } }, // убрать _id из массива
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw notFoundError('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(badRequestError(err.message));
      }
      return next(err);
    });
};
