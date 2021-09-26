import { SET_CURRENT_WATCHED, SET_LIVE_USERS } from "../actions/types";

const initialState = {
  watchedUser: "",
  liveUsers: [],
};

// eslint-disable-next-line
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_WATCHED:
      return {
        ...state,
        watchedUser: action.payload,
      };
    case SET_LIVE_USERS:
      return {
        ...state,
        liveUsers: action.payload
      }
    default:
      return state;
  }
}
