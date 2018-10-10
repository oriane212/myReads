import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

/* render App component into DOM node with id='root' */
ReactDOM.render((
   <BrowserRouter>
    <App />
    </BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();
