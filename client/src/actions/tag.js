import api from '../apis/api';

import { FETCH_TAGS } from './types';

export const fetchTags = () => async (dispatch) => {
  const { data } = await api.get('/api/tags');
  dispatch({ type: FETCH_TAGS, payload: data });
};
