[English Document](README-EN.md)

> 需要 react 版本 >= 16.7

## 原由

react-hooks 是 react 官方新的编写推荐，此库在官方的 useReducer 钩子上进行一层很简单的封装以达到和以往 react-redux \ redux-thunk \ redux-logger 类似的功能，并且大幅度简化了声明。

react-hooks 的更多信息请阅读 [reactjs.org/hooks](reactjs.org/hooks);


## 特性

- 非常小，只有11k，gzip之后只有3.9k
- 已经内置了 reduc-thunk 和 redux-logger
- 默认可以不创建 reducer，使用 reducer-in-action 的风格, 也可声明传统的 reducer 风格

## reducer-in-action

这 6 行代码就是 reducer-in-action 的全部:

```js
function reducerInAction(state, action) {
  if (typeof action.reducer === 'function') {
    return action.reducer(state);
  }
  return state;
}
```

它把 reducer 给简化了，放置到了每一个 action 中进行 reducer 的处理。我们再也不需要写一堆Switch，并且时刻关注 action 的 type 是否和 redcer 中的 type 一致。

reducer-in-action 配合 thunk 风格，可以非常简单的编写 redux，随着项目的复杂，我们只需要编写action，会使得项目结构更清晰。

## 使用

我们只用了30行代码就声明了一个react-redux的例子, 拥抱hooks。

```js
import React from 'react';
import ReactHookRedux from 'react-hooks-redux';

const { Provider, store } = ReactHookRedux({
  isDev: true,
  initialState: { name: 'dog', age: 0 },
});

function actionOfAdd() {
  return {
    type: 'add the count',
    reducer(state) {
      return { ...state, age: state.age + 1 };
    },
  };
}

setInterval(() => {
  console.log('aa');
  store.dispatch(actionOfAdd());
}, 500);

function Page() {
  const state = store.useContext();
  return <div>{state.age}</div>;
}

export default function App() {
  return <Provider><Page /></Provider>;
}
```

## 性能和注意的事项

在传统的 react-redux 中，如果一个组件被 connect 高阶函数进行处理，那么当 dispatch 时，这个组件相关的 mapStateToProps 函数就会被执行，并且返回新的props以激活组件更新。

而在 hooks 风格中，当一个组件被声明了 useContext() 时，context相关联的对象被变更了，这个组件会进行更新。

理论上性能和 react-redux 是一致的，由于 hooks 相对于 class 有着更少的声明，所以应该会更快一些。

所以，我们有节制的使用 useContext 可以减少一一些组件被 dispatch 派发更新。

如果我们需要手动控制减少更新 可以参考 [useMemo](https://reactjs.org/docs/hooks-reference.html#usememo) 钩子的使用方式进行配合。

以上都是理论分析，由于该库和此文档是一个深夜的产物，并没有去做性能上的基准测试，所以有人如果愿意非常欢迎帮忙做一些基准测试。

## 完整例子

内容均在此代码中，可以拷贝替换 create-react-app 项目的 App.js 进行执行，并阅读其中注释。

```js
import React from 'react';
import ReactHookRedux, { reducerInAction, devLog } from 'react-hooks-redux';

// 通过 ReactHookRedux 获得 Provider 组件和一个 sotre 对象
// <Provider />组件内置了Context关联到value, store在其他组件中应用进行数据的获取(useContext)或传递(dispatch)
const { Provider, store } = ReactHookRedux({
  isDev: true, // default is false
  initialState: { count: 0, asyncCount: 0 }, // default is {}
  reducer: reducerInAction, // default is reducerInAction 所以可省略
  middleware: { devLog }, // default is { devLog } 所以可省略
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
