[English Document](README-EN.md)

## 原由

react-hooks 是 react 官方新的编写推荐，我们很容易在官方的 useReducer 钩子上进行一层很简单的封装以达到和以往 react-redux \ redux-thunk \ redux-logger 类似的功能，并且大幅度简化了声明。

react-hooks 的更多信息请阅读 [reactjs.org/hooks](reactjs.org/hooks);

## 特性

- 非常小，只有 11k，gzip 之后只有 3.9k
- 简易的实现了 redux-thunk 和 redux-logger
- 默认使用 reducer-in-action 的风格, 也可声明传统的 reducer 风格

## 先看看源码

这70行代码就是全部, 客官可以先阅读以下，或许后续的说明文档也就不需要阅读了。

```js
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
```

## reducer-in-action 风格

这 6 行代码就是 reducer-in-action 的全部:

```js
function reducerInAction(state, action) {
  if (typeof action.reducer === 'function') {
    return action.reducer(state);
  }
  return state;
}
```

它把 reducer 给简化了，放置到了每一个 action 中进行 reducer 的处理。我们再也不需要写一堆 Switch，并且时刻关注 action 的 type 是否和 redcer 中的 type 一致。

reducer-in-action 配合 thunk 风格，可以非常简单的编写 redux，随着项目的复杂，我们只需要编写 action，会使得项目结构更清晰。

## 使用

安装, 您甚至可以将上面那70行代码拷贝至项目中, 需要 react 版本 >= 16.7

```js
yarn add react-hooks-redux
```

我们只用了 35 行代码就声明了一个完整的 react-redux 的例子, 拥抱 hooks。

```js
import React from 'react';
import ReactHookRedux from 'react-hooks-redux';

// 通过 ReactHookRedux 获得 Provider 组件和一个 sotre 对象
const { Provider, store } = ReactHookRedux({
  isDev: true, // 打印日志
  initialState: { name: 'dog', age: 0 },
});

function actionOfAdd() {
  return {
    type: 'add the count',
    reducer(state) {
      return { ...state, age: state.age + 1 }; // 每次需要返回一个新的 state
    },
  };
}

setInterval(() => {
  store.dispatch(actionOfAdd()); // 这行代码可以放到其他组件，在需要的时候进行派发更新
}, 500);

function Page() {
  const state = store.useContext();
  return <div>{state.age}</div>;
}

export default function App() {
  return (
    <Provider>
      <Page />
    </Provider>
  );
}
```

## middleware 的编写

绝大部分情况，你不需要编写middleware, 不过它也极其简单。middleware 是一个一维数组，数组中每个对象都是一个函数, 传入了参数并且如果返回的对象存在, 就会替换成 nextState 并且继续执行下一个 middleware。

我们可以使用 middleware 进行打印日志、编写chrome插件或者二次处理 state 等操作。

我们看看 middleware 的源码:

```js
let nextState = reducer(lastState, action);
for (let i = 0; i < middleware.length; i++) {
  const newState = middleware[i](lastState, nextState, action, isDev);
  if (newState) {
    nextState = newState;
  }
}
return nextState;
```

## 性能和注意的事项

性能(和实现上)上最大的区别是，react-hooks-redux 使用 useConnect 钩子代替 connect 高阶组件进行 dispatch的派发。

在传统的 react-redux 中，如果一个组件被 connect 高阶函数进行处理，那么当 dispatch 时，这个组件相关的 mapStateToProps 函数就会被执行，并且返回新的 props 以激活组件更新。

而在 hooks 风格中，当一个组件被声明了 useContext() 时，context 相关联的对象被变更了，这个组件会进行更新。

理论上性能和 react-redux 是一致的，由于 hooks 相对于 class 有着更少的声明，所以应该会更快一些。

所以，我们有节制的使用 useContext 可以减少一一些组件被 dispatch 派发更新。

如果我们需要手动控制减少更新 可以参考 [useMemo](https://reactjs.org/docs/hooks-reference.html#usememo) 钩子的使用方式进行配合。

以上都是理论分析，由于此库和此文档是一个深夜的产物，并没有去做性能上的基准测试，所以有人如果愿意非常欢迎帮忙做一些基准测试。

## 完整的组件操作及异步action的例子

```js
import React from 'react';
import ReactHookRedux, { reducerInAction, devLog } from 'react-hooks-redux';

// 通过 ReactHookRedux 获得 Provider 组件和一个 sotre 对象
// <Provider />组件内置了Context关联到value, store在其他组件中应用进行数据的获取(useContext)或传递(dispatch)
const { Provider, store } = ReactHookRedux({
  isDev: true, // default is false
  initialState: { count: 0, asyncCount: 0 }, // default is {}
  reducer: reducerInAction, // default is reducerInAction 所以可省略
  middleware: [devLog], // default is [devLog] 所以可省略
  actions: {} // default is {} 所以可省略
});

const actions = {
  add: () => {
    return {
      type: 'add',
      // 如果使用 reducerInAction 的reducer， 我们需要在action的返回对象中添加一个reducer函数，并且在此函数处理此action的reducer行为
      // 这只是把reducer中的行为拆分到了action中，可以不用再去编写reducer文件
      reducer(state) {
        return {
          ...state,
          count: state.count + 1,
        };
      },
    };
  },

  // 如果返回的是一个function，我们会把它当成类似 react-thunk 的处理方式，并且额外增加一个ownState的对象方便获取state
  asyncAdd: () => async (dispatch, ownState) => {
    const asyncCount = await testFetchAdd(ownState.asyncCount);
    dispatch({
      type: 'asyncAdd',
      // if use reducerInAction, we can add reducer Function repeat reducer
      reducer(state) {
        return {
          ...state,
          asyncCount,
        };
      },
    });
  },
};

function Item() {
  // 使用 useContext 来代替 sotre,getState()，带来的好处是不需要为每个组件使用connect进行处理
  const state = store.useContext();
  return (
    <>
      <div>count: {state.count}</div>
      <div>async-count: {state.asyncCount}</div>
    </>
  );
}

function Button() {
  async function handleAdd() {
    // 使用 dispatch
    store.dispatch(actions.add());
    // 使用 async dispatch
    await store.dispatch(actions.asyncAdd());
  }
  return <button onClick={handleAdd}>add</button>;
}

export default function App() {
  return (
    <Provider>
      <Item />
      <Button />
    </Provider>
  );
}

// 模拟异步操作
function testFetchAdd(a) {
  return new Promise(cb => {
    setTimeout(() => {
      cb(a + 1);
    }, 600);
  });
}
```

## Licenes

```
MIT License

Copyright (c) 2013-present, Facebook, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
