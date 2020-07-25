import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, compose } from 'redux';
import { ThemeProvider, createMuiTheme, CssBaseline } from '@material-ui/core';

import { App } from './App';
import { rootSaga } from './sagas';
import { rootReducer } from './reducers';
import * as serviceWorker from './serviceWorker';
import { AUTH_TOKEN_KEY } from './utils';
import { setAuthToken } from './api';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: Function;
  }
}

const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
if (storedToken) {
  setAuthToken(storedToken);
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#409ADF',
    },
    secondary: {
      light: '#2B3648',
      contrastText: '#7486A9',
      main: '#1B212A',
    },
    divider: '#313C4E',
  },
});

const composeEnhancers =
  (typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?.({})) ||
  compose;
const sagaMiddleware = createSagaMiddleware();
const enhancers = composeEnhancers(applyMiddleware(sagaMiddleware));
const store = createStore(
  rootReducer,
  { login: { isAuthenticated: !!storedToken } } as any,
  enhancers
);
sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
