import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import viewerReducer from "./viewerReducer";
import { ChatReducer } from "./chatReducer";
import streamReducer from "./streamReducer"

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  viewer: viewerReducer,
  chat: ChatReducer,
  stream: streamReducer
});