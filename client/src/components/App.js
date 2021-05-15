import './App.css';
import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import Header from './Header';
import BlogList from './blogs/BlogList';
import TagList from './blogs/TagList';
import MyPage from './blogs/MyPage';
import Login from './auth/Login';
import Logout from './auth/Logout';
import Signup from './auth/Signup';
import BlogCreate from './blogs/BlogCreate';
import BlogDetail from './blogs/BlogDetail';

import history from '../history';

const App = () => {
  return (
    <Router history={history}>
      <Header />
      <Switch>
        <Route path="/" exact component={BlogList} />
        <Route path="/tags" component={TagList} />
        <Route path="/mypage" component={MyPage} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <Route path="/signup" component={Signup} />
        <Route path="/blog/new" component={BlogCreate} />
        <Route path="/blog/:id" component={BlogDetail} />
      </Switch>
    </Router>
  );
};

export default App;
