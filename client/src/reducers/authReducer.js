import { SIGN_IN, SIGN_OUT, SIGN_UP } from '../actions/types';

const INITIAL_STATE = {
  isSignedIn: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN:
      return { ...state, isSignedIn: true };
    case SIGN_OUT:
      return { ...state, isSignedIn: false };
    case SIGN_UP:
      return state;
    default:
      return state;
  }
};
