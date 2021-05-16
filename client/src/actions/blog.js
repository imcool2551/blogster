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

  // 1번 promise 배열  (files 개수만큼 signed-url 요청)
  const getUploadConfigs = files.map((file) => {
    return new Promise((resolve, reject) => {
      api
        .get('/api/upload')
        .then(({ data }) => {
          resolve({ ...data, file });
        })
        .catch(reject);
    });
  });

  // 2번 promise 배열 (s3 버킷에 파일 올리기)
  let putObjects = [];
  const putObject = (uploadConfig, file) =>
    new Promise((resolve, reject) => {
      axios
        .put(uploadConfig.url, file, {
          headers: {
            'Content-Type': file.type,
          },
        })
        .then(resolve)
        .catch(reject);
    });

  // 1번 promise 배열 이행하면서 2번 promise배열 준비
  const paths = [];
  Promise.all(getUploadConfigs)
    .then((uploadConfigs) => {
      uploadConfigs.forEach((uploadConfig) => {
        console.log(1, 'presigned url 생성');
        paths.push(uploadConfig.key); // 블로그 post 요청시 필요
        putObjects.push(putObject(uploadConfig, uploadConfig.file));
      });
    })
    // 2번 promise 배열 이행한 뒤
    .then(() => {
      console.log(2, 's3에 이미지 업로드');
      return new Promise((resolve, reject) => {
        resolve(Promise.all(putObjects));
      });
    })
    // api 서버에 블로그 post 요청
    .then(() => {
      console.log(3, 'api서버에 블로그 post요청');
      return new Promise((resolve, reject) => {
        api
          .post('/api/blogs', { ...formValues, files: paths })
          .then(resolve)
          .catch(reject);
      });
    })
    .then(({ data }) => {
      console.log(4, 'api서버로부터 200 응답 (303 See Other)', data);
      // 스토어 변경후 리디렉션
      dispatch({ type: CREATE_BLOG, payload: data });
      history.push('/mypage');
    })
    .catch((err) => {
      throw err;
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
