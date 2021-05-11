import api from '../apis/api';
import history from '../history';
import { SIGN_IN, GET_CURRENT_USER, SIGN_OUT } from './types';

export const signIn = (formValues) => async (dispatch, getState) => {
  try {
    const { data } = await api.post('/api/users/signin', { ...formValues });
    window.localStorage.setItem('token', data);
    dispatch({ type: SIGN_IN });
    history.push('/');
  } catch (err) {
    throw err;
  }
};

export const getCurrentUser = () => async (dispatch) => {
  console.log('@@@@@@@@@');
  try {
    const { data } = await api.get('/api/users/currentuser');
    dispatch({ type: GET_CURRENT_USER, payload: data });
  } catch (err) {
    dispatch({ type: SIGN_OUT });
  }
};
