import {SET_CURRENT_WATCHED, SET_LIVE_USERS} from "./types"

export const setCurrentWatched = (watchedUser) => {
  return {
    type: SET_CURRENT_WATCHED,
    payload: watchedUser,
  };
};

export const setLiveUsers = (liveUsers) => {
  return {
    type: SET_LIVE_USERS,
    payload: liveUsers,
  }
}
