import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import clientReducer from "../features/client/client.slice";
import coachReducer from "../features/coach/coach.slice";
import chatReducer from "../features/chat/chat.slice"
import adminReducer from "../features/admins/admin.slice"


import programReducer from "../features/program/program.slice"
import categoryReducer from "../features/category/category.slice"
import therapyReducer from "../features/therapy/therapy.slice"
import headReducer from "../features/head/head.slice"
import workoutReducer from "../features/workout/workout.slice"
import payrollReducer from "../features/payroll/payroll.slice"
import founderReducer from "../features/founder/founder.slice"

export default combineReducers({
  auth: authReducer,
  client: clientReducer,
  coach: coachReducer,
  program:programReducer,
  category:categoryReducer,
  chat: chatReducer,
  admin:adminReducer,
  therapy: therapyReducer,
  head: headReducer,
  workout: workoutReducer,
  payroll: payrollReducer,
  founder: founderReducer,
});
