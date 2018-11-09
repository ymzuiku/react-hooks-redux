import * as React from 'react';

interface IStore {
  useContext: Function;
  dispatch: Function;
  state: Object;
  initalState: Object;
}

interface IReactHooksRedux {
  Provider: React.Component;
  store: IStore;
}

declare const ReactHooksRedux: IReactHooksRedux;

export function devLog();
export function reducerInAction();
