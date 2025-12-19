// src/store/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";

export default combineReducers({
  auth: authReducer,
});
