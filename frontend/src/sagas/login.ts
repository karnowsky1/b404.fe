import { put } from 'redux-saga/effects';

import { LoginAction, setUser } from '../actions';
import { login as loginRequest, User } from '../api';

export function* login(action: LoginAction) {
  try {
    const { username, password } = action.payload;
    const user: User = yield loginRequest(username, password);
    yield put(setUser(user));
  } catch (e) {
    // TODO dispatch some error handler action
  }
}
