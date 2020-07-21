import { State } from '../reducers';
import { User } from '../api';

export const selectUser = (state: State): User | undefined => state.login.user;
