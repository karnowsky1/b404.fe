import { User } from '../api';
import { Reducer } from 'react';
import { LoginActions, SET_USER } from '../actions';

export interface LoginState {
  user?: User;
}

export const loginReducer: Reducer<LoginState, LoginActions> = (
  state = {},
  action
) => {
  switch (action.type) {
    case SET_USER: {
      return { ...state, user: action.payload };
    }
    default: {
      return state;
    }
  }
};
