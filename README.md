[English Document](README-EN.md)

## 原由

react-hooks 是 react 官方新的编写推荐，我们很容易在官方的 useReducer 钩子上进行一层很简单的封装以达到和以往 react-redux \ redux-thunk \ redux-logger 类似的功能，并且大幅度简化了声明。

react-hooks 的更多信息请阅读 [reactjs.org/hooks](reactjs.org/hooks);

## 先看看源码

这 70 行代码是一个完整的逻辑, 客官可以先阅读，或许后续的说明文档也就不需要阅读了。

- 简易的实现了 react-redux, redux-thunk 和 redux-logger
- 默认使用 reducer-in-action 的风格, 也可声明传统的 reducer 风格

```js
import React from 'react';

function middlewareLog(lastState, nextState, action, isDev) {
  if (isDev) {
    console.log(
      `%c|------- redux: ${action.type} -------|`,
      `background: rgb(70, 70, 70); color: rgb(240, 235, 200); width:100%;`,
    );
    console.log('|--last:', lastState);
    console.log('|--next:', nextState);
  }
}

function reducerInAction(state, action) {
  if (typeof action.reducer === 'function') {
    return action.reducer(state);
  }
  return state;
}

export default function createStore(params) {
  const { isDev, reducer, initialState, middleware } = {
    isDev: false,
    reducer: reducerInAction,
    initialState: {},
    middleware: params.isDev ? [middlewareLog] : undefined,
    ...params,
  };
  const AppContext = React.createContext();
  const store = {
    isDev,
    _state: initialState,
    useContext: function() {
      return React.useContext(AppContext);
    },
    dispatch: undefined,
    getState: function() {
      return store._state;
    },
    initialState,
  };
  let isCheckedMiddleware = false;
  const middlewareReducer = function(lastState, action) {
    let nextState = reducer(lastState, action);
    if (!isCheckedMiddleware) {
      if (Object.prototype.toString.call(middleware) !== '[object Array]') {
        throw new Error("react-hooks-redux: middleware isn't Array");
      }
      isCheckedMiddleware = true;
    }
    for (let i = 0; i < middleware.length; i++) {
      const newState = middleware[i](store, lastState, nextState, action);
      if (newState) {
        nextState = newState;
      }
    }
    store._state = nextState;
    return nextState;
  };

  const Provider = props => {
    const [state, dispatch] = React.useReducer(middlewareReducer, initialState);
    if (!store.dispatch) {
      store.dispatch = async function(action) {
        if (typeof action === 'function') {
          await action(dispatch, store._state);
        } else {
          dispatch(action);
        }
      };
    }
    return <AppContext.Provider {...props} value={state} />;
  };
  return { Provider, store };
}
```

## reducer-in-action 风格

reducer-in-action 是一个 reducer 函数，这 6 行代码就是 reducer-in-action 的全部:

```js
function reducerInAction(state, action) {
  if (typeof action.reducer === 'function') {
    return action.reducer(state);
  }
  return state;
}
```

它把 reducer 给简化了，放置到了每一个 action 中进行 reducer 的处理。我们再也不需要写一堆 switch，再也不需要时刻关注 action 的 type 是否和 redcer 中的 type 一致。

reducer-in-action 配合 thunk 风格，可以非常简单的编写 redux，随着项目的复杂，我们只需要编写 action，会使得项目结构更清晰。

## 安装

