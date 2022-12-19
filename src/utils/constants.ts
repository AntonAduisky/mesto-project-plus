export const NOT_FOUND_ERROR = 404;
export const BAD_REQUEST_ERROR = 400;
export const UNAUTHORIZED_ERROR = 401;
export const FORBIDDEN_ERROR = 403;
export const INTERNAL_SERVER_ERROR = 500;
export const ERR_CONFLICT = 409;

// URL_REGEXP выполняет условия:
// Начинается с http:// или https://.
// www. — это необязательная группа.
// Путь — последовательность из цифр, латинских букв и символов -._~:/?#[]@!$&'()*+,;=
// , указанных после названия домена и доменной зоны. На конце пути может стоять решётка #.
export const URL_REGEXP = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/;
