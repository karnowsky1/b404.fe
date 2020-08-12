import { Person, clearAuthToken } from '../api';
import { Reducer } from 'react';
import { LoginActions, SET_USER, SET_AUTHENTICATED, LOGOUT } from '../actions';

export interface LoginState {
  user?: Person;
  isAuthenticated: boolean;
}

export const loginReducer: Reducer<LoginState, LoginActions> = (
  state = { isAuthenticated: false },
  action
) => {
  switch (action.type) {
    case SET_USER: {
      return { ...state, user: action.payload };
    }
    case SET_AUTHENTICATED: {
      return { ...state, isAuthenticated: action.payload };
    }
    case LOGOUT: {
      clearAuthToken();
      return { ...state, isAuthenticated: false, user: undefined };
    }
    default: {
      return state;
    }
  }
};
