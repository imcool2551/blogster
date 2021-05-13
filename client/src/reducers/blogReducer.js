import { CREATE_BLOG } from '../actions/types';

const INITIAL_STATE = {
  blogs: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATE_BLOG:
      return state;
    default:
      return state;
  }
};
