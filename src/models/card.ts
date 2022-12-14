import mongoose, { Types } from 'mongoose';
import { ICard } from '../utils/types';

const cardSchema = new mongoose.Schema<ICard>(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 20,
    },
    link: {
      type: String,
      required: true,
    },
    owner: {
      type: Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: [
      {
        type: Types.ObjectId,
        ref: 'user',
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
);

export default mongoose.model<ICard>('card', cardSchema);
