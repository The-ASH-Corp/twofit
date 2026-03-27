import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createNewPlan = createAsyncThunk("plans/createNewPlan", async (planData, { rejectWithValue }) => {
    try {
        const data = await axiosInstance.post("/plans/create-plan", planData, { rejectWithValue })
        return data.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to create new plan");
    }
})

export const getPlanById = createAsyncThunk("plans/getPlanById", async (planId, { rejectWithValue }) => {
    try {
        const data = await axiosInstance.get(`/plans/get-plan-by-id/${planId}`, { rejectWithValue })
        return data.data
    } catch (error) {
        
        return rejectWithValue(error.response?.data?.message || "Failed to fetch plan");
    }
})

export const getPlanByProgramId = createAsyncThunk("plans/getPlanByProgramId", async (programId, { rejectWithValue }) => {
    try {
        const data = await axiosInstance.get(`/plans/get-plan-by-programId/${programId}`, { rejectWithValue })
        return data.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch plan");
    }
})

export const updatePlan = createAsyncThunk(
    "plans/updatePlan",
    async ({ planId, planData }, { rejectWithValue }) => {
        try {
            const data = await axiosInstance.put(`/plans/update-plan/${planId}`, planData);
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update plan"
            );
        }
    }
);

export const deletePlan = createAsyncThunk(
    "plans/deletePlan",
    async (planId, { rejectWithValue }) => {
        try {
            const data = await axiosInstance.delete(`/plans/delete-plan/${planId}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete plan"
            );
        }
    }
);
export const getPendingExtension = createAsyncThunk(
    "plans/getPendingExtension",
    async (userId, { rejectWithValue }) => {
        try {
            const data = await axiosInstance.get(`/plans/extensions/user/${userId}`);
            // Return the pending (non-activated) extension if it exists
            const extensions = data.data || [];
            const pendingExtension = extensions.find(ext => !ext.isActivated);
            return pendingExtension || null;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch extensions"
            );
        }
    }
);
export const uploadPlanMedia = createAsyncThunk(
    "plans/uploadMedia",
    async ({ formData, onUploadProgress }, { rejectWithValue }) => {
        try {
            // axiosInstance interceptor returns response.data, so we just capture that
            const data = await axiosInstance.post("/plans/upload-media", formData, {
                headers: {
                    // "Content-Type": "multipart/form-data", // Let browser set boundary
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

export const extendProgram = createAsyncThunk(
    "plans/extendProgram",
    async ({ userId, originalProgramId, extendedProgramId, extensionDuration, notes }, { rejectWithValue }) => {
        try {
            const data = await axiosInstance.post("/plans/extend-program", {
                userId,
                originalProgramId,
                extendedProgramId,
                extensionDuration,
                notes,
            });
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to extend program"
            );
        }
    }
);

export const getUserExtensions = createAsyncThunk(
    "plans/getUserExtensions",
    async (userId, { rejectWithValue }) => {
        try {
            const data = await axiosInstance.get(`/plans/extensions/user/${userId}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch extensions"
            );
        }
    }
);

export const deleteExtension = createAsyncThunk(
    "plans/deleteExtension",
    async (extensionId, { rejectWithValue }) => {
        try {
            const data = await axiosInstance.delete(`/plans/extensions/${extensionId}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete extension"
            );
        }
    }
);