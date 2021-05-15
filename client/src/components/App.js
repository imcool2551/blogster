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
import BlogDelete from './blogs/BlogDelete';

import history from '../history';

const App = () => {
  return (
    <Router history={history}>
      <Header />
      <Switch>
        <Route path="/" exact component={BlogList} />
        <Route path="/tags" exact component={TagList} />
        <Route path="/mypage" exact component={MyPage} />
        <Route path="/login" exact component={Login} />
        <Route path="/logout" exact component={Logout} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/blog/new" exact component={BlogCreate} />
        <Route path="/blog/:id" exact component={BlogDetail} />
        <Route path="/blog/delete/:id" exact component={BlogDelete} />
      </Switch>
    </Router>
  );
};

export default App;
