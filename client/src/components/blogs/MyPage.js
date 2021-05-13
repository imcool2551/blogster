import './css/MyPage.css';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

const MyPage = ({ isSignedIn }) => {
  if (!isSignedIn) {
    <Redirect to="/" />;
  }

  return (
    <div className="my-page">
      <h1>List of Blogs</h1>
      <Link className="my-page-new" to="/blog/new">
        +
      </Link>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.auth.isSignedIn,
  };
};

export default connect(mapStateToProps)(MyPage);
