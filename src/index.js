import history from './history';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import configureStore from './store';
import 'typeface-roboto';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
