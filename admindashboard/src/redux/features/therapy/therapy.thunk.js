import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createNewPlan = createAsyncThunk("therapy/createNewPlan", async (planData, { rejectWithValue }) => {
     console.log(planData)
    try {
        const data = await axiosInstance.post("/therapy", planData, { rejectWithValue })
        return data.data
     
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to create new plan");
    }
})



// export const getPlanById = createAsyncThunk("plans/getPlanById", async (planId, { rejectWithValue }) => {
//     try {
//         const data = await axiosInstance.get(`/plans/get-plan-by-id/${planId}`, { rejectWithValue })
//         return data.data
//     } catch (error) {
        
//         return rejectWithValue(error.response?.data?.message || "Failed to fetch plan");
//     }
// })

// export const getPlanByProgramId = createAsyncThunk("plans/getPlanByProgramId", async (programId, { rejectWithValue }) => {
//     try {
//         const data = await axiosInstance.get(`/plans/get-plan-by-programId/${programId}`, { rejectWithValue })
//         return data.data
//     } catch (error) {
//         return rejectWithValue(error.response?.data?.message || "Failed to fetch plan");
//     }
// })

export const uploadPlanMedia = createAsyncThunk(
    "plans/uploadMedia",
    async ({ formData, onUploadProgress }, { rejectWithValue }) => {
        try {
            // axiosInstance interceptor returns response.data, so we just capture that
            const data = await axiosInstance.post("/therapy/upload-media", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress,
            });
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to upload media"
            );
        }
    }
);

export const fetchTherapyPlans = createAsyncThunk(
  "therapy/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(
        "/therapy"
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch plans"
      );
    }
  }
);