import './css/BlogList.css';
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { fetchBlogs } from '../../actions/blog';

const BlogList = ({ count, blogs, fetchBlogs }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await fetchBlogs(1, 5);
      setLoading(false);
    };
    init();
  }, [fetchBlogs]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const renderBlogs = (blogs) =>
    Object.values(blogs)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(({ id, title, tags, user, createdAt }) => {
        return (
          <Link key={id} className="ui card" to={`/blog/${id}`}>
            <div className="header">{title}</div>
            <div className="meta">
              {tags.map((tag) => (
                <span key={tag.tag_name} className="category">
                  {tag.tag_name}
                </span>
              ))}
            </div>
            <div className="extra content">
              {`by ${user.username} on ${new Date(
                createdAt
              ).toLocaleDateString()}`}
            </div>
          </Link>
        );
      });

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= Math.ceil(count / 5); i++) {
      pages.push(
        <li key={i}>
          <button className="blog-list-btn" onClick={() => fetchBlogs(i, 5)}>
            {i}
          </button>
        </li>
      );
    }
    return pages;
  };

  return (
    <div className="blog-list">
      {renderBlogs(blogs)}
      <ul className="blog-list-nav">{renderPagination(count)}</ul>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    count: state.blogs.count,
    blogs: _.omit(state.blogs, 'count'),
  };
};

export default connect(mapStateToProps, { fetchBlogs })(BlogList);
