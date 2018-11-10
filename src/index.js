import React from 'react';

function devLog(lastState, nextState, action, isDev) {
  if (isDev) {
    console.log(
      `%c|------- redux: ${action.type} -------|`,
      `background: rgb(70, 70, 70); color: rgb(240, 235, 200); width:100%;`,
    );
    if (lastState && typeof lastState.toJS === 'function') {
      console.log('|--last:', lastState.toJS());
    } else {
      console.log('|--last:', lastState);
    }
    if (nextState && typeof nextState.toJS === 'function') {
      console.log('|--next:', nextState.toJS());
    } else {
      console.log('|--next:', nextState);
    }
  }
}

export function createDevLogFromImmutable(...args) {
  if (!args || args.length === 0) {
    return devLog;
  }
  function getImmerForKeys(last, next, ks) {
    const endDiff = {};
    const endNext = {};
    for (let i = 0; i < ks.length; i++) {
      let d1, d2;
      if (Object.prototype.toString.call(ks[i]) === '[object Array]') {
        d1 = last.getIn(ks[i]);
        d2 = next.getIn(ks[i]);
      } else {
        d1 = last.get(ks[i]);
        d2 = next.get(ks[i]);
      }
      if (d1 !== d2) {
        if (Object.prototype.toString.call(d2) === '[object Object]') {
          endDiff[ks[i]] = {};
          for (const k in d2) {
            const sub1 = last.getIn([ks[i], k]);
            const sub2 = last.getIn([ks[i], k]);
            if (sub1 !== sub2) {
              endDiff[ks[i]][k] = sub2;
            }
          }
        } else {
          endDiff[ks[i]] = d2;
        }
      }
      endNext[ks[i]] = d2;
    }
    return [endDiff, endNext];
  }
  return function(lastState, nextState, action, isDev) {
    const data = getImmerForKeys(lastState, nextState, args);
    if (isDev) {
      console.log(
        `%c|------- redux: ${action.type} -------|`,
        `background: rgb(70, 70, 70); color: rgb(240, 235, 200); width:100%;`,
      );
      console.log('|--diff:', data[0]);
      console.log('|--merge:', data[1]);
    }
  };
}

function reducerInAction(state, action) {
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
    middleware: params.isDev ? [devLog] : undefined,
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
