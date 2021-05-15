import './css/BlogDetail.css';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import parse from 'html-react-parser';

import { fetchBlog } from '../../actions/blog';

const BlogDetail = (props) => {
  useEffect(() => {
    props.fetchBlog(props.match.params.id);
  }, []);

  const { blog } = props;
  if (!props.blog) {
    return <div>Loading...</div>;
  }

  const renderTags = (tags) => {
    return (
      <ul>
        {tags.map((tag) => {
          return <li>{tag.tag_name}</li>;
        })}
      </ul>
    );
  };

  const renderImages = (images) => {
    const baseUrl =
      'https://legends-guide-archive-2021.s3.ap-northeast-2.amazonaws.com/';
    return (
      <>
        {images.map((image) => {
          return <img src={baseUrl + image.path} />;
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
        <h4>{`by ${blog.user.username} on ${new Date(
          blog.createdAt
        ).toDateString()}`}</h4>
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
