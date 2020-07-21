import axios from 'axios';
import { stringify } from 'querystring';

import { BASE_URL } from './constants';
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
  const response = await axios.post<User>(
    `${BASE_URL}/login`,
    stringify({ username, password: hash(password) }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data;
};
