import _ from 'lodash';
import {
  CREATE_BLOG,
  FETCH_BLOG,
  FETCH_MY_BLOGS,
  DELETE_BLOG,
} from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case CREATE_BLOG:
      return { ...state, [action.payload.id]: action.payload };
    case FETCH_BLOG:
      return { ...state, [action.payload.id]: action.payload };
    case FETCH_MY_BLOGS:
      return { ..._.mapKeys(action.payload, 'id') };
    case DELETE_BLOG:
      return _.omit(state, action.payload);
    default:
      return state;
  }
};
