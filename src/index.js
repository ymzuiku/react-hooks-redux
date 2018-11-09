import React from 'react';

export function devLog(lastState, nextState, action, isDev) {
  if (isDev) {
    console.log(
      `%c|------- redux: ${action.type} -------|`,
      `background: rgb(70, 70, 70); color: rgb(240, 235, 200); width:100%;`,
    );
    console.log('|--last:', lastState);
    console.log('|--next:', nextState);
  }
}

export function reducerInAction(state, action) {
  if (typeof action.reducer === 'function') {
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
    middleware: [devLog],
    ...params,
  };
  const AppContext = React.createContext();
  const store = {
    useContext: function() {
      return React.useContext(AppContext);
    },
    actions,
    dispatch: undefined,
    state: initialState,
    initialState,
  };
  let realReducer;
  if (middleware) {
    realReducer = function(lastState, action) {
      let nextState = reducer(lastState, action);
      for (let i = 0; i < middleware.length; i++) {
        const newState = middleware[i](lastState, nextState, action, isDev);
        if (newState) {
          nextState = newState;
        }
      }
      return nextState;
    };
  } else {
    realReducer = reducer;
  }

  const Provider = props => {
    const [state, dispatch] = React.useReducer(realReducer, initialState);
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
  };
  return { Provider, store };
}
