import { LOGIN } from '../actions';
import { takeLatest, call } from 'redux-saga/effects';
import { login, getCurrentUser } from './login';

export function* rootSaga() {
  yield takeLatest(LOGIN, login);
  yield call(getCurrentUser);
}
