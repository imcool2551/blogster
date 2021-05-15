import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Modal from '../Modal';
import history from '../../history';
import { fetchBlog, deleteBlog } from '../../actions/blog';

const BlogDelete = ({ blog, deleteBlog, fetchBlog, match }) => {
  useEffect(() => {
    fetchBlog(match.params.id);
  }, [fetchBlog, match.params.id]);

  const renderActions = () => {
    const { id } = match.params;
    return (
      <>
        <button onClick={() => deleteBlog(id)} className="ui button negative">
          삭제
        </button>
        <Link to="/mypage" className="ui button">
          취소
        </Link>
      </>
    );
  };

  const renderContent = () => {
    if (!blog) {
      return '이 포스트를 삭제하시겠습니까?';
    }

    return `이 포스트를 삭제하시겠습니까?: ${blog.title}`;
  };

  return (
    <>
      <Modal
        title="포스트 삭제"
        content={renderContent()}
        actions={renderActions()}
        onDismiss={() => history.push('/mypage')}
      />
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    blog: state.blogs[ownProps.match.params.id],
  };
};

export default connect(mapStateToProps, { fetchBlog, deleteBlog })(BlogDelete);
