import './css/Signup.css';
import React from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';

import SignupForm from './SignupForm';
import { signUp } from '../../actions/auth';

const Signup = ({ isSignedIn, signUp }) => {
  const onSubmit = async (formValues) => {
    await signUp(formValues);
  };

  if (isSignedIn) {
    <Redirect to="/" />;
  }

  return (
    <div className="signup">
      <SignupForm onSubmit={onSubmit} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.auth.isSignedIn,
  };
};

export default connect(mapStateToProps, { signUp })(Signup);
