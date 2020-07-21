import { LoginState, loginReducer } from './login';
import { combineReducers } from 'redux';

export interface State {
  login: LoginState;
}

export const rootReducer = combineReducers({ login: loginReducer });
