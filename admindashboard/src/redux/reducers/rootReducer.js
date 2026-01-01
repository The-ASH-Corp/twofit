// src/store/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import clientReducer from "../features/client/client.slice";
import coachReducer from "../features/coach/coach.slice";
import chatReducer from "../features/chat/chat.slice";
import therapyReducer from "../features/therapy/therapy.slice"
import headReducer from "../features/head/head.slice"

export default combineReducers({
  auth: authReducer,
  client: clientReducer,
  coach: coachReducer,
  chat: chatReducer,
  therapy: therapyReducer,
  head: headReducer,
});
