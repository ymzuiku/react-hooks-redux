import React, { useReducer, useContext, createContext } from 'react';

let devLogSty = `background: rgb(70, 70, 70); color: rgb(240, 235, 200); width:100%;`;
export function devLog(isDev, oldState, nextState, action) {
  if (isDev) {
    console.log(`%c|------- redux: ${action.type} -------|`, devLogSty);
    console.log('|--last:', oldState);
    console.log('|--next:', nextState);
  }
}

export function reducerInAction(state, action) {
  if (action.reducer) {
    return action.reducer(state);
  }
  return state;
}

export default function createStore(params) {
  const { isDev, reducer, initialState, actions, middleware } = {
    isDev: false,
    reducer: reducerInAction,
    initialState: {},
    actions: {},
    middleware: { devLog },
    ...params,
  };
  const AppContext = createContext();
  const store = {
    useContext: function() {
      return useContext(AppContext);
    },
    actions,
    dispatch: undefined,
    state: initialState,
    initialState,
  };
  let realReducer;
  if (middleware) {
    realReducer = function(state, action) {
      const nextState = reducer(state, action);
      if (middleware) {
        for (const k in middleware) {
          middleware[k](isDev, state, nextState, action);
        }
      }
      return nextState;
    };
  } else {
    realReducer = reducer;
  }

  function Provider(props) {
    const [state, dispatch] = useReducer(realReducer, initialState);
    if (!store.dispatch) {
      store.dispatch = async function(action) {
        if (typeof action === 'function') {
          await action(dispatch, store.state);
        } else {
          dispatch(action);
        }
      };
    }
    store.state = state;
    return <AppContext.Provider {...props} value={state} />;
  }
  return { Provider, store };
}
