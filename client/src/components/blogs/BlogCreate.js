import './css/BlogCreate.css';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import BlogCreateForm from './BlogCreateForm';
import { createBlog } from '../../actions/blog';

const BlogCreate = ({ isSignedIn, createBlog }) => {
  const onSubmit = async (formValues) => {
    await createBlog(formValues);
  };

  if (!isSignedIn) {
    <Redirect to="/" />;
  }

  return (
    <div className="blog-create">
      <BlogCreateForm onSubmit={onSubmit} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.auth.isSignedIn,
  };
};

export default connect(mapStateToProps, { createBlog })(BlogCreate);
