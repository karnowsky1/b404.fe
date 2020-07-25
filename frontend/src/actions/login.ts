import { Action } from './types';
import { Person } from '../api';

export type LoginActions =
  | LoginAction
  | SetUserAction
  | SetAuthenticatedAction
  | LogoutAction;

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

export const LOGOUT = 'LOGOUT';
export type LogoutAction = Action<typeof LOGOUT>;
export const logout = (): LogoutAction => ({
  type: LOGOUT,
  payload: {},
});

export const SET_USER = 'SET_USER';
export type SetUserAction = Action<typeof SET_USER, Person>;
export const setUser = (user: Person): SetUserAction => ({
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
