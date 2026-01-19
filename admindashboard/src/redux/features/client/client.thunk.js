import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";



export const getAllClients = createAsyncThunk(
  "client/getAllClients",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/clients/all-clients/${page}/${limit}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get clients");
    }
  }
);

export const getClient = createAsyncThunk(
  "client/getClient",
  async ({ id }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/clients/get-client/${id}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get client");
    }
  }
);

export const getClientsBasedOnCoach = createAsyncThunk(
  "client/getClientsBasedOnCoach",
  async ({ coachIds, page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post(`/clients/get-all-users-based-on-coach-for-admin`, { coachIds, page, limit });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get clients");
    }
  }
);

export const createFeedback = createAsyncThunk(
  "client/createFeedback",
  async (values, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.put(`/coach/feedback`, values);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create feedback");
    }
  }
);

export const getAllFeedbacks = createAsyncThunk(
  "client/getAllFeedbacks",
  async (id, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/clients/get-all-feedbacks/${id}`);

      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get feedbacks");
    }
  }
);


export const updateWeightOfClient = createAsyncThunk("client/updateWeight", async ({ id, currentWeight }, { rejectWithValue }) => {
  try {
    const data = await axiosInstance.put(`clients/${id}/weight`, { currentWeight })
    return data.data

  }
  catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update weight")
  }
})

export const updateMeasurementOfClient = createAsyncThunk("client/updateMeasurement", async ({ id, chest, waist, hip }, { rejectWithValue }) => {
  try {
    const data = await axiosInstance.put(`clients/${id}/measurements`, { chest, waist, hip })
    return data.data
  }
  catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update measurement")
  }
})


export const fetchClientWeightHistory = createAsyncThunk(
  "client/fetchClientWeightHistory",
  async (_, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get("/clients/weight-history");

      console.log("WEIGHT HISTORY API:", data); 


      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch weight history"
      );
    }
  }
);



export const fetchClientMeasurementHistory = createAsyncThunk(
  "client/fetchClientMeasurementHistory",
  async (_, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get("/clients/measurement-history");

      console.log("MEASUREMENT HISTORY API:", data); 


      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch measurement history"
      );
    }
  }
);  
