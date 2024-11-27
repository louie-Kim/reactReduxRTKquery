import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18에서 사용
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { extendedApiSlice } from './features/posts/postsSlice';
import { usersApiSlice } from './features/users/usersSlice';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Preload initial data
store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());
store.dispatch(usersApiSlice.endpoints.getUsers.initiate());

// React 18 방식으로 root 생성
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);
