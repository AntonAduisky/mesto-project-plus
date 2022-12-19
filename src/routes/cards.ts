import { Router } from 'express';
import {
  getCards, createCard, deleteCard, addLike, removeLike,
} from '../controllers/card';
import { cardValidation, idValidation } from '../utils/validation';

const router = Router();

router.get('/', getCards);
router.post('/', cardValidation, createCard);
router.delete('/:cardId', idValidation, deleteCard);
router.put('/:cardId/likes', idValidation, addLike);
router.delete('/:cardId/likes', idValidation, removeLike);

export default router;
// Маршруты роутера (routes) связывают адрес запроса с функцией контроллера.
// (создаёт объект, на который мы и повесим обработчики:)
// Благодаря этому сервер понимает,
// что обращение по адресу /users/signup — это запрос на регистрацию,
// а /users/signin — на авторизацию.
// Роутер обрабатывает входящий запрос, находит для него соответствующий обработчик и вызывает его.
