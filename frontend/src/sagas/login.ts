import { put } from 'redux-saga/effects';

import { LoginAction, setUser, setAuthenticated } from '../actions';
import { login as loginRequest, User } from '../api';
import { errorHandler } from './error';

export function* login(action: LoginAction) {
  try {
    const { username, password } = action.payload;
    const user: User = yield loginRequest(username, password);
    yield put(setUser(user));
    yield put(setAuthenticated(true));
  } catch (e) {
    yield errorHandler(e);
  }
}
