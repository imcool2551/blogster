import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';
import blogReducer from './blogReducer';
import tagReducer from './tagReducer';

export default combineReducers({
  auth: authReducer,
  form: formReducer,
  blogs: blogReducer,
  tags: tagReducer,
});
