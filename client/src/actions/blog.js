import api from '../apis/api';
import axios from 'axios';
import history from '../history';

import {
  CREATE_BLOG,
  FETCH_BLOG,
  FETCH_MY_BLOGS,
  DELETE_BLOG,
  FETCH_BLOGS,
} from './types';

export const createBlog = (formValues) => async (dispatch) => {
  let { files } = formValues;
  files = files ? Array.prototype.slice.call(files) : [];

  // 1번 Promise 배열 : files 개수만큼 signed-url 준비
  const getUploadConfigs = files.map((file) => {
    return new Promise((resolve, reject) => {
      api
        .get('/api/upload')
        .then(({ data }) => {
          resolve({ ...data, file }); // { url, path, file }
        })
        .catch(reject);
    });
  });

  // 2번 Promise 배열 : s3 버킷에 파일 올리기
  let putObjects = [];
  const putObject = (uploadConfig) =>
    new Promise((resolve, reject) => {
      axios
        .put(uploadConfig.url, uploadConfig.file, {
          headers: {
            'Content-Type': uploadConfig.file.type,
          },
        })
        .then(resolve)
        .catch(reject);
    });

  // uploadConfig 배열이 모두 준비되면 (1번배열)
  Promise.all(getUploadConfigs)
    .then((uploadConfigs) => {
      console.log(1, '파일개수만큼 presigned url 요청성공');
      // paths만 분리해서
      const paths = uploadConfigs.map((uploadConfig) => {
        return uploadConfig.path;
      });
      // blog라우터에 post 요청
      return new Promise((resolve, reject) => {
        api
          .post('/api/blogs', { ...formValues, files: paths })
          .then(({ data }) => resolve({ uploadConfigs, data }))
          .catch(reject);
      });
    })
    // post 요청이 성공했다면
    .then(({ uploadConfigs, data }) => {
      console.log(2, 'POST /api/blogs 요청성공');

      // s3버킷에 파일 올리는 Promise배열 생성 (2번배열)
      uploadConfigs.forEach((uploadConfig) => {
        putObjects.push(putObject(uploadConfig));
      });

      // 스토어 변경한 뒤, 모든 파일이 올라갔다면
      dispatch({ type: CREATE_BLOG, payload: data });
      return Promise.all(putObjects);
    })
    // 마이페이지로 리디렉션
    .then(() => {
      console.log(3, 'S3 버킷에 이미지 업로드 성공');
      history.push('/mypage');
    })
    // 에러처리
    .catch((err) => {
      const message = err.response.data.errors[0].message;
      alert(message);
    });
};

export const fetchBlog = (id) => async (dispatch) => {
  const { data } = await api.get(`/api/blogs/${id}`);
  dispatch({ type: FETCH_BLOG, payload: data });
};

export const fetchMyBlogs = () => async (dispatch) => {
  const { data } = await api.get(`/api/user/blogs`);
  dispatch({ type: FETCH_MY_BLOGS, payload: data });
};

export const deleteBlog = (id) => async (dispatch) => {
  try {
    await api.delete(`/api/blogs/${id}`);
    dispatch({ type: DELETE_BLOG, payload: id });
  } catch (err) {
  } finally {
    history.push('/mypage');
  }
};

export const fetchBlogs = (page, limit) => async (dispatch) => {
  try {
    const { data } = await api.get('/api/blogs', {
      params: {
        page,
        limit,
      },
    });
    dispatch({ type: FETCH_BLOGS, payload: data });
  } catch (err) {
    throw err;
  }
};
