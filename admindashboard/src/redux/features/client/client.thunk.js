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
  async ( id , { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/clients/get-all-feedbacks/${id}`);
      
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get feedbacks");
    }
  }
);


export const updateWeightOfClient=createAsyncThunk("client/updateWeight", async({id,weight},{rejectWithValue})=>{
  try{
    const data=await axiosInstance.put(`clients/${id}/weight`,{weight})
    return data.data

  }
  catch(error){
    return rejectWithValue(error.response?.data?.message || "Failed to update weight")
  }
})