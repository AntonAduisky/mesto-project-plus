import {
  BAD_REQUEST_ERROR, FORBIDDEN_ERROR, INTERNAL_SERVER_ERROR, NOT_FOUND_ERROR, UNAUTHORIZED_ERROR,
} from './constants';

export class CustomError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function notFoundError(message: string) {
  return new CustomError(NOT_FOUND_ERROR, message);
}

export function badRequestError(message: string) {
  return new CustomError(BAD_REQUEST_ERROR, message);
}

export function unauthorizedError(message: string) {
  return new CustomError(UNAUTHORIZED_ERROR, message);
}

export function forbiddenError(message: string) {
  return new CustomError(FORBIDDEN_ERROR, message);
}

export function internalServerError(message: string) {
  return new CustomError(INTERNAL_SERVER_ERROR, message);
}
