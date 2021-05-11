import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import Header from './Header';
import BlogList from './blogs/BlogList';
import TagList from './blogs/TagList';
import Login from './auth/Login';

import history from '../history';
import './App.css';

const App = () => {
  return (
    <Router history={history}>
      <Header />
      <Switch>
        <Route path="/" exact component={BlogList} />
        <Route path="/tags" component={TagList} />
        <Route path="/login" component={Login} />
      </Switch>
    </Router>
  );
};

export default App;
