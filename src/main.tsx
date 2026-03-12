import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import React from 'react';

import App from './App';
import './setupMonaco';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
