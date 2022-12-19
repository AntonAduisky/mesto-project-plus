import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { ObjectId, Model, Document } from 'mongoose';

export interface IUser {
name: string,
about: string,
avatar: string,
email: string,
password: string
}

export interface IUserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

export interface ICard {
  name: string,
  link: string,
  owner: ObjectId,
  likes: ObjectId[],
  createdAt: Date,
}

export interface IError extends Error {
  statusCode: number;
}

export interface ISessionRequest extends Request {
  user?: string | JwtPayload;
}

export interface ISessionRequestAuth extends Request {
  user?: {
    _id: string
  }
}
