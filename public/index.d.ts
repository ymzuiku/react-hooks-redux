import * as React from 'react';

interface IStore {
  useContext: Function;
  dispatch: Function;
  state: Object;
  initalState: Object;
  actions: Object;
}

interface IReactHooksRedux {
  Provider: React.Component;
  store: IStore;
}
interface IParams {
  isDev: Boolean;
  reducer: (state: Object, action: Function) => Object;
  initialState: Object;
  actions: Object;
  middleware: Object | undefined;
}

declare function ReactHooksRedux(params: IParams): IReactHooksRedux;

export function devLog(
  oldState: Object,
  nextState: Object,
  action: Object,
): void;

export function reducerInAction(state: Object, action: Function): Object;