安装 [react-hooks-redux](https://github.com/ymzuiku/react-hooks-redux), 需要 react 版本 >= 16.7

```js
yarn add react-hooks-redux
```

## 使用

我们用了不到 35 行代码就声明了一个完整的 react-redux 的例子, 拥抱 hooks。

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

function Button() {
  function handleAdd() {
    store.dispatch(actionOfAdd()); //dispatch
  }
  return <button onClick={handleAdd}>add</button>;
}

function Page() {
  const state = store.useContext();
  return (
    <div>
      {state.age} <Button />{' '}
    </div>
  );
}

export default function App() {
  return (
    <Provider>
      <Page />
    </Provider>
  );
}
```

总结一下：

- 准备工作
  - 使用 ReactHookRedux 创建 Provider 组件 和 store 对象
  - 使用 Provide r 包裹根组件
- 使用
  - 在需要使用状态的地方 使用 store.useContext() 获取 store 中的 state
  - 使用 store.dispatch(action()) 派发更新

我们阅读这个小例子会发现，没有对组件进行 connect, 没有编写 reducer 函数, 这么简化设计是为了迎合 hooks, hooks 极大的简化了我们编写千篇一律的类模板，但是如果我们还是需要对组件进行 connect, 我们又回到了编写模板代码的老路。

## middleware 的编写

绝大部分情况，你不需要编写 middleware, 不过它也极其简单。middleware 是一个一维数组，数组中每个对象都是一个函数, 传入了参数并且如果返回的对象存在, 就会替换成 nextState 并且继续执行下一个 middleware。

我们可以使用 middleware 进行打印日志、编写 chrome 插件或者二次处理 state 等操作。

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

性能(和实现上)上最大的区别是，react-hooks-redux 使用 useContext 钩子代替 connect 高阶组件进行 dispatch 的派发。

在传统的 react-redux 中，如果一个组件被 connect 高阶函数进行处理，那么当 dispatch 时，这个组件相关的 mapStateToProps 函数就会被执行，并且返回新的 props 以激活组件更新。

而在 hooks 风格中，当一个组件被声明了 useContext() 时，context 相关联的对象被变更了，这个组件会进行更新。

理论上性能和 react-redux 是一致的，由于 hooks 相对于 class 有着更少的声明，所以应该会更快一些。

所以，我们有节制的使用 useContext 可以减少一些组件被 dispatch 派发更新。

如果我们需要手动控制减少更新 可以参考 [useMemo](https://reactjs.org/docs/hooks-reference.html#usememo) 钩子的使用方式进行配合。

如果不希望组件被 store.dispatch() 派发更新，仅读取数据可以使用 store.getState(), 这样也可以减少一些不必要的组件更新。

以上都是理论分析，由于此库和此文档是一个深夜的产物，并没有去做性能上的基准测试，所以有人如果愿意非常欢迎帮忙做一些基准测试。


# 其他例子

随着工作的进展，完善了一些功能， 代码量也上升到了300行，有兴趣的可以去仓库看看：
- subscribe 添加监听
- 如使用 autoSave 约定进行 state 的缓存和读取
- middlewareLog 可以打印 immutable 对象等和状态管理相关的功能

## 异步 action 并且缓存 state 到浏览器的例子

```js
import React from 'react';
import ReactHookRedux, {
  reducerInAction,
  middlewareLog,
} from 'react-hooks-redux';

// 通过 ReactHookRedux 获得 Provider 组件和一个 sotre 对象
const { Provider, store } = ReactHookRedux({
  isDev: true, // default is false
  initialState: { count: 0, asyncCount: 0 }, // default is {}
  reducer: reducerInAction, // default is reducerInAction 所以可省略
  middleware: [middlewareLog], // default is [middlewareLog] 所以可省略
  actions: {}, // default is {} 所以可省略
  autoSave: {
    item: 'localSaveKey',
    keys: ['user'], // 需要缓存的字段
  },
});

// 模拟异步操作
function timeOutAdd(a) {
  return new Promise(cb => setTimeout(() => cb(a + 1), 500));
}

const actions = {
  // 如果返回的是一个function，我们会把它当成类似 react-thunk 的处理方式，并且额外增加一个ownState的对象方便获取state
  asyncAdd: () => async (dispatch, ownState) => {
    const asyncCount = await timeOutAdd(ownState.asyncCount);
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
  const state = store.useContext();
  return <div>async-count: {state.asyncCount}</div>;
}

function Button() {
  async function handleAdd() {
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
```

## 使用 immutableJS 配合 hooks 减少重渲染的例子

```js
import React, { useCallback } from 'react';
import ReactHookRedux from 'react-hooks-redux';
import { Map } from 'immutable';

const { Provider, store } = ReactHookRedux({
  initialState: Map({ products: ['iPhone'] }), // 请确保immutable是一个Map
  isDev: true, // 当发现对象是 immutable时，middleware会遍历属性，使用getIn做浅比较打印 diff的对象
});

function actionAddProduct(product) {
  return {
    type: 'add the product',
    reducer(state) {
      return state.update('products', p => {
        p.push(product);
        return [...p];
      });
    },
  };
}

let num = 0;
function Button() {
  function handleAdd() {
    num += 1;
    store.dispatch(actionAddProduct('iPhone' + num)); //dispatch
  }
  return <button onClick={handleAdd}>add-product</button>;
}

function Page() {
  const state = store.useContext();
  // 从immutable获取对象，如果products未改变，会从堆中获取而不是重新生成新的数组
  const products = state.get('products');

  return useCallback(
    <div>
      <Button />
      {products.map(v => (
        <div>{v}</div>
      ))}
    </div>,
    [products], // 如果products未发生改变，不会进行进行重渲染
  );
}

export default function App() {
  return (
    <Provider>
      <Page />
    </Provider>
  );
}
```

谢谢阅读。

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
