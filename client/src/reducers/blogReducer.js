import _ from 'lodash';
import { CREATE_BLOG, FETCH_BLOG } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case CREATE_BLOG:
      return { ...state, [action.paylod.id]: action.payload };
    case FETCH_BLOG:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};
