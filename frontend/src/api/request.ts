import axios, { Method, AxiosRequestConfig, AxiosResponse } from 'axios';
import { stringify, ParsedUrlQueryInput } from 'querystring';
import { merge } from 'lodash';

import { BASE_URL, AUTH_TOKEN_KEY } from '../utils';

let authToken: string | undefined;

export const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  authToken = undefined;
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export interface RequestOptions {
  method?: Method;
  route: string;
  body?: ParsedUrlQueryInput;
  config?: AxiosRequestConfig;
  unprotected?: boolean;
}

export const request = <R = void>({
  method = 'GET',
  route,
  body = {},
  config = {},
  unprotected = false,
}: RequestOptions): Promise<AxiosResponse<R>> => {
  if (!unprotected && !authToken) {
    throw new Error(
      `No auth token found! User must be authenticated to call ${request.name}.`
    );
  }
  const defaultConfig: AxiosRequestConfig = {
    url: `${BASE_URL}${route}`,
    method,
    data: stringify(body),
    headers: {
      Authorization: authToken,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  return axios(merge(config, defaultConfig));
};
