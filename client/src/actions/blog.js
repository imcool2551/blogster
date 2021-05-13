import api from '../apis/api';
import history from '../history';

export const createBlog = (formValues) => async (dispatch) => {
  console.log(formValues);
  // 1. files 개수만큼 presigned url 받기

  // 2. s3에 put object로 이미지 넣기

  // 3. post 요청 보내기

  // 4. 리디렉션
};
