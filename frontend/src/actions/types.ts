import { Action as ReduxAction } from 'redux';

export interface Action<T extends string, P extends Object = {}>
  extends ReduxAction<T> {
  payload: P;
}
