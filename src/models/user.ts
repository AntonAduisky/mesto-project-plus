import mongoose from 'mongoose';
import validator from 'validator';
// import bcrypt from 'bcryptjs';
import { IUser } from '../utils/types';

const userSchema = new mongoose.Schema<IUser>(
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
      validate: {
        validator: (v: string) => validator.isURL(v),
        message: 'Неправильный формат ссылки',
      },
    },
  },
);

export default mongoose.model<IUser>('user', userSchema);
