import './css/MyPage.css';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import { fetchMyBlogs } from '../../actions/blog';

const MyPage = ({ isSignedIn, user_id, username, blogs, fetchMyBlogs }) => {
  if (!isSignedIn) {
    <Redirect to="/" />;
  }

  useEffect(() => {
    fetchMyBlogs();
  }, [fetchMyBlogs]);

  if (!blogs) {
    return <div>You don't have any posts</div>;
  }

  const renderBlogs = (blogs) => {
    return Object.values(blogs)
      .filter((blog) => blog.user_id === user_id)
      .reverse()
      .map((blog) => {
        return (
          <div className="card" key={blog.id}>
            <div className="content">
              <div className="header">{blog.title}</div>
              <div className="description">
                {new Date(blog.createdAt).toDateString()}
              </div>
              <div className="extra content">
                <div className="ui two buttons">
                  <Link
                    className="ui basic green button"
                    to={`/blog/${blog.id}`}
                  >
                    자세히 보기
                  </Link>
                  <Link
                    className="ui basic red button"
                    to={`/blog/delete/${blog.id}`}
                  >
                    삭제
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      });
  };

  return (
    <div className="my-page">
      <h1 className="my-page-header">{username} 's Posts</h1>
      <div className="my-page-main ui cards">{renderBlogs(blogs)}</div>
      <Link className="my-page-new" to="/blog/new">
        +
      </Link>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.auth.isSignedIn,
    user_id: state.auth.user_id,
    username: state.auth.username,
    blogs: state.blogs,
  };
};

export default connect(mapStateToProps, { fetchMyBlogs })(MyPage);
