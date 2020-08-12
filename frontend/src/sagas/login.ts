import { put } from 'redux-saga/effects';
import decode from 'jwt-decode';

import { LoginAction, setUser, setAuthenticated } from '../actions';
import { login as loginRequest, getPerson, Person } from '../api';
import { errorHandler } from './error';
import { AUTH_TOKEN_KEY } from '../utils';

export function* login(action: LoginAction) {
  try {
    const { username, password } = action.payload;
    const user: Person = yield loginRequest(username, password);
    yield put(setUser(user));
    yield put(setAuthenticated(true));
  } catch (e) {
    yield errorHandler(e);
  }
}

export interface JWT {
  exp: number;
  iat: number;
  iss: string;
  sub: string;
}

export function* getCurrentUser() {
  try {
    const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!authToken) {
      return yield put(setAuthenticated(false));
    }
    const { sub } = decode<JWT>(authToken);
    const user: Person = yield getPerson(sub);
    yield put(setUser(user));
    yield put(setAuthenticated(true));
  } catch (e) {
    yield errorHandler(e);
  }
}
