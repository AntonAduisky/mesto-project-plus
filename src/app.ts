import * as dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import errorHandler from './middlewares/error-handler';
import auth from './middlewares/auth';
import router from './routes'; // импортируем роутер

// для чтения переменных из файла .env
dotenv.config();

const {
  PORT = 3000,
  NAME_API = '/',
  URL_DB = 'mongodb://localhost:27017/mestodb',
} = process.env;

mongoose
  .connect(URL_DB)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

// метод, встроенный в экспресс, для распознавания входящего объекта запроса как объекта JSON
app.use(express.json());
// встроенный в выражение метод для распознавания входящего объекта запроса как строки или массива
app.use(express.urlencoded({ extended: true }));

app.use(auth);

app.use(NAME_API, router); // запускаем роутер

app.use(errors());

app.use(errorHandler);

app.listen(+PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
