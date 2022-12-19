import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { unauthorizedError } from '../utils/errors';
import { IUser, IUserModel } from '../utils/types';

const userSchema = new mongoose.Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      required: true,
      unique: true,
      minLength: 2,
      maxLength: 200,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      required: true,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (v: string) => validator.isURL(v),
        message: 'Неправильный формат ссылки',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'Неправильный формат почты',
      },
    },
    password: {
      type: String,
      required: true,
      // Так по умолчанию хеш пароля пользователя не будет возвращаться из базы
      select: false,
    },
  },
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(unauthorizedError('Неправильные почта или пароль'));
      }
      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(unauthorizedError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
});

export default mongoose.model<IUser, IUserModel>('user', userSchema);
