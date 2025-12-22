// src/store/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import clientReducer from "../features/client/client.slice";
import coachReducer from "../features/coach/coach.slice";

export default combineReducers({
  auth: authReducer,
  client: clientReducer,
  coach: coachReducer,
});
