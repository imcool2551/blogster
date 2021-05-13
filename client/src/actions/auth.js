import api from '../apis/api';
import history from '../history';
import { SIGN_IN, GET_CURRENT_USER, SIGN_OUT } from './types';

export const signIn = (formValues) => async (dispatch) => {
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
  try {
    const { data } = await api.get('/api/users/currentuser');
    dispatch({ type: GET_CURRENT_USER, payload: data });
  } catch (err) {
    window.localStorage.removeItem('token');
    dispatch({ type: SIGN_OUT });
    history.push('/');
  }
};

export const signOut = () => async (dispatch) => {
  try {
    await api.post('/api/users/signout');
  } catch {
  } finally {
    window.localStorage.removeItem('token');
    dispatch({ type: SIGN_OUT });
    history.push('/');
  }
};

export const signUp = (formValues) => async (dispatch) => {
  try {
    const { data } = await api.post('/api/users/signup', { ...formValues });
    alert('이메일로 인증메일이 발송되었습니다');
    history.push('/login');
  } catch (err) {
    throw err;
  }
};
