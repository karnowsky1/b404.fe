import { request, setAuthToken } from './request';
import { hash } from '../utils';

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

export const login = async (
  username: string,
  password: string
): Promise<User> => {
  const response = await request<User>({
    method: 'POST',
    route: '/login',
    body: { username, password: hash(password) },
    unprotected: true,
  });
  const { Authorization } = response.headers;
  if (Authorization) {
    setAuthToken(Authorization);
  }
  return response.data;
};
