import './css/Login.css';
import React, { useEffect } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';

import LoginForm from './LoginForm';
import { signIn, getCurrentUser } from '../../actions/auth';

const Login = (props) => {
  useEffect(() => {
    console.log('@@@@@');
    const init = async () => {
      await props.getCurrentUser();
    };
    init();
  }, []);

  const onSubmit = async (formValues) => {
    await props.signIn(formValues);
  };

  if (props.isSignedIn) {
    console.log('@@');
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

export default connect(mapStateToProps, { signIn, getCurrentUser })(Login);
