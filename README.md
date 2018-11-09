# Use

```js
import React from 'react';
import ReactHookRedux, { reducerInAction, devLog } from 'react-hooks-redux';

const { Provider, store } = ReactHookRedux({
  isDev: true, // default is false
  initialState: { count: 0, asyncCount: 0 }, // default is {}
  reducer: reducerInAction, // default is 'reducerInAction'
  middleware: { devLog }, // default is { devLog }
});

// So you can use this code, ignore default params
// const { Provider, store } = ReactHookRedux({ isDev: true, initialState: { count: 0, asyncCount: 0 } });

const actions = {
  add: () => {
    return {
      type: 'add',
      // if use reducerInAction, we can add reducer Function repeat reducer
      reducer(state) {
        return {
          ...state,
          count: state.count + 1,
        };
      },
    };
  },
  // if return a function, we can add use lick react-thunk
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
  // use the useContext get the store.getState();
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
    // use dispatch
    store.dispatch(actions.add());
    // use async dispatch
    await store.dispatch(actions.asyncAdd());
  }
  return (
    <button onClick={handleAdd}>add</button>
  );
}

export default function() {
  return (
    <Provider>
      <Item />
      <Button />
    </Provider>
  );
};

// --- test function

function testFetchAdd (a) {
  return new Promise(cb => {
    setTimeout(() => {
      cb(a + 1);
    }, 600);
  });
};

```
