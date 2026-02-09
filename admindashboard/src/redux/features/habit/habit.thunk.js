import { createAsyncThunk } from "@reduxjs/toolkit";
 import axiosInstance from "@/utils/axiosInstance";

 export const createHabitsThunk = createAsyncThunk(
  "habit/create",
  async ({ clientId, habits }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/habits/${clientId}`, {
        habits,
      });
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create habits"
      );
    }
  }
);

 export const getClientHabitsThunk = createAsyncThunk(
  "habit/getClientHabits",
  async (clientId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/habits/${clientId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch habits"
      );
    }
  }
);

export const getClientHabitByHabitId=createAsyncThunk("clients/getHabitPlan",
  async (habitId, {rejectWithValue})=>{
    try{
      const res=await axiosInstance.get(`/habits/get/${habitId}`);
      return res.data;
    }
    catch(error){
      return rejectWithValue(error.response?.data?.message || "Failed to fetch Habit")
    }
  }
)

