import { request, setAuthToken } from './request';
import { hash } from '../utils';
import { Person } from './types';

export const login = async (
  username: string,
  password: string
): Promise<Person> => {
  const response = await request<Person>({
    method: 'POST',
    route: '/login',
    body: { username, password: hash(password) },
    unprotected: true,
  });
  const { authorization } = response.headers;
  if (authorization) {
    setAuthToken(authorization);
  }
  return response.data;
};
