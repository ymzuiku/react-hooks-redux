import * as React from 'react';

interface IStore {
  useContext: Function;
  dispatch: Function;
  state: Object;
  initalState: Object;
  subscribe: Function;
}

interface IReactHooksRedux {
  Provider: React.Component;
  store: IStore;
}
interface IReactHooksReduxParams {
  isDev?: Boolean;
  reducer?: (state: Object, action: Function) => Object;
  initialState?: Object;
  autoSave?: { localName: String; keys: Array<any> };
  middleware?: Object | undefined;
}

interface IStorage {
  localName: string;
  save: (obj: any, key: string) => void;
  load: (key: string) => any;
  clear: (key: string) => void;
}

export default function(params: IReactHooksReduxParams): IReactHooksRedux;

export function middlewareLog(
  oldState: Object,
  nextState: Object,
  action: Object,
): void;
export function middlewareImmutableLog(): void;

export const reducerInAction: (state: Object, action: Function) => Object;

export const storage: IStorage;
