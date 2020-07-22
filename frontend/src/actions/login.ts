import { Action } from './types';
import { User } from '../api';

export type LoginActions = LoginAction | SetUserAction | SetAuthenticatedAction;

export const LOGIN = 'LOGIN';
export interface LoginPayload {
  username: string;
  password: string;
}
export type LoginAction = Action<typeof LOGIN, LoginPayload>;
export const login = (username: string, password: string): LoginAction => ({
  type: LOGIN,
  payload: {
    username,
    password,
  },
});

export const SET_USER = 'SET_USER';
export type SetUserAction = Action<typeof SET_USER, User>;
export const setUser = (user: User): SetUserAction => ({
  type: SET_USER,
  payload: user,
});

export const SET_AUTHENTICATED = 'SET_AUTHENTICATED';
export type SetAuthenticatedAction = Action<typeof SET_AUTHENTICATED, boolean>;
export const setAuthenticated = (
  isAuthenticated: boolean
): SetAuthenticatedAction => ({
  type: SET_AUTHENTICATED,
  payload: isAuthenticated,
});
