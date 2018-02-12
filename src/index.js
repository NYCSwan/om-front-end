import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './app.react';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((
  <Router>
    <App />
  </Router>), document.getElementById('app'));
registerServiceWorker();
