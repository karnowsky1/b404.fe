import { State } from '../reducers';
import { User } from '../api';

export const selectUser = (state: State): User | undefined => state.login.user;
export const selectIsAuthenticated = (state: State): boolean =>
  state.login.isAuthenticated;
