export const TOKEN_KEY = 'token';
export const UUID_KEY = 'uuid';

export const AUTH = {
  ADMIN: 1,
  DIRECTOR: 2,
  COACH: 3,
  CUSTOMER: 4,
  PROVIDER: 5
};

export const IS_ADNMIN = authorization_level => {
  return authorization_level <= AUTH.ADMIN;
};

export const IS_INTERNAL = authorization_level => {
  return authorization_level <= AUTH.COACH;
};

export const IS_EXTERNAL = authorization_level => {
  return authorization_level <= AUTH.CUSTOMER;
};

export const IS_Provider = authorization_level => {
  return authorization_level <= AUTH.PROVIDER;
};
