import { AxiosError } from 'axios';
import { put } from 'redux-saga/effects';

import { setAuthenticated } from '../actions';
import { clearAuthToken } from '../api';

export function* errorHandler(error: AxiosError) {
  if (error.response?.status === 401) {
    clearAuthToken();
    yield put(setAuthenticated(false));
  } else {
    console.error(error.message);
    // TODO Set some error in redux state to display error notification
  }
}
