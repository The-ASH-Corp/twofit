import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createNewPlan = createAsyncThunk("plans/createNewPlan",async(planData,{rejectWithValue}) => {
    try {
        const data =await axiosInstance.post("/plans/create-plan",planData,{rejectWithValue})
        return data.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to create new plan");
    }
})