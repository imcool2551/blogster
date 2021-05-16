import './css/MyPage.css';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import { fetchMyBlogs } from '../../actions/blog';

const MyPage = ({ isSignedIn, blogs, fetchMyBlogs }) => {
  const [loading, setLoading] = useState(true);

  if (!isSignedIn) {
    <Redirect to="/" />;
  }

  useEffect(() => {
    const init = async () => {
      await fetchMyBlogs();
      setLoading(false);
    };
    init();
  }, [fetchMyBlogs]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const renderBlogs = (blogs) =>
    Object.values(blogs)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((blog) => {
        return (
          <div key={blog.id} className="card">
            <div className="content">
              <div className="header">{blog.title}</div>
              <div className="description">
                {new Date(blog.createdAt).toLocaleDateString()}
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

  return (
    <div className="my-page">
      <h1 className="my-page-header">내가 작성한 글</h1>
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
