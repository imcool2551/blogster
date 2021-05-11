import api from '../apis/api';
import history from '../history';
import { SIGN_IN } from './types';

export const signIn = (formValues) => async (dispatch, getState) => {
  try {
    const { data } = await api.post('/api/users/signin', { ...formValues });
    window.localStorage.setItem('token', data);
    dispatch({ type: SIGN_IN });
  } catch (err) {
    throw err;
  }
};
