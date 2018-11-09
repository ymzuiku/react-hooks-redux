import React, { useReducer, useContext, createContext } from 'react';

let devLogSty = `background: rgb(70, 70, 70); color: rgb(240, 235, 200); width:100%;`;
export function devLog(type, oldState, nextState) {
  console.info(`%c|------- redux: ${type} -------|`, devLogSty);
  console.info('|--last:', oldState);
  console.info('|--next:', nextState);
}

export function reducerInAction(state, action) {
  if (action.callback) {
    const nextState = action.callback(state);
    return nextState;
  }
  return state;
}

export default function createStore(reducer, initialState = {}, middleware) {
  function reducer(state, action) {
    if (action.reducer) {
      const nextState = action.reducer(state);
      if (middleware) {
        for (const k in middleware) {
          middleware[k](action.type, state, nextState);
        }
      }
      return nextState;
    }
    return state;
  }
  let realReducer;
  if (middleware) {
    realReducer = function(state, action) {
      const nextState = reducer(state, action);
      if (middleware) {
        for (const k in middleware) {
          middleware[k](action.type, state, nextState);
        }
      }
      return nextState;
    };
  } else {
    realReducer = reducer;
  }

  const AppContext = createContext();
  const store = {
    useContext: function() {
      return useContext(AppContext);
    },
    dispatch: undefined,
    state: initialState,
    initialState,
  };
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
