import { State } from '../reducers';
import { Person } from '../api';

export const selectUser = (state: State): Person | undefined =>
  state.login.user;
export const selectIsAuthenticated = (state: State): boolean =>
  state.login.isAuthenticated;
