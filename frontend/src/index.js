// -- React and related libs
import React from 'react';
import { render } from 'react-dom';
import { SpeechProvider } from '@speechly/react-client';

// -- Redux
import { createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import { Provider } from 'react-redux';
import reducers from './reducers';

// -- App
import App from './App';

// -- Data Store
const store = createStore(
  reducers,
  applyMiddleware(ReduxThunk)
);

// -- Rendering Application
render(
  <Provider store={store}>
    <SpeechProvider appId="2695c95a-d005-4da8-814a-18e79390a4d8" language="en-US">
      <App />
    </SpeechProvider>
  </Provider>,
  document.getElementById('root')
);


