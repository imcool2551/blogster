import './css/BlogDetail.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import parse from 'html-react-parser';

import { fetchBlog } from '../../actions/blog';

const BlogDetail = ({ blog, fetchBlog, match }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await fetchBlog(match.params.id);
      setLoading(false);
    };
    init();
  }, [fetchBlog, match.params.id]);

  // 존재하지 않는 블로그
  if (loading) {
    return <div>Loading...</div>;
  }

  const renderTags = (tags) => (
    <ul className="blog-detail-tag-list">
      {tags.map(({ tag_name }) => (
        <li className="blog-detail-tag-list-item" key={tag_name}>
          <Link className="blog-detail-tag-btn" to={`/tags#${tag_name}`}>
            {tag_name}
          </Link>
        </li>
      ))}
    </ul>
  );

  const renderImages = (images) => {
    const baseUrl =
      'https://legends-guide-archive-2021.s3.ap-northeast-2.amazonaws.com/';
    return (
      <>
        {images.map((image) => {
          return <img key={image.path} src={baseUrl + image.path} alt="" />;
        })}
      </>
    );
  };

  return (
    <div className="blog-detail">
      <div className="blog-detail-tags">{renderTags(blog.tags)}</div>
      <div className="blog-detail-title">
        <h1>{blog.title}</h1>
      </div>
      <div className="blog-detail-meta">
        <h4>
          {`by ${blog.user.username} 
          on ${new Date(blog.createdAt).toLocaleDateString()}`}
        </h4>
      </div>
      <div className="blog-detail-content">
        <div className="blog-detail-content-images">
          {renderImages(blog.images)}
        </div>
        <div className="blog-detail-content-main">{parse(blog.content)}</div>
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    blog: state.blogs[ownProps.match.params.id],
  };
};

export default connect(mapStateToProps, { fetchBlog })(BlogDetail);
