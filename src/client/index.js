import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from '../redux/store';
import { Provider } from 'react-redux';
import { browserHistory, Router } from 'react-router';
import routes from '../routes.js';
import { syncHistoryWithStore } from 'react-router-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

let initialState = {};

const store = configureStore(initialState, browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes}/>
  </Provider>,
  document.getElementById('app')
);
