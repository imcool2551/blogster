import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { signOut } from '../../actions/auth';

const Logout = ({ signOut }) => {
  useEffect(() => {
    signOut();
  }, [signOut]);

  return <div>Logging out...</div>;
};

export default connect(null, { signOut })(Logout);
