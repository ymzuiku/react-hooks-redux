[Chinese Document](README-CN.md)

## Example

Example and Started:

```js
import React from "react";
import ReactHookRedux from "react-hooks-redux";

const { Provider, store } = ReactHookRedux({
  isDev: true,
  initialState: { name: "dog", age: 0 },
});

function actionOfAdd() {
  return {
    type: "add the count",
    reducer(state) {
      return { ...state, age: state.age + 1 };
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
      {state.age} <Button />{" "}
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

## async/await example

```js
import React from "react";
import ReactHookRedux, { reducerInAction, devLog } from "react-hooks-redux";

const { Provider, store } = ReactHookRedux({
  isDev: true, // default is false
  initialState: { count: 0, asyncCount: 0 }, // default is {}
  reducer: reducerInAction, // default is reducerInAction
  middleware: [devLog], // default is [devLog]
  actions: {}, // default is {}
});

// 模拟异步操作
function timeOutAdd(a) {
  return new Promise((cb) => setTimeout(() => cb(a + 1), 500));
}

const actions = {
  // if return a function，like react-thunk:
  asyncAdd: () => async (dispatch, ownState) => {
    const asyncCount = await timeOutAdd(ownState.asyncCount);
    dispatch({
      type: "asyncAdd",
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

## immutable example

```js
import React, { useCallback } from "react";
import ReactHookRedux from "react-hooks-redux";
import { Map } from "immutable";

const { Provider, store } = ReactHookRedux({
  isDev: true,
  initialState: Map({ products: ["iPhone"] }),
});

function actionAddProduct(product) {
  return {
    type: "add the product",
    reducer(state) {
      return state.update("products", (p) => {
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
    store.dispatch(actionAddProduct("iPhone" + num)); //dispatch
  }
  return <button onClick={handleAdd}>add-product</button>;
}

function Page() {
  const state = store.useContext();
  const products = state.get("products");

  return useCallback(
    <div>
      <Button />
      {products.map((v) => (
        <div>{v}</div>
      ))}
    </div>,
    [products]
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
