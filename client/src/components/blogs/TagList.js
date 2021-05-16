import './css/TagList.css';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { fetchTags } from '../../actions/tag';

const TagList = ({ tags, fetchTags }) => {
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const renderTagList = (tags) => (
    <>
      {tags.map((tag) => {
        return (
          <li className="tag-list-item" key={tag.tag_name}>
            <a className="tag-list-btn" href={`#${tag.tag_name}`}>
              {tag.tag_name}
            </a>
          </li>
        );
      })}
    </>
  );

  const renderPosts = (posts) => (
    <>
      {posts.map((post) => {
        return (
          <Link key={post.id} className="tag-link" to={`/blog/${post.id}`}>
            {post.title}
          </Link>
        );
      })}
    </>
  );

  const renderTags = (tags) =>
    tags.map((tag) => {
      return (
        <li className="tag" key={tag.tag_name}>
          <span id={tag.tag_name} className="tag-name">
            「{tag.tag_name}」
          </span>
          {renderPosts(tag.posts)}
        </li>
      );
    });

  return (
    <>
      <ul className="tag-list">{renderTagList(tags)}</ul>
      <ul className="tags">{renderTags(tags)}</ul>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    tags: state.tags,
  };
};

export default connect(mapStateToProps, { fetchTags })(TagList);
