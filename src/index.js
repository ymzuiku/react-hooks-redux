import React from 'react';

function reducerInAction(state, action) {
  if (typeof action.reducer === 'function') {
    return action.reducer(state);
  }
  return state;
}

const subscribeCache = {};
let subscribeNum = 0;
function subscribe(fn) {
  if (typeof fn !== 'function') {
    throw new Error('react-hooks-redux: subscribe params need a function');
  }
  subscribeNum++;
  function unSubscribe() {
    delete subscribeCache[subscribeNum];
  }
  return unSubscribe;
}

function runSubscribes(action, state) {
  for (const k in subscribeCache) {
    subscribeCache[k](state);
  }
}
export default function createStore(params) {
  const { isDev, reducer, initialState, middleware } = {
    isDev: false,
    reducer: reducerInAction,
    initialState: {},
    middleware: params.isDev ? [middlewareLog] : undefined,
    autoSave: { localName: undefined, keys: [] },
    ...params,
  };
  const AppContext = React.createContext();
  const store = {
    isDev,
    useContext: function() {
      return React.useContext(AppContext);
    },
    subscribe,
    dispatch: undefined,
    state: initialState,
    initialState,
  };
  if (store.autoSave && store.autoSave.localName) {
    autoSaveLocalStorage(store, store.autoSave.localName, store.autoSave.keys);
  }
  const realReducer = function(lastState, action) {
    let nextState = reducer(lastState, action);
    if (middleware) {
      if (Object.prototype.toString.call(middleware) !== '[object Array]') {
        throw new Error("react-hooks-redux: middleware isn't Array");
      }
      for (let i = 0; i < middleware.length; i++) {
        const newState = middleware[i](store, lastState, nextState, action);
        if (newState) {
          nextState = newState;
        }
      }
    }
    runSubscribes(action, nextState);
    return nextState;
  };

  function Provider(props) {
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
  }
  return { Provider, store };
}

// 用于本地存储的方法
export const storage = {
  localName: 'defaultIOKey',
  save: (v, theKey = storage.localName) => {
    const theType = Object.prototype.toString.call(v);
    if (theType === '[object Object]') {
      localStorage.setItem(theKey, JSON.stringify(v));
    } else if (theType === '[object String]') {
      localStorage.setItem(theKey, v);
    } else {
      console.warn('Warn: storage.save() param is no a Object');
    }
  },
  load: (theKey = storage.localName) => {
    try {
      const data = localStorage.getItem(theKey);
      if (data) {
        if (typeof data === 'string') {
          return JSON.parse(data);
        }
        return data;
      }
    } catch (err) {
      console.warn('load last localSate error');
    }
  },
  clear: (theKey = storage.localName) => {
    localStorage.setItem(theKey, {});
  },
};

// 这里做自动保存的监听
export function autoSaveLocalStorage(store, localName, needSaveKeys) {
  if (localName) {
    storage.localName = localName;
  }
  if (Object.prototype.toString.call(needSaveKeys) !== '[object Array]') {
    // eslint-disable-next-line
    console.warn('autoSaveStorageKeys: params is no a Array');
  }
  // 只有needSaveKeys的修改会激发IO, lastDats保存之前的记录
  const lastDatas = {};
  needSaveKeys.forEach(v => {
    lastDatas[v] = undefined;
  });
  store.subscribe(() => {
    const state = store.getState();
    if (state && state.toJS) {
      //immutable 类型
      const nowDatas = {};
      let isNeedSave = false;
      needSaveKeys.forEach(v => {
        // 监听数据和 Immutable 配合做低开销校验
        if (Object.prototype.toString.call(v) === '[object Array]') {
          nowDatas[v] = state.getIn(v);
        } else {
          nowDatas[v] = state.get(v);
        }
        if (lastDatas[v] !== nowDatas[v]) {
          isNeedSave = true;
        }
      });
      if (isNeedSave) {
        storage.save(nowDatas);
        needSaveKeys.forEach(v => {
          lastDatas[v] = nowDatas[v];
        });
      }
    } else {
      // 非immutable做浅比较判断是否需要保存
      const nowDatas = {};
      let isNeedSave = true;
      needSaveKeys.forEach(v => {
        nowDatas[v] = state[v];
        if (lastDatas[v] !== nowDatas[v]) {
          isNeedSave = true;
        }
      });
      if (isNeedSave) {
        storage.save(nowDatas);
        needSaveKeys.forEach(v => {
          lastDatas[v] = nowDatas[v];
        });
      }
    }
  });
  //首次加载读取历史数据
  const lastLocalData = storage.load(storage.localName);
  if (Object.prototype.toString.call(lastLocalData) === '[object Object]') {
    store.dispatch({
      type: 'localStorageLoad: IO',
      reducer: state => {
        // 如果是immutable 使用toJS
        if (state && state.toJS) {
          const data = {
            ...state.toJS(),
            ...lastLocalData,
          };
          for (const key in data) {
            state = state.setIn(key, data[key]);
          }
          return state;
        }
        // 非immutable直接合并历史数据
        return {
          ...state,
          ...lastLocalData,
        };
      },
    });
  }
}

export function middlewareLog(store, lastState, nextState, action) {
  if (store.isDev) {
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

export function middlewareImmutableLog(...args) {
  if (!args || args.length === 0) {
    throw new Error('middlewareImmutableLog: no have immutable keys');
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
  return function(store, lastState, nextState, action) {
    if (store.isDev) {
      let data;
      if (nextState === undefined || !nextState.toJS) {
        data = [lastState, nextState];
      } else {
        data = getImmerForKeys(lastState, nextState, args);
      }
      console.log(
        `%c|------- redux: ${action.type} -------|`,
        `background: rgb(70, 70, 70); color: rgb(240, 235, 200); width:100%;`,
      );
      console.log('|--diff:', data[0]);
      console.log('|--merge:', data[1]);
    }
  };
}
