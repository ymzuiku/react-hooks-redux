# Use
```js
import React from 'react';
import HookRedux from 'react-hooks-redux';

const actions = {
  add: state => {
    return {
      type: 'add-fn',
      count: state.count === undefined ? 0 : state.count + 1,
    };
  },
};

const isLog = true;
const initialState = {}
const { Provider, store } = HookRedux(initialState, isLog);

const Item = React.memo(() => {
  const state = store.useContext();
  return (
      <div>
        count: {state.count}
      </div>
  );
});

const Button = React.memo(() => {
  function handleAdd() {
    store.dispatch(actions.add);
  }
  return (
    <div>
      <div onClick={handleAdd}>add</div>
    </div>
  );
});

export default React.memo(() => {
  return (
    <Provider>
        <Item />
        <Button />
    </Provider>
  );
});

```
