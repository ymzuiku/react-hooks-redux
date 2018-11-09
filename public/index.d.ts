import * as React from 'react';

interface IStore {
  useContext: Function;
  dispatch: Function;
}

interface IReactHooksRedux {
  Provider: React.Component;
  store: IStore;
  devTool: Function;
}

declare const ReactHooksRedux: IReactHooksRedux;
