import './css/Login.css';
import React from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';

import LoginForm from './LoginForm';
import { signIn } from '../../actions/auth';

const Login = ({ isSignedIn, signIn }) => {
  const onSubmit = async (formValues) => {
    await signIn(formValues);
  };

  if (isSignedIn) {
    return <Redirect to="/" />;
  }
  return (
    <div className="login">
      <LoginForm onSubmit={onSubmit} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, { signIn })(Login);
