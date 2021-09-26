import {SET_STREAM_STATUS} from "./types"

export const setStreamStatus = (status) => {
  return {
    type: SET_STREAM_STATUS,
    payload: status,
  };
};
