import api from '../apis/api';
import axios from 'axios';
import history from '../history';

export const createBlog = (formValues) => async (dispatch) => {
  let { files } = formValues;
  files = Array.prototype.slice.call(files);

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
          .post('/api/blogs', { ...formValues, paths })
          .then(resolve)
          .catch(reject);
      });
    })
    .then(({ data }) => {
      console.log(4, 'api서버로부터 201 응답', data);
    })
    .catch((err) => {
      throw err;
    });

  // 4. 스토어 상태 변경

  // 5. 리디렉션
};
