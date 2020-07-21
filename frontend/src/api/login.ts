import axios from 'axios';
import { stringify } from 'querystring';

import { BASE_URL, AUTH_TOKEN_KEY, hash } from '../utils';

export interface User {
  accessLevelID: number;
  companies: any[]; // TODO change this
  email: string;
  fName: string;
  lName: string;
  signature: string;
  title: string;
  username: string;
  uuid: string;
}

let authToken: string | undefined;

export const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const login = async (
  username: string,
  password: string
): Promise<User> => {
  const response = await axios.post<User>(
    `${BASE_URL}/login`,
    stringify({ username, password: hash(password) }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  const { Authorization } = response.headers;
  if (Authorization) {
    setAuthToken(Authorization);
  }
  return response.data;
};

export const authedRequest = <R extends (...args: any) => any>(
  request: (authToken: string) => R
) => (...args: Parameters<R>): ReturnType<R> => {
  if (!authToken) {
    throw new Error(
      `No auth token found! User must be authenticated to call ${request.name}.`
    );
  }
  return request(authToken)(...args);
};
