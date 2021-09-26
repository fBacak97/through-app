import { SET_STREAM_STATUS } from "../actions/types";

const initialState = {
  status: "offline"
};

// eslint-disable-next-line
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_STREAM_STATUS:
      return {
        ...state,
        status: action.payload,
      };
    default:
      return state;
  }
}
