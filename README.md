# Use
```js
import React from 'react';
import ReactHookRedux, { reducerInAction, devLog } from 'react-hooks-redux';

const initialState = {
  count: 0,
  asyncCount: 0,
};
const { Provider, store } = ReactHookRedux(reducerInAction, initialState, { devLog });

const actions = {
  add: () => {
    return {
      type: 'add',
      reducer(state) {
        return {
          ...state,
          count: state.count + 1,
        };
      },
    };
  },
  asyncAdd: () => async (dispatch, ownState) => {
    const asyncCount = await testFetchAdd(ownState.asyncCount);
    dispatch({
      type: 'asyncAdd',
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
  return (
    <>
      <div>count: {state.count}</div>
      <div>async-count: {state.asyncCount}</div>
    </>
  );
}

function Button() {
  async function handleAdd() {
    store.dispatch(actions.add());
    store.dispatch(await actions.asyncAdd());
    console.log('waited asyncAdd');
  }
  return (
    <div>
      <div onClick={handleAdd}>add</div>
    </div>
  );
}

export default () => {
  return (
    <Provider>
      <Item />
      <Button />
    </Provider>
  );
};

// --- test function

const testFetchAdd = a => {
  return new Promise(cb => {
    setTimeout(() => {
      cb(a + 1);
    }, 600);
  });
};


```
