import React, { useState, useContext, createContext } from 'react';

export default function createStore(initialState, isLog = false) {
  function devTool(type, diff, state) {
    console.info(`|------- redux: ${type} -------|`);
    console.info('|-diff:', diff);
    console.info('|-merge:', state);
  }
  const AppContext = createContext();
  const store = {
    useContext: function() {
      const state = useContext(AppContext);
      return state;
    },
    dispatch: undefined,
  };
  function useProvider(initialState = {}) {
    const [state, setState] = useState(initialState);
    async function dispatch(data) {
      if (typeof data === 'function') {
        const { type, ...diff } = await data(state);
        const nextState = { ...state, ...diff };
        setState(nextState);
        if (isLog) {
          devTool(type, diff, nextState);
        }
      } else {
        const { type, ...diff } = data;
        const nextState = { ...state, ...diff };
        setState(nextState);
        if (isLog) {
          devTool(type, diff, nextState);
        }
      }
    }
    return [state, dispatch];
  }
  function Provider(props) {
    const [state, dispatch] = useProvider(initialState);
    store.dispatch = dispatch;
    return <AppContext.Provider {...props} value={state} />;
  }
  return { Provider, store, devTool };
}
