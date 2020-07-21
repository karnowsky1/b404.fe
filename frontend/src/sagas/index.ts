import { LOGIN } from '../actions';
import { takeLatest } from 'redux-saga/effects';
import { login } from './login';

export function* main() {
  yield takeLatest(LOGIN, login);
}
